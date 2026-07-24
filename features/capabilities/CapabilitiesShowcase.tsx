'use client';

import { useRef, useEffect } from 'react';
import { useGsapContext } from '@/hooks/useGsapContext';
import { gsap, ScrollTrigger } from '@/lib/gsap/registerPlugins';
import { CAPABILITIES_DATA } from './capabilities.data';
import { CapabilityCard } from './CapabilityCard';

/**
 * MOBILE FALLBACK ARCHITECTURAL DECISION:
 * Sticky scroll-pinning (`pin: true`) on narrow touch viewports (< 768px) frequently causes touch-scroll
 * jumping, height calculation traps, and viewport locking on mobile devices.
 *
 * Therefore, this component implements a dual-layout strategy:
 * 1. Mobile (< 768px): Renders a natural, non-pinned stacked card layout (`block md:hidden`).
 * 2. Desktop (>= 768px): Activates the GSAP ScrollTrigger pinned scrub sequence (`hidden md:block`).
 *
 * This provides mobile users with smooth native scrolling while delivering the full desktop pinned experience.
 */
export function CapabilitiesShowcase() {
  const pinSectionRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  useGsapContext(
    () => {
      // Execute pinned sequence on desktop viewports only
      if (typeof window === 'undefined' || window.innerWidth < 768) return;
      if (!pinSectionRef.current || !cardsContainerRef.current) return;

      const cardElements = cardsContainerRef.current.querySelectorAll('.capability-card-slide');
      if (cardElements.length < 2) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinSectionRef.current,
          pin: true,
          scrub: 0.8,
          start: 'top top',
          end: `+=${(cardElements.length - 1) * 100}%`,
          invalidateOnRefresh: true,
        },
      });

      // Initial setup: Stack all cards with first card visible
      cardElements.forEach((card, i) => {
        if (i !== 0) {
          gsap.set(card, { opacity: 0, y: 60, pointerEvents: 'none' });
        } else {
          gsap.set(card, { opacity: 1, y: 0, pointerEvents: 'auto' });
        }
      });

      // Crossfade through each capability card slide
      cardElements.forEach((card, i) => {
        if (i === 0) return;

        const prevCard = cardElements[i - 1];

        tl.to(
          prevCard,
          {
            opacity: 0,
            y: -40,
            pointerEvents: 'none',
            duration: 0.8,
            ease: 'power2.inOut',
          },
          `slide-${i}`
        ).to(
          card,
          {
            opacity: 1,
            y: 0,
            pointerEvents: 'auto',
            duration: 0.8,
            ease: 'power2.inOut',
          },
          `slide-${i}`
        );
      });

      // Refresh ScrollTrigger after pinned dimensions settle
      ScrollTrigger.refresh();
    },
    { scope: pinSectionRef }
  );

  // Force ScrollTrigger refresh after initial mount & layout stabilization
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="w-full bg-background py-16 md:py-0 select-none">
      {/* ------------------------------------------------------------- */}
      {/* 1. MOBILE LAYOUT (Non-pinned natural stack for viewports < 768px) */}
      {/* ------------------------------------------------------------- */}
      <div className="block md:hidden px-6">
        <div className="flex flex-col gap-3 mb-10 border-b border-border pb-6">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-emerald-400">
            Core Competencies
          </span>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
            What I Do
          </h2>
        </div>

        <div className="flex flex-col gap-8">
          {CAPABILITIES_DATA.map((cap) => (
            <CapabilityCard key={cap.id} capability={cap} />
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. DESKTOP LAYOUT (GSAP ScrollTrigger Pinned Scrub Sequence >= 768px) */}
      {/* ------------------------------------------------------------- */}
      <div
        ref={pinSectionRef}
        className="hidden md:flex flex-col justify-center min-h-screen w-full px-12 py-16 max-w-7xl mx-auto relative"
      >
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-border pb-6 mb-8">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-muted-foreground">
              Core Competencies
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
            What I Do
          </h2>
        </div>

        {/* Pinned Card Stack Stage */}
        <div ref={cardsContainerRef} className="relative w-full min-h-[520px] flex items-center">
          {CAPABILITIES_DATA.map((cap) => (
            <div
              key={cap.id}
              className="capability-card-slide absolute inset-0 w-full flex items-center justify-center"
            >
              <CapabilityCard capability={cap} className="w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CapabilitiesShowcase;
