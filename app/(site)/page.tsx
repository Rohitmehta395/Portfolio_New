import { Metadata } from 'next';
import { SEO_DEFAULTS } from '@/constants/seo-defaults';
import { siteConfig } from '@/config/site.config';
import { Hero } from '@/features/hero/Hero';
import { GithubActivityGraph } from '@/features/github-activity/GithubActivityGraph';
import { TechMarquee } from '@/features/marquee/TechMarquee';
import { ExperienceTimeline } from '@/features/experience/ExperienceTimeline';
import { CapabilitiesShowcase } from '@/features/capabilities/CapabilitiesShowcase';
import { FlagRow } from '@/features/global-reach/FlagRow';
import { ContactForm } from '@/features/contact/ContactForm';

export const metadata: Metadata = {
  title: {
    default: SEO_DEFAULTS.title,
    template: `%s | ${SEO_DEFAULTS.siteName}`,
  },
  description: SEO_DEFAULTS.description,
  openGraph: {
    title: SEO_DEFAULTS.title,
    description: SEO_DEFAULTS.description,
    url: siteConfig.url,
    siteName: SEO_DEFAULTS.siteName,
    locale: SEO_DEFAULTS.locale,
    type: 'website',
    images: [`${siteConfig.url}/api/og?title=${encodeURIComponent('Creative Software Developer')}`],
  },
  twitter: {
    card: 'summary_large_image',
    title: SEO_DEFAULTS.title,
    description: SEO_DEFAULTS.description,
    creator: SEO_DEFAULTS.twitterHandle,
    images: [`${siteConfig.url}/api/og?title=${encodeURIComponent('Creative Software Developer')}`],
  },
  metadataBase: new URL(siteConfig.url),
};

/**
 * TEMPORARY TEST RENDER: Phase 15 Validation
 * Mounts ContactForm temporarily on the homepage for Phase 15 form submission validation.
 */
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const year = resolvedSearchParams.year ? parseInt(resolvedSearchParams.year as string, 10) : undefined;
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.author,
    jobTitle: siteConfig.role,
    url: siteConfig.url,
    sameAs: [
      siteConfig.links.github,
      siteConfig.links.linkedin,
      siteConfig.links.twitter,
    ]
  };

  return (
    <main className="flex flex-col gap-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Hero />
      <GithubActivityGraph year={year} />
      <TechMarquee />
      <ExperienceTimeline />
      <CapabilitiesShowcase />
      <FlagRow />
      <section className="max-w-4xl mx-auto w-full px-6 py-12">
        <h2 className="text-2xl font-bold font-display text-foreground mb-6 text-center">
          Get in Touch (Phase 15 Test Render)
        </h2>
        <ContactForm />
      </section>
    </main>
  );
}
