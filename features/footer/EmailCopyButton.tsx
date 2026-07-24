'use client';

import { useState, useEffect } from 'react';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { SOCIAL_LINKS } from '@/constants/social-links';

const emailObj = SOCIAL_LINKS.find((s) => s.platform === 'Email');
const realEmail = emailObj ? emailObj.url.replace('mailto:', '') : 'rohit@example.com';

// In-house obfuscation utility: character offset encoding decoded only on client mount
function decodeEmail(encodedStr: string): string {
  return encodedStr
    .split('')
    .map((c) => String.fromCharCode(c.charCodeAt(0) - 1))
    .join('');
}

function encodeEmail(email: string): string {
  return email
    .split('')
    .map((c) => String.fromCharCode(c.charCodeAt(0) + 1))
    .join('');
}

const encodedEmail = encodeEmail(realEmail);

export function EmailCopyButton() {
  const { copied, copy } = useCopyToClipboard(2500);
  const [displayEmail, setDisplayEmail] = useState<string>('••••••••@••••.•••');

  useEffect(() => {
    // Decode client-side on mount to protect from static web scrapers
    setDisplayEmail(decodeEmail(encodedEmail));
  }, []);

  const handleCopy = () => {
    copy(realEmail);
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className="group relative inline-flex items-center gap-3 rounded-full border border-border bg-muted/60 px-5 py-2.5 text-sm font-medium text-secondary-foreground transition-all hover:border-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none"
      aria-label="Copy contact email to clipboard"
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
            copied ? 'bg-emerald-400' : 'bg-neutral-500 group-hover:bg-foreground'
          }`}
        />
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${
            copied ? 'bg-emerald-500' : 'bg-neutral-400 group-hover:bg-foreground'
          }`}
        />
      </span>

      <span className="font-mono text-xs tracking-tight">
        {copied ? 'Copied to Clipboard!' : displayEmail}
      </span>

      <span className="text-xs text-neutral-500 group-hover:text-secondary-foreground">
        {copied ? '✓' : '📋'}
      </span>
    </button>
  );
}

export default EmailCopyButton;
