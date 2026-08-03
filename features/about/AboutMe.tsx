'use client';

import React from 'react';
import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';
import { SiLeetcode, SiGeeksforgeeks } from 'react-icons/si';
import { FaGithub, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export function AboutMe() {
  return (
    <section className="w-full py-12 md:py-20 px-4 md:px-8 lg:px-12 max-w-[120rem] mx-auto relative overflow-hidden">
      <motion.div
        className="w-full flex flex-col gap-10 bg-[#171717] text-white rounded-[2rem] pt-16 pb-16 px-6 sm:px-10 md:px-16 shadow-2xl"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        {/* Section Header */}
        <motion.div className="flex flex-col items-center gap-2 mb-2" variants={fadeUp}>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white flex items-center gap-3">
            <span>About</span>
            <span
              className="font-light italic text-[#9b87f5]"
              style={{ fontFamily: 'var(--font-cursive, cursive)' }}
            >
              Me
            </span>
          </h2>
        </motion.div>

        {/* Content: Image + Text */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 lg:gap-16">
          {/* Profile Image */}
          <motion.div
            className="relative flex-shrink-0 flex flex-col items-center gap-6"
            variants={fadeLeft}
          >
            {/* Profile Image */}
            <div className="relative">
              {/* Decorative glow ring */}
              <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-[#8B5CF6]/30 via-[#9b87f5]/15 to-transparent blur-xl" />
              {/* Decorative border ring */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-[#8B5CF6] via-[#a78bfa] to-[#7c3aed] opacity-60" />
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-full overflow-hidden ring-4 ring-[#171717]">
                <Image
                  src="/images/Rohit_Mehta.webp"
                  alt="Rohit Mehta — Full-Stack Developer"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 224px, (max-width: 1024px) 256px, 288px"
                  priority
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {[
                { label: 'LeetCode', href: 'https://leetcode.com/u/Rohitmehta395/', icon: <SiLeetcode className="w-5 h-5" /> },
                { label: 'GeeksforGeeks', href: 'https://www.geeksforgeeks.org/profile/rohitmehta03', icon: <SiGeeksforgeeks className="w-5 h-5" /> },
                { label: 'GitHub', href: 'https://github.com/Rohitmehta395', icon: <FaGithub className="w-5 h-5" /> },
                { label: 'LinkedIn', href: 'https://www.linkedin.com/in/rohitmehta395/', icon: <FaLinkedinIn className="w-5 h-5" /> },
                { label: 'Instagram', href: 'https://www.instagram.com/rohit_._mehta/', icon: <FaInstagram className="w-5 h-5" /> },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-neutral-400 transition-all duration-300 hover:bg-[#8B5CF6]/20 hover:border-[#8B5CF6]/50 hover:text-[#a78bfa] hover:scale-110 hover:shadow-[0_0_15px_rgba(139,92,246,0.25)]"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Bio Text */}
          <motion.div
            className="flex flex-col gap-5 text-left max-w-3xl"
            variants={fadeRight}
          >
            <p className="text-base sm:text-lg leading-relaxed text-neutral-300">
              I&apos;m a full-stack developer from Dehradun, India, currently pursuing my Bachelor of Computer Application at Graphic Era University with a current CGPA of{' '}
              <span className="text-white font-semibold">8.87</span>.
            </p>

            <p className="text-base sm:text-lg leading-relaxed text-neutral-300">
              I specialize in building scalable, production-ready web applications using the MERN stack. From developing a travel and adventure platform with secure admin dashboards to creating a full-stack NGO management system, I enjoy turning ideas into fast, responsive, and user-friendly digital experiences.
            </p>

            <p className="text-base sm:text-lg leading-relaxed text-neutral-300">
              I&apos;ve also worked professionally as a{' '}
              <span className="text-[#a78bfa] font-semibold">Website Developer Intern</span>{' '}
              for Payana Trails, where I built and deployed the company&apos;s official website with 15+ dynamic pages and a custom content management dashboard. Additionally, during my MERN Stack internship at Sharada Education Trust, I developed reusable React components, integrated multiple API endpoints, and improved application performance through clean, maintainable code.
            </p>

            <p className="text-base sm:text-lg leading-relaxed text-neutral-300">
              Beyond development, I&apos;m passionate about problem-solving and have solved{' '}
              <span className="text-[#a78bfa] font-semibold">620+ coding challenges</span>{' '}
              across LeetCode and GeeksforGeeks. I&apos;m always exploring new technologies, refining my skills, and building impactful software that solves real-world problems.
            </p>

            {/* Stats Pills */}
            <motion.div
              className="flex flex-wrap gap-3 mt-3"
              variants={fadeUp}
            >
              {[
                { label: 'CGPA', value: '8.87' },
                { label: 'Problems Solved', value: '620+' },
                { label: 'Stack', value: 'MERN' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-2 backdrop-blur-sm transition-colors hover:bg-white/10"
                >
                  <span className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
                    {stat.label}
                  </span>
                  <span className="text-sm font-bold text-[#a78bfa]">{stat.value}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

export default AboutMe;
