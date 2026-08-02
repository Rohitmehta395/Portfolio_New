'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { SerializedProject } from '@/lib/validations/project.schema';
import { ProjectCard } from './ProjectCard';

interface ProjectGridProps {
  initialProjects: SerializedProject[];
}

export function ProjectGrid({ initialProjects }: ProjectGridProps) {
  const [isHoveringProject, setIsHoveringProject] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const totalItemsCount = initialProjects.length + 1;
  const remainder = totalItemsCount % 3;
  const emptyCellsCount = remainder === 0 ? 0 : 3 - remainder;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      onMouseLeave={() => setIsHoveringProject(false)}
      onMouseMove={handleMouseMove}
      className="w-full relative border-t border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900/40 select-none overflow-hidden"
    >
      {/* Floating Cursor "VIEW" Tag across project cards */}
      <AnimatePresence>
        {isHoveringProject && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: cursorPos.x + 14,
              y: cursorPos.y + 14,
            }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
              mass: 0.4,
            }}
            className="pointer-events-none absolute top-0 left-0 z-30 hidden md:flex items-center justify-center rounded-full rounded-tl-none bg-black dark:bg-white text-white dark:text-black px-4 py-1.5 text-[11px] font-sans font-extrabold uppercase tracking-wider shadow-xl"
          >
            VIEW
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Project Cards */}
        {initialProjects.map((project, index) => {
          const isRightBorderLg = (index + 1) % 3 !== 0;
          const isRightBorderMd = (index + 1) % 2 !== 0;

          return (
            <motion.div
              key={project._id || index}
              onMouseEnter={() => setIsHoveringProject(true)}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
              className={`p-4 sm:p-5 lg:p-6 flex flex-col border-b border-neutral-300 dark:border-neutral-800 ${
                isRightBorderLg ? 'lg:border-r border-neutral-300 dark:border-neutral-800' : 'lg:border-r-0'
              } ${isRightBorderMd ? 'md:border-r border-neutral-300 dark:border-neutral-800' : 'md:border-r-0'}`}
            >
              <ProjectCard project={project} className="h-full" />
            </motion.div>
          );
        })}

        {/* "Let's Connect" Card */}
        {(() => {
          const connectIndex = initialProjects.length;
          const isRightBorderLg = (connectIndex + 1) % 3 !== 0;
          const isRightBorderMd = (connectIndex + 1) % 2 !== 0;

          return (
            <motion.div
              onMouseEnter={() => setIsHoveringProject(false)}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: initialProjects.length * 0.04 }}
              className={`p-4 sm:p-5 lg:p-6 flex flex-col items-center justify-center text-center gap-4 min-h-[360px] border-b border-neutral-300 dark:border-neutral-800 ${
                isRightBorderLg ? 'lg:border-r border-neutral-300 dark:border-neutral-800' : 'lg:border-r-0'
              } ${isRightBorderMd ? 'md:border-r border-neutral-300 dark:border-neutral-800' : 'md:border-r-0'}`}
            >
              <div className="flex flex-wrap items-center justify-center gap-x-2">
                <span className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                  Let's
                </span>
                <span
                  className="font-cursive text-[#8B5CF6] dark:text-[#a78bfa] text-4xl sm:text-5xl font-normal py-1"
                  style={{ fontFamily: 'var(--font-cursive, cursive)' }}
                >
                  connect!
                </span>
              </div>
              <p className="text-xs text-muted-foreground max-w-[220px] leading-relaxed">
                Interested in working together or just want to say hi?
              </p>
              <Link
                href="/contact"
                className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-foreground px-6 py-2.5 text-xs font-semibold text-foreground hover:bg-foreground hover:text-background transition-all shadow-sm"
              >
                <span>Get in Touch</span>
                <span className="text-sm">↗</span>
              </Link>
            </motion.div>
          );
        })()}

        {/* Empty cells to complete 3-column row grid lines if needed */}
        {Array.from({ length: emptyCellsCount }).map((_, idx) => {
          const emptyIndex = totalItemsCount + idx;
          const isRightBorderLg = (emptyIndex + 1) % 3 !== 0;
          const isRightBorderMd = (emptyIndex + 1) % 2 !== 0;

          return (
            <div
              key={`empty-${idx}`}
              onMouseEnter={() => setIsHoveringProject(false)}
              className={`hidden md:block p-4 sm:p-5 lg:p-6 border-b border-neutral-300 dark:border-neutral-800 ${
                isRightBorderLg ? 'lg:border-r border-neutral-300 dark:border-neutral-800' : 'lg:border-r-0'
              } ${isRightBorderMd ? 'md:border-r border-neutral-300 dark:border-neutral-800' : 'md:border-r-0'}`}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ProjectGrid;

