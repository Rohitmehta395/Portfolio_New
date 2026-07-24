import React from 'react';
import { TechnologyForm } from '@/features/admin/TechnologyForm';

export const metadata = {
  title: 'Create Technology | Admin',
};

export default function CreateTechnologyPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Create Technology</h2>
        <p className="text-muted-foreground">Add a new technology to your portfolio.</p>
      </div>
      <TechnologyForm />
    </div>
  );
}
