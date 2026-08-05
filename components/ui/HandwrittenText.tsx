'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface HandwrittenTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  style?: React.CSSProperties;
}

/**
 * HandwrittenText component.
 * Animates any cursive text (Great Vibes font) with a handwritten line-writing reveal
 * in 100% synchrony with surrounding text when loaded or scrolled into view.
 */
export function HandwrittenText({
  children,
  className = '',
  delay = 0,
  duration = 0.65,
  style,
}: HandwrittenTextProps) {
  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.1 }}
      className="inline-relative overflow-visible"
      style={{
        display: 'inline-flex',
        verticalAlign: 'baseline',
        paddingTop: '0.2em',
        paddingBottom: '0.2em',
        paddingLeft: '0.15em',
        paddingRight: '0.15em',
        marginTop: '-0.2em',
        marginBottom: '-0.2em',
        marginLeft: '-0.15em',
        marginRight: '-0.15em',
        ...style,
      }}
    >
      <motion.span
        variants={{
          hidden: {
            clipPath: 'inset(-50% 105% -50% -30%)',
            filter: 'blur(1.5px)',
          },
          visible: {
            clipPath: 'inset(-50% -30% -50% -30%)',
            filter: 'blur(0px)',
            transition: {
              duration: duration,
              ease: [0.25, 1, 0.5, 1],
              delay: delay,
            },
          },
        }}
        className={`inline-block font-cursive overflow-visible ${className}`}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

export default HandwrittenText;
