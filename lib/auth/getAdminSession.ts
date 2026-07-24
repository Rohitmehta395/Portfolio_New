import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth.config';
import env from '@/config/env';

/**
 * Reusable server-side session helper for Phase 17 Admin Dashboard layout/pages.
 * Verifies that a valid session exists AND that the user email matches the allow-listed ADMIN_EMAIL.
 */
export async function getAdminSession() {
  const session = await auth();

  if (!session?.user?.email) {
    return null;
  }

  const adminEmail = env.auth.adminEmail.trim().toLowerCase();
  const userEmail = session.user.email.trim().toLowerCase();

  if (userEmail !== adminEmail) {
    return null;
  }

  return session;
}

/**
 * Enforces admin session guard on Server Components / Layouts.
 * Redirects unauthenticated or non-admin users to /admin/login.
 */
export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login?error=AccessDenied');
  }

  return session;
}
