import React from 'react';
import { getExperiences } from '@/actions/experience.actions';
import { ExperienceClient } from './ExperienceClient';

export const metadata = {
  title: 'Manage Experience | Admin',
};

export default async function ExperiencePage() {
  const experiences = await getExperiences();

  return (
    <div className="p-6">
      <ExperienceClient experiences={experiences} />
    </div>
  );
}
