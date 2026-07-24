import { z } from 'zod';

export interface ProjectInput {
  title: string;
  slug: string;
  category: 'website' | 'saas' | 'mobile';
  shortDescription: string;
  coverImage: string;
  gallery?: string[];
  techStack: string[];
  liveUrl?: string;
  repoUrl?: string;
  caseStudyRef?: string;
  featured?: boolean;
  order?: number;
  published?: boolean;
}

export interface SerializedProject {
  _id: string;
  title: string;
  slug: string;
  category: 'website' | 'saas' | 'mobile';
  shortDescription: string;
  coverImage: string;
  gallery: string[];
  techStack: string[];
  liveUrl?: string;
  repoUrl?: string;
  caseStudyRef?: string;
  featured: boolean;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SerializedCaseStudyImage {
  url: string;
  caption: string;
}

export interface SerializedCaseStudyMetric {
  label: string;
  value: string;
}

export interface SerializedCaseStudy {
  _id: string;
  projectRef: string;
  problem?: string;
  approach?: string;
  solution?: string;
  results?: string;
  images: SerializedCaseStudyImage[];
  metrics: SerializedCaseStudyMetric[];
  createdAt: string;
  updatedAt: string;
}

export interface SerializedProjectWithCaseStudy extends SerializedProject {
  caseStudy?: SerializedCaseStudy | null;
}

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

  if (!proj.slug || typeof proj.slug !== 'string') {
    throw new Error('Project slug is required');
  }

  if (!['website', 'saas', 'mobile'].includes(proj.category)) {
    throw new Error('Project category must be website, saas, or mobile');
  }

  return {
    _id: String(proj._id),
    title: proj.title,
    slug: proj.slug,
    category: proj.category,
    shortDescription: proj.shortDescription || '',
    coverImage: proj.coverImage || '',
    gallery: Array.isArray(proj.gallery) ? proj.gallery : [],
    techStack: Array.isArray(proj.techStack) ? proj.techStack : [],
    liveUrl: proj.liveUrl || undefined,
    repoUrl: proj.repoUrl || undefined,
    caseStudyRef: proj.caseStudyRef ? String(proj.caseStudyRef._id || proj.caseStudyRef) : undefined,
    featured: Boolean(proj.featured),
    order: Number(proj.order) || 0,
    published: Boolean(proj.published),
    createdAt: proj.createdAt ? new Date(proj.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: proj.updatedAt ? new Date(proj.updatedAt).toISOString() : new Date().toISOString(),
  };
}

/**
 * Validates and serializes a Project document with populated CaseStudy data.
 */
export function validateProjectWithCaseStudyData(data: unknown): SerializedProjectWithCaseStudy {
  const baseProject = validateProjectData(data);
  const proj = data as Record<string, any>;

  let caseStudy: SerializedCaseStudy | null = null;

  if (proj.caseStudyRef && typeof proj.caseStudyRef === 'object' && proj.caseStudyRef._id) {
    const cs = proj.caseStudyRef;
    caseStudy = {
      _id: String(cs._id),
      projectRef: String(cs.projectRef),
      problem: cs.problem || undefined,
      approach: cs.approach || undefined,
      solution: cs.solution || undefined,
      results: cs.results || undefined,
      images: Array.isArray(cs.images)
        ? cs.images.map((img: any) => ({ url: String(img.url), caption: String(img.caption) }))
        : [],
      metrics: Array.isArray(cs.metrics)
        ? cs.metrics.map((m: any) => ({ label: String(m.label), value: String(m.value) }))
        : [],
      createdAt: cs.createdAt ? new Date(cs.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: cs.updatedAt ? new Date(cs.updatedAt).toISOString() : new Date().toISOString(),
    };
  }

  return {
    ...baseProject,
    caseStudy,
  };
}

export const projectZodSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric and hyphens'),
  category: z.enum(['website', 'saas', 'mobile']),
  shortDescription: z.string().min(1, 'Short description is required'),
  coverImage: z.string().min(1, 'Cover image is required'),
  gallery: z.array(z.string()),
  techStack: z.array(z.string()).min(1, 'At least one tech stack item is required'),
  liveUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  repoUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  featured: z.boolean(),
  order: z.number(),
  published: z.boolean(),
});

export type ProjectFormValues = z.infer<typeof projectZodSchema>;
