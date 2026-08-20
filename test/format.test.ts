import { describe, expect, it } from 'vitest';
import { formatArea, formatBeds, formatPrice, titleCase } from '@/lib/format';

describe('formatters', () => {
  it('formats sale vs rent price', () => {
    expect(formatPrice({ price: 1_200_000, listingType: 'sale' })).toContain(
      '1,200,000',
    );
    expect(formatPrice({ price: 8000, listingType: 'rent' })).toMatch(/\/mo$/);
  });

  it('labels studios and pluralises beds', () => {
    expect(formatBeds(0)).toBe('Studio');
    expect(formatBeds(1)).toBe('1 Bed');
    expect(formatBeds(3)).toBe('3 Beds');
  });

  it('formats area with unit', () => {
    expect(formatArea(1500)).toBe('1,500 sqft');
  });

  it('title-cases', () => {
    expect(titleCase('villa')).toBe('Villa');
  });
});
