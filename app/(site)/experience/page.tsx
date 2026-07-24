import { Metadata } from 'next';
import { SEO_DEFAULTS } from '@/constants/seo-defaults';
import { siteConfig } from '@/config/site.config';
import { ExperienceTimeline } from '@/features/experience/ExperienceTimeline';

export const metadata: Metadata = {
  title: 'Experience',
  description: 'My complete work experience and career trajectory.',
  openGraph: {
    title: `Experience | ${SEO_DEFAULTS.siteName}`,
    description: 'My complete work experience and career trajectory.',
    url: `${siteConfig.url}/experience`,
    siteName: SEO_DEFAULTS.siteName,
    locale: SEO_DEFAULTS.locale,
    type: 'website',
    images: [`${siteConfig.url}/api/og?title=${encodeURIComponent('Experience')}`],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Experience | ${SEO_DEFAULTS.siteName}`,
    description: 'My complete work experience and career trajectory.',
    creator: SEO_DEFAULTS.twitterHandle,
    images: [`${siteConfig.url}/api/og?title=${encodeURIComponent('Experience')}`],
  },
};

export default function ExperiencePage() {
  return (
    <main className="min-h-screen pt-24 pb-12">
      <ExperienceTimeline />
    </main>
  );
}
