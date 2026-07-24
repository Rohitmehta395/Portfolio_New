import { siteConfig } from '@/config/site.config';
import { InlineImageWord } from './InlineImageWord';
import { ArrowUpRight } from 'lucide-react';

/**
 * Kinetic Headline typography component.
 * Manually wraps words in `.hero-word` spans and interleaves `.hero-inline-img` instances
 * for coordinated GSAP entrance timeline animation.
 */
export function KineticHeadline() {
  return (
    <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-bold uppercase tracking-tight leading-[1.1] text-foreground select-none w-full flex flex-col items-center max-w-[100vw] overflow-hidden">
      {/* Line 1 */}
      <div className="flex flex-nowrap items-center justify-center whitespace-nowrap">
        <span className="hero-word inline-block mr-3 sm:mr-5">HELLO, I'M</span>
        <span className="hero-word inline-block font-cursive font-normal normal-case tracking-normal text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] pt-2 sm:pt-4">
          {siteConfig.author}
        </span>
      </div>

      {/* Line 2 */}
      <div className="flex flex-nowrap items-center justify-center mt-2 sm:mt-4 whitespace-nowrap">
        <span className="hero-word inline-block mr-3 sm:mr-4">A</span>
        <InlineImageWord
          src="/images/laptop.png"
          alt="Laptop Desk"
          width={120}
          height={60}
          shape="pill"
          className="w-16 h-8 sm:w-24 sm:h-12 md:w-32 md:h-16 lg:w-40 lg:h-20"
        />
        <span className="hero-word inline-block ml-3 sm:ml-4">SOFTWARE DEVELOPER</span>
      </div>

      {/* Line 3 */}
      <div className="flex flex-nowrap items-center justify-center mt-2 sm:mt-4 whitespace-nowrap">
        <span className="hero-word inline-block mr-3 sm:mr-4">WHO</span>
        
        {/* Purple Arrow Icon */}
        <span className="hero-inline-img flex items-center justify-center shrink-0 mx-2 opacity-0 scale-75 cursor-default">
          <span className="group relative flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-[#8B5CF6] text-white shadow-lg transition-transform duration-300 ease-out hover:scale-110 overflow-hidden">
            <ArrowUpRight className="absolute w-5 h-5 sm:w-7 sm:h-7 lg:w-10 lg:h-10 transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-x-[150%] group-hover:-translate-y-[150%]" />
            <ArrowUpRight className="absolute w-5 h-5 sm:w-7 sm:h-7 lg:w-10 lg:h-10 transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] -translate-x-[150%] translate-y-[150%] group-hover:translate-x-0 group-hover:translate-y-0" />
          </span>
        </span>
        
        <span className="hero-word inline-block ml-3 sm:ml-4 mr-3 sm:mr-4">CRAFTS</span>
        <span className="hero-word inline-block font-cursive font-normal normal-case tracking-normal text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] pt-2 sm:pt-4">
          creative
        </span>
      </div>

      {/* Line 4 */}
      <div className="flex flex-nowrap items-center justify-center mt-2 sm:mt-4 whitespace-nowrap">
        <span className="hero-word inline-block mr-3 sm:mr-4">DIGITAL</span>
        <InlineImageWord
          src="/images/abstract.png"
          alt="Abstract Art"
          width={120}
          height={60}
          shape="pill"
          className="w-16 h-8 sm:w-24 sm:h-12 md:w-32 md:h-16 lg:w-40 lg:h-20"
        />
        <span className="hero-word inline-block ml-3 sm:ml-4">EXPERIENCES</span>
      </div>
    </h1>
  );
}

export default KineticHeadline;
