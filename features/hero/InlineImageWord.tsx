import Image from 'next/image';

export interface InlineImageWordProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  shape?: 'circle' | 'pill' | 'rounded';
  className?: string;
}

/**
 * Presentational inline image component designed to sit within kinetic headline sentences.
 * Exposes the `hero-inline-img` class for parent GSAP timeline targeting.
 */
export function InlineImageWord({
  src,
  alt,
  width = 64,
  height = 64,
  shape = 'circle',
  className = '',
}: InlineImageWordProps) {
  const shapeStyles = {
    circle: 'rounded-full',
    pill: 'rounded-full aspect-[2/1]',
    rounded: 'rounded-2xl',
  };

  return (
    <span
      className={`hero-inline-img group inline-flex items-center justify-center align-middle mx-1.5 sm:mx-3 shrink-0 overflow-hidden border border-white/20 shadow-xl opacity-0 scale-75 ${shapeStyles[shape]} ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
        priority
      />
    </span>
  );
}

export default InlineImageWord;
