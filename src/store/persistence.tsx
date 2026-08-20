'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useAppDispatch, useAppSelector } from '.';
import { hydrateFavourites } from './favourites-slice';
import {
  hydrateSavedSearches,
  type SavedSearch,
} from './saved-searches-slice';

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota / unavailable */
  }
}

/**
 * Bridges the Redux store to localStorage, namespaced to the signed-in user
 * (Context API). Hydrates on sign-in / sign-out and writes back on change.
 * Dispatching in an effect is fine — the setState-in-effect rule targets React
 * local state, not Redux actions.
 */
export function ReduxPersistence({ children }: { children: ReactNode }) {
  const { user, isReady } = useAuth();
  const scope = user?.id ?? 'guest';
  const dispatch = useAppDispatch();

  const favourites = useAppSelector((s) => s.favourites.ids);
  const savedSearches = useAppSelector((s) => s.savedSearches.items);

  // Tracks which scope's data is currently loaded, so the write-back effects
  // don't clobber storage before hydration completes.
  const loadedScope = useRef<string | null>(null);

  useEffect(() => {
    if (!isReady) return;
    dispatch(hydrateFavourites(read(`ef.${scope}.favourites`, [] as string[])));
    dispatch(
      hydrateSavedSearches(read(`ef.${scope}.savedSearches`, [] as SavedSearch[])),
    );
    loadedScope.current = scope;
  }, [scope, isReady, dispatch]);

  useEffect(() => {
    if (loadedScope.current !== scope) return;
    write(`ef.${scope}.favourites`, favourites);
  }, [favourites, scope]);

  useEffect(() => {
    if (loadedScope.current !== scope) return;
    write(`ef.${scope}.savedSearches`, savedSearches);
  }, [savedSearches, scope]);

  return <>{children}</>;
}
