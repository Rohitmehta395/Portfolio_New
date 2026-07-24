import React from 'react';
import { notFound } from 'next/navigation';
import { getSkillById } from '@/actions/skill.actions';
import { SkillForm } from '@/features/admin/SkillForm';

export const metadata = {
  title: 'Edit Skill | Admin',
};

interface EditSkillPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSkillPage({ params }: EditSkillPageProps) {
  const resolvedParams = await params;
  const skill = await getSkillById(resolvedParams.id);

  if (!skill) {
    notFound();
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Edit Skill</h2>
        <p className="text-muted-foreground">Modify existing skill details.</p>
      </div>
      <SkillForm initialData={skill} />
    </div>
  );
}
