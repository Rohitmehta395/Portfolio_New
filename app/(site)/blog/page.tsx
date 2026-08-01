import { Metadata } from 'next';
import { getBlogPosts } from '@/actions/blog.actions';
import { BlogCard } from '@/features/blog/BlogCard';

import { PageHero } from '@/components/ui/PageHero';

import { siteConfig } from '@/config/site.config';

export const metadata: Metadata = {
  title: 'Blog & Articles',
  description:
    'Technical articles, architectural insights, and tutorials on Next.js, React, TypeScript, GSAP, and full-stack engineering.',
  openGraph: {
    title: 'Blog & Articles',
    description:
      'Technical articles, architectural insights, and tutorials on Next.js, React, TypeScript, GSAP, and full-stack engineering.',
    url: `${siteConfig.url}/blog`,
    images: [`${siteConfig.url}/api/og?title=${encodeURIComponent('Blog & Articles')}&type=Blog`],
  },
};

/**
 * Blog Listing Server Component route at /blog.
 * Fetches all published blog posts server-side and renders the articles grid.
 */
export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <main className="min-h-screen pb-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col gap-12 select-none">
      {/* Page Hero Section */}
      <PageHero
        title="My"
        highlight="Blogs"
        subtitle="Deep dives into software architecture, frontend performance optimization, design systems, and modern web development."
      />

      {/* Articles Grid */}
      {posts.length === 0 ? (
        <div className="rounded-2xl border border-border bg-muted/40 p-12 text-center text-sm text-muted-foreground">
          No articles published yet. Check back soon!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </main>
  );
}
