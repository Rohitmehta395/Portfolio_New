'use client';

import { createContext, useContext } from 'react';
import type Lenis from 'lenis';

export const LenisContext = createContext<Lenis | null>(null);

/**
 * Custom React hook to access the active Lenis smooth-scroll instance.
 * Allows components to query scroll state or execute programmatic scroll actions
 * (e.g. lenis.scrollTo('#section')) without managing custom event listeners or refs.
 */
export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

export default useLenis;
