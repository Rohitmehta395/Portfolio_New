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
    pillCategory: 'Enterprise Development',
    subheading: 'SCALABILITY & ARCHITECTURE',
    title: 'Enterprise Software',
    ghostTitle: 'ENTERPRISE',
    description:
      "I build software that doesn't flinch under real traffic dashboards, internal tools, and systems that people actually depend on, not just demo well. Less about looking clean in a screenshot, more about staying solid when a few thousand people hit it at once.",
    tags: ['Scalable', 'Secure', 'High-Performance', 'Reliable'],
    imageSrc:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
  },
  {
    id: 'web-design-app',
    number: '02',
    pillCategory: 'Web Development',
    subheading: 'WEB PRESENCE & INTERFACE',
    title: 'Website Design & Application',
    ghostTitle: 'INTERACTIVE',
    description:
      'Your website is the first conversation you have with a stranger. I make sure it says the right thing in half a second. Fast, intentional, and built to hold up past the first impression.',
    tags: ['Intentional', 'Fast', 'Responsive', 'Memorable'],
    imageSrc:
      'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 'mobile-app',
    number: '03',
    pillCategory: 'App Development',
    subheading: 'ON DEVICE, BUILT TO LAST',
    title: 'Mobile Application',
    ghostTitle: 'MOBILE',
    description:
      "Apps people open every day, not once and forget. I care about the small stuff most devs skip. the notification that lands right, the tap that feels instant, the screen that doesn't jank when the network's bad.",
    tags: ['Native Feel', 'Smooth', 'Offline-Ready', 'Instant'],
    imageSrc:
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 'ux-product-research',
    number: '04',
    pillCategory: 'Product Research',
    subheading: 'RESEARCH BEFORE PIXELS',
    title: 'UX & Product Excellence Research',
    ghostTitle: 'EXCELLENCE',
    description:
      "Before I design a single screen, I want to know why someone would even open it. Good UX isn't decoration. it's the difference between a product people use once and one they come back to.",
    tags: ['Insight-Driven', 'User-First', 'Iterative', 'Purposeful'],
    imageSrc:
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=2070&auto=format&fit=crop',
  },
];
