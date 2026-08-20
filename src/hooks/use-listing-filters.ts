'use client';

import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from 'nuqs';
import { LISTING_TYPES, PROPERTY_TYPES, SORT_OPTIONS } from '@/lib/types';

/**
 * URL is the single source of truth for search state — shareable, bookmarkable,
 * and SSR-friendly. Empty/default values are cleared from the URL by nuqs.
 */
export const filterParsers = {
  q: parseAsString.withDefault(''),
  city: parseAsString.withDefault(''),
  listingType: parseAsStringLiteral(LISTING_TYPES),
  propertyType: parseAsStringLiteral(PROPERTY_TYPES),
  minPrice: parseAsInteger,
  maxPrice: parseAsInteger,
  minBeds: parseAsInteger,
  minBaths: parseAsInteger,
  furnished: parseAsStringLiteral(['true', 'false'] as const),
  sort: parseAsStringLiteral(SORT_OPTIONS).withDefault('newest'),
  page: parseAsInteger.withDefault(1),
};

export function useListingFilters() {
  return useQueryStates(filterParsers, {
    history: 'push',
    shallow: false, // let the server component re-render for SSR-accurate results
  });
}

/** Build the query string sent to the API from the current filter values. */
export function filtersToQueryString(
  filters: Record<string, unknown>,
): string {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value == null || value === '') continue;
    sp.set(key, String(value));
  }
  return sp.toString();
}
