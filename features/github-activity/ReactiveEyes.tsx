"use client";

import { useEffect, useRef } from "react";
import { motion, useSpring } from "framer-motion";
import { useMousePosition } from "@/hooks/useMousePosition";

/**
 * Isolated Client Component implementing massive reactive googly eyes.
 * Pupil displacement is calculated from mouse position and animated with
 * spring physics for a smooth, natural-feeling motion, bounded strictly
 * inside the circular eye socket.
 */
export function ReactiveEyes() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePos = useMousePosition(containerRef);

  // Spring-driven motion values — much smoother than a CSS transition since
  // they react continuously to fast-changing input instead of re-triggering
  // a fixed-duration transition on every update.
  const x = useSpring(0, { stiffness: 300, damping: 25, mass: 0.5 });
  const y = useSpring(0, { stiffness: 300, damping: 25, mass: 0.5 });

  // Eye radius ~ 48, Pupil radius ~ 20. Max displacement ~ 24 to keep it safely inside
  const maxRadius = 24;

  useEffect(() => {
    if (!mousePos.elementWidth || !mousePos.elementHeight) return;

    const centerX = mousePos.elementWidth / 2;
    const centerY = mousePos.elementHeight / 2;
    const dx = mousePos.elementX - centerX;
    const dy = mousePos.elementY - centerY;

    const angle = Math.atan2(dy, dx);
    const distance = Math.hypot(dx, dy);

    // Scale displacement based on distance, capped at maxRadius
    // Dividing by 15 gives a nice sensitivity
    const offset = Math.min(distance / 15, maxRadius);
    x.set(Math.cos(angle) * offset);
    y.set(Math.sin(angle) * offset);
  }, [
    mousePos.elementX,
    mousePos.elementY,
    mousePos.elementWidth,
    mousePos.elementHeight,
    x,
    y,
  ]);

  const svgStyle = "w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 drop-shadow-xl";

  return (
    <div
      ref={containerRef}
      className="inline-flex items-center select-none cursor-default"
      title="I see you!"
    >
      {/* Left Eye */}
      <svg
        className={`${svgStyle} -mr-4 z-10`}
        viewBox="0 0 100 100"
        fill="none"
      >
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="#f4f4f5"
          stroke="#171717"
          strokeWidth="2"
        />
        <motion.g style={{ x, y }}>
          <circle cx="50" cy="50" r="22" fill="#171717" />
          <circle cx="58" cy="42" r="5" fill="#ffffff" />
        </motion.g>
      </svg>

      {/* Right Eye */}
      <svg className={`${svgStyle} z-20`} viewBox="0 0 100 100" fill="none">
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="#f4f4f5"
          stroke="#171717"
          strokeWidth="2"
        />
        <motion.g style={{ x, y }}>
          <circle cx="50" cy="50" r="22" fill="#171717" />
          <circle cx="58" cy="42" r="5" fill="#ffffff" />
        </motion.g>
      </svg>
    </div>
  );
}

export default ReactiveEyes;
