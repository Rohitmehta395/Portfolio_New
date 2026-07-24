'use client';

import React, { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable, ColumnDef } from '@/features/admin/DataTable';
import { SerializedSkill } from '@/lib/validations/skill.schema';
import { deleteSkill } from '@/actions/skill.actions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function SkillsClient({ skills }: { skills: SerializedSkill[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this skill?')) {
      startTransition(async () => {
        await deleteSkill(id);
      });
    }
  };

  const columns: ColumnDef<SerializedSkill>[] = [
    {
      id: 'name',
      header: 'Name',
      cell: (s) => <div className="font-medium">{s.name}</div>,
    },
    {
      id: 'category',
      header: 'Category',
      cell: (s) => <Badge variant="outline" className="capitalize">{s.category}</Badge>,
    },
    {
      id: 'proficiency',
      header: 'Proficiency',
      cell: (s) => (s.proficiency ? s.proficiency : '-'),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (s) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push(`/admin/skills/${s._id}/edit`)}>
            Edit
          </Button>
          <Button variant="destructive" size="sm" disabled={isPending} onClick={() => handleDelete(s._id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Skills</h2>
        <Button onClick={() => router.push('/admin/skills/create')}>
          Create Skill
        </Button>
      </div>
      <DataTable
        data={skills}
        columns={columns}
        keyExtractor={(s) => s._id}
        emptyMessage="No skills found."
      />
    </div>
  );
}
