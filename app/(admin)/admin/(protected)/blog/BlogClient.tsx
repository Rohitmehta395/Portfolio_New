'use client';

import React, { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable, ColumnDef } from '@/features/admin/DataTable';
import { SerializedBlogPost } from '@/lib/validations/blog.schema';
import { togglePublish, deleteBlogPost } from '@/actions/blog.actions';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

export function BlogClient({ posts }: { posts: SerializedBlogPost[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleToggle = (id: string, field: string, value: boolean) => {
    if (field === 'published') {
      startTransition(async () => {
        await togglePublish(id, value);
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      startTransition(async () => {
        await deleteBlogPost(id);
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
