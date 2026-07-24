'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { KineticHeadline } from './KineticHeadline';
import { useGsapContext } from '@/hooks/useGsapContext';
import { gsap } from '@/lib/gsap/registerPlugins';

/**
 * Hero Section feature module.
 * Owns the coordinated GSAP load-time kinetic typography timeline.
 */
export function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  useGsapContext(
    () => {
      if (!containerRef.current) return;

      const words = containerRef.current.querySelectorAll('.hero-word');
      const inlineImgs = containerRef.current.querySelectorAll('.hero-inline-img');
      const ctaElements = containerRef.current.querySelectorAll('.hero-cta');

      if (!words.length) return;

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
      });

      // Set initial hidden states before entrance
      gsap.set(words, { y: 40, opacity: 0 });
      gsap.set(inlineImgs, { scale: 0.4, opacity: 0 });

      // Orchestrate on-load entrance timeline
      tl.to(words, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.04,
      })
        .to(
          inlineImgs,
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: 'back.out(1.7)',
          },
          '-=0.5'
        );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative flex h-screen min-h-[600px] flex-col justify-center items-center px-4 md:px-12 w-full overflow-hidden"
    >
      {/* Center Kinetic Typography Headline */}
      <div className="w-full flex justify-center">
        <KineticHeadline />
      </div>
    </section>
  );
}

export default Hero;
