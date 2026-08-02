import { z } from 'zod';

export interface ProjectInput {
  title: string;
  category: 'website' | 'saas' | 'mobile';
  shortDescription: string;
  coverImage: string;
  gallery?: string[];
  techStack: string[];
  liveUrl?: string;
  repoUrl?: string;
  goal?: string;
  contribution?: string;
  outcome?: string;
  featured?: boolean;
  order?: number;
  published?: boolean;
}

export interface SerializedProject {
  _id: string;
  title: string;
  category: 'website' | 'saas' | 'mobile';
  shortDescription: string;
  coverImage: string;
  gallery: string[];
  techStack: string[];
  liveUrl?: string;
  repoUrl?: string;
  goal?: string;
  contribution?: string;
  outcome?: string;
  featured: boolean;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

// Backwards compatibility alias for components transition
export type SerializedProjectWithCaseStudy = SerializedProject;

/**
 * Validates raw project object structure for read/serialization consistency.
 * Matches models/Project.model.ts fields and enums.
 */
export function validateProjectData(data: unknown): SerializedProject {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid project data object');
  }

  const proj = data as Record<string, any>;

  if (!proj.title || typeof proj.title !== 'string') {
    throw new Error('Project title is required');
  }

  if (!['website', 'saas', 'mobile'].includes(proj.category)) {
    throw new Error('Project category must be website, saas, or mobile');
  }

  return {
    _id: String(proj._id),
    title: proj.title,
    category: proj.category,
    shortDescription: proj.shortDescription || '',
    coverImage: proj.coverImage || '',
    gallery: Array.isArray(proj.gallery) ? proj.gallery : [],
    techStack: Array.isArray(proj.techStack) ? proj.techStack : [],
    liveUrl: proj.liveUrl || undefined,
    repoUrl: proj.repoUrl || undefined,
    goal: proj.goal || undefined,
    contribution: proj.contribution || undefined,
    outcome: proj.outcome || undefined,
    featured: Boolean(proj.featured),
    order: Number(proj.order) || 0,
    published: Boolean(proj.published),
    createdAt: proj.createdAt ? new Date(proj.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: proj.updatedAt ? new Date(proj.updatedAt).toISOString() : new Date().toISOString(),
  };
}

export const projectZodSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.enum(['website', 'saas', 'mobile']),
  shortDescription: z.string().min(1, 'Short description is required'),
  coverImage: z.string().min(1, 'Cover image is required'),
  gallery: z.array(z.string()),
  techStack: z.array(z.string()).min(1, 'At least one tech stack item is required'),
  liveUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  repoUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  goal: z.string().optional().or(z.literal('')),
  contribution: z.string().optional().or(z.literal('')),
  outcome: z.string().optional().or(z.literal('')),
  featured: z.boolean(),
  order: z.number(),
  published: z.boolean(),
});

export type ProjectFormValues = z.infer<typeof projectZodSchema>;
