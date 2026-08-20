'use client';

import { useState } from 'react';
import { useSavedSearches } from '@/hooks/use-saved-searches';
import { useAuth } from '@/lib/auth-context';

export function SaveSearchButton({
  query,
  label,
}: {
  query: string;
  /** human-readable summary of the active filters */
  label: string;
}) {
  const { user } = useAuth();
  const { save, exists } = useSavedSearches();
  const [saved, setSaved] = useState(false);

  const alreadySaved = exists(query) || saved;
  const disabled = !query || alreadySaved;

  return (
    <button
      type="button"
      disabled={disabled}
      title={!user ? 'Saved to this browser (sign in to keep them with your account)' : undefined}
      onClick={() => {
        save(label || 'All properties', query);
        setSaved(true);
      }}
      className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm hover:bg-accent disabled:opacity-50"
    >
      <span aria-hidden>{alreadySaved ? '✓' : '☆'}</span>
      {alreadySaved ? 'Search saved' : 'Save this search'}
    </button>
  );
}
