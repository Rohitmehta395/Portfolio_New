import Link from 'next/link';
import { NAV_LINKS } from '@/constants/nav-links';
import { SOCIAL_LINKS } from '@/constants/social-links';
import { siteConfig } from '@/config/site.config';
import { EmailCopyButton } from './EmailCopyButton';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-card text-muted-foreground py-16 px-6 md:px-12 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 flex flex-col items-start gap-4">
            <Link
              href="/"
              className="font-display text-2xl font-bold tracking-tight text-foreground hover:opacity-80 transition-opacity"
            >
              {siteConfig.author}
            </Link>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="mt-2">
              <EmailCopyButton />
            </div>
          </div>

          {/* Navigation Sitemap Col */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
              Sitemap
            </h4>
            <ul className="flex flex-col gap-2 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Connect Col */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
              Connect
            </h4>
            <ul className="flex flex-col gap-2 text-sm">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.platform}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors inline-flex items-center gap-1"
                  >
                    <span>{social.platform}</span>
                    <span className="text-xs text-neutral-600">↗</span>
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors inline-flex items-center gap-1 font-medium text-secondary-foreground"
                >
                  <span>Resume</span>
                  <span className="text-xs text-neutral-500">↗</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {currentYear} {siteConfig.author}. All rights reserved.</p>
          <p className="font-mono">Crafted with Next.js 15, GSAP & Lenis</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
