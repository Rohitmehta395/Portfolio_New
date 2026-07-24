'use client';

import { useState, useEffect, RefObject } from 'react';

export interface MousePosition {
  x: number;
  y: number;
  elementX: number;
  elementY: number;
  elementWidth: number;
  elementHeight: number;
}

/**
 * Reusable client-side hook tracking cursor position.
 * Returns global clientX/clientY as well as relative elementX/elementY coordinates
 * if a container element ref is provided.
 */
export function useMousePosition(ref?: RefObject<HTMLElement | null>): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    elementX: 0,
    elementY: 0,
    elementWidth: 0,
    elementHeight: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const pageX = event.clientX;
      const pageY = event.clientY;

      if (ref?.current) {
        const rect = ref.current.getBoundingClientRect();
        const elementX = pageX - rect.left;
        const elementY = pageY - rect.top;

        setMousePosition({
          x: pageX,
          y: pageY,
          elementX,
          elementY,
          elementWidth: rect.width,
          elementHeight: rect.height,
        });
      } else {
        setMousePosition({
          x: pageX,
          y: pageY,
          elementX: 0,
          elementY: 0,
          elementWidth: 0,
          elementHeight: 0,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [ref]);

  return mousePosition;
}

export default useMousePosition;
