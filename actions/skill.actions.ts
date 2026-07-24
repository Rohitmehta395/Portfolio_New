'use server';

import connectDB from '@/lib/db/connect';
import Skill from '@/models/Skill.model';
import {
  validateSkillData,
  SerializedSkill,
  skillZodSchema,
} from '@/lib/validations/skill.schema';
import { requireAdminSession } from '@/lib/auth/getAdminSession';
import { revalidatePath } from 'next/cache';

export async function getSkills(): Promise<SerializedSkill[]> {
  try {
    await connectDB();
    const skills = await Skill.find().sort({ createdAt: -1 }).lean();
    return skills.map((doc) => validateSkillData(doc));
  } catch (error) {
    console.error('Failed to fetch skills:', error);
    return [];
  }
}

export async function getSkillById(id: string): Promise<SerializedSkill | null> {
  try {
    await requireAdminSession();
    await connectDB();
    
    const skill = await Skill.findById(id).lean();
    if (!skill) return null;

    return validateSkillData(skill);
  } catch (error) {
    console.error(`Failed to fetch skill by id "${id}":`, error);
    return null;
  }
}

export async function createSkill(formData: any) {
  try {
    await requireAdminSession();
    await connectDB();

    const parsed = skillZodSchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false, error: 'Invalid skill data' };
    }

    // Convert empty string to undefined for proficiency to allow valid insertion
    const dataToSave: any = { ...parsed.data };
    if (dataToSave.proficiency === '') {
      delete dataToSave.proficiency;
    }

    const existingName = await Skill.findOne({ name: parsed.data.name });
    if (existingName) {
      return { success: false, error: 'Skill name is already in use' };
    }

    const newSkill = await Skill.create(dataToSave);
    
    revalidatePath('/admin/skills');

    return { success: true, id: newSkill._id.toString() };
  } catch (error: any) {
    console.error('Failed to create skill:', error);
    return { success: false, error: error.message || 'Failed to create skill' };
  }
}

export async function updateSkill(id: string, formData: any) {
  try {
    await requireAdminSession();
    await connectDB();

    const parsed = skillZodSchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false, error: 'Invalid skill data' };
    }

    // Convert empty string to undefined for proficiency
    const dataToSave: any = { ...parsed.data };
    if (dataToSave.proficiency === '') {
      dataToSave.$unset = { proficiency: 1 };
      delete dataToSave.proficiency;
    }

    const existingName = await Skill.findOne({ name: parsed.data.name, _id: { $ne: id } });
    if (existingName) {
      return { success: false, error: 'Skill name is already in use by another entry' };
    }

    const updatePayload = dataToSave.$unset 
      ? { $set: dataToSave, $unset: dataToSave.$unset }
      : dataToSave;

    // Remove $unset from root of dataToSave before $set
    if (dataToSave.$unset) {
       delete dataToSave.$unset;
    }

    const updatedSkill = await Skill.findByIdAndUpdate(id, updatePayload, { new: true });
    if (!updatedSkill) {
      return { success: false, error: 'Skill not found' };
    }

    revalidatePath('/admin/skills');

    return { success: true, id: updatedSkill._id.toString() };
  } catch (error: any) {
    console.error('Failed to update skill:', error);
    return { success: false, error: error.message || 'Failed to update skill' };
  }
}

export async function deleteSkill(id: string) {
  try {
    await requireAdminSession();
    await connectDB();

    const skill = await Skill.findById(id);
    if (!skill) {
      return { success: false, error: 'Skill not found' };
    }

    await Skill.findByIdAndDelete(id);

    revalidatePath('/admin/skills');
    
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete skill:', error);
    return { success: false, error: error.message || 'Failed to delete skill' };
  }
}
