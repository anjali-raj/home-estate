'use client';

import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleFavourite } from '@/store/favourites-slice';

/**
 * Thin, ergonomic wrapper over the Redux favourites slice so components don't
 * touch dispatch/selectors directly.
 */
export function useFavourites() {
  const dispatch = useAppDispatch();
  const ids = useAppSelector((s) => s.favourites.ids);
  const hydrated = useAppSelector((s) => s.favourites.hydrated);

  const set = useMemo(() => new Set(ids), [ids]);
  const isFavourite = useCallback((id: string) => set.has(id), [set]);
  const toggle = useCallback(
    (id: string) => dispatch(toggleFavourite(id)),
    [dispatch],
  );

  return { ids, count: ids.length, isFavourite, toggle, isReady: hydrated };
}
