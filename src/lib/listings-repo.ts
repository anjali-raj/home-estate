import 'server-only';
import listingsData from '@/data/listings.json';
import {
  listingSchema,
  type Listing,
  type ListingsResponse,
  type SearchParams,
} from './types';

// Validate once at module load so bad data fails loudly, then cache.
const LISTINGS: Listing[] = listingSchema.array().parse(listingsData);

export function getListingById(id: string): Listing | undefined {
  return LISTINGS.find((l) => l.id === id);
}

function matches(l: Listing, p: SearchParams): boolean {
  if (p.q) {
    const hay = `${l.title} ${l.community} ${l.city} ${l.address}`.toLowerCase();
    if (!hay.includes(p.q.toLowerCase())) return false;
  }
  if (p.city && l.city !== p.city) return false;
  if (p.listingType && l.listingType !== p.listingType) return false;
  if (p.propertyType && l.propertyType !== p.propertyType) return false;
  if (p.minPrice != null && l.price < p.minPrice) return false;
  if (p.maxPrice != null && l.price > p.maxPrice) return false;
  if (p.minBeds != null && l.beds < p.minBeds) return false;
  if (p.minBaths != null && l.baths < p.minBaths) return false;
  if (p.furnished != null && l.furnished !== p.furnished) return false;
  return true;
}

const SORTERS: Record<SearchParams['sort'], (a: Listing, b: Listing) => number> = {
  newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  'beds-desc': (a, b) => b.beds - a.beds,
  'area-desc': (a, b) => b.area - a.area,
};

export function queryListings(p: SearchParams): ListingsResponse {
  const filtered = LISTINGS.filter((l) => matches(l, p));
  const sorted = [...filtered].sort(SORTERS[p.sort]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / p.pageSize));
  const page = Math.min(p.page, totalPages);
  const start = (page - 1) * p.pageSize;
  const results = sorted.slice(start, start + p.pageSize);

  // Facets are computed against the full dataset so the sidebar stays stable.
  const cityCounts = new Map<string, number>();
  let min = Infinity;
  let max = 0;
  for (const l of LISTINGS) {
    cityCounts.set(l.city, (cityCounts.get(l.city) ?? 0) + 1);
    if (l.price < min) min = l.price;
    if (l.price > max) max = l.price;
  }

  return {
    results,
    total,
    page,
    pageSize: p.pageSize,
    totalPages,
    facets: {
      cities: [...cityCounts.entries()]
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count),
      priceRange: { min: Number.isFinite(min) ? min : 0, max },
    },
  };
}

export function getListingIds(): string[] {
  return LISTINGS.map((l) => l.id);
}
