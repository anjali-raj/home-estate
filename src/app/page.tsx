import { Suspense } from 'react';
import { SearchExperience } from '@/components/search-experience';
import { ListingGridSkeleton } from '@/components/listing-grid';
import { PurposeTabs } from '@/components/purpose-tabs';

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
            to <span className="font-medium text-foreground">buy or rent</span> across
            Mumbai, Bengaluru, Delhi, Pune and Gurugram. Every search is shareable
            via its URL.
          </p>
          <Suspense fallback={<div className="mt-5 h-11" />}>
            <PurposeTabs />
          </Suspense>
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
