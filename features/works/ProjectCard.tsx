'use client';

import Image from 'next/image';
import Link from 'next/link';
import { SerializedProject } from '@/lib/validations/project.schema';

interface ProjectCardProps {
  project: SerializedProject;
  className?: string;
}

/**
 * Clean card component matching grid layout reference.
 * Renders cover image with rounded corners, title, short description, monospaced tech stack pills,
 * and a cursor-following "VIEW" badge on hover.
 */
export function ProjectCard({ project, className = '' }: ProjectCardProps) {
  return (
    <div className={`group flex flex-col justify-between h-full select-none ${className}`}>

      <div className="flex flex-col gap-4">
        {/* Cover Image */}
        <Link href={`/works/${project.slug}`} className="block relative w-full aspect-[1.5/1] overflow-hidden rounded-lg bg-muted">
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        </Link>

        {/* Details: Title & Short Description */}
        <div className="flex flex-col gap-2 mt-1">
          <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
            <Link href={`/works/${project.slug}`}>
              {project.title}
            </Link>
          </h3>

          <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {project.shortDescription}
          </p>
        </div>
      </div>

      {/* Tech Stack Badges */}
      <div className="flex flex-wrap gap-2 mt-6">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="inline-flex items-center rounded-md border border-neutral-200/80 bg-neutral-100/70 dark:border-neutral-800 dark:bg-neutral-900/60 px-2.5 py-1 text-[10px] font-mono font-medium tracking-wider uppercase text-neutral-600 dark:text-neutral-400"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

export default ProjectCard;


