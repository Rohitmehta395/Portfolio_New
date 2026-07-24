import React from 'react';
import { getTechnologies } from '@/actions/technology.actions';
import { TechnologiesClient } from './TechnologiesClient';

export const metadata = {
  title: 'Manage Technologies | Admin',
};

export default async function TechnologiesPage() {
  const technologies = await getTechnologies();

  return (
    <div className="p-6">
      <TechnologiesClient technologies={technologies} />
    </div>
  );
}
