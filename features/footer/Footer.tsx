'use client';

import Link from 'next/link';
import { NAV_LINKS } from '@/constants/nav-links';
import { SOCIAL_LINKS } from '@/constants/social-links';
import { siteConfig } from '@/config/site.config';
import { ArrowUp, Copy, Check } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { LuffyFloat } from '@/components/ui/LuffyFloat';
import { HandwrittenText } from '@/components/ui/HandwrittenText';

export function Footer() {
  const { copied, copy } = useCopyToClipboard(2500);
  const emailObj = SOCIAL_LINKS.find((s) => s.platform === 'Email');
  const realEmail = emailObj ? emailObj.url.replace('mailto:', '') : 'rohitmehtaddn@gmail.com';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#0a0a0a] text-white rounded-t-[2.5rem] px-8 md:px-20 pt-20 pb-10 md:pb-0 lg:pb-0 mt-auto overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between gap-16 md:gap-8 mb-12 md:mb-20 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-24 w-full md:w-3/4">
            {/* SITEMAP */}
            <div className="flex flex-col gap-6">
              <h4 className="text-sm font-bold tracking-widest uppercase">
                SITEMAP
              </h4>
              <ul className="flex flex-col gap-4 text-sm font-normal text-neutral-300">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:text-white transition-colors inline-flex items-center gap-2 group"
                    >
                      <span className="text-neutral-500 group-hover:text-white transition-colors text-xs font-serif">
                        ↗
                      </span>
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* FOLLOW ME */}
            <div className="flex flex-col gap-6">
              <h4 className="text-sm font-bold tracking-widest uppercase">
                FOLLOW ME
              </h4>
              <ul className="flex flex-col gap-4 text-sm font-normal text-neutral-300">
                {SOCIAL_LINKS.filter((s) => s.platform !== "Email").map(
                  (social) => (
                    <li key={social.platform}>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors inline-flex items-center gap-2 group"
                      >
                        <span className="text-neutral-500 group-hover:text-white transition-colors text-xs font-serif">
                          ↗
                        </span>
                        <span>{social.platform}</span>
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* WORK WITH ME */}
            <div className="flex flex-col gap-6 md:col-span-1 col-span-2">
              <h4 className="text-sm font-bold tracking-widest uppercase">
                WORK WITH ME:
              </h4>
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="text-[0.85rem] xs:text-[1rem] sm:text-xl md:text-3xl font-semibold tracking-tight whitespace-nowrap">
                  {realEmail}
                </span>
                <button
                  onClick={() => copy(realEmail)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                  aria-label="Copy email"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-neutral-400" />
                  )}
                </button>
              </div>
              <a
                href={siteConfig.links.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-sm font-bold tracking-[0.2em] hover:text-neutral-300 transition-colors uppercase inline-flex items-center gap-2"
              >
                VIEW RESUME{" "}
                <span className="text-neutral-500 text-xs font-serif">↗</span>
              </a>
            </div>
          </div>

          {/* Scroll to top button - Desktop */}
          <div className="hidden md:flex relative justify-end">
            <button
              onClick={scrollToTop}
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-6 h-6 text-black" />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-full h-[1px] bg-white/20 mb-12 relative z-10" />

        {/* Bottom Section */}
        <div className="flex items-end justify-between relative">
          {/* Large Name */}
          <h1 className="font-cursive text-[6rem] xs:text-[7.5rem] sm:text-9xl md:text-[14rem] lg:text-[18rem] leading-none tracking-tight -mb-8 md:-mb-12 whitespace-nowrap text-white relative z-10">
            <HandwrittenText>{siteConfig.author}</HandwrittenText>
          </h1>

          {/* Scroll to top button - Mobile */}
          <div className="flex md:hidden relative z-20 mb-2 mr-2">
            <button
              onClick={scrollToTop}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5 text-black" />
            </button>
          </div>

          {/* Luffy Float */}
          <div className="hidden md:block absolute bottom-6 right-0 md:bottom-12 md:right-8 z-20">
            <LuffyFloat />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
