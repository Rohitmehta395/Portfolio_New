'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { NAV_LINKS } from '@/constants/nav-links';
import { SOCIAL_LINKS } from '@/constants/social-links';
import { siteConfig } from '@/config/site.config';
import { NavLink } from './NavLink';
import { useGsapContext } from '@/hooks/useGsapContext';
import { useLenis } from '@/hooks/useLenis';
import { gsap } from '@/lib/gsap/registerPlugins';

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  // Control body scroll & Lenis smooth scroll locking
  useEffect(() => {
    if (isOpen) {
      lenis?.stop();
      document.body.style.overflow = 'hidden';
    } else {
      lenis?.start();
      document.body.style.overflow = '';
    }

    return () => {
      lenis?.start();
      document.body.style.overflow = '';
    };
  }, [isOpen, lenis]);

  // GSAP animation context for staggered entrance & exit
  useGsapContext(
    () => {
      if (!overlayRef.current) return;

      const links = overlayRef.current.querySelectorAll('.menu-link-item');
      const footerElements = overlayRef.current.querySelectorAll('.menu-footer-item');

      if (isOpen) {
        gsap.killTweensOf([overlayRef.current, links, footerElements]);

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.to(overlayRef.current, {
          autoAlpha: 1,
          duration: 0.4,
        })
          .fromTo(
            links,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
            '-=0.2'
          )
          .fromTo(
            footerElements,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, stagger: 0.05 },
            '-=0.3'
          );
      } else {
        gsap.to(overlayRef.current, {
          autoAlpha: 0,
          duration: 0.3,
          ease: 'power2.in',
        });
      }
    },
    { scope: overlayRef, dependencies: [isOpen] }
  );

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-40 flex flex-col justify-between bg-card/95 p-6 md:p-12 backdrop-blur-xl opacity-0 invisible"
      aria-hidden={!isOpen}
    >
      {/* Top spacing matching header bar */}
      <div className="h-16" />

      {/* Main Nav Links list */}
      <div className="my-auto flex flex-col items-start gap-6 md:gap-8 max-w-4xl mx-auto w-full">
        {NAV_LINKS.map((link) => (
          <div key={link.href} className="menu-link-item overflow-hidden">
            <NavLink
              link={link}
              onClick={onClose}
              className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-secondary-foreground hover:text-foreground"
            />
          </div>
        ))}
      </div>

      {/* Footer Info Row inside Overlay */}
      <div className="w-full max-w-4xl mx-auto border-t border-border pt-8 mt-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Social links */}
        <div className="flex flex-wrap items-center gap-6">
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="menu-footer-item text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {social.platform}
            </a>
          ))}
        </div>

        {/* CTA Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/contact"
            onClick={onClose}
            className="menu-footer-item rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-background hover:bg-neutral-200 transition-colors"
          >
            Get in Touch
          </Link>
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="menu-footer-item rounded-full border border-muted-foreground px-6 py-2.5 text-sm font-medium text-secondary-foreground hover:border-neutral-500 hover:text-foreground transition-colors"
          >
            Resume ↗
          </a>
        </div>
      </div>
    </div>
  );
}

export default MenuOverlay;
