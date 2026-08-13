'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLenis } from '@/hooks/useLenis';
import { ScrollTrigger } from '@/lib/gsap/registerPlugins';

export function HashScrollHandler() {
  const lenis = useLenis();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!lenis || typeof window === 'undefined') return;

    const scrollToHash = () => {
      const hash = window.location.hash;
      if (!hash) return;

      const target = document.querySelector(hash);
      if (target) {
        try {
          ScrollTrigger.refresh();
        } catch {}
        lenis.scrollTo(hash, {
          offset: -20,
          duration: 1.2,
          immediate: false,
        });
      }
    };

    // Staggered triggers to account for layout shifts from GSAP ScrollTrigger pinning
    // and initial SignatureLoader unmounting
    const timer1 = setTimeout(scrollToHash, 150);
    const timer2 = setTimeout(scrollToHash, 600);
    const timer3 = setTimeout(scrollToHash, 1500);

    window.addEventListener('hashchange', scrollToHash);

    // Initial check
    scrollToHash();

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      window.removeEventListener('hashchange', scrollToHash);
    };
  }, [lenis, pathname, searchParams]);

  return null;
}

export default HashScrollHandler;
