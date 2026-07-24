import React from 'react';
import { notFound } from 'next/navigation';
import { getBlogPostById } from '@/actions/blog.actions';
import { BlogForm } from '@/features/admin/BlogForm';

export const metadata = {
  title: 'Edit Blog Post | Admin',
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: Props) {
  const { id } = await params;
  const post = await getBlogPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Edit Blog Post</h2>
        <p className="text-muted-foreground">
          Update the content, media, or publishing status for this post.
        </p>
      </div>
      <BlogForm initialData={post} />
    </div>
  );
}
