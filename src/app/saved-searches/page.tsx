'use client';

import Link from 'next/link';
import { useSavedSearches } from '@/hooks/use-saved-searches';

export default function SavedSearchesPage() {
  const { searches, remove, isReady } = useSavedSearches();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">Saved searches</h1>
      <p className="mt-1 text-muted">
        Re-run a search you saved earlier. Stored in this browser.
      </p>

      <div className="mt-6 space-y-3">
        {!isReady ? (
          <div className="h-20 animate-pulse rounded-xl bg-border" />
        ) : searches.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
            <p className="text-4xl" aria-hidden>🔖</p>
            <h2 className="mt-3 font-semibold">No saved searches</h2>
            <p className="mt-1 text-sm text-muted">
              Set some filters on the search page, then hit “Save this search”.
            </p>
            <Link
              href="/"
              className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-fg"
            >
              Start searching
            </Link>
          </div>
        ) : (
          searches.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{s.label}</p>
                <p className="truncate text-xs text-muted">
                  {s.query || 'All properties'}
                </p>
              </div>
              <Link
                href={`/?${s.query}`}
                className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-fg hover:opacity-90"
              >
                Run
              </Link>
              <button
                onClick={() => remove(s.id)}
                aria-label={`Delete saved search ${s.label}`}
                className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-accent"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
