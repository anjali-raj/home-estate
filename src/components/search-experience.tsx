'use client';

import { useMemo, useState } from 'react';
import {
  filtersToQueryString,
  useListingFilters,
} from '@/hooks/use-listing-filters';
import { useListings } from '@/hooks/use-listings';
import {
  PROPERTY_TYPE_LABELS,
  SORT_OPTIONS,
  type PropertyType,
  type SortOption,
} from '@/lib/types';
import { FiltersPanel } from './filters-panel';
import {
  EmptyState,
  ListingGrid,
  ListingGridSkeleton,
} from './listing-grid';
import { Pagination } from './pagination';
import { SaveSearchButton } from './save-search-button';

const SORT_LABELS: Record<SortOption, string> = {
  newest: 'Newest first',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
  'beds-desc': 'Most bedrooms',
  'area-desc': 'Largest area',
};

/** Human-readable summary used to label a saved search. */
function describeFilters(f: Record<string, unknown>): string {
  const parts: string[] = [];
  if (f.propertyType) parts.push(PROPERTY_TYPE_LABELS[f.propertyType as PropertyType]);
  else parts.push('Properties');
  if (f.listingType) parts.push(`for ${f.listingType}`);
  if (f.city) parts.push(`in ${f.city}`);
  if (f.minBeds) parts.push(`· ${f.minBeds}+ beds`);
  if (f.q) parts.push(`· “${f.q}”`);
  return parts.join(' ');
}

export function SearchExperience() {
  const [filters, setFilters] = useListingFilters();
  const [filtersOpen, setFiltersOpen] = useState(false);

  // The query string that hits the API — excludes empty values.
  const queryString = useMemo(
    () => filtersToQueryString(filters),
    [filters],
  );

  const { data, isLoading, isError, isPlaceholderData, refetch } =
    useListings(queryString);

  // The saved-search query excludes pagination so it restores to page 1.
  const savableFilters = { ...filters, page: null };
  const savableQuery = filtersToQueryString(savableFilters);

  const activeFilterCount = [
    filters.q,
    filters.city,
    filters.propertyType,
    filters.minPrice,
    filters.maxPrice,
    filters.minBeds,
    filters.minBaths,
    filters.furnished,
  ].filter(Boolean).length;

  return (
    <div className="mx-auto max-w-7xl gap-6 px-4 py-6 lg:grid lg:grid-cols-[300px_1fr]">
      {/* Mobile-only toggle: filters are a big panel, so they collapse on small
          screens and are always shown from lg up. */}
      <button
        type="button"
        onClick={() => setFiltersOpen((v) => !v)}
        aria-expanded={filtersOpen}
        aria-controls="filters-panel"
        className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface py-2.5 text-sm font-medium lg:hidden"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M3 5h18M6 12h12M10 19h4" strokeLinecap="round" />
        </svg>
        {filtersOpen ? 'Hide filters' : 'Show filters'}
        {activeFilterCount > 0 && (
          <span className="rounded-full bg-primary px-1.5 text-xs text-primary-fg">
            {activeFilterCount}
          </span>
        )}
      </button>

      <aside
        id="filters-panel"
        className={`mb-6 lg:mb-0 lg:block ${filtersOpen ? 'block' : 'hidden'}`}
      >
        <div className="lg:sticky lg:top-20">
          <FiltersPanel facets={data?.facets} total={data?.total} />
        </div>
      </aside>

      <section aria-live="polite">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <SaveSearchButton
            query={savableQuery}
            label={describeFilters(savableFilters)}
          />
          <label className="ml-auto flex items-center gap-2 text-sm text-muted">
            Sort
            <select
              value={filters.sort}
              onChange={(e) =>
                setFilters({ sort: e.target.value as SortOption, page: 1 })
              }
              className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s} value={s}>{SORT_LABELS[s]}</option>
              ))}
            </select>
          </label>
        </div>

        {isError ? (
          <div className="rounded-2xl border border-danger/40 bg-surface p-8 text-center">
            <p className="font-semibold text-danger">Something went wrong</p>
            <button
              onClick={() => refetch()}
              className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm text-primary-fg"
            >
              Retry
            </button>
          </div>
        ) : isLoading ? (
          <ListingGridSkeleton count={filters.page ? 6 : 6} />
        ) : !data || data.results.length === 0 ? (
          <EmptyState
            onReset={() =>
              setFilters({
                q: '',
                city: '',
                listingType: null,
                propertyType: null,
                minPrice: null,
                maxPrice: null,
                minBeds: null,
                minBaths: null,
                furnished: null,
                page: 1,
              })
            }
          />
        ) : (
          <div
            className={isPlaceholderData ? 'opacity-60 transition-opacity' : ''}
          >
            <ListingGrid listings={data.results} />
            <div className="mt-8">
              <Pagination
                page={data.page}
                totalPages={data.totalPages}
                onChange={(page) => {
                  setFilters({ page });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
