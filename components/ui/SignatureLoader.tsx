'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SignatureLoaderProps {
  onLoadingComplete?: () => void;
  minimumDuration?: number;
}

export function SignatureLoader({
  onLoadingComplete,
  minimumDuration = 1350,
}: SignatureLoaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const hasSeenLoader =
      typeof window !== 'undefined' &&
      sessionStorage.getItem('has_seen_signature_loader');

    if (hasSeenLoader) {
      setIsVisible(false);
      if (onLoadingComplete) onLoadingComplete();
      return;
    }

    try {
      sessionStorage.setItem('has_seen_signature_loader', 'true');
    } catch {}

    // Scroll to top and lock page scrolling while loader is active
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, minimumDuration);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [minimumDuration, onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        if (onLoadingComplete) onLoadingComplete();
      }}
    >
      {isVisible && (
        <motion.div
          key="signature-loader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.02,
            transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-background text-foreground transition-colors duration-300 pointer-events-auto select-none overflow-hidden touch-none"
        >
          {/* Subtle Ambient Background Glow */}
          <div className="absolute inset-0 bg-radial from-primary/10 via-transparent to-transparent opacity-60 blur-3xl pointer-events-none" />

          <div className="relative flex flex-col items-center justify-center">
            {/* Project Font ("Great Vibes") Animated Text Container */}
            <div className="relative w-[280px] sm:w-[400px] md:w-[500px] h-[150px] sm:h-[190px] flex items-center justify-center">
              <svg
                viewBox="0 0 600 200"
                className="w-full h-full overflow-visible drop-shadow-[0_0_20px_rgba(255,255,255,0.12)] dark:drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]"
              >
                {/* Outer Glow Path Layer */}
                <motion.text
                  x="50%"
                  y="55%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-cursive text-7xl sm:text-8xl md:text-9xl select-none"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeOpacity="0.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ strokeDasharray: 1200, strokeDashoffset: 1200, opacity: 0 }}
                  animate={{ strokeDashoffset: 0, opacity: 1 }}
                  transition={{
                    strokeDashoffset: { duration: 0.85, ease: [0.65, 0, 0.35, 1] },
                    opacity: { duration: 0.1 },
                  }}
                >
                  Rohit
                </motion.text>

                {/* Layer 1: Crisp Line Outline Drawing in Great_Vibes font */}
                <motion.text
                  x="50%"
                  y="55%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-cursive text-7xl sm:text-8xl md:text-9xl select-none"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ strokeDasharray: 1200, strokeDashoffset: 1200, opacity: 0 }}
                  animate={{ strokeDashoffset: 0, opacity: 1 }}
                  transition={{
                    strokeDashoffset: { duration: 0.8, ease: [0.65, 0, 0.35, 1] },
                    opacity: { duration: 0.1 },
                  }}
                >
                  Rohit
                </motion.text>

                {/* Layer 2: Fill reveal for Great_Vibes typography */}
                <motion.text
                  x="50%"
                  y="55%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-cursive text-7xl sm:text-8xl md:text-9xl select-none"
                  fill="currentColor"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35, delay: 0.65 }}
                >
                  Rohit
                </motion.text>
              </svg>
            </div>

            {/* Bottom subtle progress line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 0.7 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="mt-3 w-24 h-[2px] bg-foreground/20 rounded-full overflow-hidden origin-center"
            >
              <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 0.75, ease: 'linear' }}
                className="w-full h-full bg-foreground"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
