'use client';

import { useListingFilters } from '@/hooks/use-listing-filters';
import {
  LISTING_TYPES,
  PROPERTY_TYPE_LABELS,
  PROPERTY_TYPES,
  type ListingsResponse,
} from '@/lib/types';
import { formatCompactPrice, titleCase } from '@/lib/format';

type Props = {
  facets: ListingsResponse['facets'] | undefined;
  total: number | undefined;
};

const selectCls =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm';
const labelCls = 'block text-xs font-semibold uppercase tracking-wide text-muted';

export function FiltersPanel({ facets, total }: Props) {
  const [filters, setFilters] = useListingFilters();

  // Any filter change resets pagination to page 1.
  const patch = (next: Parameters<typeof setFilters>[0]) =>
    setFilters({ ...next, page: 1 });

  const hasActive =
    filters.q ||
    filters.city ||
    filters.listingType ||
    filters.propertyType ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.minBeds ||
    filters.minBaths ||
    filters.furnished;

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Filters</h2>
        {hasActive ? (
          <button
            onClick={() =>
              setFilters({
                q: '',
                city: '',
                listingType: null,
                propertyType: null,
                minPrice: null,
                maxPrice: null,
                minBeds: null,
                minBaths: null,
                furnished: null,
                page: 1,
              })
            }
            className="text-xs font-medium text-primary hover:underline"
          >
            Clear all
          </button>
        ) : null}
      </div>

      <div>
        <label className={labelCls} htmlFor="f-q">Keyword</label>
        <input
          id="f-q"
          value={filters.q}
          onChange={(e) => patch({ q: e.target.value })}
          placeholder="Bengaluru, Central"
          className={`mt-1 ${selectCls}`}
        />
      </div>

      <div>
        <label className={labelCls} htmlFor="f-type">Purpose</label>
        <select
          id="f-type"
          value={filters.listingType ?? ''}
          onChange={(e) =>
            patch({ listingType: (e.target.value || null) as never })
          }
          className={`mt-1 ${selectCls}`}
        >
          <option value="">Buy or Rent</option>
          {LISTING_TYPES.map((t) => (
            <option key={t} value={t}>For {titleCase(t)}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelCls} htmlFor="f-city">City</label>
        <select
          id="f-city"
          value={filters.city}
          onChange={(e) => patch({ city: e.target.value })}
          className={`mt-1 ${selectCls}`}
        >
          <option value="">All cities</option>
          {facets?.cities.map((c) => (
            <option key={c.value} value={c.value}>
              {c.value} ({c.count})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelCls} htmlFor="f-ptype">Property type</label>
        <select
          id="f-ptype"
          value={filters.propertyType ?? ''}
          onChange={(e) =>
            patch({ propertyType: (e.target.value || null) as never })
          }
          className={`mt-1 ${selectCls}`}
        >
          <option value="">Any type</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t}>{PROPERTY_TYPE_LABELS[t]}</option>
          ))}
        </select>
      </div>

      <fieldset>
        <legend className={labelCls}>
          Price {facets ? `(${formatCompactPrice(facets.priceRange.min)} – ${formatCompactPrice(facets.priceRange.max)})` : ''}
        </legend>
        <div className="mt-1 flex gap-2">
          <input
            type="number"
            inputMode="numeric"
            placeholder="Min"
            value={filters.minPrice ?? ''}
            onChange={(e) =>
              patch({ minPrice: e.target.value ? Number(e.target.value) : null })
            }
            className={selectCls}
          />
          <input
            type="number"
            inputMode="numeric"
            placeholder="Max"
            value={filters.maxPrice ?? ''}
            onChange={(e) =>
              patch({ maxPrice: e.target.value ? Number(e.target.value) : null })
            }
            className={selectCls}
          />
        </div>
      </fieldset>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelCls} htmlFor="f-beds">Beds (min)</label>
          <select
            id="f-beds"
            value={filters.minBeds ?? ''}
            onChange={(e) =>
              patch({ minBeds: e.target.value ? Number(e.target.value) : null })
            }
            className={`mt-1 ${selectCls}`}
          >
            <option value="">Any</option>
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n === 0 ? 'Studio' : `${n}+`}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls} htmlFor="f-baths">Baths (min)</label>
          <select
            id="f-baths"
            value={filters.minBaths ?? ''}
            onChange={(e) =>
              patch({ minBaths: e.target.value ? Number(e.target.value) : null })
            }
            className={`mt-1 ${selectCls}`}
          >
            <option value="">Any</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n}+</option>
            ))}
          </select>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={filters.furnished === 'true'}
          onChange={(e) => patch({ furnished: e.target.checked ? 'true' : null })}
          className="h-4 w-4 accent-[var(--primary)]"
        />
        Furnished only
      </label>

      {total != null && (
        <p className="border-t border-border pt-3 text-sm text-muted">
          <span className="font-semibold text-foreground">{total}</span> matching
          {total === 1 ? ' property' : ' properties'}
        </p>
      )}
    </div>
  );
}
