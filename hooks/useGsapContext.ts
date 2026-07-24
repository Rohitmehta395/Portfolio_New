'use client';

import { useGSAP } from '@gsap/react';
import type { RefObject } from 'react';
import { registerGsapPlugins } from '@/lib/gsap/registerPlugins';

// Ensure GSAP plugins (ScrollTrigger) are registered before hook invocation
registerGsapPlugins();

export type UseGsapCallback = (
  context: gsap.Context,
  contextSafe?: (func: (...args: any[]) => any) => (...args: any[]) => any
) => void | (() => void);

export interface UseGsapOptions {
  scope?: RefObject<Element | null> | Element | string;
  dependencies?: any[];
  revertOnUpdate?: boolean;
}

/**
 * Standardized GSAP animation cleanup hook for the application.
 *
 * PROJECT-WIDE CONVENTION: All feature-level GSAP animations (Phases 6, 7, 9, 10, etc.)
 * MUST route their timeline and ScrollTrigger creation through this hook rather than raw useEffect.
 *
 * This guarantees:
 * 1. Automatic selector scoping within the container element.
 * 2. Strict cleanup via context reversion (ctx.revert()) upon unmount or route changes,
 *    preventing orphaned ScrollTriggers and memory leaks in Next.js App Router.
 * 3. Single-source registration of required GSAP plugins (ScrollTrigger).
 */
export function useGsapContext(
  callback: UseGsapCallback,
  options: UseGsapOptions = {}
) {
  const { scope, dependencies = [], revertOnUpdate = true } = options;

  return useGSAP(callback, {
    scope,
    dependencies,
    revertOnUpdate,
  });
}

export default useGsapContext;
