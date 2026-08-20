'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  addSavedSearch,
  removeSavedSearch,
  type SavedSearch,
} from '@/store/saved-searches-slice';

export type { SavedSearch };

export function useSavedSearches() {
  const dispatch = useAppDispatch();
  const searches = useAppSelector((s) => s.savedSearches.items);
  const hydrated = useAppSelector((s) => s.savedSearches.hydrated);

  const save = useCallback(
    (label: string, query: string) => dispatch(addSavedSearch(label, query)),
    [dispatch],
  );
  const remove = useCallback(
    (id: string) => dispatch(removeSavedSearch(id)),
    [dispatch],
  );
  const exists = useCallback(
    (query: string) => searches.some((s) => s.query === query),
    [searches],
  );

  return { searches, save, remove, exists, isReady: hydrated };
}
