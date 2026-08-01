import { z } from 'zod';

export interface SerializedTechnology {
  _id: string;
  name: string;
  icon?: string;
  order: number;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'mobile';
  createdAt: string;
  updatedAt: string;
}

export function validateTechnologyData(data: unknown): SerializedTechnology {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid technology data object');
  }

  const tech = data as Record<string, any>;

  if (!tech.name || typeof tech.name !== 'string') {
    throw new Error('Technology name is required');
  }

  if (!['frontend', 'backend', 'database', 'devops', 'mobile'].includes(tech.category)) {
    throw new Error('Technology category must be frontend, backend, database, devops, or mobile');
  }

  return {
    _id: String(tech._id),
    name: tech.name,
    icon: tech.icon ? String(tech.icon) : undefined,
    order: Number(tech.order) || 0,
    category: tech.category,
    createdAt: tech.createdAt ? new Date(tech.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: tech.updatedAt ? new Date(tech.updatedAt).toISOString() : new Date().toISOString(),
  };
}

export const technologyZodSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  icon: z.string().optional(),
  order: z.number(),
  category: z.enum(['frontend', 'backend', 'database', 'devops', 'mobile']),
});

export type TechnologyFormValues = z.infer<typeof technologyZodSchema>;
