import type { Listing } from './types';

const currency = new Intl.NumberFormat('en-AE', {
  style: 'currency',
  currency: 'AED',
  maximumFractionDigits: 0,
});

const compact = new Intl.NumberFormat('en-AE', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

export function formatPrice(listing: Pick<Listing, 'price' | 'listingType'>): string {
  const base = currency.format(listing.price);
  return listing.listingType === 'rent' ? `${base}/mo` : base;
}

export function formatCompactPrice(value: number): string {
  return `AED ${compact.format(value)}`;
}

export function formatArea(sqft: number): string {
  return `${new Intl.NumberFormat('en-AE').format(sqft)} sqft`;
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
