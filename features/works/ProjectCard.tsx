import Image from 'next/image';
import Link from 'next/link';
import { TagPill } from '@/features/experience/TagPill';
import { SerializedProject } from '@/lib/validations/project.schema';

interface ProjectCardProps {
  project: SerializedProject;
  className?: string;
}

/**
 * Presentational card component rendering a single Project item.
 * Reuses TagPill from features/experience/TagPill for techStack tags.
 */
export function ProjectCard({ project, className = '' }: ProjectCardProps) {
  const categoryLabels: Record<SerializedProject['category'], string> = {
    website: 'Website & Web App',
    saas: 'SaaS Platform',
    mobile: 'Mobile Application',
  };

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/80 transition-all hover:border-muted-foreground hover:shadow-2xl ${className}`}
    >
      {/* Cover Image Container */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized
        />
        {project.featured && (
          <span className="absolute top-3 left-3 rounded-full bg-emerald-500/90 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-background shadow-md">
            Featured
          </span>
        )}
      </div>

      {/* Card Details Body */}
      <div className="flex flex-1 flex-col justify-between p-6 gap-5">
        <div className="flex flex-col gap-2.5">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-emerald-400">
            {categoryLabels[project.category]}
          </span>

          <h3 className="font-display text-2xl font-bold tracking-tight text-foreground group-hover:text-neutral-100">
            <Link href={`/works/${project.slug}`} className="hover:underline">
              {project.title}
            </Link>
          </h3>

          <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {project.shortDescription}
          </p>
        </div>

        {/* Tech Stack Pills & Action Links */}
        <div className="flex flex-col gap-4 border-t border-border pt-4">
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <TagPill key={tech} label={tech} variant="ghost" />
            ))}
          </div>

          <div className="flex items-center justify-between text-xs font-semibold">
            <Link
              href={`/works/${project.slug}`}
              className="inline-flex items-center gap-1 text-foreground hover:text-emerald-400 transition-colors"
            >
              <span>View Case Study</span>
              <span>→</span>
            </Link>

            <div className="flex items-center gap-3 text-muted-foreground">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                  aria-label="Live Demo"
                  title="Live Demo"
                >
                  Live ↗
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                  aria-label="GitHub Repository"
                  title="GitHub Repository"
                >
                  Code ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
