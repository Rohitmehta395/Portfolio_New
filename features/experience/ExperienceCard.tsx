import { TagPill } from './TagPill';

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
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

/**
 * Presentational component rendering one Experience entry with stacked roles and tag pills.
 */
export function ExperienceCard({ experience, index }: ExperienceCardProps) {
  const indexFormatted = String(index + 1).padStart(2, '0');

  return (
    <div className="group relative rounded-2xl border border-border/80 bg-card/60 p-6 md:p-8 backdrop-blur-sm transition-all hover:border-muted-foreground/80 hover:bg-muted/40">
      {/* Top Bar: Index & Company Info */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm font-bold text-neutral-500">
            {indexFormatted}
          </span>
          <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground group-hover:text-neutral-100">
            {experience.company}
          </h3>
        </div>

        {experience.companyUrl && (
          <a
            href={experience.companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-secondary-foreground transition-colors hover:border-muted-foreground hover:text-foreground"
          >
            <span>View</span>
            <span className="text-neutral-500 group-hover:text-foreground">↗</span>
          </a>
        )}
      </div>

      {/* Stacked Roles List */}
      <div className="flex flex-col gap-6 py-6">
        {experience.roles.map((role, rIdx) => (
          <div key={rIdx} className="flex flex-col gap-2">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h4 className="text-lg font-semibold text-neutral-200">
                {role.title}
              </h4>
              <span className="font-mono text-xs text-muted-foreground">
                {formatDate(role.startDate)} — {formatDate(role.endDate)}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-3xl">
              {role.description}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom Tag Pills */}
      {experience.tags && experience.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60">
          {experience.tags.map((tag) => (
            <TagPill key={tag} label={tag} variant="default" />
          ))}
        </div>
      )}
    </div>
  );
}

export default ExperienceCard;
