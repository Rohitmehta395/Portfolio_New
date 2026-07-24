import React from 'react';
import { getProjects } from '@/actions/project.actions';
import { ProjectsClient } from './ProjectsClient';

export const metadata = {
  title: 'Manage Projects | Admin',
};

export default async function ProjectsPage() {
  const projects = await getProjects({ includeUnpublished: true });

  return (
    <div className="p-6">
      <ProjectsClient projects={projects} />
    </div>
  );
}
