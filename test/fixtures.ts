import type { Listing } from '@/lib/types';

export const sampleListing: Listing = {
  id: 'he-0001',
  title: '3 BHK Apartment in Powai',
  description: 'A lovely home.\n\nWith two paragraphs.',
  propertyType: 'apartment',
  listingType: 'sale',
  price: 12_500_000,
  beds: 3,
  baths: 3,
  area: 1450,
  city: 'Mumbai',
  community: 'Powai',
  address: '12 Hill Road, Powai, Mumbai',
  lat: 19.12,
  lng: 72.9,
  images: ['https://picsum.photos/seed/he-1/800/600'],
  agent: { name: 'Asha Rao', agency: 'Acme Realtors', phone: '+91 90000 00000' },
  amenities: ['Gym', 'Lift'],
  furnished: true,
  createdAt: new Date().toISOString(),
};
