"use client";

import { useRef, useEffect, useState, useMemo, useId } from "react";

interface CurvedLoopProps {
  words?: string[];
  glyph?: string;
  speed?: number;
  amplitude?: number; // how deep the S-wave dips/rises
  period?: number; // horizontal distance for one full wave cycle
  interactive?: boolean;
  className?: string;
}

const VIEW_W = 1440;
const VIEW_H = 240;
const BASELINE_Y = 150;
const PATH_DOMAIN = 9000; // how far the wave path extends left/right — must comfortably exceed total looped text length

export const TextMarquee = ({
  words = ["ANALYZE", "DESIGN", "BUILD", "VALIDATE", "OPTIMIZE", "SCALE"],
  glyph = "✦",
  speed = 1.2,
  amplitude = 60,
  period = 1440,
  interactive = true,
  className = "",
}: CurvedLoopProps) => {
  const text = useMemo(
    () => `\u00A0${words.join(`\u00A0${glyph}\u00A0`)}\u00A0${glyph}\u00A0`,
    [words, glyph],
  );

  const measureRef = useRef<SVGTextPathElement>(null);
  const textPathRef = useRef<SVGTextPathElement>(null);
  const [spacing, setSpacing] = useState(0);
  const [offset, setOffset] = useState(0);
  const uid = useId();
  const pathId = `curve-${uid.replace(/:/g, "")}`;

  // Build ONE continuous sine wave path, once. This is the entire "shape" —
  // it never changes, is never recomputed per frame, and repeats seamlessly
  // as text scrolls along it, producing the S-bend rise/dip/rise pattern
  // over and over for as long as the path domain extends.
  const pathD = useMemo(() => {
    const step = 12; // px resolution — fine enough to look perfectly smooth at this font size
    let d = "";
    for (let x = -PATH_DOMAIN / 2; x <= PATH_DOMAIN / 2; x += step) {
      const y = BASELINE_Y + amplitude * Math.sin((2 * Math.PI * x) / period);
      // Use toFixed(3) to prevent hydration mismatches caused by floating point precision
      // differences in Math.sin() between Node.js (SSR) and the browser.
      d += d === "" ? `M${x.toFixed(3)},${y.toFixed(3)}` : ` L${x.toFixed(3)},${y.toFixed(3)}`;
    }
    return d;
  }, [amplitude, period]);

  const dragRef = useRef(false);
  const lastXRef = useRef(0);
  const velRef = useRef(0);
  const dirRef = useRef<"left" | "right">("left");

  const ready = spacing > 0;
  const totalText = ready
    ? Array(Math.ceil(PATH_DOMAIN / spacing) + 2)
        .fill(text)
        .join("")
    : text;

  useEffect(() => {
    if (measureRef.current) {
      setSpacing(measureRef.current.getComputedTextLength());
    }
  }, [text]);

  useEffect(() => {
    if (!spacing) return;
    let frame: number;
    const step = () => {
      if (!dragRef.current) {
        const delta = dirRef.current === "right" ? speed : -speed;
        setOffset((prev) => {
          let next = prev + delta;
          if (next <= -spacing) next += spacing;
          if (next > 0) next -= spacing;
          return next;
        });
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [spacing, speed]);

  useEffect(() => {
    // Only startOffset changes per frame — path and letters are otherwise static
    textPathRef.current?.setAttribute(
      "startOffset",
      `${offset + PATH_DOMAIN / 2}px`,
    );
  }, [offset]);

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!interactive) return;
    dragRef.current = true;
    lastXRef.current = e.clientX;
    velRef.current = 0;
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!interactive || !dragRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    velRef.current = dx;
    setOffset((prev) => {
      let next = prev + dx;
      if (next <= -spacing) next += spacing;
      if (next > 0) next -= spacing;
      return next;
    });
  };

  const endDrag = () => {
    if (!interactive) return;
    dragRef.current = false;
    dirRef.current = velRef.current > 0 ? "right" : "left";
  };

  return (
    <section
      className="w-full overflow-hidden py-2 bg-background"
    >
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className={`w-full select-none ${className}`}
        style={{
          cursor: interactive
            ? dragRef.current
              ? "grabbing"
              : "grab"
            : "auto",
          touchAction: "pan-y",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
      >
        <text 
          style={{ 
            visibility: "hidden",
            fontFamily: "inherit",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            fontSize: "84px",
          }} 
          aria-hidden="true"
        >
          <textPath ref={measureRef} href={`#${pathId}`}>
            {text}
          </textPath>
        </text>

        <path id={pathId} d={pathD} fill="none" stroke="none" />

        {ready && (
          <text
            xmlSpace="preserve"
            fill="currentColor"
            className="text-foreground"
            style={{
              fontFamily: "inherit",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              fontSize: "84px",
            }}
          >
            <textPath
              ref={textPathRef}
              href={`#${pathId}`}
              startOffset={`${offset + PATH_DOMAIN / 2}px`}
            >
              {totalText}
            </textPath>
          </text>
        )}
      </svg>
    </section>
  );
};
