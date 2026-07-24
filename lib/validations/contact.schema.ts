import { z } from 'zod';

/**
 * Zod validation schema for the public contact form and API payload.
 * Includes a hidden honeypot field (_hp_website) for bot detection.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .trim()
    .toLowerCase(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters long')
    .max(2000, 'Message cannot exceed 2000 characters')
    .trim(),
  // Honeypot field - expected to be empty. Real users never see or fill this in.
  _hp_website: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
