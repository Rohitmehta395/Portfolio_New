import Image from 'next/image';
import { CapabilityItem } from './capabilities.data';

interface CapabilityCardProps {
  capability: CapabilityItem;
  className?: string;
}

/**
 * Presentational component for displaying a single Capability card.
 */
export function CapabilityCard({ capability, className = '' }: CapabilityCardProps) {
  return (
    <div
      className={`relative flex flex-col rounded-3xl border border-white/5 bg-[#171717] p-4 sm:p-6 md:p-10 lg:p-12 shadow-2xl overflow-hidden transition-colors ${className}`}
    >
      {/* Media Image Preview */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden rounded-xl bg-neutral-900 mb-8 sm:mb-10 transition-colors">
        <Image
          src={capability.imageSrc}
          alt={capability.title}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          unoptimized
        />
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1">
        <div className="flex flex-col gap-2 mb-6">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-neutral-400 transition-colors">
            {capability.subheading}
          </span>
          <h3 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white transition-colors">
            {capability.title}
          </h3>
        </div>

        <p className="text-sm md:text-base leading-relaxed text-neutral-300 max-w-3xl mb-12 transition-colors">
          {capability.description}
        </p>

        {/* Tag Pills */}
        <div className="flex flex-wrap items-center gap-3 mt-auto">
          {capability.tags.map((tag) => (
            <div key={tag} className="px-4 py-1.5 rounded-full border border-white/20 text-xs text-neutral-300 bg-transparent whitespace-nowrap transition-colors">
              {tag}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CapabilityCard;

