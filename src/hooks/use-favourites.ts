'use client';

import { useCallback, useMemo } from 'react';
import { useUserStore } from './use-user-store';

export function useFavourites() {
  const [ids, setIds, isReady] = useUserStore<string[]>('favourites', []);

  const set = useMemo(() => new Set(ids), [ids]);

  const isFavourite = useCallback((id: string) => set.has(id), [set]);

  const toggle = useCallback(
    (id: string) => {
      setIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev],
      );
    },
    [setIds],
  );

  return { ids, count: ids.length, isFavourite, toggle, isReady };
}
