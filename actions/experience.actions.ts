'use server';

import connectDB from '@/lib/db/connect';
import Experience from '@/models/Experience.model';
import {
  validateExperienceData,
  SerializedExperience,
  experienceZodSchema,
} from '@/lib/validations/experience.schema';
import { requireAdminSession } from '@/lib/auth/getAdminSession';
import { revalidatePath } from 'next/cache';

export async function getExperiences(): Promise<SerializedExperience[]> {
  try {
    await connectDB();
    const experiences = await Experience.find().sort({ order: 1, createdAt: -1 }).lean();
    return experiences.map((doc) => validateExperienceData(doc));
  } catch (error) {
    console.error('Failed to fetch experiences:', error);
    return [];
  }
}

export async function getExperienceById(id: string): Promise<SerializedExperience | null> {
  try {
    await requireAdminSession();
    await connectDB();
    
    const experience = await Experience.findById(id).lean();
    if (!experience) return null;

    return validateExperienceData(experience);
  } catch (error) {
    console.error(`Failed to fetch experience by id "${id}":`, error);
    return null;
  }
}

export async function createExperience(formData: any) {
  try {
    await requireAdminSession();
    await connectDB();

    const parsed = experienceZodSchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false, error: 'Invalid experience data' };
    }

    const dataToSave = { ...parsed.data };
    dataToSave.roles = dataToSave.roles.map(r => ({
      ...r,
      endDate: r.endDate === '' ? null : (r.endDate || null)
    }));

    const newExperience = await Experience.create(dataToSave);
    
    revalidatePath('/admin/experience');
    revalidatePath('/experience');

    return { success: true, id: newExperience._id.toString() };
  } catch (error: any) {
    console.error('Failed to create experience:', error);
    return { success: false, error: error.message || 'Failed to create experience' };
  }
}

export async function updateExperience(id: string, formData: any) {
  try {
    await requireAdminSession();
    await connectDB();

    const parsed = experienceZodSchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false, error: 'Invalid experience data' };
    }

    const dataToSave = { ...parsed.data };
    dataToSave.roles = dataToSave.roles.map(r => ({
      ...r,
      endDate: r.endDate === '' ? null : (r.endDate || null)
    }));

    const updatedExperience = await Experience.findByIdAndUpdate(id, dataToSave, { new: true });
    if (!updatedExperience) {
      return { success: false, error: 'Experience not found' };
    }

    revalidatePath('/admin/experience');
    revalidatePath('/experience');

    return { success: true, id: updatedExperience._id.toString() };
  } catch (error: any) {
    console.error('Failed to update experience:', error);
    return { success: false, error: error.message || 'Failed to update experience' };
  }
}

export async function deleteExperience(id: string) {
  try {
    await requireAdminSession();
    await connectDB();

    const exp = await Experience.findById(id);
    if (!exp) {
      return { success: false, error: 'Experience not found' };
    }

    await Experience.findByIdAndDelete(id);

    revalidatePath('/admin/experience');
    revalidatePath('/experience');
    
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete experience:', error);
    return { success: false, error: error.message || 'Failed to delete experience' };
  }
}
