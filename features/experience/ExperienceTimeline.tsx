import Link from 'next/link';
import connectDB from '@/lib/db/connect';
import Experience from '@/models/Experience.model';
import { SerializedExperience } from './ExperienceCard';
import { ExperienceTimelineAnimated } from './ExperienceTimelineAnimated';

interface ExperienceTimelineProps {
  limit?: number;
}

async function getExperiences(limit?: number): Promise<SerializedExperience[]> {
  try {
    await connectDB();
    let query = Experience.find({}).sort({ order: 1 });
    if (limit) {
      query = query.limit(limit);
    }
    const expDocs = await query.lean();
    return JSON.parse(JSON.stringify(expDocs));
  } catch (error) {
    console.error('Failed to fetch experiences for timeline:', error);
    return [];
  }
}

/**
 * Server Component fetching Experience data from MongoDB.
 */
export async function ExperienceTimeline({ limit }: ExperienceTimelineProps) {
  const experiences = await getExperiences(limit);
  const isHomepageTeaser = typeof limit === 'number';

  return (
    <section className="w-full py-12 md:py-20 px-4 md:px-8 lg:px-12 max-w-[120rem] mx-auto relative overflow-hidden">
      <div className="w-full flex flex-col gap-12 bg-[#171717] text-white rounded-[2rem] pt-16 pb-12 px-4 sm:px-8 md:px-12 shadow-2xl">
        {/* Section Header */}
        <div className="flex flex-col items-center gap-2 mb-4">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white flex items-center gap-3">
            <span>My</span>
            <span 
              className="font-light italic text-[#9b87f5]" 
              style={{ fontFamily: 'var(--font-cursive, cursive)' }}
            >
              Experience
            </span>
          </h2>
        </div>

        {/* Animated Timeline Container (Client Component Wrapper) */}
        <div 
          className="relative w-full"
          style={isHomepageTeaser ? {
            WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
            paddingBottom: '2rem'
          } : undefined}
        >
          <ExperienceTimelineAnimated experiences={experiences} />
        </div>

        {/* View All Button (Homepage only) */}
        {isHomepageTeaser && (
          <div className="flex justify-center -mt-8 relative z-10">
            <Link
              href="/experience"
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-black transition-transform hover:scale-105"
            >
              <span>View All ↗</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default ExperienceTimeline;
