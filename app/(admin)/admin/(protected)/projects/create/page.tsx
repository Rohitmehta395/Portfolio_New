import React from 'react';
import { ProjectForm } from '@/features/admin/ProjectForm';

export const metadata = {
  title: 'Create Project | Admin',
};

export default function CreateProjectPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Create Project</h2>
        <p className="text-muted-foreground">Add a new project to your portfolio.</p>
      </div>
      <ProjectForm />
    </div>
  );
}
