import { z } from 'zod';

export interface BlogPostInput {
  title: string;
  slug: string;
  excerpt: string;
  contentMdx: string;
  coverImage?: string;
  tags?: string[];
  published?: boolean;
  publishedAt?: string;
  readTimeMinutes?: number;
}

export interface SerializedBlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  contentMdx: string;
  coverImage?: string;
  tags: string[];
  published: boolean;
  publishedAt?: string;
  readTimeMinutes: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Validates and serializes raw BlogPost object data.
 * Matches models/BlogPost.model.ts schema.
 */
export function validateBlogPostData(data: unknown): SerializedBlogPost {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid blog post data object');
  }

  const post = data as Record<string, any>;

  if (!post.title || typeof post.title !== 'string') {
    throw new Error('Blog post title is required');
  }

  if (!post.slug || typeof post.slug !== 'string') {
    throw new Error('Blog post slug is required');
  }

  if (!post.excerpt || typeof post.excerpt !== 'string') {
    throw new Error('Blog post excerpt is required');
  }

  if (!post.contentMdx || typeof post.contentMdx !== 'string') {
    throw new Error('Blog post contentMdx is required');
  }

  return {
    _id: String(post._id),
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    contentMdx: post.contentMdx,
    coverImage: post.coverImage || undefined,
    tags: Array.isArray(post.tags) ? post.tags : [],
    published: Boolean(post.published),
    publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    readTimeMinutes: Number(post.readTimeMinutes) || 5,
    createdAt: post.createdAt ? new Date(post.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: post.updatedAt ? new Date(post.updatedAt).toISOString() : new Date().toISOString(),
  };
}

export const blogZodSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric and hyphens'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  contentMdx: z.string().min(1, 'Content is required'),
  coverImage: z.string().min(1, 'Cover image is required'),
  tags: z.array(z.string()),
  published: z.boolean(),
  publishedAt: z.string().optional(),
  readTimeMinutes: z.number().min(1, 'Read time must be at least 1 minute'),
});

export type BlogFormValues = z.infer<typeof blogZodSchema>;
