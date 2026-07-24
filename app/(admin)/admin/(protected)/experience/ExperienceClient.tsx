'use client';

import React, { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable, ColumnDef } from '@/features/admin/DataTable';
import { SerializedExperience } from '@/lib/validations/experience.schema';
import { deleteExperience } from '@/actions/experience.actions';
import { Button } from '@/components/ui/button';

export function ExperienceClient({ experiences }: { experiences: SerializedExperience[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this experience entry?')) {
      startTransition(async () => {
        await deleteExperience(id);
      });
    }
  };

  const columns: ColumnDef<SerializedExperience>[] = [
    {
      id: 'company',
      header: 'Company',
      cell: (e) => <div className="font-medium">{e.company}</div>,
    },
    {
      id: 'rolesCount',
      header: 'Roles',
      cell: (e) => (
        <div className="text-sm text-muted-foreground">
          {e.roles.length} {e.roles.length === 1 ? 'role' : 'roles'}
        </div>
      ),
    },
    {
      id: 'order',
      header: 'Order',
      cell: (e) => e.order,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (e) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push(`/admin/experience/${e._id}/edit`)}>
            Edit
          </Button>
          <Button variant="destructive" size="sm" disabled={isPending} onClick={() => handleDelete(e._id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Experience</h2>
        <Button onClick={() => router.push('/admin/experience/create')}>
          Add Experience
        </Button>
      </div>
      <DataTable
        data={experiences}
        columns={columns}
        keyExtractor={(e) => e._id}
        emptyMessage="No experiences found."
      />
    </div>
  );
}
