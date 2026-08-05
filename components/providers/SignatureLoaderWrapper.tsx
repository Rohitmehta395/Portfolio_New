'use client';

import React, { useState } from 'react';
import { SignatureLoader } from '@/components/ui/SignatureLoader';

interface SignatureLoaderWrapperProps {
  children: React.ReactNode;
}

export function SignatureLoaderWrapper({ children }: SignatureLoaderWrapperProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <SignatureLoader onLoadingComplete={() => setIsLoaded(true)} />
      <div
        className={`flex-1 flex flex-col transition-all duration-700 ease-out ${
          isLoaded
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-[0.985] translate-y-2 pointer-events-none max-h-screen overflow-hidden'
        }`}
      >
        {children}
      </div>
    </>
  );
}
