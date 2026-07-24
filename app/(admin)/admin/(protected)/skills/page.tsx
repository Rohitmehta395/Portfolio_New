import React from 'react';
import { getSkills } from '@/actions/skill.actions';
import { SkillsClient } from './SkillsClient';

export const metadata = {
  title: 'Manage Skills | Admin',
};

export default async function SkillsPage() {
  const skills = await getSkills();

  return (
    <div className="p-6">
      <SkillsClient skills={skills} />
    </div>
  );
}
