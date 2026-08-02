'use client';

import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  projectZodSchema,
  ProjectFormValues,
  SerializedProjectWithCaseStudy,
} from '@/lib/validations/project.schema';
import { createProject, updateProject } from '@/actions/project.actions';
import { uploadImageToCloudinary } from '@/lib/cloudinary/upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ProjectFormProps {
  initialData?: SerializedProjectWithCaseStudy;
}

export function ProjectForm({ initialData }: ProjectFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectZodSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      category: initialData?.category || 'website',
      shortDescription: initialData?.shortDescription || '',
      coverImage: initialData?.coverImage || '',
      gallery: initialData?.gallery || [],
      techStack: initialData?.techStack || [],
      liveUrl: initialData?.liveUrl || '',
      repoUrl: initialData?.repoUrl || '',
      featured: initialData?.featured || false,
      order: initialData?.order || 0,
      published: initialData?.published !== undefined ? initialData.published : true,
    },
  });

  const [techStackInput, setTechStackInput] = useState(
    initialData?.techStack.join(', ') || ''
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);

    // Validate image type
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Invalid file type. Please select an image file (PNG, JPG, WebP, SVG, etc.).');
      e.target.value = '';
      return;
    }

    // Validate file size (5MB max)
    const MAX_SIZE_MB = 5;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setErrorMsg(`Image size exceeds ${MAX_SIZE_MB}MB limit (${(file.size / (1024 * 1024)).toFixed(2)}MB). Please choose a smaller image or paste an image URL.`);
      e.target.value = '';
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const result = await uploadImageToCloudinary(formData);
      if (result.success && result.url) {
        form.setValue('coverImage', result.url, { shouldValidate: true });
      } else {
        setErrorMsg(result.error || 'Failed to upload image. Please try again.');
      }
    } catch (err: any) {
      console.error('Image upload exception:', err);
      setErrorMsg(err.message || 'An unexpected error occurred during image upload.');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = (data: ProjectFormValues) => {
    setErrorMsg(null);
    startTransition(async () => {
      try {
        // Process tech stack before submission
        const techStackArray = techStackInput
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        data.techStack = techStackArray;

        let result;
        if (initialData) {
          result = await updateProject(initialData._id, data);
        } else {
          result = await createProject(data);
        }

        if (result.success) {
          router.push('/admin/projects');
        } else {
          setErrorMsg(result.error || 'An error occurred while saving the project.');
        }
      } catch (err: any) {
        console.error('Project form submit error:', err);
        setErrorMsg(err.message || 'An unexpected error occurred while saving.');
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
        <Card>
          <CardHeader>
            <CardTitle>Basic Details</CardTitle>
            <CardDescription>Main identity of the project.</CardDescription>
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
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" {...form.register('slug')} />
              {form.formState.errors.slug && (
                <p className="text-sm text-red-500">{form.formState.errors.slug.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                {...form.register('category')}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="website">Website</option>
                <option value="saas">SaaS</option>
                <option value="mobile">Mobile</option>
              </select>
              {form.formState.errors.category && (
                <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short Description</Label>
              <Textarea id="shortDescription" {...form.register('shortDescription')} />
              {form.formState.errors.shortDescription && (
                <p className="text-sm text-red-500">{form.formState.errors.shortDescription.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Media & Links</CardTitle>
            <CardDescription>Cover image and external URLs.</CardDescription>
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
              <Label htmlFor="techStack">Tech Stack (Comma-separated)</Label>
              <Input
                id="techStack"
                value={techStackInput}
                onChange={(e) => {
                  setTechStackInput(e.target.value);
                  form.setValue(
                    'techStack',
                    e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean),
                    { shouldValidate: true }
                  );
                }}
                placeholder="Next.js, Tailwind CSS, MongoDB"
              />
              {form.formState.errors.techStack && (
                <p className="text-sm text-red-500">{form.formState.errors.techStack.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="liveUrl">Live URL</Label>
              <Input id="liveUrl" {...form.register('liveUrl')} />
              {form.formState.errors.liveUrl && (
                <p className="text-sm text-red-500">{form.formState.errors.liveUrl.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="repoUrl">Repo URL</Label>
              <Input id="repoUrl" {...form.register('repoUrl')} />
              {form.formState.errors.repoUrl && (
                <p className="text-sm text-red-500">{form.formState.errors.repoUrl.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Visibility & Ordering</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex flex-col md:flex-row md:gap-8">
            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={form.watch('published')}
                onCheckedChange={(val) => form.setValue('published', val)}
              />
              <Label htmlFor="published">Published</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={form.watch('featured')}
                onCheckedChange={(val) => form.setValue('featured', val)}
              />
              <Label htmlFor="featured">Featured</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Label htmlFor="order">Order (Lower is first)</Label>
              <Input
                id="order"
                type="number"
                {...form.register('order', { valueAsNumber: true })}
                className="w-24"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/projects')}
          disabled={isPending || uploading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending || uploading}>
          {isPending ? 'Saving...' : initialData ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
}
