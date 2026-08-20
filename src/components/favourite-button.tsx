'use client';

import { useFavourites } from '@/hooks/use-favourites';

export function FavouriteButton({
  id,
  className = '',
}: {
  id: string;
  className?: string;
}) {
  const { isFavourite, toggle, isReady } = useFavourites();
  const active = isFavourite(id);

  return (
    <button
      type="button"
      disabled={!isReady}
      aria-pressed={active}
      aria-label={active ? 'Remove from favourites' : 'Add to favourites'}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(id);
      }}
      className={`grid h-9 w-9 place-items-center rounded-full border border-border bg-surface/90 backdrop-blur transition hover:scale-105 ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill={active ? 'var(--danger)' : 'none'}
        stroke={active ? 'var(--danger)' : 'currentColor'}
        strokeWidth="2"
        aria-hidden
      >
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
      </svg>
    </button>
  );
}
