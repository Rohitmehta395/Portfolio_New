import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let isRegistered = false;

/**
 * Singleton registration utility for GSAP plugins.
 * Ensures ScrollTrigger is registered exactly once across SSR and client hydration / hot reloads.
 * This is the ONLY file in the project where gsap.registerPlugin() should be called.
 */
export function registerGsapPlugins(): void {
  if (typeof window !== 'undefined' && !isRegistered) {
    gsap.registerPlugin(ScrollTrigger);
    isRegistered = true;
  }
}

// Auto-register on client execution
if (typeof window !== 'undefined') {
  registerGsapPlugins();
}

export { gsap, ScrollTrigger };
