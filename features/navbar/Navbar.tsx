'use client';

import { useState } from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site.config';
import { MenuOverlay } from './MenuOverlay';
import { ThemeToggle } from './ThemeToggle';
import { HandwrittenText } from '@/components/ui/HandwrittenText';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 md:pr-20 backdrop-blur-md bg-background/40 transition-all">
        <Link
          href="/"
          onClick={closeMenu}
          className="group flex items-center font-cursive text-4xl text-foreground hover:opacity-80 transition-opacity"
        >
          <span><HandwrittenText>{siteConfig.author}</HandwrittenText></span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <div className="relative z-50">
            <ThemeToggle />
          </div>

          <button
            onClick={toggleMenu}
            className="group relative z-50 flex items-center justify-center rounded-full bg-foreground px-6 py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-background hover:scale-105 transition-all shadow-md focus:outline-none"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            <span>{isOpen ? 'CLOSE' : 'MENU'}</span>
          </button>
        </div>
      </header>

      {/* Full-screen Menu Overlay */}
      <MenuOverlay isOpen={isOpen} onClose={closeMenu} />
    </>
  );
}

export default Navbar;
