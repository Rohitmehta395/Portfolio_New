import React from 'react';
import { BlogForm } from '@/features/admin/BlogForm';

export const metadata = {
  title: 'Create Blog Post | Admin',
};

export default function CreateBlogPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Create Blog Post</h2>
        <p className="text-muted-foreground">
          Draft a new blog post. You can keep it unpublished until you're ready.
        </p>
      </div>
      <BlogForm />
    </div>
  );
}
