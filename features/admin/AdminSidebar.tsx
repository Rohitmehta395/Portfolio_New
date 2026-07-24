'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderKanban, FileText, Mail, ShieldAlert } from 'lucide-react';
import { AdminSignOutButton } from './AdminSignOutButton';

interface AdminSidebarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const NAV_ITEMS = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Projects CMS', href: '/admin/projects', icon: FolderKanban },
  { label: 'Blog CMS', href: '/admin/blog', icon: FileText },
  { label: 'Experience CMS', href: '/admin/experience', icon: FileText },
  { label: 'Skills CMS', href: '/admin/skills', icon: FileText },
  { label: 'Technologies CMS', href: '/admin/technologies', icon: FileText },
  { label: 'Messages', href: '/admin/messages', icon: Mail },
];

/**
 * Sidebar navigation component for the Admin Dashboard shell.
 * Uses Lucide icons and active path highlight state.
 */
export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-card p-6 flex flex-col justify-between hidden md:flex shrink-0 select-none min-h-screen">
      <div className="flex flex-col gap-8">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-sm tracking-tight text-foreground">
              Portfolio Admin
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">CMS Control Panel</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-foreground text-background font-bold shadow-md'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile & Sign Out Footer */}
      <div className="flex flex-col gap-4 border-t border-border pt-4">
        {user && (
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-mono font-bold text-emerald-400 uppercase">
              {user.name?.[0] || 'A'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-foreground truncate">{user.name || 'Admin'}</span>
              <span className="text-[10px] font-mono text-muted-foreground truncate">{user.email}</span>
            </div>
          </div>
        )}
        <AdminSignOutButton />
      </div>
    </aside>
  );
}

export default AdminSidebar;
