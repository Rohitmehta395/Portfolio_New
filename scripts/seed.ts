import connectDB from '../lib/db/connect';
import Experience from '../models/Experience.model';
import Skill from '../models/Skill.model';
import Technology from '../models/Technology.model';
import SiteSettings from '../models/SiteSettings.model';

async function seed() {
  console.log('Connecting to MongoDB...');
  await connectDB();
  console.log('Connected to MongoDB.');

  // 1. Seed Experience
  console.log('Seeding Experience documents...');
  await Experience.deleteMany({});
  const sampleExperience = await Experience.create([
    {
      company: 'TechCorp Solutions',
      companyUrl: 'https://example.com/techcorp',
      companyLogo: 'https://res.cloudinary.com/placeholder-cloud-name/techcorp.png',
      roles: [
        {
          title: 'Senior Full Stack Developer',
          startDate: new Date('2023-01-15'),
          endDate: null,
          description: 'Leading development of scalable Next.js web applications and microservices.',
        },
        {
          title: 'Frontend Engineer',
          startDate: new Date('2021-06-01'),
          endDate: new Date('2022-12-31'),
          description: 'Built dynamic user interfaces and design systems using React and TypeScript.',
        },
      ],
      tags: ['Next.js', 'React', 'TypeScript', 'Node.js', 'MongoDB'],
      order: 1,
    },
    {
      company: 'Creative Digital Agency',
      companyUrl: 'https://example.com/creative',
      companyLogo: 'https://res.cloudinary.com/placeholder-cloud-name/creative.png',
      roles: [
        {
          title: 'Creative Software Developer',
          startDate: new Date('2019-09-01'),
          endDate: new Date('2021-05-31'),
          description: 'Crafted interactive web experiences, kinetic typography, and GSAP scroll animations.',
        },
      ],
      tags: ['GSAP', 'WebGL', 'Three.js', 'Tailwind CSS'],
      order: 2,
    },
  ]);
  console.log(`Seeded ${sampleExperience.length} Experience documents.`);

  // 2. Seed Technology
  console.log('Seeding Technology documents...');
  await Technology.deleteMany({});
  const sampleTechnology = await Technology.create([
    { name: 'Next.js', category: 'frontend', icon: 'nextjs-icon' },
    { name: 'TypeScript', category: 'frontend', icon: 'typescript-icon' },
    { name: 'React', category: 'frontend', icon: 'react-icon' },
    { name: 'Tailwind CSS', category: 'frontend', icon: 'tailwindcss-icon' },
    { name: 'GSAP', category: 'frontend', icon: 'gsap-icon' },
    { name: 'Node.js', category: 'backend', icon: 'nodejs-icon' },
    { name: 'MongoDB', category: 'database', icon: 'mongodb-icon' },
    { name: 'PostgreSQL', category: 'database', icon: 'postgresql-icon' },
    { name: 'Docker', category: 'devops', icon: 'docker-icon' },
    { name: 'Flutter', category: 'mobile', icon: 'flutter-icon' },
  ]);
  console.log(`Seeded ${sampleTechnology.length} Technology documents.`);

  // 3. Seed Skill
  console.log('Seeding Skill documents...');
  await Skill.deleteMany({});
  const sampleSkills = await Skill.create([
    { name: 'TypeScript', category: 'language', proficiency: 5 },
    { name: 'JavaScript', category: 'language', proficiency: 5 },
    { name: 'Python', category: 'language', proficiency: 4 },
    { name: 'Next.js', category: 'framework', proficiency: 5 },
    { name: 'React', category: 'framework', proficiency: 5 },
    { name: 'Tailwind CSS', category: 'framework', proficiency: 5 },
    { name: 'GSAP', category: 'tool', proficiency: 4 },
    { name: 'Git', category: 'tool', proficiency: 5 },
    { name: 'System Design', category: 'soft-skill', proficiency: 4 },
    { name: 'UX Research', category: 'soft-skill', proficiency: 4 },
  ]);
  console.log(`Seeded ${sampleSkills.length} Skill documents.`);

  // 4. Seed SiteSettings
  console.log('Seeding SiteSettings singleton...');
  await SiteSettings.deleteMany({});
  const sampleSettings = await SiteSettings.create({
    resumeUrl: 'https://example.com/resume.pdf',
    contactEmail: 'rohit@example.com',
    availableForWork: true,
    socialLinks: [
      { platform: 'GitHub', url: 'https://github.com/example' },
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/example' },
      { platform: 'Twitter', url: 'https://twitter.com/example' },
    ],
    seoDefaults: {
      title: 'Rohit — Creative Software Developer',
      description: 'Portfolio of Rohit, a Creative Software Developer crafting premium digital experiences.',
      ogImage: 'https://res.cloudinary.com/placeholder-cloud-name/og-default.png',
    },
  });
  console.log(`Seeded SiteSettings singleton document (ID: ${sampleSettings._id}).`);

  console.log('Database seeding complete successfully!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Error seeding database:', err);
  process.exit(1);
});
