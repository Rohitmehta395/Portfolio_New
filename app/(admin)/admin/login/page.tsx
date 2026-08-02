import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth/getAdminSession';
import { AdminLoginForm } from '@/features/auth/AdminLoginForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin Authentication | Developer Portfolio',
  description: 'Secure admin authentication portal for portfolio management.',
};

interface Props {
  searchParams: Promise<{ error?: string }>;
}

/**
 * Admin Login Page Server Component route at /admin/login.
 * Marked force-dynamic for on-demand session checking.
 */
export default async function AdminLoginPage({ searchParams }: Props) {
  const session = await getAdminSession();
  if (session) {
    redirect('/admin');
  }

  const { error } = await searchParams;

  return (
    <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-6 select-none">
      <div className="w-full max-w-md flex flex-col gap-8 rounded-3xl border border-neutral-800 bg-neutral-900/90 p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="flex flex-col gap-2 text-center">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-emerald-400">
            Portfolio CMS Management
          </span>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-white">
            Admin Portal
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            Authenticate using your allow-listed administrator account to manage projects, content, and messages.
          </p>
        </div>

        {/* Unauthorized Rejection Error Alert Banner */}
        {error && (
          <div className="rounded-2xl border border-rose-500/40 bg-rose-950/40 p-4 text-xs leading-relaxed text-rose-300 flex flex-col gap-1">
            <span className="font-semibold uppercase tracking-wider text-rose-400">
              Access Restricted
            </span>
            <p>
              Sign-in rejected. Only the authorized administrator email configured in{' '}
              <code className="font-mono text-white">ADMIN_EMAIL</code> is permitted to access the Admin Dashboard.
            </p>
          </div>
        )}

        {/* OAuth Buttons */}
        <AdminLoginForm />
      </div>
    </main>
  );
}
