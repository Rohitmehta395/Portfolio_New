import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProjectBySlug } from '@/actions/project.actions';
import { TagPill } from '@/features/experience/TagPill';
import { siteConfig } from '@/config/site.config';

import { PageHero } from '@/components/ui/PageHero';

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * Dynamic metadata generator for Project / Case Study detail route.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project Not Found | Developer Portfolio',
      description: 'The requested project could not be found.',
    };
  }

  return {
    title: `${project.title} — Case Study & Project Details`,
    description: project.shortDescription,
    openGraph: {
      title: `${project.title} — Case Study & Project Details`,
      description: project.shortDescription,
      url: `${siteConfig.url}/works/${slug}`,
      images: [`${siteConfig.url}/api/og?title=${encodeURIComponent(project.title)}&type=${encodeURIComponent('Case Study')}`],
    },
  };
}

/**
 * Case Study / Project Detail Server Component route at /works/[slug].
 * Fetches project & populated case study server-side.
 * Renders full case study layout when linked CaseStudy exists; renders project-only fallback when unlinked.
 */
export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const { caseStudy } = project;

  const categoryLabels: Record<string, string> = {
    website: 'Website & Web App',
    saas: 'SaaS Platform',
    mobile: 'Mobile Application',
  };

  const projectJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.shortDescription,
    url: `${siteConfig.url}/works/${slug}`,
    creator: {
      '@type': 'Person',
      name: siteConfig.author,
    },
    image: project.coverImage,
    datePublished: project.createdAt ? new Date(project.createdAt).toISOString() : undefined,
  };

  return (
    <main className="min-h-screen py-24 px-6 md:px-12 max-w-6xl mx-auto flex flex-col gap-16 select-none">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />
      {/* Top Back Navigation Link */}
      <div className="flex items-center justify-between border-b border-border pb-6">
        <Link
          href="/works"
          className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>← Back to Selected Works</span>
        </Link>

        <span className="text-xs font-mono text-muted-foreground">
          {categoryLabels[project.category]}
        </span>
      </div>

      {/* Hero Header */}
      <PageHero
        title={project.title}
        subtitle={project.shortDescription}
      />

        {/* Tech Stack & External Links Bar */}
        <div className="flex flex-wrap items-center justify-between gap-6 pt-4 border-t border-border">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground mr-2">Stack:</span>
            {project.techStack.map((tech) => (
              <TagPill key={tech} label={tech} variant="default" />
            ))}
          </div>

          <div className="flex items-center gap-4 text-sm font-semibold">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-background hover:bg-neutral-200 transition-colors shadow-md"
              >
                <span>Live Demo</span>
                <span>↗</span>
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-5 py-2 text-neutral-200 hover:border-muted-foreground hover:text-foreground transition-colors"
              >
                <span>Source Code</span>
                <span>↗</span>
              </a>
            )}
          </div>
        </div>

      {/* Main Cover Image */}
      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-3xl border border-border bg-muted shadow-2xl">
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="object-cover"
          unoptimized
        />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* FULL CASE STUDY SECTION (Rendered if CaseStudy exists)         */}
      {/* ------------------------------------------------------------- */}
      {caseStudy ? (
        <div className="flex flex-col gap-16 pt-6">
          {/* Key Impact Metrics Grid */}
          {caseStudy.metrics && caseStudy.metrics.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 rounded-3xl border border-border/80 bg-card/60 backdrop-blur-md">
              {caseStudy.metrics.map((metric, idx) => (
                <div key={idx} className="flex flex-col gap-1 border-l-2 border-emerald-500 pl-4">
                  <span className="font-display text-3xl md:text-4xl font-extrabold text-foreground">
                    {metric.value}
                  </span>
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    {metric.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Core Case Study Content Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {caseStudy.problem && (
              <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card/40 p-8">
                <h2 className="text-xs font-mono font-semibold uppercase tracking-widest text-emerald-400">
                  01. The Challenge
                </h2>
                <h3 className="font-display text-2xl font-bold text-foreground">Problem Statement</h3>
                <p className="text-sm leading-relaxed text-secondary-foreground">{caseStudy.problem}</p>
              </div>
            )}

            {caseStudy.approach && (
              <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card/40 p-8">
                <h2 className="text-xs font-mono font-semibold uppercase tracking-widest text-emerald-400">
                  02. Technical Strategy
                </h2>
                <h3 className="font-display text-2xl font-bold text-foreground">Engineering Approach</h3>
                <p className="text-sm leading-relaxed text-secondary-foreground">{caseStudy.approach}</p>
              </div>
            )}

            {caseStudy.solution && (
              <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card/40 p-8">
                <h2 className="text-xs font-mono font-semibold uppercase tracking-widest text-emerald-400">
                  03. Implementation
                </h2>
                <h3 className="font-display text-2xl font-bold text-foreground">The Solution</h3>
                <p className="text-sm leading-relaxed text-secondary-foreground">{caseStudy.solution}</p>
              </div>
            )}

            {caseStudy.results && (
              <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card/40 p-8">
                <h2 className="text-xs font-mono font-semibold uppercase tracking-widest text-emerald-400">
                  04. Key Outcomes
                </h2>
                <h3 className="font-display text-2xl font-bold text-foreground">Measurable Results</h3>
                <p className="text-sm leading-relaxed text-secondary-foreground">{caseStudy.results}</p>
              </div>
            )}
          </div>

          {/* Case Study Image Gallery */}
          {caseStudy.images && caseStudy.images.length > 0 && (
            <div className="flex flex-col gap-6 pt-6">
              <h3 className="font-display text-2xl font-bold text-foreground">Visual Walkthrough</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {caseStudy.images.map((img, idx) => (
                  <div key={idx} className="flex flex-col gap-3">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-muted">
                      <Image
                        src={img.url}
                        alt={img.caption}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <p className="text-xs font-mono text-muted-foreground px-1">{img.caption}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ------------------------------------------------------------- */
        /* FALLBACK PROJECT-ONLY VIEW (Rendered if CaseStudy is null)    */
        /* ------------------------------------------------------------- */
        <div className="rounded-3xl border border-border/80 bg-card/60 p-8 md:p-12 text-center flex flex-col items-center gap-6">
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            Project Overview
          </span>
          <p className="text-sm text-secondary-foreground max-w-xl leading-relaxed">
            Detailed deep-dive case study architecture notes for this project are currently being prepared. Check out the live demo or source code links above to explore the project.
          </p>
        </div>
      )}
    </main>
  );
}
  