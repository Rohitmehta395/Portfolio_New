import '@/app/(admin)/admin.css';
import { requireAdminSession } from '@/lib/auth/getAdminSession';
import { AdminSidebar } from '@/features/admin/AdminSidebar';

/**
 * Unconditional session guard layout for all protected admin routes.
 *
 * Structural design:
 *   app/(admin)/admin/(protected)/layout.tsx  ← THIS FILE (guarded)
 *   app/(admin)/admin/login/page.tsx          ← OUTSIDE this layout (structurally exempt)
 *
 * requireAdminSession() redirects unauthenticated/non-admin visitors to
 * /admin/login?error=AccessDenied. No conditional branching is needed here
 * because the login page is structurally outside the (protected) route group.
 *
 * Every current and future page added under (protected)/ inherits this guard
 * automatically — Phases 18 (Projects CMS), 19 (Blog CMS), and 20 (Messages)
 * do NOT need to call requireAdminSession() themselves.
 *
 * Scoping:
 *   admin.css (imported above) applies shadcn/ui CSS custom properties under
 *   the .admin-theme class only. The public (site) route group is unaffected.
 */
export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminSession();

  return (
    <div className="admin-theme min-h-screen bg-neutral-950 text-neutral-100 flex font-sans">
      <AdminSidebar user={session.user} />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <header className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6 py-4 md:hidden">
          <span className="font-display text-sm font-bold text-white">Portfolio Admin</span>
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
            CMS Control
          </span>
        </header>

        {/* Dashboard Main Workspace */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
