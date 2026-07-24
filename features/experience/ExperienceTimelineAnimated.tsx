'use client';

import { useRef } from 'react';
import { useGsapContext } from '@/hooks/useGsapContext';
import { gsap } from '@/lib/gsap/registerPlugins';
import { ExperienceCard, SerializedExperience } from './ExperienceCard';

interface ExperienceTimelineAnimatedProps {
  experiences: SerializedExperience[];
}

/**
 * Isolated Client Component wrapper handling per-card GSAP ScrollTrigger reveals.
 * Receives plain serialized Experience objects from the parent Server Component.
 */
export function ExperienceTimelineAnimated({ experiences }: ExperienceTimelineAnimatedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGsapContext(
    () => {
      if (!containerRef.current) return;

      const cards = containerRef.current.querySelectorAll('.experience-card-item');

      if (!cards.length) return;

      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    },
    { scope: containerRef, dependencies: [experiences] }
  );

  if (experiences.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-muted/40 p-8 text-center text-sm text-muted-foreground">
        No work experience entries recorded in database.
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col bg-[#262626] text-white rounded-[2rem] px-6 md:px-12 py-2 shadow-2xl">
      {experiences.map((exp, idx) => (
        <div key={exp._id} className="experience-card-item opacity-0 flex flex-col">
          <ExperienceCard experience={exp} index={idx} />
          {idx < experiences.length - 1 && (
            <hr className="border-[#3a3a3a] w-full" />
          )}
        </div>
      ))}
    </div>
  );
}

export default ExperienceTimelineAnimated;
