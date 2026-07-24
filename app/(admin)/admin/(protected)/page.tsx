import { Metadata } from 'next';
import Link from 'next/link';
import { getAdminSession } from '@/lib/auth/getAdminSession';
import { DashboardStats } from '@/features/admin/DashboardStats';
import { PlusCircle, FilePlus, MessageSquareText, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Dashboard Overview | Admin CMS',
  description: 'Portfolio CMS management overview dashboard.',
};

/**
 * Admin Dashboard Overview Server Component at /admin.
 * Auth is enforced centrally by app/(admin)/admin/(protected)/layout.tsx.
 * This page only reads the session for display (user name) — no redirect needed here.
 */
export default async function AdminDashboardPage() {
  // Session is guaranteed valid by the (protected) layout; getAdminSession() is used
  // here only to retrieve the user's display name without triggering a duplicate redirect.
  const session = await getAdminSession();

  return (
    <div className="flex flex-col gap-10">
      {/* Overview Header */}
      <div className="flex flex-col gap-2 border-b border-neutral-900 pb-8">
        <span className="text-xs font-mono font-semibold uppercase tracking-widest text-emerald-400">
          CMS Control Panel
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Welcome back, {session?.user?.name || 'Admin'}
        </h1>
        <p className="text-sm text-neutral-400 leading-relaxed">
          Manage your portfolio projects, published articles, and incoming client contact messages.
        </p>
      </div>

      {/* Live Mongoose Document Counts */}
      <DashboardStats />

      {/* Quick Actions Panel */}
      <div className="flex flex-col gap-6 pt-4">
        <h2 className="font-display text-xl font-bold text-white">Quick Management Actions</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Action 1: Create Project */}
          <Link
            href="/admin/projects/new"
            className="group flex flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 transition-all hover:border-neutral-700 hover:bg-neutral-900"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <PlusCircle className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-500 transition-transform group-hover:translate-x-1 group-hover:text-white" />
            </div>

            <div className="flex flex-col gap-1 mt-6">
              <h3 className="font-display font-bold text-lg text-white">Add New Project</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Publish a new web app, SaaS platform, or mobile case study project.
              </p>
            </div>
          </Link>

          {/* Action 2: Create Post */}
          <Link
            href="/admin/blog/new"
            className="group flex flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 transition-all hover:border-neutral-700 hover:bg-neutral-900"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
                <FilePlus className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-500 transition-transform group-hover:translate-x-1 group-hover:text-white" />
            </div>

            <div className="flex flex-col gap-1 mt-6">
              <h3 className="font-display font-bold text-lg text-white">Write Blog Article</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Draft and publish technical MDX articles and architectural deep dives.
              </p>
            </div>
          </Link>

          {/* Action 3: View Messages */}
          <Link
            href="/admin/messages"
            className="group flex flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 transition-all hover:border-neutral-700 hover:bg-neutral-900"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
                <MessageSquareText className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-500 transition-transform group-hover:translate-x-1 group-hover:text-white" />
            </div>

            <div className="flex flex-col gap-1 mt-6">
              <h3 className="font-display font-bold text-lg text-white">Review Messages</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Read, respond to, or manage client contact form submissions.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
