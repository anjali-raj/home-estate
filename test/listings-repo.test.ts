import { queryListings, getListingById } from '@/lib/listings-repo';
import { searchParamsSchema } from '@/lib/types';

/** Helper: parse raw params the way the API route does. */
const parse = (raw: Record<string, string>) => searchParamsSchema.parse(raw);

describe('queryListings', () => {
  it('returns a full first page by default', () => {
    const res = queryListings(parse({}));
    expect(res.results.length).toBe(12);
    expect(res.page).toBe(1);
    expect(res.total).toBeGreaterThan(100);
  });

  it('filters by city', () => {
    const res = queryListings(parse({ city: 'Mumbai', pageSize: '48' }));
    expect(res.results.every((l) => l.city === 'Mumbai')).toBe(true);
    expect(res.total).toBe(
      res.facets.cities.find((c) => c.value === 'Mumbai')!.count,
    );
  });

  it('respects a price range', () => {
    const res = queryListings(
      parse({ minPrice: '30000', maxPrice: '80000', pageSize: '48' }),
    );
    expect(res.total).toBeGreaterThan(0);
    expect(
      res.results.every((l) => l.price >= 30_000 && l.price <= 80_000),
    ).toBe(true);
  });

  it('sorts by price ascending', () => {
    const res = queryListings(parse({ sort: 'price-asc', pageSize: '48' }));
    const prices = res.results.map((l) => l.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it('paginates without overlap and clamps out-of-range pages', () => {
    const p1 = queryListings(parse({ page: '1', pageSize: '10' }));
    const p2 = queryListings(parse({ page: '2', pageSize: '10' }));
    const overlap = p1.results.filter((a) =>
      p2.results.some((b) => b.id === a.id),
    );
    expect(overlap).toHaveLength(0);

    const beyond = queryListings(parse({ page: '9999', pageSize: '10' }));
    expect(beyond.page).toBe(beyond.totalPages);
  });

  it('combines filters (AND semantics)', () => {
    const res = queryListings(
      parse({ city: 'Mumbai', listingType: 'rent', minBeds: '2', pageSize: '48' }),
    );
    expect(
      res.results.every(
        (l) => l.city === 'Mumbai' && l.listingType === 'rent' && l.beds >= 2,
      ),
    ).toBe(true);
  });

  it('computes stable facets over the whole dataset regardless of filters', () => {
    const all = queryListings(parse({}));
    const filtered = queryListings(parse({ city: 'Mumbai' }));
    expect(filtered.facets.cities).toEqual(all.facets.cities);
    expect(filtered.facets.priceRange).toEqual(all.facets.priceRange);
  });
});

describe('getListingById', () => {
  it('finds a known listing', () => {
    expect(getListingById('pf-0001')?.id).toBe('pf-0001');
  });
  it('returns undefined for an unknown id', () => {
    expect(getListingById('nope')).toBeUndefined();
  });
});
