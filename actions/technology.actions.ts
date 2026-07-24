'use server';

import connectDB from '@/lib/db/connect';
import Technology from '@/models/Technology.model';
import {
  validateTechnologyData,
  SerializedTechnology,
  technologyZodSchema,
} from '@/lib/validations/technology.schema';
import { requireAdminSession } from '@/lib/auth/getAdminSession';
import { revalidatePath } from 'next/cache';

export async function getTechnologies(): Promise<SerializedTechnology[]> {
  try {
    await connectDB();
    const technologies = await Technology.find().sort({ createdAt: -1 }).lean();
    return technologies.map((doc) => validateTechnologyData(doc));
  } catch (error) {
    console.error('Failed to fetch technologies:', error);
    return [];
  }
}

export async function getTechnologyById(id: string): Promise<SerializedTechnology | null> {
  try {
    await requireAdminSession();
    await connectDB();
    
    const tech = await Technology.findById(id).lean();
    if (!tech) return null;

    return validateTechnologyData(tech);
  } catch (error) {
    console.error(`Failed to fetch technology by id "${id}":`, error);
    return null;
  }
}

export async function createTechnology(formData: any) {
  try {
    await requireAdminSession();
    await connectDB();

    const parsed = technologyZodSchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false, error: 'Invalid technology data' };
    }

    const existingName = await Technology.findOne({ name: parsed.data.name });
    if (existingName) {
      return { success: false, error: 'Technology name is already in use' };
    }

    const newTech = await Technology.create(parsed.data);
    
    revalidatePath('/admin/technologies');

    return { success: true, id: newTech._id.toString() };
  } catch (error: any) {
    console.error('Failed to create technology:', error);
    return { success: false, error: error.message || 'Failed to create technology' };
  }
}

export async function updateTechnology(id: string, formData: any) {
  try {
    await requireAdminSession();
    await connectDB();

    const parsed = technologyZodSchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false, error: 'Invalid technology data' };
    }

    const existingName = await Technology.findOne({ name: parsed.data.name, _id: { $ne: id } });
    if (existingName) {
      return { success: false, error: 'Technology name is already in use by another entry' };
    }

    const updatedTech = await Technology.findByIdAndUpdate(id, parsed.data, { new: true });
    if (!updatedTech) {
      return { success: false, error: 'Technology not found' };
    }

    revalidatePath('/admin/technologies');

    return { success: true, id: updatedTech._id.toString() };
  } catch (error: any) {
    console.error('Failed to update technology:', error);
    return { success: false, error: error.message || 'Failed to update technology' };
  }
}

export async function deleteTechnology(id: string) {
  try {
    await requireAdminSession();
    await connectDB();

    const tech = await Technology.findById(id);
    if (!tech) {
      return { success: false, error: 'Technology not found' };
    }

    await Technology.findByIdAndDelete(id);

    revalidatePath('/admin/technologies');
    
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete technology:', error);
    return { success: false, error: error.message || 'Failed to delete technology' };
  }
}
