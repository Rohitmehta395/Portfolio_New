interface TagPillProps {
  label: string;
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
}

/**
 * Generic reusable tag/skill pill badge component.
 * Presentational component designed for tag arrays across Experience, Works, and Capabilities sections.
 */
export function TagPill({ label, variant = 'default', className = '' }: TagPillProps) {
  const variantStyles = {
    default: 'bg-muted text-secondary-foreground border-border hover:border-muted-foreground hover:text-foreground',
    outline: 'bg-transparent text-muted-foreground border-border hover:text-foreground',
    ghost: 'bg-muted/50 text-muted-foreground border-transparent hover:bg-muted',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-tight transition-colors ${variantStyles[variant]} ${className}`}
    >
      {label}
    </span>
  );
}

export default TagPill;
