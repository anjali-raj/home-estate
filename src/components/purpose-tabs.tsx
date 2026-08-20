'use client';

import { useListingFilters } from '@/hooks/use-listing-filters';

const TABS = [
  { value: null, label: 'All' },
  { value: 'sale', label: 'Buy' },
  { value: 'rent', label: 'Rent' },
] as const;

/** Prominent Buy / Rent switch that drives the `listingType` URL filter. */
export function PurposeTabs() {
  const [filters, setFilters] = useListingFilters();
  const current = filters.listingType ?? null;

  return (
    <div
      role="tablist"
      aria-label="Filter by purpose"
      className="mt-5 inline-flex rounded-full border border-border bg-surface p-1"
    >
      {TABS.map((t) => {
        const active = current === t.value;
        return (
          <button
            key={t.label}
            role="tab"
            aria-selected={active}
            onClick={() => setFilters({ listingType: t.value, page: 1 })}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
              active
                ? 'bg-primary text-primary-fg'
                : 'text-muted hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
