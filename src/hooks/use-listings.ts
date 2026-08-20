'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { Listing, ListingsResponse } from '@/lib/types';

async function fetchListings(queryString: string): Promise<ListingsResponse> {
  const res = await fetch(`/api/listings?${queryString}`);
  if (!res.ok) throw new Error(`Failed to load listings (${res.status})`);
  return res.json() as Promise<ListingsResponse>;
}

export function useListings(queryString: string) {
  return useQuery({
    queryKey: ['listings', queryString],
    queryFn: () => fetchListings(queryString),
    placeholderData: keepPreviousData, // no flash to empty on page/filter change
  });
}

async function fetchListing(id: string): Promise<Listing> {
  const res = await fetch(`/api/listings/${id}`);
  if (!res.ok) throw new Error(`Failed to load listing (${res.status})`);
  return res.json() as Promise<Listing>;
}

export function useListing(id: string) {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: () => fetchListing(id),
  });
}
