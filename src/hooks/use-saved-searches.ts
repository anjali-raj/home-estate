'use client';

import { useCallback } from 'react';
import { useUserStore } from './use-user-store';

export type SavedSearch = {
  id: string;
  label: string;
  /** serialized URLSearchParams string, e.g. "city=Dubai&minBeds=2" */
  query: string;
  createdAt: string;
};

export function useSavedSearches() {
  const [searches, setSearches, isReady] = useUserStore<SavedSearch[]>(
    'saved-searches',
    [],
  );

  const save = useCallback(
    (label: string, query: string) => {
      const entry: SavedSearch = {
        // deterministic-ish id without Date.now collisions across quick saves
        id: `${query}::${label}`,
        label,
        query,
        createdAt: new Date().toISOString(),
      };
      setSearches((prev) => {
        const withoutDup = prev.filter((s) => s.query !== query);
        return [entry, ...withoutDup];
      });
    },
    [setSearches],
  );

  const remove = useCallback(
    (id: string) => {
      setSearches((prev) => prev.filter((s) => s.id !== id));
    },
    [setSearches],
  );

  const exists = useCallback(
    (query: string) => searches.some((s) => s.query === query),
    [searches],
  );

  return { searches, save, remove, exists, isReady };
}
