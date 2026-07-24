export interface SocialLink {
  platform: string;
  url: string;
  handle?: string;
  icon?: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    platform: 'GitHub',
    url: 'https://github.com/placeholder-username',
    handle: '@placeholder',
  },
  {
    platform: 'LinkedIn',
    url: 'https://linkedin.com/in/placeholder-username',
    handle: 'in/placeholder',
  },
  {
    platform: 'Twitter',
    url: 'https://twitter.com/placeholder-username',
    handle: '@placeholder',
  },
  {
    platform: 'Email',
    url: 'mailto:rohit@example.com',
    handle: 'rohit@example.com',
  },
];

export default SOCIAL_LINKS;
