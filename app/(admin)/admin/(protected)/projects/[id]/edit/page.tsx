import React from 'react';
import { notFound } from 'next/navigation';
import { getProjectById } from '@/actions/project.actions';
import { ProjectForm } from '@/features/admin/ProjectForm';

export const metadata = {
  title: 'Edit Project | Admin',
};

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Edit Project</h2>
        <p className="text-muted-foreground">Update the details for {project.title}.</p>
      </div>
      <ProjectForm initialData={project} />
    </div>
  );
}
