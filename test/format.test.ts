import {
  formatArea,
  formatBeds,
  formatCompactPrice,
  formatPrice,
  titleCase,
} from '@/lib/format';

describe('formatters', () => {
  it('formats sale price in INR', () => {
    const out = formatPrice({ price: 12_500_000, listingType: 'sale' });
    expect(out).toContain('₹');
    expect(out).toContain('1,25,00,000'); // Indian digit grouping
  });

  it('suffixes rent with /mo', () => {
    expect(formatPrice({ price: 55_000, listingType: 'rent' })).toMatch(/\/mo$/);
  });

  it('formats compact price as lakh / crore', () => {
    expect(formatCompactPrice(4_500_000)).toBe('₹45.0 L');
    expect(formatCompactPrice(23_000_000)).toBe('₹2.30 Cr');
    expect(formatCompactPrice(50_000)).toBe('₹50,000');
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
