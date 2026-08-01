'use client';

import React, { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable, ColumnDef } from '@/features/admin/DataTable';
import { SerializedTechnology } from '@/lib/validations/technology.schema';
import { deleteTechnology } from '@/actions/technology.actions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function TechnologiesClient({ technologies }: { technologies: SerializedTechnology[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this technology?')) {
      startTransition(async () => {
        await deleteTechnology(id);
      });
    }
  };

  const columns: ColumnDef<SerializedTechnology>[] = [
    {
      id: 'name',
      header: 'Name',
      cell: (t) => <div className="font-medium">{t.name}</div>,
    },
    {
      id: 'category',
      header: 'Category',
      cell: (t) => <Badge variant="outline" className="capitalize">{t.category}</Badge>,
    },
    {
      id: 'icon',
      header: 'Icon',
      cell: (t) => (t.icon ? <div className="text-sm truncate max-w-[150px]" title={t.icon}>{t.icon}</div> : '-'),
    },
    {
      id: 'order',
      header: 'Order',
      cell: (t) => <div className="font-medium">{t.order}</div>,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (t) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push(`/admin/technologies/${t._id}/edit`)}>
            Edit
          </Button>
          <Button variant="destructive" size="sm" disabled={isPending} onClick={() => handleDelete(t._id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Technologies</h2>
        <Button onClick={() => router.push('/admin/technologies/create')}>
          Create Technology
        </Button>
      </div>
      <DataTable
        data={technologies}
        columns={columns}
        keyExtractor={(t) => t._id}
        emptyMessage="No technologies found."
      />
    </div>
  );
}
