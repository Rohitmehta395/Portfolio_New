import { z } from 'zod';

export interface SerializedExperienceRole {
  title: string;
  startDate: string;
  endDate?: string | null;
  description: string;
}

export interface SerializedExperience {
  _id: string;
  company: string;
  companyUrl?: string;
  companyLogo?: string;
  roles: SerializedExperienceRole[];
  tags: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export function validateExperienceData(data: unknown): SerializedExperience {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid experience data object');
  }

  const exp = data as Record<string, any>;

  if (!exp.company || typeof exp.company !== 'string') {
    throw new Error('Company name is required');
  }

  return {
    _id: String(exp._id),
    company: exp.company,
    companyUrl: exp.companyUrl ? String(exp.companyUrl) : undefined,
    companyLogo: exp.companyLogo ? String(exp.companyLogo) : undefined,
    roles: Array.isArray(exp.roles)
      ? exp.roles.map((r: any) => ({
          title: String(r.title),
          startDate: new Date(r.startDate).toISOString(),
          endDate: r.endDate ? new Date(r.endDate).toISOString() : null,
          description: String(r.description),
        }))
      : [],
    tags: Array.isArray(exp.tags) ? exp.tags.map(String) : [],
    order: Number(exp.order) || 0,
    createdAt: exp.createdAt ? new Date(exp.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: exp.updatedAt ? new Date(exp.updatedAt).toISOString() : new Date().toISOString(),
  };
}

export const experienceRoleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  startDate: z.string().min(1, 'Start Date is required'),
  endDate: z.string().optional().nullable().or(z.literal('')),
  description: z.string().min(1, 'Description is required'),
});

export const experienceZodSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  companyUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  companyLogo: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  roles: z.array(experienceRoleSchema).min(1, 'At least one role is required'),
  tags: z.array(z.string()),
  order: z.number().default(0),
});

export type ExperienceFormValues = z.infer<typeof experienceZodSchema>;
