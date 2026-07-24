'use client';

import React, { useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DataTable, ColumnDef } from '@/features/admin/DataTable';
import { SerializedProject } from '@/lib/validations/project.schema';
import { toggleProjectField, deleteProject } from '@/actions/project.actions';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

export function ProjectsClient({ projects }: { projects: SerializedProject[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleToggle = (id: string, field: 'published' | 'featured', value: boolean) => {
    startTransition(async () => {
      await toggleProjectField(id, field, value);
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this project? This will also delete any linked Case Study.')) {
      startTransition(async () => {
        await deleteProject(id);
      });
    }
  };

  const columns: ColumnDef<SerializedProject>[] = [
    {
      id: 'title',
      header: 'Title',
      cell: (p) => (
        <div className="font-medium">
          {p.title}
          <div className="text-xs text-muted-foreground">{p.slug}</div>
        </div>
      ),
    },
    {
      id: 'category',
      header: 'Category',
      cell: (p) => <Badge variant="outline" className="capitalize">{p.category}</Badge>,
    },
    {
      id: 'published',
      header: 'Published',
      cell: (p) => (
        <Switch
          checked={p.published}
          disabled={isPending}
          onCheckedChange={(val) => handleToggle(p._id, 'published', val)}
        />
      ),
    },
    {
      id: 'featured',
      header: 'Featured',
      cell: (p) => (
        <Switch
          checked={p.featured}
          disabled={isPending}
          onCheckedChange={(val) => handleToggle(p._id, 'featured', val)}
        />
      ),
    },
    {
      id: 'order',
      header: 'Order',
      cell: (p) => p.order,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (p) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push(`/admin/projects/${p._id}/edit`)}>
            Edit
          </Button>
          <Button variant="destructive" size="sm" disabled={isPending} onClick={() => handleDelete(p._id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
        <Button onClick={() => router.push('/admin/projects/create')}>
          Create Project
        </Button>
      </div>
      <DataTable
        data={projects}
        columns={columns}
        keyExtractor={(p) => p._id}
        emptyMessage="No projects found."
      />
    </div>
  );
}
