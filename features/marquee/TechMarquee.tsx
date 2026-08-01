import connectDB from '@/lib/db/connect';
import Technology from '@/models/Technology.model';
import { TechGrid } from './TechGrid';

interface TechItem {
  _id: string;
  name: string;
  category: string;
  icon?: string;
}

async function getTechnologies(): Promise<TechItem[]> {
  try {
    await connectDB();
    const techDocs = await Technology.find({}).sort({ order: 1, name: 1 }).lean();
    return JSON.parse(JSON.stringify(techDocs));
  } catch (error) {
    console.error('Failed to fetch technologies:', error);
    return [];
  }
}

/**
 * Server Component — fetches technology data from MongoDB and renders
 * the editorial Technologies grid section with the "Technologies / work with" heading.
 */
export async function TechMarquee() {
  const technologies = await getTechnologies();

  if (technologies.length === 0) return null;

  return (
    <section
      className="w-full bg-background py-16 px-6 md:px-14"
      style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" }}
    >
      {/* Heading — mirrors "Want to know about my story?" style */}
      <h2 className="mb-10 text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-foreground flex flex-wrap items-center gap-x-3 gap-y-0 leading-tight">
        <span className="font-cursive text-4xl md:text-7xl lg:text-[5rem] font-normal text-[#8B5CF6] -mt-2 md:mt-0 pt-2 sm:pt-4 tracking-normal">
          Technologies
        </span>{" "}
        I work with
      </h2>

      {/* Client grid with react-icons brand logos */}
      <TechGrid technologies={technologies} />
    </section>
  );
}

export default TechMarquee;
