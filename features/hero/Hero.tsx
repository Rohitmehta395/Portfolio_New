'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Send, FileText, Sparkles } from 'lucide-react';
import { siteConfig } from '@/config/site.config';
import { HeroPortrait } from './HeroPortrait';
import { useGsapContext } from '@/hooks/useGsapContext';
import { gsap } from '@/lib/gsap/registerPlugins';

/**
 * Editorial Hero Section inspired by poster art and modern kinetic design.
 * Features stacked condensed typography on the left and an illustrated
 * portrait with dynamic energetic brush strokes on the right.
 */
export function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  useGsapContext(
    () => {
      if (!containerRef.current) return;

      const titleLine1 = containerRef.current.querySelector('.hero-title-line-1');
      const titleLine2 = containerRef.current.querySelector('.hero-title-line-2');
      const subtitle = containerRef.current.querySelector('.hero-subtitle');
      const ctas = containerRef.current.querySelectorAll('.hero-cta-btn');
      const portrait = containerRef.current.querySelector('.hero-portrait-wrap');
      const brushStrokes = containerRef.current.querySelectorAll('.hero-brush-stroke');

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        delay: 0.15,
      });

      // Initial state
      if (titleLine1) gsap.set(titleLine1, { y: 80, opacity: 0 });
      if (titleLine2) gsap.set(titleLine2, { y: 80, opacity: 0 });
      if (subtitle) gsap.set(subtitle, { y: 30, opacity: 0 });
      if (ctas.length) gsap.set(ctas, { y: 20, opacity: 0 });
      if (portrait) gsap.set(portrait, { y: 60, opacity: 0, scale: 0.95 });
      if (brushStrokes.length) gsap.set(brushStrokes, { scale: 0.7, opacity: 0, transformOrigin: 'center center' });

      // Orchestrated Entrance
      if (brushStrokes.length) {
        tl.to(brushStrokes, {
          scale: 1,
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: 'back.out(1.4)',
        });
      }

      if (portrait) {
        tl.to(
          portrait,
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.85,
            ease: 'power3.out',
          },
          '-=0.7'
        );
      }

      if (titleLine1) {
        tl.to(titleLine1, { y: 0, opacity: 1, duration: 0.75, ease: 'power4.out' }, '-=0.6');
      }

      if (titleLine2) {
        tl.to(titleLine2, { y: 0, opacity: 1, duration: 0.75, ease: 'power4.out' }, '-=0.6');
      }

      if (subtitle) {
        tl.to(subtitle, { y: 0, opacity: 1, duration: 0.6 }, '-=0.4');
      }

      if (ctas.length) {
        tl.to(ctas, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 }, '-=0.4');
      }
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative flex h-[100dvh] min-h-[700px] w-full flex-col justify-center overflow-hidden px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 pt-16 lg:pt-0 pb-0"
    >
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute -top-40 right-0 w-[500px] h-[500px] rounded-full bg-[#8B5CF6]/5 dark:bg-[#8B5CF6]/15 blur-[130px] -z-10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 left-0 w-[450px] h-[450px] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-[120px] -z-10"
        aria-hidden="true"
      />

      {/* Main Grid: Left Typography + Right Illustrated Portrait */}
      <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-4 w-full max-w-[1550px] mx-auto h-full">
        {/* Left Column: Massive Editorial Typography */}
        <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center z-10 py-10 lg:py-0">

          {/* Stacked Poster Headline with Overlapping Typography */}
          <h1 className="font-poster uppercase select-none flex flex-col leading-[0.75] tracking-[-0.02em]">
            <span className="hero-title-line-1 relative z-0 text-8xl sm:text-9xl md:text-[9.5rem] lg:text-[10.5rem] xl:text-[12.5rem] text-foreground transition-colors block">
              ROHIT
            </span>
            <span className="hero-title-line-2 relative z-10 text-8xl sm:text-9xl md:text-[9.5rem] lg:text-[10.5rem] xl:text-[12.5rem] text-[#8B5CF6] dark:text-[#a78bfa] hover:brightness-110 transition-all block -mt-[0.22em]">
              MEHTA
            </span>
          </h1>

          {/* Subtitle & Tagline directly underneath matching Image 1 */}
          <div className="hero-subtitle mt-4 sm:mt-5 max-w-xl">
            <p className="text-xl sm:text-2xl md:text-[1.75rem] font-normal text-foreground/90 tracking-tight leading-snug">
              Bringing Ideas To Life Through Creative Engineering
            </p>
            <p className="mt-1.5 text-sm sm:text-base text-muted-foreground leading-relaxed">
              Creative Software Developer crafting scalable full-stack applications & high-performance digital products.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              href="/works"
              className="hero-cta-btn group relative inline-flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-foreground text-background font-semibold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-foreground/10 hover:scale-105 active:scale-95 transition-all"
            >
              <span>Explore Works</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            <Link
              href="#contact"
              className="hero-cta-btn group inline-flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-muted/70 hover:bg-muted text-foreground font-semibold text-xs sm:text-sm uppercase tracking-wider border border-border/80 hover:border-border transition-all"
            >
              <Send className="w-3.5 h-3.5 text-[#8B5CF6] dark:text-[#a78bfa]" />
              <span>Let's Talk</span>
            </Link>

            {siteConfig.links.resume && (
              <a
                href={siteConfig.links.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-cta-btn inline-flex items-center gap-1.5 px-4 py-3 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Resume</span>
              </a>
            )}
          </div>
        </div>

        {/* Right Column: Illustrated Cutout Avatar with Dynamic Brush Strokes */}
        <div className="hero-portrait-wrap lg:col-span-6 xl:col-span-6 flex items-end justify-center lg:justify-end w-full h-full relative z-0 mt-4 lg:mt-0">
          <HeroPortrait />
        </div>
      </div>
    </section>
  );
}

export default Hero;
