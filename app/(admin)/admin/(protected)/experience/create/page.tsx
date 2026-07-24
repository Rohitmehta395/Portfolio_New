import React from 'react';
import { ExperienceForm } from '@/features/admin/ExperienceForm';

export const metadata = {
  title: 'Create Experience | Admin',
};

export default function CreateExperiencePage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Create Experience</h2>
        <p className="text-muted-foreground">Add a new professional experience to your timeline.</p>
      </div>
      <ExperienceForm />
    </div>
  );
}
