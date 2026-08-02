'use client';

import React, { useState, useTransition } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  experienceZodSchema,
  ExperienceFormValues,
  SerializedExperience,
} from '@/lib/validations/experience.schema';
import { createExperience, updateExperience } from '@/actions/experience.actions';
import { uploadImageToCloudinary } from '@/lib/cloudinary/upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

interface ExperienceFormProps {
  initialData?: SerializedExperience;
}

export function ExperienceForm({ initialData }: ExperienceFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceZodSchema),
    defaultValues: {
      company: initialData?.company || '',
      companyUrl: initialData?.companyUrl || '',
      companyLogo: initialData?.companyLogo || '',
      roles: initialData?.roles.map(r => ({
        title: r.title,
        startDate: r.startDate.substring(0, 10), // Format for input type="date"
        endDate: r.endDate ? r.endDate.substring(0, 10) : '',
        description: r.description,
      })) || [{ title: '', startDate: '', endDate: '', description: '' }],
      tags: initialData?.tags || [],
      order: initialData?.order || 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "roles",
  });

  const [tagsInput, setTagsInput] = useState(
    initialData?.tags.join(', ') || ''
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
        form.setValue('companyLogo', result.url, { shouldValidate: true });
      } else {
        setErrorMsg(result.error || 'Failed to upload image. Please try again.');
      }
    } catch (err: any) {
      console.error('Logo upload exception:', err);
      setErrorMsg(err.message || 'An unexpected error occurred during logo upload.');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = (data: ExperienceFormValues) => {
    setErrorMsg(null);
    startTransition(async () => {
      try {
        // Process tags before submission
        const tagsArray = tagsInput
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        data.tags = tagsArray;

        let result;
        if (initialData) {
          result = await updateExperience(initialData._id, data);
        } else {
          result = await createExperience(data);
        }

        if (result.success) {
          router.push('/admin/experience');
        } else {
          setErrorMsg(result.error || 'An error occurred while saving experience.');
        }
      } catch (err: any) {
        console.error('Experience form submit error:', err);
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" {...form.register('company')} />
                {form.formState.errors.company && (
                  <p className="text-sm text-red-500">{form.formState.errors.company.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyUrl">Company URL</Label>
                <Input id="companyUrl" {...form.register('companyUrl')} />
                {form.formState.errors.companyUrl && (
                  <p className="text-sm text-red-500">{form.formState.errors.companyUrl.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyLogo">Company Logo</Label>
                <div className="flex gap-4 items-start">
                  {form.watch('companyLogo') && (
                    <img
                      src={form.watch('companyLogo')}
                      alt="Logo Preview"
                      className="w-16 h-16 object-contain rounded-md border bg-white"
                    />
                  )}
                  <div className="flex-1 space-y-2">
                    <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                    <Input placeholder="Or paste Cloudinary URL" {...form.register('companyLogo')} />
                  </div>
                </div>
                {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
                {form.formState.errors.companyLogo && (
                  <p className="text-sm text-red-500">{form.formState.errors.companyLogo.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags & Ordering</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (Comma-separated)</Label>
                <Input
                  id="tags"
                  value={tagsInput}
                  onChange={(e) => {
                    setTagsInput(e.target.value);
                  }}
                  placeholder="React, Node.js, Leadership"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Order (Lower is first)</Label>
                <Input
                  id="order"
                  type="number"
                  {...form.register('order', { valueAsNumber: true })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Roles</CardTitle>
                <CardDescription>Roles held at this company.</CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ title: '', startDate: '', endDate: '', description: '' })}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Role
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg space-y-4 relative bg-muted/20">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-sm">Role {index + 1}</h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 h-8 px-2"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Remove
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input {...form.register(`roles.${index}.title` as const)} />
                    {form.formState.errors.roles?.[index]?.title && (
                      <p className="text-sm text-red-500">{form.formState.errors.roles[index]?.title?.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input type="date" {...form.register(`roles.${index}.startDate` as const)} />
                      {form.formState.errors.roles?.[index]?.startDate && (
                        <p className="text-sm text-red-500">{form.formState.errors.roles[index]?.startDate?.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>End Date (Leave blank if current)</Label>
                      <Input type="date" {...form.register(`roles.${index}.endDate` as const)} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea 
                      className="min-h-[100px]"
                      {...form.register(`roles.${index}.description` as const)} 
                    />
                    {form.formState.errors.roles?.[index]?.description && (
                      <p className="text-sm text-red-500">{form.formState.errors.roles[index]?.description?.message}</p>
                    )}
                  </div>
                </div>
              ))}
              {form.formState.errors.roles?.message && (
                <p className="text-sm text-red-500">{form.formState.errors.roles.message}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/experience')}
          disabled={isPending || uploading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending || uploading}>
          {isPending ? 'Saving...' : initialData ? 'Update Experience' : 'Create Experience'}
        </Button>
      </div>
    </form>
  );
}
