import { z } from 'zod';

export interface SerializedSkill {
  _id: string;
  name: string;
  category: 'language' | 'framework' | 'tool' | 'soft-skill';
  proficiency?: number;
  createdAt: string;
  updatedAt: string;
}

export function validateSkillData(data: unknown): SerializedSkill {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid skill data object');
  }

  const skill = data as Record<string, any>;

  if (!skill.name || typeof skill.name !== 'string') {
    throw new Error('Skill name is required');
  }

  if (!['language', 'framework', 'tool', 'soft-skill'].includes(skill.category)) {
    throw new Error('Skill category must be language, framework, tool, or soft-skill');
  }

  return {
    _id: String(skill._id),
    name: skill.name,
    category: skill.category,
    proficiency: skill.proficiency ? Number(skill.proficiency) : undefined,
    createdAt: skill.createdAt ? new Date(skill.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: skill.updatedAt ? new Date(skill.updatedAt).toISOString() : new Date().toISOString(),
  };
}

export const skillZodSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.enum(['language', 'framework', 'tool', 'soft-skill']),
  proficiency: z.number().min(1).max(5).optional().or(z.literal('')),
});

export type SkillFormValues = z.infer<typeof skillZodSchema>;
