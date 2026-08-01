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
    <main className="min-h-screen pb-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col gap-12 select-none">
      {/* Page Hero Section */}
      <PageHero
        title="My"
        highlight="Works"
        subtitle="A showcase of web applications, SaaS products, and mobile experiences engineered for performance, scale, and refined UX."
      />

      {/* Interactive Filterable Projects Grid */}
      <ProjectGrid initialProjects={projects} />

      {/* Closing CTA Banner (Links to /contact - Contact Page will be built in Phase 15) */}
      <div className="rounded-3xl border border-border bg-card/80 p-8 sm:p-12 text-center flex flex-col items-center gap-6 mt-8">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-emerald-400">
            Have a project in mind?
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Let's build something exceptional together.
          </h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
          Available for technical advisory, contract engineering, and full-time leadership roles worldwide.
        </p>
        <Link
          href="/contact"
          className="group inline-flex items-center gap-3 rounded-full bg-foreground px-8 py-4 text-sm font-semibold text-background hover:bg-neutral-200 transition-all shadow-xl hover:shadow-white/10"
        >
          <span>Get in Touch</span>
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </main>
  );
}
