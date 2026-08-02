'use client';

import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  technologyZodSchema,
  TechnologyFormValues,
  SerializedTechnology,
} from '@/lib/validations/technology.schema';
import { createTechnology, updateTechnology } from '@/actions/technology.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface TechnologyFormProps {
  initialData?: SerializedTechnology;
}

export function TechnologyForm({ initialData }: TechnologyFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const form = useForm<TechnologyFormValues>({
    resolver: zodResolver(technologyZodSchema),
    defaultValues: {
      name: initialData?.name || '',
      category: initialData?.category || 'frontend',
      icon: initialData?.icon || '',
      order: initialData?.order || 0,
    },
  });

  const onSubmit = (data: TechnologyFormValues) => {
    setErrorMsg(null);
    startTransition(async () => {
      try {
        let result;
        if (initialData) {
          result = await updateTechnology(initialData._id, data);
        } else {
          result = await createTechnology(data);
        }

        if (result.success) {
          router.push('/admin/technologies');
        } else {
          setErrorMsg(result.error || 'An error occurred while saving technology.');
        }
      } catch (err: any) {
        console.error('Technology form submit error:', err);
        setErrorMsg(err.message || 'An unexpected error occurred while saving.');
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
      {errorMsg && (
        <div className="p-4 bg-red-100 text-red-900 rounded-md border border-red-200">
          {errorMsg}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Technology Details</CardTitle>
          <CardDescription>Main identity of the technology.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...form.register('name')} placeholder="e.g. React" />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              {...form.register('category')}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="database">Database</option>
              <option value="devops">DevOps</option>
              <option value="mobile">Mobile</option>
            </select>
            {form.formState.errors.category && (
              <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Icon (SVG or class, Optional)</Label>
            <Input id="icon" {...form.register('icon')} placeholder="e.g. devicon-react-original" />
            {form.formState.errors.icon && (
              <p className="text-sm text-red-500">{form.formState.errors.icon.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Order (Lower numbers appear first)</Label>
            <Input id="order" type="number" {...form.register('order', { valueAsNumber: true })} placeholder="0" />
            {form.formState.errors.order && (
              <p className="text-sm text-red-500">{form.formState.errors.order.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/technologies')}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : initialData ? 'Update Technology' : 'Create Technology'}
        </Button>
      </div>
    </form>
  );
}
