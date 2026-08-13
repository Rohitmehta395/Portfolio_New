'use client';

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const contact2Schema = z.object({
  firstname: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters")
    .trim(),
  lastname: z.string().max(50, "Last name cannot exceed 50 characters").optional(),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .trim()
    .toLowerCase(),
  subject: z.string().max(150, "Subject cannot exceed 150 characters").optional(),
  message: z
    .string()
    .min(5, "Message must be at least 5 characters long")
    .max(2000, "Message cannot exceed 2000 characters")
    .trim(),
  _hp_website: z.string().optional(),
});

type Contact2FormData = z.infer<typeof contact2Schema>;

interface Contact2Props {
  title?: string;
  description?: string;
  phone?: string;
  email?: string;
  web?: { label: string; url: string };
}

export const Contact2 = ({
  title = "Contact Me",
  description = "Have a project in mind or just want to chat? Fill out the information below and I'll get back to you as soon as possible.",
  phone = "+91 8279908698",
  email = "rohitmehtaddn@gmail.com",
}: Contact2Props) => {
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
  } = useForm<Contact2FormData>({
    resolver: zodResolver(contact2Schema),
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      subject: '',
      message: '',
      _hp_website: '',
    },
  });

  const onSubmit = async (data: Contact2FormData) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const fullName = `${data.firstname} ${data.lastname || ''}`.trim();
      const messageContent = data.subject?.trim()
        ? `[Subject: ${data.subject.trim()}]\n\n${data.message}`
        : data.message;

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          email: data.email,
          message: messageContent,
          _hp_website: data._hp_website,
        }),
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
    <section className="py-16 md:py-24 lg:py-32" id="contact">
      <div className="container">
        <div className="mx-auto flex max-w-screen-xl flex-col justify-between gap-10 lg:flex-row lg:gap-20">
          <div className="mx-auto flex w-full max-w-sm flex-col justify-between gap-10">
            <div className="text-center lg:text-left">
              <h1 className="mb-2 text-5xl font-semibold lg:mb-1 lg:text-6xl">
                {title}
              </h1>
              <p className="text-muted-foreground">{description}</p>
            </div>
            <div className="mx-auto w-fit lg:mx-0">
              <h3 className="mb-6 text-center text-2xl font-semibold lg:text-left">
                Contact Details
              </h3>
              <ul className="ml-4 list-disc space-y-2">
                <li>
                  <span className="font-bold">Phone: </span>
                  {phone}
                </li>
                <li>
                  <span className="font-bold">Email: </span>
                  <a href={`mailto:${email}`} className="underline hover:text-emerald-400 transition-colors">
                    {email}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="mx-auto flex w-full max-w-screen-md flex-col gap-6 rounded-lg border p-6 md:p-10 bg-card/50 backdrop-blur-sm"
            noValidate
          >
            {/* Honeypot Field */}
            <div className="sr-only aria-hidden absolute pointer-events-none -z-50 opacity-0 overflow-hidden h-0 w-0">
              <label htmlFor="_hp_website">Leave this empty</label>
              <input
                id="_hp_website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                {...register('_hp_website')}
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="firstname">First Name <span className="text-emerald-500">*</span></Label>
                <Input
                  type="text"
                  id="firstname"
                  placeholder="First Name"
                  disabled={isSubmitting}
                  {...register('firstname')}
                />
                {errors.firstname && (
                  <span className="text-xs text-rose-500">{errors.firstname.message}</span>
                )}
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="lastname">Last Name</Label>
                <Input
                  type="text"
                  id="lastname"
                  placeholder="Last Name"
                  disabled={isSubmitting}
                  {...register('lastname')}
                />
                {errors.lastname && (
                  <span className="text-xs text-rose-500">{errors.lastname.message}</span>
                )}
              </div>
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">Email <span className="text-emerald-500">*</span></Label>
              <Input
                type="email"
                id="email"
                placeholder="john@example.com"
                disabled={isSubmitting}
                {...register('email')}
              />
              {errors.email && (
                <span className="text-xs text-rose-500">{errors.email.message}</span>
              )}
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="subject">Subject</Label>
              <Input
                type="text"
                id="subject"
                placeholder="Project Inquiry / Hello"
                disabled={isSubmitting}
                {...register('subject')}
              />
              {errors.subject && (
                <span className="text-xs text-rose-500">{errors.subject.message}</span>
              )}
            </div>

            <div className="grid w-full gap-1.5">
              <Label htmlFor="message">Message <span className="text-emerald-500">*</span></Label>
              <Textarea
                placeholder="Type your message here..."
                id="message"
                rows={5}
                disabled={isSubmitting}
                {...register('message')}
              />
              {errors.message && (
                <span className="text-xs text-rose-500">{errors.message.message}</span>
              )}
            </div>

            {/* Submission Status Banner */}
            {submitStatus.type && (
              <div
                className={`rounded-lg border p-4 text-sm font-medium ${
                  submitStatus.type === 'success'
                    ? 'border-emerald-500/50 bg-emerald-950/80 text-emerald-300'
                    : 'border-rose-500/50 bg-rose-950/40 text-rose-300'
                }`}
              >
                {submitStatus.message}
              </div>
            )}

            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full font-semibold transition-all"
            >
              {isSubmitting ? 'Sending Message...' : 'Send Message'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};
