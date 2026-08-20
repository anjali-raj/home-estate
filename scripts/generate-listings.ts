/**
 * Generates a deterministic set of mock listings into src/data/listings.json.
 * Run with: pnpm data:generate
 *
 * Deterministic seed => stable data across runs, so committed JSON only changes
 * when we intend it to.
 */
import { faker } from '@faker-js/faker';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  LISTING_TYPES,
  PROPERTY_TYPES,
  type Listing,
  type PropertyType,
} from '../src/lib/types.ts';

faker.seed(20260821);

const COUNT = 220;

const CITIES: { city: string; communities: string[] }[] = [
  { city: 'Dubai', communities: ['Dubai Marina', 'Downtown', 'JVC', 'Business Bay', 'Palm Jumeirah'] },
  { city: 'Abu Dhabi', communities: ['Al Reem Island', 'Yas Island', 'Saadiyat', 'Al Raha Beach'] },
  { city: 'Sharjah', communities: ['Al Majaz', 'Al Khan', 'Aljada', 'Muwaileh'] },
];

const AMENITIES = [
  'Balcony', 'Shared Pool', 'Gym', 'Covered Parking', 'Central A/C',
  'Built-in Wardrobes', 'Security', 'Concierge', "Maid's Room", 'Pets Allowed',
  'Sea View', 'Kitchen Appliances',
];

// Beds range per property type keeps data plausible.
const BEDS_BY_TYPE: Record<PropertyType, [number, number]> = {
  studio: [0, 0],
  apartment: [1, 4],
  townhouse: [2, 5],
  villa: [3, 7],
  penthouse: [3, 6],
};

const AREA_BY_TYPE: Record<PropertyType, [number, number]> = {
  studio: [350, 600],
  apartment: [600, 2200],
  townhouse: [1800, 3800],
  villa: [3000, 9000],
  penthouse: [2500, 6000],
};

function makeListing(i: number): Listing {
  const propertyType = faker.helpers.arrayElement(PROPERTY_TYPES);
  const listingType = faker.helpers.arrayElement(LISTING_TYPES);
  const { city, communities } = faker.helpers.arrayElement(CITIES);
  const community = faker.helpers.arrayElement(communities);

  const [minBeds, maxBeds] = BEDS_BY_TYPE[propertyType];
  const beds = faker.number.int({ min: minBeds, max: maxBeds });
  const baths = Math.max(1, beds || 1);

  const [minArea, maxArea] = AREA_BY_TYPE[propertyType];
  const area = faker.number.int({ min: minArea, max: maxArea });

  // Price scales with area; rent is roughly ~7% of sale price per year, monthly.
  const salePrice = Math.round((area * faker.number.int({ min: 900, max: 2600 })) / 1000) * 1000;
  const price =
    listingType === 'sale'
      ? salePrice
      : Math.round((salePrice * 0.07) / 12 / 500) * 500;

  const title =
    propertyType === 'studio'
      ? `Studio in ${community}`
      : `${beds} BR ${propertyType} in ${community}`;

  return {
    id: `pf-${String(i + 1).padStart(4, '0')}`,
    title,
    description: faker.lorem.paragraphs({ min: 2, max: 3 }, '\n\n'),
    propertyType,
    listingType,
    price,
    beds,
    baths,
    area,
    city,
    community,
    address: `${faker.location.streetAddress()}, ${community}, ${city}`,
    lat: faker.location.latitude({ min: 24.3, max: 25.4 }),
    lng: faker.location.longitude({ min: 54.3, max: 55.6 }),
    images: Array.from({ length: faker.number.int({ min: 3, max: 6 }) }, (_, k) =>
      // picsum: stable per id+index, no API key, works offline-ish in dev
      `https://picsum.photos/seed/${i + 1}-${k}/800/600`,
    ),
    agent: {
      name: faker.person.fullName(),
      agency: `${faker.company.name()} Real Estate`,
      phone: faker.phone.number({ style: 'international' }),
    },
    amenities: faker.helpers.arrayElements(AMENITIES, { min: 3, max: 8 }),
    furnished: faker.datatype.boolean(),
    createdAt: faker.date.recent({ days: 60 }).toISOString(),
  };
}

const listings = Array.from({ length: COUNT }, (_, i) => makeListing(i));

const outPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'listings.json');
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(listings, null, 2));

console.log(`Wrote ${listings.length} listings to ${outPath}`);
