export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'My Journey', href: '/journey' },
  { label: 'My Works', href: '/works' },
  { label: 'My Experience', href: '/experience' },
  { label: 'Blog', href: '/blog' },
];

export default NAV_LINKS;
