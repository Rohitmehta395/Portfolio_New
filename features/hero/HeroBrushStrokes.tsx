'use client';

import React from 'react';

interface HeroBrushStrokesProps {
  className?: string;
}

/**
 * Dynamic energetic paint/brush strokes inspired by the reference illustration.
 * Renders behind the subject portrait with customizable accent color and subtle ambient glow.
 */
export function HeroBrushStrokes({ className = '' }: HeroBrushStrokesProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible select-none ${className}`}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full max-w-[130%] max-h-[130%] -rotate-6 md:-rotate-12 transform-gpu scale-110 md:scale-125 opacity-90 transition-transform duration-700 ease-out"
        viewBox="0 0 900 650"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradient for depth in signature purple */}
          <linearGradient id="brushGrad1" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="1" />
            <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="brushGrad2" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#6D28D9" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#8B5CF6" stopOpacity="1" />
            <stop offset="100%" stopColor="#C4B5FD" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {/* Ambient background glow in dark mode */}
        <ellipse
          cx="460"
          cy="330"
          rx="260"
          ry="170"
          className="fill-[#8B5CF6]/15 dark:fill-[#8B5CF6]/30 blur-3xl"
        />

        {/* Top/Main Slash Streak */}
        <path
          className="hero-brush-stroke transition-all duration-500"
          d="M 60,340 
             C 140,310 240,290 350,260 
             C 450,230 600,170 760,110 
             C 830,85 890,65 895,72 
             C 890,85 820,135 720,195 
             C 610,260 480,315 370,345 
             C 270,370 170,390 70,375 
             C 55,372 45,350 60,340 Z"
          fill="url(#brushGrad1)"
        />

        {/* Upper Accent Feather Streak */}
        <path
          className="hero-brush-stroke transition-all duration-500 delay-75"
          d="M 520,185 
             C 610,140 730,90 850,45 
             C 880,35 885,42 865,58 
             C 790,110 680,175 580,225 
             C 545,242 530,235 520,185 Z"
          fill="url(#brushGrad2)"
        />

        {/* Center-Bottom Secondary Slash Streak */}
        <path
          className="hero-brush-stroke transition-all duration-500 delay-100"
          d="M 120,440 
             C 210,410 320,380 430,345 
             C 560,305 690,260 830,200 
             C 870,182 880,195 845,218 
             C 740,285 620,345 490,395 
             C 380,438 270,470 145,475 
             C 120,475 105,450 120,440 Z"
          fill="url(#brushGrad1)"
        />

        {/* Lower Accent Splatter / Dry Streak */}
        <path
          className="hero-brush-stroke transition-all duration-500 delay-150"
          d="M 230,490 
             C 330,455 450,415 560,375 
             C 650,342 740,310 790,285 
             C 810,275 805,285 775,305 
             C 690,360 590,415 480,460 
             C 390,498 300,520 220,515 
             C 210,514 215,497 230,490 Z"
          fill="url(#brushGrad2)"
          opacity="0.85"
        />

        {/* Small energetic spatter marks */}
        <circle cx="875" cy="55" r="4" fill="#A78BFA" opacity="0.9" />
        <circle cx="895" cy="90" r="3" fill="#8B5CF6" opacity="0.8" />
        <circle cx="850" cy="180" r="4.5" fill="#C4B5FD" opacity="0.85" />
        <circle cx="100" cy="355" r="3.5" fill="#8B5CF6" opacity="0.75" />
        <circle cx="75" cy="370" r="2.5" fill="#A78BFA" opacity="0.7" />
      </svg>
    </div>
  );
}

export default HeroBrushStrokes;
