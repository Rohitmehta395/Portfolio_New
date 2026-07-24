'use client';

export type CategoryFilter = 'all' | 'website' | 'saas' | 'mobile';

interface FilterTabsProps {
  activeCategory: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
  className?: string;
}

const TABS: { id: CategoryFilter; label: string }[] = [
  { id: 'all', label: 'All Projects' },
  { id: 'website', label: 'Websites' },
  { id: 'saas', label: 'SaaS Platforms' },
  { id: 'mobile', label: 'Mobile Apps' },
];

/**
 * Client Component rendering category filter tabs for the Works grid.
 * Uses plain React state callback prop (no Zustand required).
 */
export function FilterTabs({
  activeCategory,
  onCategoryChange,
  className = '',
}: FilterTabsProps) {
  return (
    <div className={`flex flex-wrap items-center gap-2 select-none ${className}`}>
      {TABS.map((tab) => {
        const isActive = activeCategory === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onCategoryChange(tab.id)}
            className={`rounded-full px-5 py-2 text-xs font-semibold tracking-wide transition-all ${
              isActive
                ? 'bg-foreground text-background shadow-lg'
                : 'bg-muted text-muted-foreground border border-border hover:border-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export default FilterTabs;
