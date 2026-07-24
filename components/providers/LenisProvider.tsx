'use client';

import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger } from '@/lib/gsap/registerPlugins';
import { LenisContext } from '@/hooks/useLenis';

interface LenisProviderProps {
  children: React.ReactNode;
}

/**
 * Client-side Lenis Smooth Scroll Provider.
 * Initializes Lenis virtual scrolling, drives its RAF animation loop,
 * and synchronizes scroll updates directly with GSAP ScrollTrigger.
 */
export function LenisProvider({ children }: LenisProviderProps) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis with smooth easing defaults
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    setLenisInstance(lenis);

    // Synchronize Lenis scroll position with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // RAF Loop
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      setLenisInstance(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisInstance}>
      {children}
    </LenisContext.Provider>
  );
}

export default LenisProvider;
