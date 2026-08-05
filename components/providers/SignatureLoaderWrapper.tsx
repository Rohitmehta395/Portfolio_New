'use client';

import React, { useState } from 'react';
import { SignatureLoader } from '@/components/ui/SignatureLoader';

interface SignatureLoaderWrapperProps {
  children: React.ReactNode;
}

export function SignatureLoaderWrapper({ children }: SignatureLoaderWrapperProps) {
  const [, setIsLoaded] = useState(false);

  const handleLoadingComplete = () => {
    setIsLoaded(true);

    // Refresh GSAP ScrollTrigger & dispatch window resize after loader unmounts
    // to ensure pinned sections like CapabilitiesShowcase ("What I Do") measure correctly
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
        try {
          // Dynamic import / check GSAP ScrollTrigger
          import('@/lib/gsap/registerPlugins').then(({ ScrollTrigger }) => {
            ScrollTrigger.refresh();
          });
        } catch {}
      }, 50);
    }
  };

  return (
    <>
      <SignatureLoader onLoadingComplete={handleLoadingComplete} minimumDuration={1350} />
      {children}
    </>
  );
}
