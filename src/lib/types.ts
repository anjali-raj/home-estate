import { z } from 'zod';

export const PROPERTY_TYPES = [
  'apartment',
  'villa',
  'townhouse',
  'penthouse',
  'studio',
] as const;

export const LISTING_TYPES = ['sale', 'rent'] as const;

export const SORT_OPTIONS = [
  'newest',
  'price-asc',
  'price-desc',
  'beds-desc',
  'area-desc',
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];
export type ListingType = (typeof LISTING_TYPES)[number];
export type SortOption = (typeof SORT_OPTIONS)[number];

export const listingSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  propertyType: z.enum(PROPERTY_TYPES),
  listingType: z.enum(LISTING_TYPES),
  price: z.number().int().positive(),
  /** monthly for rent, absolute for sale */
  beds: z.number().int().min(0),
  baths: z.number().int().min(1),
  /** built-up area in sqft */
  area: z.number().int().positive(),
  city: z.string(),
  community: z.string(),
  address: z.string(),
  lat: z.number(),
  lng: z.number(),
  images: z.array(z.string()).min(1),
  agent: z.object({
    name: z.string(),
    agency: z.string(),
    phone: z.string(),
  }),
  amenities: z.array(z.string()),
  furnished: z.boolean(),
  createdAt: z.string(), // ISO date
});

export type Listing = z.infer<typeof listingSchema>;

/** Query parameters that drive faceted search. All optional. */
export const searchParamsSchema = z.object({
  q: z.string().trim().optional(),
  city: z.string().optional(),
  listingType: z.enum(LISTING_TYPES).optional(),
  propertyType: z.enum(PROPERTY_TYPES).optional(),
  minPrice: z.coerce.number().int().nonnegative().optional(),
  maxPrice: z.coerce.number().int().positive().optional(),
  minBeds: z.coerce.number().int().min(0).optional(),
  minBaths: z.coerce.number().int().min(1).optional(),
  furnished: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  sort: z.enum(SORT_OPTIONS).default('newest'),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(48).default(12),
});

export type SearchParams = z.infer<typeof searchParamsSchema>;

export type ListingsResponse = {
  results: Listing[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  facets: {
    cities: { value: string; count: number }[];
    priceRange: { min: number; max: number };
  };
};
