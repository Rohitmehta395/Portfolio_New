import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import ContactMessage from '@/models/ContactMessage.model';
import { contactSchema } from '@/lib/validations/contact.schema';

// Simple in-memory IP rate limiter map
// IP -> Array of timestamp numbers
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];

  // Filter out timestamps outside the current window
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return false;
}

/**
 * Route Handler (POST) processing public contact form submissions.
 *
 * ARCHITECTURAL DECISION (Route Handler vs. Server Action):
 * Public contact submissions originate from untrusted, unauthenticated external visitors.
 * Implementing this as a dedicated Route Handler (rather than a Server Action) allows:
 * 1. Granular IP rate-limiting to prevent spam floods.
 * 2. Silent honeypot bot trap interception.
 * 3. Strict, isolated server-side schema validation independent of client JavaScript state.
 */
export async function POST(request: Request) {
  try {
    // 1. IP Rate Limiting Check
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'anonymous-client';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many contact requests from your IP. Please wait a few minutes and try again.',
        },
        { status: 429 }
      );
    }

    // 2. Parse & Independently Validate Request Body
    const body = await request.json();
    const parseResult = contactSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid form submission data.',
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, message, _hp_website } = parseResult.data;

    // 3. Honeypot Bot Trap Check
    // If the hidden honeypot field is filled, return fake 200 success to confuse spam bots without saving to DB.
    if (_hp_website && _hp_website.trim().length > 0) {
      console.warn(`[Honeypot Intercepted] Bot submission trapped from IP: ${ip}`);
      return NextResponse.json(
        {
          success: true,
          message: 'Thank you! Your message has been sent successfully.',
        },
        { status: 200 }
      );
    }

    // 4. Save Validated Message to Database
    await connectDB();
    const newMessage = await ContactMessage.create({
      name,
      email,
      message,
      read: false,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you! Your message has been sent successfully.',
        id: newMessage._id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error processing contact form submission:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An internal server error occurred while processing your request.',
      },
      { status: 500 }
    );
  }
}
