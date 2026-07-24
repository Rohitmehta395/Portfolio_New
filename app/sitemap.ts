import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site.config';
import { getProjects } from '@/actions/project.actions';
import { getBlogPosts } from '@/actions/blog.actions';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // 1. Static Routes
  // Note: /journey and /experience were omitted as they are not actual independent routes 
  // in this application (they are anchor links or sections on the homepage). 
  // Including them would result in 404s for crawlers.
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/works`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // 2. Dynamic Routes (Published Only)
  // getProjects and getBlogPosts inherently filter to { published: true } unless 
  // explicitly overridden with includeUnpublished: true.
  const projects = await getProjects();
  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/works/${project.slug}`,
    lastModified: new Date(project.updatedAt || project.createdAt || new Date()),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const blogs = await getBlogPosts();
  const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: new Date(blog.updatedAt || blog.publishedAt || new Date()),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}
