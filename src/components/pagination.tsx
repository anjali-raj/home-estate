'use client';

type Props = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;

  // Compact window of pages around the current one.
  const pages: (number | '…')[] = [];
  const add = (n: number) => pages.push(n);
  const window = 1;
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= window) {
      add(i);
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…');
    }
  }

  const btn =
    'min-w-9 rounded-lg border border-border px-3 py-1.5 text-sm disabled:opacity-40';

  return (
    <nav className="flex items-center justify-center gap-1.5" aria-label="Pagination">
      <button
        className={btn}
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        ‹
      </button>
      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} className="px-1 text-muted">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`${btn} ${
              p === page ? 'bg-primary text-primary-fg border-primary' : 'hover:bg-accent'
            }`}
          >
            {p}
          </button>
        ),
      )}
      <button
        className={btn}
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        ›
      </button>
    </nav>
  );
}
