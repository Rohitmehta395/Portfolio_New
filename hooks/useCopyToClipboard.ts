'use client';

import { useState, useCallback } from 'react';

export interface UseCopyToClipboardReturn {
  copied: boolean;
  copy: (text: string) => Promise<boolean>;
}

/**
 * Custom React hook for copying text to the browser clipboard
 * with a temporary boolean feedback state that auto-reverts after a timeout.
 */
export function useCopyToClipboard(timeout: number = 2000): UseCopyToClipboardReturn {
  const [copied, setCopied] = useState<boolean>(false);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (!navigator?.clipboard) {
        console.warn('Clipboard API not supported');
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), timeout);
        return true;
      } catch (error) {
        console.error('Copy to clipboard failed:', error);
        setCopied(false);
        return false;
      }
    },
    [timeout]
  );

  return { copied, copy };
}

export default useCopyToClipboard;
