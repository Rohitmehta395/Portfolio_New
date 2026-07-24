import React from 'react';
import { SkillForm } from '@/features/admin/SkillForm';

export const metadata = {
  title: 'Create Skill | Admin',
};

export default function CreateSkillPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Create Skill</h2>
        <p className="text-muted-foreground">Add a new skill to your portfolio.</p>
      </div>
      <SkillForm />
    </div>
  );
}
