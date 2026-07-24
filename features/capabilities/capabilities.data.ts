export interface CapabilityItem {
  id: string;
  number: string;
  category: string;
  title: string;
  ghostTitle: string;
  description: string;
  tags: string[];
  imageSrc: string;
}

/**
 * Hardcoded, typed capabilities content array.
 * Per project spec & implementation plan, "What I do" capabilities are not represented
 * as a separate Mongoose database model, but defined as structured constants data.
 */
export const CAPABILITIES_DATA: CapabilityItem[] = [
  {
    id: 'enterprise-software',
    number: '01',
    category: 'Full-Stack Systems',
    title: 'Enterprise Software',
    ghostTitle: 'ENTERPRISE',
    description:
      'Designing and building scalable, high-concurrency microservices, robust REST/GraphQL APIs, and mission-critical cloud backends engineered for performance and high availability.',
    tags: ['Next.js 15', 'TypeScript', 'Node.js', 'MongoDB', 'Docker', 'GraphQL'],
    imageSrc:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect width="800" height="500" fill="%23171717"/><text x="400" y="250" font-family="sans-serif" font-size="26" fill="%23737373" text-anchor="middle">ENTERPRISE SOFTWARE PLATFORM</text></svg>',
  },
  {
    id: 'web-design-app',
    number: '02',
    category: 'Interactive Web',
    title: 'Website Design & Application',
    ghostTitle: 'INTERACTIVE',
    description:
      'Crafting fluid, responsive web applications with kinetic typography, modern design systems, and seamless GSAP/Lenis scroll animations that deliver exceptional user engagement.',
    tags: ['React 19', 'Tailwind CSS v4', 'GSAP', 'Lenis', 'Framer Motion', 'SEO'],
    imageSrc:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect width="800" height="500" fill="%2318181b"/><text x="400" y="250" font-family="sans-serif" font-size="26" fill="%23a1a1aa" text-anchor="middle">KINETIC WEB EXPERIENCE</text></svg>',
  },
  {
    id: 'mobile-app',
    number: '03',
    category: 'Cross-Platform Mobile',
    title: 'Mobile Application',
    ghostTitle: 'MOBILE',
    description:
      'Developing native-feeling iOS and Android mobile applications built with Flutter and React Native, delivering crisp 60fps performance, offline synchronization, and natural touch gestures.',
    tags: ['Flutter', 'React Native', 'Dart', 'Mobile UX', 'State Management'],
    imageSrc:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect width="800" height="500" fill="%2309090b"/><text x="400" y="250" font-family="sans-serif" font-size="26" fill="%2371717a" text-anchor="middle">CROSS-PLATFORM MOBILE ENGINE</text></svg>',
  },
  {
    id: 'ux-product-research',
    number: '04',
    category: 'Product & Architecture',
    title: 'UX & Product Excellence Research',
    ghostTitle: 'EXCELLENCE',
    description:
      'Conducting technical architecture reviews, web accessibility audits, design system engineering, and user interface research to turn complex requirements into refined software products.',
    tags: ['Design Systems', 'Accessibility (a11y)', 'System Architecture', 'UI Audit'],
    imageSrc:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect width="800" height="500" fill="%2327272a"/><text x="400" y="250" font-family="sans-serif" font-size="26" fill="%23e4e4e7" text-anchor="middle">PRODUCT RESEARCH & DESIGN</text></svg>',
  },
];
