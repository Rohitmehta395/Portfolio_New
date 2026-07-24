import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug } from '@/actions/blog.actions';
import { TagPill } from '@/features/experience/TagPill';
import { MDXRenderer } from '@/features/blog/MDXRenderer';
import { siteConfig } from '@/config/site.config';

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * Dynamic SEO Metadata generator for Blog Detail route.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found | Developer Portfolio',
      description: 'The requested article could not be found.',
    };
  }

  return {
    title: `${post.title} | Articles & Insights`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | Articles & Insights`,
      description: post.excerpt,
      url: `${siteConfig.url}/blog/${slug}`,
      images: [`${siteConfig.url}/api/og?title=${encodeURIComponent(post.title)}&type=${encodeURIComponent('Article')}`],
    },
  };
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

/**
 * Blog Article Detail Server Component route at /blog/[slug].
 * Fetches published post server-side and renders compiled MDX content via MDXRenderer.
 */
export default async function BlogPostDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    author: {
      '@type': 'Person',
      name: siteConfig.author,
      url: siteConfig.url,
    },
  };

  return (
    <main className="min-h-screen py-24 px-6 md:px-12 max-w-4xl mx-auto flex flex-col gap-12 select-none">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {/* Top Back Navigation Link */}
      <div className="flex items-center justify-between border-b border-border pb-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>← Back to Articles</span>
        </Link>

        <span className="text-xs font-mono text-muted-foreground">
          {post.readTimeMinutes} min read
        </span>
      </div>

      {/* Article Header */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-3">
          {post.tags.map((tag) => (
            <TagPill key={tag} label={tag} variant="default" />
          ))}
        </div>

        <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground border-t border-b border-border/80 py-3">
          <span>Published on {formatDate(post.publishedAt)}</span>
        </div>
      </div>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="relative w-full aspect-[16/9] overflow-hidden rounded-3xl border border-border bg-muted shadow-2xl">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
            unoptimized
          />
        </div>
      )}

      {/* MDX Compiled Article Content Body */}
      <article className="pt-4">
        <MDXRenderer source={post.contentMdx} />
      </article>
    </main>
  );
}
