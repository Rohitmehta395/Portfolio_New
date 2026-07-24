'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SerializedProject } from '@/lib/validations/project.schema';
import { ProjectCard } from './ProjectCard';
import { FilterTabs, CategoryFilter } from './FilterTabs';

interface ProjectGridProps {
  initialProjects: SerializedProject[];
}

/**
 * Client Component managing active category filtering and Framer Motion layout animation grid.
 * Client-side filters the pre-fetched project array without re-fetching from the server.
 */
export function ProjectGrid({ initialProjects }: ProjectGridProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');

  const filteredProjects = initialProjects.filter(
    (p) => activeCategory === 'all' || p.category === activeCategory
  );

  return (
    <div className="flex flex-col gap-10">
      {/* Filter Tabs */}
      <FilterTabs
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Animated Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="rounded-2xl border border-border bg-muted/40 p-12 text-center text-sm text-muted-foreground">
          No projects found in this category.
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project._id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                <ProjectCard project={project} className="h-full" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

export default ProjectGrid;
