'use client';

import { useRef } from 'react';
import { useGsapContext } from '@/hooks/useGsapContext';
import { gsap } from '@/lib/gsap/registerPlugins';

interface CountryFlag {
  code: string;
  name: string;
  flag: string;
}

/**
 * Localized typed country flag array.
 * Per the spec's Content Management Strategy, country/flag data is static and specific to this component,
 * so it is defined inline rather than created as a separate Mongoose database model or constants file.
 */
const COUNTRIES: CountryFlag[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
];

/**
 * Global Reach ("Working Across Borders") feature component.
 * Uses a Client Component wrapper with useGsapContext for a lightweight, staggered ScrollTrigger entrance.
 */
export function FlagRow() {
  const containerRef = useRef<HTMLElement>(null);

  useGsapContext(
    () => {
      if (!containerRef.current) return;

      const flagItems = containerRef.current.querySelectorAll('.flag-item');
      const textElements = containerRef.current.querySelectorAll('.global-reach-text');

      if (!flagItems.length) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.fromTo(
        textElements,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
      ).fromTo(
        flagItems,
        { y: 25, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' },
        '-=0.3'
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="w-full border-y border-border bg-card/40 py-20 px-6 md:px-12 select-none"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-10">
        {/* Section Header */}
        <div className="flex flex-col items-center gap-3">
          <span className="global-reach-text text-xs font-mono font-semibold uppercase tracking-widest text-emerald-400">
            Global Collaboration
          </span>
          <h2 className="global-reach-text font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Working Across Borders
          </h2>
          <p className="global-reach-text text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
            Collaborating seamlessly with cross-functional teams, clients, and engineering hubs across time zones worldwide.
          </p>
        </div>

        {/* Flag + Country Name Row */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 max-w-4xl">
          {COUNTRIES.map((c) => (
            <div
              key={c.code}
              className="flag-item group flex items-center gap-3 rounded-full border border-border bg-muted/90 px-6 py-3.5 shadow-lg transition-all hover:border-muted-foreground hover:bg-secondary"
            >
              <span className="text-2xl sm:text-3xl transition-transform group-hover:scale-110">
                {c.flag}
              </span>
              <span className="font-display text-sm sm:text-base font-semibold tracking-tight text-neutral-200 group-hover:text-foreground">
                {c.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FlagRow;
