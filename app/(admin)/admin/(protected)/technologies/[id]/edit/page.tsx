import React from 'react';
import { notFound } from 'next/navigation';
import { getTechnologyById } from '@/actions/technology.actions';
import { TechnologyForm } from '@/features/admin/TechnologyForm';

export const metadata = {
  title: 'Edit Technology | Admin',
};

interface EditTechnologyPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTechnologyPage({ params }: EditTechnologyPageProps) {
  const resolvedParams = await params;
  const technology = await getTechnologyById(resolvedParams.id);

  if (!technology) {
    notFound();
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Edit Technology</h2>
        <p className="text-muted-foreground">Modify existing technology details.</p>
      </div>
      <TechnologyForm initialData={technology} />
    </div>
  );
}
