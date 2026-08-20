'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';

/**
 * A localStorage-backed piece of state namespaced to the signed-in user.
 * Falls back to a shared "guest" bucket when signed out, and syncs across
 * tabs via the `storage` event.
 */
export function useUserStore<T>(
  key: string,
  initial: T,
): readonly [T, (updater: T | ((prev: T) => T)) => void, boolean] {
  const { user } = useAuth();
  const scope = user?.id ?? 'guest';
  const storageKey = `ef.${scope}.${key}`;

  const [value, setValue] = useState<T>(initial);
  const [isReady, setIsReady] = useState(false);

  // Load whenever the scoped key changes (e.g. after sign-in). Hydrating from
  // localStorage requires syncing state in an effect — the accepted exception.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setIsReady(false);
    try {
      const raw = localStorage.getItem(storageKey);
      setValue(raw ? (JSON.parse(raw) as T) : initial);
    } catch {
      setValue(initial);
    }
    setIsReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Cross-tab sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== storageKey) return;
      try {
        setValue(e.newValue ? (JSON.parse(e.newValue) as T) : initial);
      } catch {
        /* ignore */
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const update = useCallback(
    (updater: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const next =
          typeof updater === 'function'
            ? (updater as (p: T) => T)(prev)
            : updater;
        try {
          localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {
          /* quota / unavailable */
        }
        return next;
      });
    },
    [storageKey],
  );

  return [value, update, isReady] as const;
}
