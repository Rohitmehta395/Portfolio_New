'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight } from 'lucide-react';
import { SerializedProject } from '@/lib/validations/project.schema';
import { useLenis } from '@/hooks/useLenis';

interface ProjectModalProps {
  project: SerializedProject | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const lenis = useLenis();

  // Disable background scrolling (Lenis & HTML/Body) and handle Escape key
  useEffect(() => {
    if (!project) return;

    lenis?.stop();
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      lenis?.start();
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, lenis, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 select-none">
          {/* Backdrop Blur & Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
            className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white dark:bg-neutral-900 rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 md:p-10 shadow-2xl border border-neutral-200/80 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 z-50 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-5 right-5 sm:top-6 sm:right-6 w-9 h-9 rounded-full border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors z-20 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Grid Content */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-start pt-2">
              {/* Left Column: Image, CTA Buttons, Tech Stack */}
              <div className="md:col-span-5 flex flex-col gap-6">
                {/* Project Cover Image */}
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 shadow-sm">
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover"
                    unoptimized
                  />
                </div>

                {/* Action Buttons (Experience It & Source Code) */}
                {(project.liveUrl || project.repoUrl) && (
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 w-full bg-[#18181b] dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 py-3.5 px-6 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
                      >
                        <span>Experience It</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    )}

                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full ${
                          project.liveUrl ? 'sm:w-auto px-5' : 'flex-1'
                        } bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200/80 dark:border-neutral-700/80 py-3.5 rounded-full font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-[0.98]`}
                      >
                        <span>Source Code</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                )}

                {/* Technology Stack Section */}
                {project.techStack && project.techStack.length > 0 && (
                  <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-col gap-3">
                    <h4 className="text-[11px] font-mono font-bold tracking-widest text-neutral-400 dark:text-neutral-500 uppercase">
                      TECHNOLOGY STACK
                    </h4>

                    <div
                      onWheel={(e) => e.stopPropagation()}
                      className="flex flex-wrap gap-2 max-h-32 sm:max-h-36 overflow-y-auto overscroll-contain pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                    >
                      {project.techStack.map((tech, index) => (
                        <span
                          key={`${tech}-${index}`}
                          className="inline-flex items-center rounded-md border border-neutral-200/80 dark:border-neutral-800 bg-neutral-100/90 dark:bg-neutral-800/80 px-2.5 py-1 text-[11px] font-mono font-medium text-neutral-700 dark:text-neutral-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Title, Goal, Contribution, Outcome */}
              <div className="md:col-span-7 flex flex-col">
                {/* Title */}
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-3">
                  {project.title}
                </h2>

                {/* Divider Line */}
                <div className="w-full border-b border-neutral-200/80 dark:border-neutral-800 pb-2 mb-6" />

                {/* THE GOAL */}
                <div className="mb-6">
                  <h4 className="text-[11px] font-mono font-bold tracking-widest text-neutral-400 dark:text-neutral-500 uppercase mb-2">
                    THE GOAL
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">
                    {project.goal || project.shortDescription}
                  </p>
                </div>

                {/* MY CONTRIBUTION */}
                <div className="mb-6">
                  <h4 className="text-[11px] font-mono font-bold tracking-widest text-neutral-400 dark:text-neutral-500 uppercase mb-2">
                    MY CONTRIBUTION
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">
                    {project.contribution ||
                      'I transformed complex ideas into a clean, engaging web experience by focusing on intuitive layouts, meaningful interactions, and thoughtful visual storytelling. Every section was designed to guide visitors naturally while making the platform value instantly clear.'}
                  </p>
                </div>

                {/* THE OUTCOME */}
                <div>
                  <h4 className="text-[11px] font-mono font-bold tracking-widest text-neutral-400 dark:text-neutral-500 uppercase mb-2">
                    THE OUTCOME
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">
                    {project.outcome ||
                      'The result is a fast, modern experience that earns trust before asking for action. Visitors can quickly understand the platform, navigate with confidence, and move seamlessly.'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default ProjectModal;
