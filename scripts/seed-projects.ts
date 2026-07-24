import connectDB from '../lib/db/connect';
import Project, { IProject } from '../models/Project.model';

/**
 * TEMPORARY TEST DATA SEEDING SCRIPT FOR PHASE 12
 * This script inserts 6 temporary test Project documents into MongoDB purely for Phase 12 Works Page
 * layout, filtering, and component structure validation.
 *
 * NOTE: This is explicitly NOT production content or CMS-managed data (which will be built in Phase 18).
 */
async function seedProjects() {
  console.log('Connecting to MongoDB...');
  await connectDB();

  console.log('Clearing existing test Project documents...');
  await Project.deleteMany({});

  const sampleProjects: Partial<IProject>[] = [
    {
      title: 'Quantum Analytics SaaS Platform',
      slug: 'quantum-analytics',
      category: 'saas',
      shortDescription:
        'Real-time metrics visualization and AI-driven data intelligence dashboard built for high-concurrency enterprise workloads.',
      coverImage:
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect width="800" height="500" fill="%23171717"/><text x="400" y="250" font-family="sans-serif" font-size="28" fill="%2310b981" text-anchor="middle">QUANTUM SAAS DASHBOARD</text></svg>',
      gallery: [],
      techStack: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'MongoDB', 'Node.js'],
      liveUrl: 'https://example.com/quantum',
      repoUrl: 'https://github.com/example/quantum',
      featured: true,
      order: 1,
      published: true,
    },
    {
      title: 'Aura E-Commerce Experience',
      slug: 'aura-ecommerce',
      category: 'website',
      shortDescription:
        'Ultra-responsive luxury fashion storefront featuring kinetic typography, product showcases, and interactive cart transitions.',
      coverImage:
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect width="800" height="500" fill="%2318181b"/><text x="400" y="250" font-family="sans-serif" font-size="28" fill="%23e4e4e7" text-anchor="middle">AURA LUXURY E-COMMERCE</text></svg>',
      gallery: [],
      techStack: ['React 19', 'GSAP', 'Tailwind CSS', 'Next.js', 'Stripe'],
      liveUrl: 'https://example.com/aura',
      repoUrl: 'https://github.com/example/aura',
      featured: true,
      order: 2,
      published: true,
    },
    {
      title: 'Pulse Health & Fitness Companion',
      slug: 'pulse-fitness',
      category: 'mobile',
      shortDescription:
        'Cross-platform mobile wellness application tracking workout telemetry, biometric trends, and customized nutrition plans.',
      coverImage:
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect width="800" height="500" fill="%2309090b"/><text x="400" y="250" font-family="sans-serif" font-size="28" fill="%2334d399" text-anchor="middle">PULSE MOBILE APP</text></svg>',
      gallery: [],
      techStack: ['Flutter', 'Dart', 'Firebase', 'Node.js'],
      liveUrl: 'https://example.com/pulse',
      featured: true,
      order: 3,
      published: true,
    },
    {
      title: 'Nexus Developer API Portal',
      slug: 'nexus-api-portal',
      category: 'saas',
      shortDescription:
        'Developer documentation hub, interactive API sandbox, and key management console with automated SDK generation.',
      coverImage:
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect width="800" height="500" fill="%2327272a"/><text x="400" y="250" font-family="sans-serif" font-size="28" fill="%23a1a1aa" text-anchor="middle">NEXUS API PORTAL</text></svg>',
      gallery: [],
      techStack: ['Next.js', 'TypeScript', 'GraphQL', 'Docker', 'Tailwind CSS'],
      liveUrl: 'https://example.com/nexus',
      repoUrl: 'https://github.com/example/nexus',
      featured: false,
      order: 4,
      published: true,
    },
    {
      title: 'Vanguard Editorial Portfolio',
      slug: 'vanguard-portfolio',
      category: 'website',
      shortDescription:
        'Editorial creative agency website built with smooth Lenis virtualized scrolling and dynamic layout transitions.',
      coverImage:
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect width="800" height="500" fill="%23111827"/><text x="400" y="250" font-family="sans-serif" font-size="28" fill="%239ca3af" text-anchor="middle">VANGUARD EDITORIAL SITE</text></svg>',
      gallery: [],
      techStack: ['Next.js', 'GSAP', 'Lenis', 'Tailwind CSS'],
      liveUrl: 'https://example.com/vanguard',
      featured: false,
      order: 5,
      published: true,
    },
    {
      title: 'Orbit Task Management Mobile',
      slug: 'orbit-task-mobile',
      category: 'mobile',
      shortDescription:
        'Minimalist offline-first mobile productivity tracker with gesture-based interactions and dark editorial UI design.',
      coverImage:
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect width="800" height="500" fill="%231f2937"/><text x="400" y="250" font-family="sans-serif" font-size="28" fill="%2360a5fa" text-anchor="middle">ORBIT MOBILE APP</text></svg>',
      gallery: [],
      techStack: ['React Native', 'TypeScript', 'Redux Toolkit'],
      liveUrl: 'https://example.com/orbit',
      repoUrl: 'https://github.com/example/orbit',
      featured: false,
      order: 6,
      published: true,
    },
  ];

  const created = await Project.create(sampleProjects);
  console.log(`Successfully seeded ${created.length} temporary test Project documents!`);
  process.exit(0);
}

seedProjects().catch((err) => {
  console.error('Error seeding test projects:', err);
  process.exit(1);
});
