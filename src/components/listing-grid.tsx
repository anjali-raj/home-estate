import type { Listing } from '@/lib/types';
import { ListingCard } from './listing-card';

export function ListingGrid({ listings }: { listings: Listing[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {listings.map((l) => (
        <ListingCard key={l.id} listing={l} />
      ))}
    </div>
  );
}

export function ListingGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-border bg-surface"
        >
          <div className="aspect-[4/3] animate-pulse bg-border" />
          <div className="space-y-2 p-4">
            <div className="h-5 w-24 animate-pulse rounded bg-border" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-border" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-border" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ onReset }: { onReset?: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
      <p className="text-4xl" aria-hidden>🔍</p>
      <h3 className="mt-3 font-semibold">No properties match your filters</h3>
      <p className="mt-1 text-sm text-muted">
        Try widening your price range or clearing some filters.
      </p>
      {onReset && (
        <button
          onClick={onReset}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-fg"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
