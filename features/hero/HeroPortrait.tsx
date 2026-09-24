'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { HeroBrushStrokes } from './HeroBrushStrokes';

interface HeroPortraitProps {
  className?: string;
}

export function HeroPortrait({ className = '' }: HeroPortraitProps) {
  // Parallax mouse tilt
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative flex flex-col items-center lg:items-end justify-end w-full h-[75vh] sm:h-[85vh] lg:h-[100dvh] select-none ${className}`}
    >
      {/* Background Energetic Brush Strokes with Parallax */}
      <motion.div
        animate={{
          x: mousePos.x * -25,
          y: mousePos.y * -20,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 80 }}
        className="absolute inset-0 z-0 flex items-center justify-center lg:justify-end pointer-events-none scale-110 lg:scale-125"
      >
        <HeroBrushStrokes />
      </motion.div>

      {/* Portrait Image Container - 100vh height grounded at bottom */}
      <motion.div
        animate={{
          x: mousePos.x * 15,
          y: mousePos.y * 12,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 100 }}
        className="relative z-10 w-full h-full flex items-end justify-center lg:justify-end"
      >
        <div className="relative w-full h-full max-h-[100dvh] flex items-end justify-center lg:justify-end">
          <Image
            src="/images/Rohit_Informal.png"
            alt="Rohit Mehta - Creative Software Developer"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 60vw"
            priority
            className="object-contain object-bottom drop-shadow-[0_15px_30px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_20px_45px_rgba(0,0,0,0.65)] filter"
          />
        </div>
      </motion.div>
    </div>
  );
}

export default HeroPortrait;
