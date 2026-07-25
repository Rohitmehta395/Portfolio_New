export interface SeoDefaults {
  title: string;
  description: string;
  ogImage: string;
  twitterHandle: string;
  siteName: string;
  locale: string;
  type: string;
}

export const SEO_DEFAULTS: SeoDefaults = {
  title: 'Rohit | Creative Software Developer Portfolio',
  description:
    'Full-stack and creative software developer specializing in high-performance web applications, dynamic interactive user interfaces, and robust server architectures.',
  ogImage: '/images/og-default.png',
  twitterHandle: '@placeholder',
  siteName: 'Rohit Portfolio',
  locale: 'en_US',
  type: 'website',
};

export default SEO_DEFAULTS;
