import { Metadata } from 'next';
import { SEO_DEFAULTS } from '@/constants/seo-defaults';
import { siteConfig } from '@/config/site.config';
import { ExperienceTimeline } from '@/features/experience/ExperienceTimeline';
import { PageHero } from '@/components/ui/PageHero';
import { AboutMe } from '@/features/about/AboutMe';

export const metadata: Metadata = {
  title: 'My Journey',
  description: 'My complete career journey, milestones, and personal evolution.',
  openGraph: {
    title: `My Journey | ${SEO_DEFAULTS.siteName}`,
    description: 'My complete career journey, milestones, and personal evolution.',
    url: `${siteConfig.url}/journey`,
    siteName: SEO_DEFAULTS.siteName,
    locale: SEO_DEFAULTS.locale,
    type: 'website',
    images: [`${siteConfig.url}/api/og?title=${encodeURIComponent('My Journey')}`],
  },
  twitter: {
    card: 'summary_large_image',
    title: `My Journey | ${SEO_DEFAULTS.siteName}`,
    description: 'My complete career journey, milestones, and personal evolution.',
    creator: SEO_DEFAULTS.twitterHandle,
    images: [`${siteConfig.url}/api/og?title=${encodeURIComponent('My Journey')}`],
  },
};

export default function JourneyPage() {
  return (
    <main className="min-h-screen select-none">
      <PageHero
        title="My"
        highlight="Journey"
        subtitle="A detailed narrative of my software engineering career, milestones, and personal evolution."
      />
      <AboutMe />
      <ExperienceTimeline hideHeader />
    </main>
  );
}
