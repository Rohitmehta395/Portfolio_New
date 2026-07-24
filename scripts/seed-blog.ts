import connectDB from '../lib/db/connect';
import BlogPost from '../models/BlogPost.model';

/**
 * TEMPORARY TEST DATA SEEDING SCRIPT FOR PHASE 14
 * Inserts 3 test BlogPost documents into MongoDB Atlas:
 * - 2 published posts with valid past publishedAt dates
 * - 1 unpublished draft post to exercise the public query "must not leak" validation check.
 */
async function seedBlog() {
  console.log('Connecting to MongoDB...');
  await connectDB();

  console.log('Clearing existing test BlogPost documents...');
  await BlogPost.deleteMany({});

  const now = new Date();
  const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
  const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);

  const samplePosts = [
    {
      title: 'Building High-Performance Next.js 15 Applications',
      slug: 'building-high-performance-nextjs-15',
      excerpt:
        'Explore practical strategies for optimizing Next.js 15 App Router applications using Server Components, streaming, and parallel data fetching.',
      contentMdx: `# Building High-Performance Next.js 15 Applications

Next.js 15 introduces powerful enhancements to Server Components, dynamic rendering, and caching strategies.

## Key Architectural Strategies

- **Server Components:** Default to server rendering to eliminate client bundle overhead.
- **Granular Suspense Boundaries:** Stream UI sections progressively.
- **Optimized Caching:** Utilize explicit revalidation intervals.

\`\`\`typescript
// Example Server Component fetch pattern
export async function getPerformanceMetrics() {
  const res = await fetch('https://api.example.com/metrics', { next: { revalidate: 3600 } });
  return res.json();
}
\`\`\`

> **Pro Tip:** Keep client interactive logic isolated in small leaf components to maintain fast initial page load times.`,
      coverImage:
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect width="800" height="500" fill="%23171717"/><text x="400" y="250" font-family="sans-serif" font-size="28" fill="%2310b981" text-anchor="middle">NEXT.JS 15 PERFORMANCE</text></svg>',
      tags: ['Next.js', 'Performance', 'React', 'TypeScript'],
      published: true,
      publishedAt: fiveDaysAgo,
      readTimeMinutes: 6,
    },
    {
      title: 'Mastering GSAP and Lenis for Modern Web Animations',
      slug: 'mastering-gsap-and-lenis-animations',
      excerpt:
        'A deep dive into combining GSAP ScrollTrigger with Lenis smooth virtualized scrolling for kinetic editorial layouts.',
      contentMdx: `# Mastering GSAP and Lenis for Modern Web Animations

Kinetic typography and dynamic scroll animations elevate developer portfolios from basic static pages to memorable visual experiences.

## Smooth Scroll Syncing

When combining **Lenis** with **GSAP ScrollTrigger**, ensure that Lenis updates ScrollTrigger on every animation frame:

1. Register GSAP plugins globally in a single initialization module.
2. Sync Lenis scroll events directly to \`ScrollTrigger.update()\`.
3. Wrap component timelines in \`useGsapContext\` for clean teardown on unmount.

\`\`\`typescript
// GSAP context cleanup pattern
useGsapContext(() => {
  gsap.fromTo('.anim-target', { opacity: 0 }, { opacity: 1 });
}, { scope: containerRef });
\`\`\``,
      coverImage:
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect width="800" height="500" fill="%2318181b"/><text x="400" y="250" font-family="sans-serif" font-size="28" fill="%23a1a1aa" text-anchor="middle">GSAP & LENIS ANIMATIONS</text></svg>',
      tags: ['GSAP', 'Lenis', 'Animation', 'Frontend'],
      published: true,
      publishedAt: tenDaysAgo,
      readTimeMinutes: 8,
    },
    {
      title: 'Unpublished Draft: AI-Driven Engineering Workflows',
      slug: 'unpublished-draft-ai-workflows',
      excerpt:
        'Internal draft notes on integrating LLM pair programming tools into modern software delivery pipelines.',
      contentMdx: `# Draft Content

This is an unpublished draft post that MUST NOT be returned by public queries or rendered on public routes.`,
      coverImage:
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect width="800" height="500" fill="%2327272a"/><text x="400" y="250" font-family="sans-serif" font-size="28" fill="%23ef4444" text-anchor="middle">UNPUBLISHED DRAFT</text></svg>',
      tags: ['Draft', 'AI', 'Engineering'],
      published: false,
      publishedAt: now,
      readTimeMinutes: 4,
    },
  ];

  const created = await BlogPost.create(samplePosts);
  console.log(`Successfully seeded ${created.length} test BlogPost documents!`);
  process.exit(0);
}

seedBlog().catch((err) => {
  console.error('Error seeding test blog posts:', err);
  process.exit(1);
});
