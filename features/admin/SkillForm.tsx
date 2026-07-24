'use client';

import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  skillZodSchema,
  SkillFormValues,
  SerializedSkill,
} from '@/lib/validations/skill.schema';
import { createSkill, updateSkill } from '@/actions/skill.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface SkillFormProps {
  initialData?: SerializedSkill;
}

export function SkillForm({ initialData }: SkillFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillZodSchema),
    defaultValues: {
      name: initialData?.name || '',
      category: initialData?.category || 'language',
      proficiency: initialData?.proficiency || '',
    },
  });

  const onSubmit = (data: SkillFormValues) => {
    setErrorMsg(null);
    startTransition(async () => {
      let result;
      if (initialData) {
        result = await updateSkill(initialData._id, data);
      } else {
        result = await createSkill(data);
      }

      if (result.success) {
        router.push('/admin/skills');
      } else {
        setErrorMsg(result.error || 'An error occurred');
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
          <CardTitle>Skill Details</CardTitle>
          <CardDescription>Main identity of the skill.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...form.register('name')} placeholder="e.g. System Design" />
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
              <option value="language">Language</option>
              <option value="framework">Framework</option>
              <option value="tool">Tool</option>
              <option value="soft-skill">Soft Skill</option>
            </select>
            {form.formState.errors.category && (
              <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="proficiency">Proficiency (1-5, Optional)</Label>
            <Input 
              id="proficiency" 
              type="number" 
              min="1" max="5" 
              {...form.register('proficiency', { valueAsNumber: true })} 
              placeholder="e.g. 4" 
            />
            {form.formState.errors.proficiency && (
              <p className="text-sm text-red-500">{form.formState.errors.proficiency.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/skills')}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : initialData ? 'Update Skill' : 'Create Skill'}
        </Button>
      </div>
    </form>
  );
}
