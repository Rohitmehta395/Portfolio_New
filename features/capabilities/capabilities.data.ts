export interface CapabilityItem {
  id: string;
  number: string;
  pillCategory: string;
  subheading: string;
  title: string;
  ghostTitle: string;
  description: string;
  tags: string[];
  imageSrc: string;
  imageAlt?: string;
}

/**
 * Hardcoded, typed capabilities content array.
 * Per project spec & implementation plan, "What I do" capabilities are not represented
 * as a separate Mongoose database model, but defined as structured constants data.
 */
export const CAPABILITIES_DATA: CapabilityItem[] = [
  {
    id: 'full-stack-development',
    number: '01',
    pillCategory: 'Full-Stack Development',
    subheading: 'FULL-STACK DEVELOPMENT',
    title: 'Full-Stack Web Applications',
    ghostTitle: 'FULL-STACK',
    description:
      'I build complete web applications from the interface users interact with to the backend systems that power them. I focus on clean architecture, reliable APIs, authentication, and practical features that work together smoothly.',
    tags: ['React.js', 'Node.js', 'MongoDB', 'REST APIs'],
    imageSrc:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop',
    imageAlt:
      'Full-stack software development code editor interface on dark screen',
  },
  {
    id: 'web-development',
    number: '02',
    pillCategory: 'Web Development',
    subheading: 'WEB DEVELOPMENT',
    title: 'Modern Website Development',
    ghostTitle: 'WEB DEV',
    description:
      'I create responsive websites that look good, feel fast, and work across different screen sizes. From reusable React components to responsive layouts, I focus on making websites simple to use and easy to maintain.',
    tags: ['Responsive', 'React.js', 'Tailwind CSS', 'Reusable UI'],
    imageSrc:
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=2055&auto=format&fit=crop',
    imageAlt:
      'Modern responsive website design and frontend development workspace',
  },
  {
    id: 'backend-api-development',
    number: '03',
    pillCategory: 'Backend Development',
    subheading: 'BACKEND & API DEVELOPMENT',
    title: 'Backend Systems & APIs',
    ghostTitle: 'BACKEND',
    description:
      'I build the systems behind web applications — designing APIs, connecting databases, handling authentication, and managing application data. I care about keeping backend code structured, secure, and reliable.',
    tags: ['Node.js', 'Express.js', 'MongoDB', 'JWT'],
    imageSrc:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop',
    imageAlt:
      'Backend server technology, APIs, and database infrastructure',
  },
  {
    id: 'deployment-performance',
    number: '04',
    pillCategory: 'Deployment & Performance',
    subheading: 'DEPLOYMENT & PERFORMANCE',
    title: 'Production & Deployment',
    ghostTitle: 'DEPLOYMENT',
    description:
      'I take projects beyond development and get them running in the real world. I work with version control, deployment platforms, debugging, and performance improvements to make sure applications remain reliable after they go live.',
    tags: ['Git & GitHub', 'Vercel', 'Render', 'Performance'],
    imageSrc:
      'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=2088&auto=format&fit=crop',
    imageAlt:
      'Cloud deployment, DevOps production infrastructure, and performance monitoring',
  },
];

