import React from 'react';
import { notFound } from 'next/navigation';
import { getExperienceById } from '@/actions/experience.actions';
import { ExperienceForm } from '@/features/admin/ExperienceForm';

export const metadata = {
  title: 'Edit Experience | Admin',
};

interface EditExperiencePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditExperiencePage({ params }: EditExperiencePageProps) {
  const resolvedParams = await params;
  const experience = await getExperienceById(resolvedParams.id);

  if (!experience) {
    notFound();
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Edit Experience</h2>
        <p className="text-muted-foreground">Modify existing experience details and roles.</p>
      </div>
      <ExperienceForm initialData={experience} />
    </div>
  );
}
