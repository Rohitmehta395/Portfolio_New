import Image from 'next/image';
import { TagPill } from '@/features/experience/TagPill';
import { CapabilityItem } from './capabilities.data';

interface CapabilityCardProps {
  capability: CapabilityItem;
  className?: string;
}

/**
 * Presentational component for displaying a single Capability card.
 * Features oversized low-opacity "ghost text" watermark background typography and reuses TagPill.
 */
export function CapabilityCard({ capability, className = '' }: CapabilityCardProps) {
  return (
    <div
      className={`relative flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12 rounded-3xl border border-border/80 bg-card/80 p-8 md:p-12 backdrop-blur-md overflow-hidden ${className}`}
    >
      {/* Oversized Low-Opacity Ghost Background Typography Watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-6 -right-6 select-none font-display text-7xl sm:text-9xl md:text-[12rem] font-black uppercase text-neutral-900/40 tracking-tighter leading-none z-0"
      >
        {capability.ghostTitle}
      </div>

      {/* Content Column */}
      <div className="relative z-10 flex flex-1 flex-col justify-between gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-400">
              {capability.number}
            </span>
            <span className="h-1 w-1 rounded-full bg-neutral-600" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              {capability.category}
            </span>
          </div>

          <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            {capability.title}
          </h3>
        </div>

        <p className="text-sm md:text-base leading-relaxed text-secondary-foreground max-w-xl">
          {capability.description}
        </p>

        {/* Tag Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {capability.tags.map((tag) => (
            <TagPill key={tag} label={tag} variant="default" />
          ))}
        </div>
      </div>

      {/* Media Image Preview Column */}
      <div className="relative z-10 w-full lg:w-1/2 shrink-0 aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-muted shadow-2xl">
        <Image
          src={capability.imageSrc}
          alt={capability.title}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          unoptimized
        />
      </div>
    </div>
  );
}

export default CapabilityCard;
