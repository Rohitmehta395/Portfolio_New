"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  SiNextdotjs,
  SiTypescript,
  SiReact,
  SiTailwindcss,
  SiGreensock,
  SiNodedotjs,
  SiMongodb,
  SiPostgresql,
  SiDocker,
  SiFlutter,
  SiPython,
} from "react-icons/si";
import type { IconType } from "react-icons";

interface TechItem {
  _id: string;
  name: string;
  category: string;
  icon?: string;
}

const ICON_MAP: Record<string, IconType> = {
  "next.js": SiNextdotjs,
  typescript: SiTypescript,
  react: SiReact,
  "tailwind css": SiTailwindcss,
  gsap: SiGreensock,
  "node.js": SiNodedotjs,
  mongodb: SiMongodb,
  postgresql: SiPostgresql,
  docker: SiDocker,
  flutter: SiFlutter,
  python: SiPython,
};

function TechIcon({
  name,
  size = 48,
  color = "var(--color-foreground)",
}: {
  name: string;
  size?: number;
  color?: string;
}) {
  const Icon = ICON_MAP[name.toLowerCase()];
  if (Icon) return <Icon size={size} color={color} />;
  return (
    <span
      style={{
        fontFamily: "'Arial Black', Arial, sans-serif",
        fontWeight: 900,
        fontSize: size * 0.65,
        color,
        lineHeight: 1,
      }}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

interface OverlayState {
  id: string;
  rowKey: "row1" | "row2";
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface TechGridProps {
  technologies: TechItem[];
}

export function TechGrid({ technologies }: TechGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [overlay, setOverlay] = useState<OverlayState | null>(null);

  const handleEnter = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement>,
      id: string,
      rowKey: "row1" | "row2",
      index: number
    ) => {
      const container = containerRef.current;
      if (!container) return;
      const cr = container.getBoundingClientRect();
      const cell = e.currentTarget.getBoundingClientRect();
      setOverlay({
        id,
        rowKey,
        index,
        x: cell.left - cr.left,
        y: cell.top - cr.top,
        width: cell.width,
        height: cell.height,
      });
    },
    []
  );


  if (technologies.length === 0) return null;

  const row1 = technologies.slice(0, 4);
  const row2 = technologies.slice(4);

  const isActive = (id: string) => overlay?.id === id;

  return (
    <div
      ref={containerRef}
      className="relative w-full border border-border dark:border-[#2a2a2a] dark:bg-[#111111] overflow-hidden"
      onMouseLeave={() => setOverlay(null)}
    >
      {/* ── Sliding overlay — uses foreground token so it inverts in dark mode ── */}
      <motion.div
        className="pointer-events-none absolute top-0 left-0 z-0"
        style={{ backgroundColor: "var(--color-foreground)" }}
        animate={
          overlay
            ? {
                x: overlay.x,
                y: overlay.y,
                width: overlay.width,
                height: overlay.height,
                opacity: 1,
              }
            : { opacity: 0 }
        }
        transition={{
          opacity: { duration: 0.15, ease: "easeInOut" },
          x: { type: "tween", duration: 0.28, ease: [0.4, 0, 0.2, 1] },
          y: { type: "tween", duration: 0.28, ease: [0.4, 0, 0.2, 1] },
          width: { type: "tween", duration: 0.28, ease: [0.4, 0, 0.2, 1] },
          height: { type: "tween", duration: 0.28, ease: [0.4, 0, 0.2, 1] },
        }}
      />

      {/* ── Row 1 — Responsive Flex Grid ── */}
      <div className="flex flex-wrap relative z-10">
        {row1.map((tech, i) => (
          <div
            key={tech._id}
            className="flex-grow flex-shrink basis-[50%] md:basis-0 flex flex-col items-center justify-center gap-2 border-b border-r border-border dark:border-[#2a2a2a] transition-colors duration-150"
            style={{
              minHeight: "200px",
              padding: "2rem",
              cursor: "default",
              marginBottom: "-1px",
              marginRight: "-1px",
            }}
            onMouseEnter={(e) => handleEnter(e, tech._id, "row1", i)}
          >
            <TechIcon
              name={tech.name}
              size={60}
              color={
                isActive(tech._id)
                  ? "var(--color-background)"
                  : "var(--color-foreground)"
              }
            />

            <span
              style={{
                fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--color-background)",
                opacity: isActive(tech._id) ? 1 : 0,
                transform: isActive(tech._id)
                  ? "translateY(0px)"
                  : "translateY(4px)",
                transition: "opacity 0.18s ease, transform 0.18s ease",
                whiteSpace: "nowrap",
              }}
            >
              {tech.name}
            </span>
          </div>
        ))}
      </div>

      {/* ── Row 2 — Responsive Flex Grid ── */}
      {row2.length > 0 && (
        <div className="flex flex-wrap relative z-10">
          {row2.map((tech, i) => (
            <div
              key={tech._id}
              className="flex-grow flex-shrink basis-[30%] sm:basis-[20%] md:basis-0 flex flex-col items-center justify-center gap-2 border-b border-r border-border dark:border-[#2a2a2a] transition-colors duration-150"
              style={{
                minHeight: "110px",
                padding: "1.5rem",
                cursor: "default",
                marginBottom: "-1px",
                marginRight: "-1px",
              }}
              onMouseEnter={(e) => handleEnter(e, tech._id, "row2", i)}
            >
              <TechIcon
                name={tech.name}
                size={42}
                color={
                  isActive(tech._id)
                    ? "var(--color-background)"
                    : "var(--color-foreground)"
                }
              />

              <span
                style={{
                  fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
                  fontSize: "0.6rem",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--color-background)",
                  opacity: isActive(tech._id) ? 1 : 0,
                  transform: isActive(tech._id)
                    ? "translateY(0px)"
                    : "translateY(3px)",
                  transition: "opacity 0.18s ease, transform 0.18s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
