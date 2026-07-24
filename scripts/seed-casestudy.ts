import connectDB from '../lib/db/connect';
import Project from '../models/Project.model';
import CaseStudy from '../models/CaseStudy.model';

/**
 * TEMPORARY TEST DATA SEEDING SCRIPT FOR PHASE 13
 * Creates ONE test CaseStudy document linked to the 'quantum-analytics' Project.
 *
 * NOTE: This is explicitly temporary test data for Phase 13 validation, allowing
 * testing of both the full case study rendering path (quantum-analytics) and the
 * unlinked project-only fallback path (other 5 test projects).
 */
async function seedCaseStudy() {
  console.log('Connecting to MongoDB...');
  await connectDB();

  console.log('Finding target project (quantum-analytics)...');
  const targetProject = await Project.findOne({ slug: 'quantum-analytics' });

  if (!targetProject) {
    console.error('Target project "quantum-analytics" not found. Run seed-projects.ts first.');
    process.exit(1);
  }

  console.log('Clearing existing test CaseStudy documents...');
  await CaseStudy.deleteMany({});

  const sampleCaseStudy = await CaseStudy.create({
    projectRef: targetProject._id,
    problem:
      'Legacy enterprise dashboard suffered from latency spikes, unoptimized queries, and lack of real-time telemetry, hindering executive decision making under heavy peak loads.',
    approach:
      'Architected a decoupled microservices architecture with Next.js 15 Server Components for initial shell loading, Node.js GraphQL API services, and MongoDB indexing strategies.',
    solution:
      'Implemented real-time WebSocket data feeds, Redis-cached GraphQL query layers, and dynamic GSAP data visualization charts with dark editorial UI styling.',
    results:
      'Reduced initial page load latency by 68%, scaled to support 100k+ concurrent active sessions, and increased user engagement metrics by 45% across corporate accounts.',
    metrics: [
      { label: 'Latency Reduction', value: '68%' },
      { label: 'Concurrent Users', value: '100k+' },
      { label: 'User Engagement', value: '+45%' },
      { label: 'Uptime SLA', value: '99.99%' },
    ],
    images: [
      {
        url:
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect width="800" height="500" fill="%23171717"/><text x="400" y="250" font-family="sans-serif" font-size="24" fill="%2310b981" text-anchor="middle">SYSTEM ARCHITECTURE DIAGRAM</text></svg>',
        caption: 'High-concurrency system architecture overview',
      },
      {
        url:
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect width="800" height="500" fill="%2318181b"/><text x="400" y="250" font-family="sans-serif" font-size="24" fill="%23e4e4e7" text-anchor="middle">REAL-TIME METRICS DASHBOARD</text></svg>',
        caption: 'Real-time telemetry and analytics workspace',
      },
    ],
  });

  // Link CaseStudy back to Project via caseStudyRef
  targetProject.caseStudyRef = sampleCaseStudy._id as any;
  await targetProject.save();

  console.log(
    `Successfully created test CaseStudy (ID: ${sampleCaseStudy._id}) linked to Project "${targetProject.title}"!`
  );
  process.exit(0);
}

seedCaseStudy().catch((err) => {
  console.error('Error seeding test case study:', err);
  process.exit(1);
});
