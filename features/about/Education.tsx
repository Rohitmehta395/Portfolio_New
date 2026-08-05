'use client';

import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { FaGraduationCap } from 'react-icons/fa';
import { HandwrittenText } from '@/components/ui/HandwrittenText';

const educationData = [
  {
    degree: 'Bachelor of Computer Application',
    school: 'Graphic Era University, Dehradun',
    period: '2024 – 2027',
    score: { label: 'CGPA', value: '8.87' },
    description:
      'Pursuing comprehensive computer science education with focus on full-stack development, data structures, algorithms, and software engineering principles.',
    current: true,
  },
  {
    degree: 'Senior Secondary (12th Grade)',
    school: 'Hilton\'s School, Dehradun',
    period: '2023 – 2024',
    score: { label: 'Aggregate', value: '70%' },
    description: null,
    current: false,
  },
  {
    degree: 'Secondary School (10th Grade)',
    school: 'Hilton\'s School, Dehradun',
    period: '2021 – 2022',
    score: { label: 'Aggregate', value: '80%' },
    description: null,
    current: false,
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.15,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, x: -30, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export function Education() {
  return (
    <section className="w-full py-16 md:py-24 px-4 md:px-8 lg:px-12 max-w-[120rem] mx-auto relative overflow-hidden">
      {/* Subtle background gradient blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#8B5CF6]/5 dark:bg-[#8B5CF6]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#7c3aed]/5 dark:bg-[#7c3aed]/8 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        className="relative w-full flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {/* Section Header */}
        <motion.div className="flex flex-col items-center gap-3 mb-14" variants={headingVariants}>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <span>My</span>
            <span
              className="font-light italic text-[#8B5CF6] dark:text-[#a78bfa]"
              style={{ fontFamily: 'var(--font-cursive, cursive)' }}
            >
              <HandwrittenText>Education</HandwrittenText>
            </span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-lg text-center">
            Academic milestones that built my foundation
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative w-full max-w-5xl">
          {/* Vertical glowing line */}
          <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#8B5CF6]/60 via-[#a78bfa]/30 to-transparent" />

          <div className="flex flex-col gap-8 md:gap-10">
            {educationData.map((edu, index) => (
              <motion.div
                key={edu.degree}
                className="relative flex gap-5 sm:gap-7"
                variants={cardVariants}
              >
                {/* Timeline node */}
                <div className="relative z-10 flex-shrink-0 mt-6">
                  <div
                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border-2 transition-colors ${
                      edu.current
                        ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]'
                        : 'bg-background border-[#8B5CF6]/30 dark:border-[#a78bfa]/30 text-[#8B5CF6] dark:text-[#a78bfa]'
                    }`}
                  >
                    <FaGraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </div>

                {/* Card */}
                <div
                  className={`group relative flex-1 rounded-2xl p-5 sm:p-7 transition-all duration-300 hover:translate-y-[-2px] ${
                    edu.current
                      ? 'bg-[#8B5CF6]/5 dark:bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 dark:border-[#8B5CF6]/30 shadow-lg shadow-[#8B5CF6]/5'
                      : 'bg-foreground/[0.02] dark:bg-white/[0.03] border border-foreground/[0.06] dark:border-white/[0.06] hover:border-[#8B5CF6]/20 dark:hover:border-[#a78bfa]/20'
                  }`}
                >
                  {/* Gradient left accent bar */}
                  <div className="absolute left-0 top-5 bottom-5 w-[3px] rounded-full bg-gradient-to-b from-[#8B5CF6] to-[#7c3aed] opacity-60 group-hover:opacity-100 transition-opacity" />

                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <div className="flex flex-col gap-1">
                      <h3 className="font-display text-lg sm:text-xl font-bold text-foreground leading-snug">
                        {edu.degree}
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground">
                        {edu.school}
                      </p>
                    </div>

                    {/* Period badge */}
                    <span className="self-start inline-flex items-center rounded-full bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/15 px-3 py-1 text-xs sm:text-sm font-medium text-[#8B5CF6] dark:text-[#a78bfa] whitespace-nowrap border border-[#8B5CF6]/15 dark:border-[#8B5CF6]/25">
                      {edu.period}
                    </span>
                  </div>

                  {/* Score badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                      {edu.score.label}:
                    </span>
                    <span className="text-sm font-bold text-[#8B5CF6] dark:text-[#a78bfa]">
                      {edu.score.value}
                    </span>
                    {edu.current && (
                      <span className="ml-1 inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-500 dark:text-emerald-400">
                        Pursuing
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {edu.description && (
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default Education;
