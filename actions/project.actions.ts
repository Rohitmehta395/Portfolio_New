'use server';

import connectDB from '@/lib/db/connect';
import Project from '@/models/Project.model';
import CaseStudy from '@/models/CaseStudy.model';
import {
  validateProjectData,
  validateProjectWithCaseStudyData,
  SerializedProject,
  SerializedProjectWithCaseStudy,
  projectZodSchema,
} from '@/lib/validations/project.schema';
import { requireAdminSession } from '@/lib/auth/getAdminSession';
import { revalidatePath } from 'next/cache';

export interface ProjectFilters {
  category?: 'website' | 'saas' | 'mobile' | 'all';
  featured?: boolean;
  includeUnpublished?: boolean;
}

export async function getProjects(filters?: ProjectFilters): Promise<SerializedProject[]> {
  try {
    await connectDB();

    const query: Record<string, any> = {};
    if (!filters?.includeUnpublished) {
      query.published = true;
    }

    if (filters?.category && filters.category !== 'all') {
      query.category = filters.category;
    }

    if (filters?.featured !== undefined) {
      query.featured = filters.featured;
    }

    const projectDocs = await Project.find(query).sort({ order: 1 }).lean();
    return projectDocs.map((doc) => validateProjectData(doc));
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return [];
  }
}

export async function getProjectBySlug(
  slug: string
): Promise<SerializedProjectWithCaseStudy | null> {
  try {
    await connectDB();
    if (!CaseStudy) {} // ensure registered

    const projectDoc = await Project.findOne({ slug, published: true })
      .populate('caseStudyRef')
      .lean();

    if (!projectDoc) {
      return null;
    }

    return validateProjectWithCaseStudyData(projectDoc);
  } catch (error) {
    console.error(`Failed to fetch project by slug "${slug}":`, error);
    return null;
  }
}

export async function getProjectById(
  id: string
): Promise<SerializedProjectWithCaseStudy | null> {
  try {
    await requireAdminSession();
    await connectDB();
    if (!CaseStudy) {} // ensure registered

    const projectDoc = await Project.findById(id).populate('caseStudyRef').lean();
    if (!projectDoc) {
      return null;
    }

    return validateProjectWithCaseStudyData(projectDoc);
  } catch (error) {
    console.error(`Failed to fetch project by id "${id}":`, error);
    return null;
  }
}

export async function createProject(formData: any) {
  try {
    await requireAdminSession();
    await connectDB();

    const parsed = projectZodSchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false, error: 'Invalid project data' };
    }

    const existingSlug = await Project.findOne({ slug: parsed.data.slug });
    if (existingSlug) {
      return { success: false, error: 'Slug is already in use' };
    }

    const newProject = await Project.create(parsed.data);
    
    revalidatePath('/works');
    revalidatePath('/admin/projects');
    revalidatePath('/admin'); // for dashboard stats

    return { success: true, id: newProject._id.toString() };
  } catch (error: any) {
    console.error('Failed to create project:', error);
    return { success: false, error: error.message || 'Failed to create project' };
  }
}

export async function updateProject(id: string, formData: any) {
  try {
    await requireAdminSession();
    await connectDB();

    const parsed = projectZodSchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false, error: 'Invalid project data' };
    }

    const existingSlug = await Project.findOne({ slug: parsed.data.slug, _id: { $ne: id } });
    if (existingSlug) {
      return { success: false, error: 'Slug is already in use by another project' };
    }

    const updatedProject = await Project.findByIdAndUpdate(id, parsed.data, { new: true });
    if (!updatedProject) {
      return { success: false, error: 'Project not found' };
    }

    revalidatePath('/works');
    revalidatePath(`/works/${updatedProject.slug}`);
    revalidatePath('/admin/projects');

    return { success: true, id: updatedProject._id.toString() };
  } catch (error: any) {
    console.error('Failed to update project:', error);
    return { success: false, error: error.message || 'Failed to update project' };
  }
}

export async function deleteProject(id: string) {
  try {
    await requireAdminSession();
    await connectDB();

    const project = await Project.findById(id);
    if (!project) {
      return { success: false, error: 'Project not found' };
    }

    // Cascade delete CaseStudy if it exists
    await CaseStudy.deleteOne({ projectRef: project._id });
    
    // Actually delete the project
    await Project.findByIdAndDelete(id);

    revalidatePath('/works');
    revalidatePath('/admin/projects');
    revalidatePath('/admin');
    
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete project:', error);
    return { success: false, error: error.message || 'Failed to delete project' };
  }
}

export async function toggleProjectField(id: string, field: 'published' | 'featured', value: boolean) {
  try {
    await requireAdminSession();
    await connectDB();

    if (!['published', 'featured'].includes(field)) {
      return { success: false, error: 'Invalid field' };
    }

    const updated = await Project.findByIdAndUpdate(id, { [field]: value }, { new: true });
    if (!updated) {
      return { success: false, error: 'Project not found' };
    }

    revalidatePath('/works');
    revalidatePath(`/works/${updated.slug}`);
    revalidatePath('/admin/projects');
    revalidatePath('/admin');

    return { success: true };
  } catch (error: any) {
    console.error(`Failed to toggle ${field}:`, error);
    return { success: false, error: error.message || `Failed to toggle ${field}` };
  }
}
