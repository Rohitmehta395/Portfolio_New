'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavLink as NavLinkType } from '@/constants/nav-links';

interface NavLinkProps {
  link: NavLinkType;
  onClick?: () => void;
  className?: string;
}

export function NavLink({ link, onClick, className = '' }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === link.href;

  return (
    <Link
      href={link.href}
      onClick={onClick}
      className={`group relative inline-flex items-center transition-colors hover:text-foreground ${
        isActive ? 'text-foreground font-semibold' : 'text-muted-foreground'
      } ${className}`}
    >
      <span>{link.label}</span>
      <span
        className={`absolute -bottom-1 left-0 h-[2px] bg-foreground transition-all duration-300 ease-out ${
          isActive ? 'w-full' : 'w-0 group-hover:w-full'
        }`}
      />
    </Link>
  );
}

export default NavLink;
