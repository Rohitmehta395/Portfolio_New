import { TagPill } from './TagPill';
import Image from 'next/image';

export interface SerializedExperienceRole {
  title: string;
  startDate: string;
  endDate?: string | null;
  description: string;
}

export interface SerializedExperience {
  _id: string;
  company: string;
  companyUrl?: string;
  companyLogo?: string;
  roles: SerializedExperienceRole[];
  tags: string[];
  order: number;
}

interface ExperienceCardProps {
  experience: SerializedExperience;
  index: number;
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return 'Present';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'Present';
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

/**
 * Presentational component rendering one Experience entry with stacked roles and tag pills.
 */
export function ExperienceCard({ experience, index }: ExperienceCardProps) {
  const indexFormatted = String(index + 1).padStart(2, '0');

  // Split company name if it has multiple words for potential two-line display
  const companyWords = experience.company.split(' ');
  const companyDisplay = companyWords.length >= 2 
    ? (
        <>
          <span className="block">{companyWords[0]}</span>
          <span className="block">{companyWords.slice(1).join(' ')}</span>
        </>
      )
    : experience.company;

  return (
    <div className="group relative flex flex-col md:flex-row gap-6 md:gap-8 py-10 transition-all">
      {/* Far Left: Index */}
      <div className="w-12 shrink-0 pt-3">
        <span className="font-mono text-sm font-bold text-neutral-500">
          {indexFormatted}
        </span>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Company Name & Roles (Span 6) */}
        <div className="lg:col-span-6 flex flex-col gap-10">
          <h3 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight group-hover:text-neutral-200 transition-colors">
            {companyDisplay}
          </h3>

          <div className="flex flex-col gap-8">
            {experience.roles.map((role, rIdx) => (
              <div key={rIdx} className="relative pl-6">
                {/* Bullet Marker */}
                <div className="absolute left-0 top-[0.4rem] w-[7px] h-[7px] rounded-full border-2 border-[#555] bg-transparent" />
                
                <h4 className="text-xl font-bold text-neutral-100">
                  {role.title}
                </h4>
                <div className="text-sm text-neutral-500 mt-1 mb-4">
                  {role.endDate ? `${formatDate(role.startDate)} — ${formatDate(role.endDate)}` : formatDate(role.startDate)}
                </div>
                <p className="text-sm md:text-base leading-relaxed text-neutral-400 max-w-xl">
                  {role.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Column: Tags & View Button (Span 3) */}
        <div className="lg:col-span-3 flex flex-col items-start gap-6 pt-3 lg:pt-0">
          {experience.tags && experience.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {experience.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="inline-flex items-center rounded-xs bg-[#333333] px-3 py-1.5 text-[11px] md:text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {experience.companyUrl && (
            <div className="mt-4">
              <a
                href={experience.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-5 py-2 text-xs font-bold uppercase tracking-wider text-black transition-transform hover:scale-105"
              >
                <span>View</span>
                <span className="text-neutral-800 font-bold">↗</span>
              </a>
            </div>
          )}
        </div>

        {/* Right Column: Logo (Span 3) */}
        <div className="lg:col-span-3 flex items-start justify-end lg:justify-start">
          {experience.companyLogo ? (
            <div className="w-full max-w-[240px] aspect-[4/3] bg-white rounded-2xl p-6 flex items-center justify-center overflow-hidden shrink-0 transition-transform duration-500 group-hover:scale-[1.02]">
              <div className="relative w-full h-full flex items-center justify-center">
                <Image 
                  src={experience.companyLogo}
                  alt={`${experience.company} logo`}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          ) : (
            <div className="w-full max-w-[240px] aspect-[4/3] bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 transition-transform duration-500 group-hover:scale-[1.02]">
              <span className="text-neutral-500 text-center font-semibold text-lg px-4">{experience.company}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExperienceCard;
