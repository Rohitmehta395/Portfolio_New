'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PageHeroProps {
  /** Main title or first part of title */
  title?: string;
  /** Highlighted part rendered in purple script font. If omitted, the last word of title is highlighted */
  highlight?: string;
  /** Optional subtitle text rendered underneath */
  subtitle?: string;
  /** Optional container class name overrides */
  className?: string;
}

export function PageHero({
  title = "My Works",
  highlight,
  subtitle,
  className = "",
}: PageHeroProps) {
  let firstPart = "";
  let secondPart = "";

  if (highlight !== undefined) {
    firstPart = title;
    secondPart = highlight;
  } else {
    const words = title.trim().split(/\s+/);
    if (words.length > 1) {
      secondPart = words.pop() || "";
      firstPart = words.join(" ");
    } else {
      secondPart = words[0] || "";
      firstPart = "";
    }
  }

  return (
    <section className={`w-full min-h-screen flex flex-col items-center justify-center text-center select-none px-4 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-4 max-w-4xl mx-auto"
      >
        <h1 className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-5 md:gap-x-7 tracking-tight leading-none">
          {firstPart && (
            <span className="font-extrabold font-display text-5xl min-[400px]:text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-foreground">
              {firstPart}
            </span>
          )}
          {secondPart && (
            <span
              className="font-cursive text-[#8B5CF6] dark:text-[#a78bfa] font-normal text-6xl min-[400px]:text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] transform -rotate-1 py-1 leading-none"
              style={{ fontFamily: 'var(--font-cursive, cursive)' }}
            >
              {secondPart}
            </span>
          )}
        </h1>

        {subtitle && (
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mt-2">
            {subtitle}
          </p>
        )}
      </motion.div>
    </section>
  );
}

export default PageHero;
