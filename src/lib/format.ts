import type { Listing } from './types';

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export function formatPrice(listing: Pick<Listing, 'price' | 'listingType'>): string {
  const base = currency.format(listing.price);
  return listing.listingType === 'rent' ? `${base}/mo` : base;
}

/** Indian short form: lakh (L) and crore (Cr). */
export function formatCompactPrice(value: number): string {
  if (value >= 1_00_00_000) return `₹${(value / 1_00_00_000).toFixed(2)} Cr`;
  if (value >= 1_00_000) return `₹${(value / 1_00_000).toFixed(1)} L`;
  return `₹${new Intl.NumberFormat('en-IN').format(value)}`;
}

export function formatArea(sqft: number): string {
  return `${new Intl.NumberFormat('en-IN').format(sqft)} sqft`;
}

export function formatBeds(beds: number): string {
  return beds === 0 ? 'Studio' : `${beds} Bed${beds > 1 ? 's' : ''}`;
}

export function relativeDate(iso: string): string {
  const days = Math.round((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  const months = Math.round(days / 30);
  return `${months} month${months > 1 ? 's' : ''} ago`;
}

export function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
