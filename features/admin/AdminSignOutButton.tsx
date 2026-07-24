'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export function AdminSignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: '/admin/login' })}
      className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-rose-400 transition-colors"
    >
      <LogOut className="w-4 h-4" />
      <span>Sign Out</span>
    </button>
  );
}

export default AdminSignOutButton;
