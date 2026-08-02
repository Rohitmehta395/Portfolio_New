import { Metadata } from 'next';
import Link from 'next/link';
import { getProjects } from '@/actions/project.actions';
import { ProjectGrid } from '@/features/works/ProjectGrid';

import { PageHero } from '@/components/ui/PageHero';

import { siteConfig } from '@/config/site.config';
import { SEO_DEFAULTS } from '@/constants/seo-defaults';

export const metadata: Metadata = {
  title: 'Works & Case Studies',
  description:
    'Explore featured full-stack web applications, SaaS platforms, and mobile apps built with Next.js, React, TypeScript, and Flutter.',
  openGraph: {
    title: 'Works & Case Studies',
    description:
      'Explore featured full-stack web applications, SaaS platforms, and mobile apps built with Next.js, React, TypeScript, and Flutter.',
    url: `${siteConfig.url}/works`,
    images: [`${siteConfig.url}/api/og?title=${encodeURIComponent('Works & Case Studies')}&type=Portfolio`],
  },
};

/**
 * Works Page Server Component route at /works.
 * Fetches all published projects server-side and passes serialized data to the interactive ProjectGrid.
 */
export default async function WorksPage() {
  const projects = await getProjects();

  return (
    <main className="min-h-screen pb-24 px-2 sm:px-4 lg:px-6 max-w-[1440px] mx-auto flex flex-col gap-12 select-none">
      {/* Page Hero Section */}
      <PageHero
        title="My"
        highlight="Works"
        subtitle="A showcase of web applications, SaaS products, and mobile experiences engineered for performance, scale, and refined UX."
      />

      {/* Interactive Filterable Projects Grid */}
      <ProjectGrid initialProjects={projects} />
    </main>
  );
}

