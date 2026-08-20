import { Suspense } from 'react';
import { SearchExperience } from '@/components/search-experience';
import { ListingGridSkeleton } from '@/components/listing-grid';

export default function HomePage() {
  return (
    <>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <h1 className="text-3xl font-bold sm:text-4xl">
            Find your next home in India
          </h1>
          <p className="mt-2 max-w-2xl text-muted">
            Search{' '}
            <span className="font-medium text-foreground">apartments, villas and independent houses</span>{' '}
            for sale and rent across Mumbai, Bengaluru, Delhi, Pune and Gurugram.
            Every search is shareable via its URL.
          </p>
        </div>
      </section>

      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-4 py-6">
            <ListingGridSkeleton />
          </div>
        }
      >
        <SearchExperience />
      </Suspense>
    </>
  );
}
