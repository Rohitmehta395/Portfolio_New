'use client';

import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  blogZodSchema,
  BlogFormValues,
  SerializedBlogPost,
} from '@/lib/validations/blog.schema';
import { createBlogPost, updateBlogPost } from '@/actions/blog.actions';
import { uploadImageToCloudinary } from '@/lib/cloudinary/upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface BlogFormProps {
  initialData?: SerializedBlogPost;
}

export function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogZodSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      excerpt: initialData?.excerpt || '',
      contentMdx: initialData?.contentMdx || '',
      coverImage: initialData?.coverImage || '',
      tags: initialData?.tags || [],
      published: initialData?.published !== undefined ? initialData.published : false,
      publishedAt: initialData?.publishedAt || '',
      readTimeMinutes: initialData?.readTimeMinutes || 5,
    },
  });

  const [tagsInput, setTagsInput] = useState(
    initialData?.tags.join(', ') || ''
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const result = await uploadImageToCloudinary(formData);
    if (result.success && result.url) {
      form.setValue('coverImage', result.url, { shouldValidate: true });
    } else {
      setErrorMsg(result.error || 'Failed to upload image');
    }
    setUploading(false);
  };

  const autoGenerateSlug = () => {
    const title = form.getValues('title');
    if (!title) return;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    form.setValue('slug', slug, { shouldValidate: true });
  };

  const onSubmit = (data: BlogFormValues) => {
    setErrorMsg(null);
    startTransition(async () => {
      // Process tags
      const tagsArray = tagsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      data.tags = tagsArray;

      // Handle publishedAt
      if (data.published && (!data.publishedAt || data.publishedAt.trim() === '')) {
        data.publishedAt = new Date().toISOString();
      }

      let result;
      if (initialData) {
        result = await updateBlogPost(initialData._id, data);
      } else {
        result = await createBlogPost(data);
      }

      if (result.success) {
        router.push('/admin/blog');
      } else {
        setErrorMsg(result.error || 'An error occurred');
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {errorMsg && (
        <div className="p-4 bg-red-100 text-red-900 rounded-md border border-red-200">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Content</CardTitle>
            <CardDescription>Main content of the blog post.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...form.register('title')} />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="slug">Slug</Label>
                <Button type="button" variant="ghost" size="sm" onClick={autoGenerateSlug}>
                  Auto-generate from Title
                </Button>
              </div>
              <Input id="slug" {...form.register('slug')} />
              {form.formState.errors.slug && (
                <p className="text-sm text-red-500">{form.formState.errors.slug.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea id="excerpt" {...form.register('excerpt')} />
              {form.formState.errors.excerpt && (
                <p className="text-sm text-red-500">{form.formState.errors.excerpt.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contentMdx">MDX Content</Label>
              <Textarea id="contentMdx" rows={15} className="font-mono text-sm" {...form.register('contentMdx')} />
              {form.formState.errors.contentMdx && (
                <p className="text-sm text-red-500">{form.formState.errors.contentMdx.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Media & Meta</CardTitle>
            <CardDescription>Cover image and tags.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="coverImage">Cover Image</Label>
              <div className="flex gap-4 items-start">
                {form.watch('coverImage') && (
                  <img
                    src={form.watch('coverImage')}
                    alt="Cover Preview"
                    className="w-24 h-24 object-cover rounded-md border"
                  />
                )}
                <div className="flex-1 space-y-2">
                  <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                  <Input placeholder="Or paste Cloudinary URL" {...form.register('coverImage')} />
                </div>
              </div>
              {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
              {form.formState.errors.coverImage && (
                <p className="text-sm text-red-500">{form.formState.errors.coverImage.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (Comma-separated)</Label>
              <Input
                id="tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="React, TypeScript, Web Development"
              />
              {form.formState.errors.tags && (
                <p className="text-sm text-red-500">{form.formState.errors.tags.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="readTimeMinutes">Read Time (minutes)</Label>
              <Input
                id="readTimeMinutes"
                type="number"
                {...form.register('readTimeMinutes', { valueAsNumber: true })}
              />
              {form.formState.errors.readTimeMinutes && (
                <p className="text-sm text-red-500">{form.formState.errors.readTimeMinutes.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Publishing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={form.watch('published')}
                onCheckedChange={(val) => form.setValue('published', val)}
              />
              <Label htmlFor="published">Published</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="publishedAt">Published At (ISO String or leave blank for now)</Label>
              <Input
                id="publishedAt"
                placeholder="2024-01-01T12:00:00Z"
                {...form.register('publishedAt')}
              />
              {form.formState.errors.publishedAt && (
                <p className="text-sm text-red-500">{form.formState.errors.publishedAt.message}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/blog')}
          disabled={isPending || uploading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending || uploading}>
          {isPending ? 'Saving...' : initialData ? 'Update Post' : 'Create Post'}
        </Button>
      </div>
    </form>
  );
}
