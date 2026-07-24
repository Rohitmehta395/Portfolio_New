import Link from 'next/link';
import connectDB from '@/lib/db/connect';
import Experience from '@/models/Experience.model';
import { SerializedExperience } from './ExperienceCard';
import { ExperienceTimelineAnimated } from './ExperienceTimelineAnimated';

async function getExperiences(): Promise<SerializedExperience[]> {
  try {
    await connectDB();
    const expDocs = await Experience.find({}).sort({ order: 1 }).lean();
    return JSON.parse(JSON.stringify(expDocs));
  } catch (error) {
    console.error('Failed to fetch experiences for timeline:', error);
    return [];
  }
}

/**
 * Server Component fetching Experience data from MongoDB.
 *
 * ARCHITECTURAL PATTERN (Server Fetch → Pass Plain Props → Client Animates):
 * 1. The outer ExperienceTimeline remains a Server Component, fetching data server-side via Mongoose.
 * 2. Mongoose documents are serialized to plain JSON objects to safely cross the Server/Client boundary.
 * 3. The plain data is passed to ExperienceTimelineAnimated, a Client Component wrapper.
 * 4. The Client wrapper applies GSAP ScrollTrigger per-card reveal animations via useGsapContext.
 *
 * This pattern isolates client bundle weight to animation wrappers while leaving page data fetching server-side.
 * Phase 10's Capabilities Showcase will build directly on this composition template.
 */
export async function ExperienceTimeline() {
  const experiences = await getExperiences();

  return (
    <section className="w-full border-y border-border bg-background/40 py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 border-b border-border pb-8">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-muted-foreground">
              Career Trajectory
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Work Experience
            </h2>
          </div>

          <Link
            href="/experience"
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-muted px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-secondary-foreground transition-all hover:border-muted-foreground hover:text-foreground"
          >
            <span>View All Experience</span>
            <span className="text-neutral-500 group-hover:translate-x-1 group-hover:text-foreground transition-all">
              →
            </span>
          </Link>
        </div>

        {/* Animated Timeline Container (Client Component Wrapper) */}
        <ExperienceTimelineAnimated experiences={experiences} />
      </div>
    </section>
  );
}

export default ExperienceTimeline;
