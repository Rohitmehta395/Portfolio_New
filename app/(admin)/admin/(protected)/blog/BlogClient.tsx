'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable, ColumnDef } from '@/features/admin/DataTable';
import { SerializedBlogPost } from '@/lib/validations/blog.schema';
import { togglePublish, deleteBlogPost } from '@/actions/blog.actions';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

export function BlogClient({ posts }: { posts: SerializedBlogPost[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleToggle = (id: string, field: string, value: boolean) => {
    if (field === 'published') {
      setErrorMsg(null);
      startTransition(async () => {
        try {
          const res = await togglePublish(id, value);
          if (!res.success) {
            setErrorMsg(res.error || 'Failed to update publish status.');
          }
        } catch (err: any) {
          console.error('Toggle blog publish error:', err);
          setErrorMsg(err.message || 'An error occurred while updating status.');
        }
      });
    }
  };

  const handleDelete = (id: string) => {
    setErrorMsg(null);
    if (confirm('Are you sure you want to delete this blog post?')) {
      startTransition(async () => {
        try {
          const res = await deleteBlogPost(id);
          if (!res.success) {
            setErrorMsg(res.error || 'Failed to delete blog post.');
          }
        } catch (err: any) {
          console.error('Delete blog post error:', err);
          setErrorMsg(err.message || 'An error occurred while deleting blog post.');
        }
      });
    }
  };

  const columns: ColumnDef<SerializedBlogPost>[] = [
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
      id: 'publishedAt',
      header: 'Published Date',
      cell: (p) => (
        <span className="text-sm">
          {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : 'N/A'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (p) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push(`/admin/blog/${p._id}/edit`)}>
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
      {errorMsg && (
        <div className="p-4 bg-red-100 text-red-900 rounded-md border border-red-200">
          {errorMsg}
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Blog Posts</h2>
        <Button onClick={() => router.push('/admin/blog/create')}>
          Create Post
        </Button>
      </div>
      <DataTable
        data={posts}
        columns={columns}
        keyExtractor={(p) => p._id}
        emptyMessage="No blog posts found."
      />
    </div>
  );
}
