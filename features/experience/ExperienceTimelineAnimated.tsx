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
    <div ref={containerRef} className="flex flex-col gap-8">
      {experiences.map((exp, idx) => (
        <div key={exp._id} className="experience-card-item opacity-0">
          <ExperienceCard experience={exp} index={idx} />
        </div>
      ))}
    </div>
  );
}

export default ExperienceTimelineAnimated;
