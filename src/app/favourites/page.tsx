'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useFavourites } from '@/hooks/use-favourites';
import { ListingGrid, ListingGridSkeleton } from '@/components/listing-grid';
import type { Listing } from '@/lib/types';

async function fetchByIds(ids: string[]): Promise<Listing[]> {
  if (ids.length === 0) return [];
  const res = await fetch(`/api/listings/batch?ids=${ids.join(',')}`);
  if (!res.ok) throw new Error('Failed to load favourites');
  const data = (await res.json()) as { results: Listing[] };
  return data.results;
}

export default function FavouritesPage() {
  const { ids, isReady } = useFavourites();

  const { data, isLoading } = useQuery({
    queryKey: ['favourites', ids],
    queryFn: () => fetchByIds(ids),
    enabled: isReady,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold">Your favourites</h1>
      <p className="mt-1 text-muted">
        {ids.length} saved {ids.length === 1 ? 'property' : 'properties'}
      </p>

      <div className="mt-6">
        {!isReady || isLoading ? (
          <ListingGridSkeleton count={3} />
        ) : !data || data.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
            <p className="text-4xl" aria-hidden>♡</p>
            <h2 className="mt-3 font-semibold">No favourites yet</h2>
            <p className="mt-1 text-sm text-muted">
              Tap the heart on any listing to save it here.
            </p>
            <Link
              href="/"
              className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-fg"
            >
              Browse properties
            </Link>
          </div>
        ) : (
          <ListingGrid listings={data} />
        )}
      </div>
    </div>
  );
}
