import React from 'react';
import { getBlogPosts } from '@/actions/blog.actions';
import { BlogClient } from './BlogClient';

export const metadata = {
  title: 'Manage Blog | Admin',
};

export default async function BlogPage() {
  const posts = await getBlogPosts({ includeUnpublished: true });

  return (
    <div className="p-6">
      <BlogClient posts={posts} />
    </div>
  );
}
