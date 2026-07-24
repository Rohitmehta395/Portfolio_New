'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, ContactFormData } from '@/lib/validations/contact.schema';

interface ContactFormProps {
  className?: string;
}

/**
 * Client Component rendering the public contact form with React Hook Form,
 * Zod validation, hidden honeypot bot trap, and feedback states.
 */
export function ContactForm({ className = '' }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
      _hp_website: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to submit contact message.');
      }

      setSubmitStatus({
        type: 'success',
        message: 'Thank you for reaching out! Your message has been sent successfully.',
      });
      reset();
    } catch (err: any) {
      setSubmitStatus({
        type: 'error',
        message: err.message || 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`flex flex-col gap-6 rounded-3xl border border-border/80 bg-card/80 p-8 sm:p-12 backdrop-blur-md ${className}`}
      noValidate
    >
      {/* Honeypot Bot Trap Field (Visually hidden from human users) */}
      <div className="sr-only aria-hidden absolute pointer-events-none -z-50 opacity-0 overflow-hidden h-0 w-0">
        <label htmlFor="_hp_website">Leave this field empty</label>
        <input
          id="_hp_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register('_hp_website')}
        />
      </div>

      {/* Name Input */}
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary-foreground">
          Your Name <span className="text-emerald-400">*</span>
        </label>
        <input
          id="name"
          type="text"
          placeholder="John Doe"
          disabled={isSubmitting}
          {...register('name')}
          className={`w-full rounded-xl border bg-muted/90 px-4 py-3.5 text-sm text-foreground placeholder-neutral-500 outline-none transition-colors focus:border-emerald-500 ${
            errors.name ? 'border-rose-500/80' : 'border-border'
          }`}
        />
        {errors.name && (
          <span className="text-xs font-mono text-rose-400">{errors.name.message}</span>
        )}
      </div>

      {/* Email Input */}
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary-foreground">
          Your Email <span className="text-emerald-400">*</span>
        </label>
        <input
          id="email"
          type="email"
          placeholder="john@example.com"
          disabled={isSubmitting}
          {...register('email')}
          className={`w-full rounded-xl border bg-muted/90 px-4 py-3.5 text-sm text-foreground placeholder-neutral-500 outline-none transition-colors focus:border-emerald-500 ${
            errors.email ? 'border-rose-500/80' : 'border-border'
          }`}
        />
        {errors.email && (
          <span className="text-xs font-mono text-rose-400">{errors.email.message}</span>
        )}
      </div>

      {/* Message Textarea */}
      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary-foreground">
          Your Message <span className="text-emerald-400">*</span>
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder="Tell me about your project, timeline, or inquiry..."
          disabled={isSubmitting}
          {...register('message')}
          className={`w-full rounded-xl border bg-muted/90 px-4 py-3.5 text-sm text-foreground placeholder-neutral-500 outline-none transition-colors focus:border-emerald-500 ${
            errors.message ? 'border-rose-500/80' : 'border-border'
          }`}
        />
        {errors.message && (
          <span className="text-xs font-mono text-rose-400">{errors.message.message}</span>
        )}
      </div>

      {/* Feedback Banner */}
      {submitStatus.type && (
        <div
          className={`rounded-xl border p-4 text-xs font-medium ${
            submitStatus.type === 'success'
              ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
              : 'border-rose-500/40 bg-rose-950/40 text-rose-300'
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-foreground px-8 py-4 text-sm font-semibold text-background hover:bg-neutral-200 transition-all shadow-xl hover:shadow-white/10 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
      >
        <span>{isSubmitting ? 'Sending Message...' : 'Send Message'}</span>
        <span className="text-base transition-transform group-hover:translate-x-1">→</span>
      </button>
    </form>
  );
}

export default ContactForm;
