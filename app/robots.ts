import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site.config';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin'], // Block admin routes
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
