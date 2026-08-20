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
  PROPERTY_TYPE_LABELS,
  PROPERTY_TYPES,
  type Listing,
  type PropertyType,
} from '../src/lib/types.ts';

faker.seed(20260821);

const COUNT = 220;

// Indian metros with representative localities and an approximate centre so
// generated coordinates land in the right region.
const CITIES: {
  city: string;
  communities: string[];
  center: [number, number];
}[] = [
  {
    city: 'Mumbai',
    communities: ['Bandra West', 'Andheri East', 'Powai', 'Worli', 'Juhu'],
    center: [19.076, 72.8777],
  },
  {
    city: 'Bengaluru',
    communities: ['Whitefield', 'Koramangala', 'Indiranagar', 'HSR Layout', 'Electronic City'],
    center: [12.9716, 77.5946],
  },
  {
    city: 'Delhi',
    communities: ['Dwarka', 'Saket', 'Vasant Kunj', 'Rohini', 'Greater Kailash'],
    center: [28.6139, 77.209],
  },
  {
    city: 'Pune',
    communities: ['Kothrud', 'Hinjewadi', 'Baner', 'Viman Nagar', 'Wakad'],
    center: [18.5204, 73.8567],
  },
  {
    city: 'Gurugram',
    communities: ['DLF Phase 1', 'Sohna Road', 'Golf Course Road', 'Sector 56', 'Nirvana Country'],
    center: [28.4595, 77.0266],
  },
];

// Curated, verified Unsplash photos (interiors for flats, facades for houses).
const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=70`;

// Categorised by visual inspection (see contact sheet).
const INTERIOR_PHOTOS = [
  '1600607687939-ce8a6c25118c', // living room
  '1600566753086-00f18fb6b3ea', // living room
  '1600210492486-724fe5c67fb0', // living room
  '1600566752355-35792bedcfea', // bathroom
  '1600585152220-90363fe7e115', // kitchen
  '1560448204-e02f11c3d0e2', // living room
  '1522708323590-d24dbb6b0267', // open-plan living/dining
  '1502672260266-1c1ef2d93688', // cosy sitting area
  '1615529182904-14819c35db37', // living room
  '1502005229762-cf1b2da7c5d6', // staircase / interior
  '1493809842364-78817add7ffb', // living room
].map(img);

const EXTERIOR_PHOTOS = [
  '1600585154340-be6161a56a0c', // modern house at dusk
  '1600047509807-ba8f99d2cdde', // modern house facade
  '1583608205776-bfd35f0d9f83', // suburban house
  '1512917774080-9991f1c4c750', // house with pool
  '1568605114967-8130f3a36994', // A-frame house
  '1570129477492-45c003edd2be', // suburban house
  '1580587771525-78b9dba3b914', // modern villa with pool
].map(img);

const HOUSE_TYPES: PropertyType[] = ['villa', 'independent-house'];

const AMENITIES = [
  'Balcony', 'Swimming Pool', 'Gym', 'Covered Parking', 'Power Backup',
  'Modular Kitchen', '24x7 Security', 'Clubhouse', 'Servant Room', 'Pet Friendly',
  'Vaastu Compliant', 'Piped Gas', "Children's Play Area", 'Lift',
];

// Beds range per property type keeps data plausible.
const BEDS_BY_TYPE: Record<PropertyType, [number, number]> = {
  studio: [0, 0],
  apartment: [1, 4],
  'builder-floor': [2, 4],
  'independent-house': [2, 5],
  villa: [3, 6],
  penthouse: [3, 5],
};

const AREA_BY_TYPE: Record<PropertyType, [number, number]> = {
  studio: [350, 600],
  apartment: [500, 2000],
  'builder-floor': [900, 2400],
  'independent-house': [1200, 3500],
  villa: [2500, 6000],
  penthouse: [2200, 5000],
};

function makeListing(i: number): Listing {
  const propertyType = faker.helpers.arrayElement(PROPERTY_TYPES);
  const listingType = faker.helpers.arrayElement(LISTING_TYPES);
  const { city, communities, center } = faker.helpers.arrayElement(CITIES);
  const community = faker.helpers.arrayElement(communities);

  const [minBeds, maxBeds] = BEDS_BY_TYPE[propertyType];
  const beds = faker.number.int({ min: minBeds, max: maxBeds });
  const baths = Math.max(1, beds || 1);

  const [minArea, maxArea] = AREA_BY_TYPE[propertyType];
  const area = faker.number.int({ min: minArea, max: maxArea });

  // INR pricing: sale = area (sqft) x local rate/sqft, rounded to the nearest
  // ₹50k. Rent (monthly) is ~3% annual gross yield on the sale value.
  const ratePerSqft = faker.number.int({ min: 5_000, max: 22_000 });
  const salePrice = Math.round((area * ratePerSqft) / 50_000) * 50_000;
  const price =
    listingType === 'sale'
      ? salePrice
      : Math.round((salePrice * 0.03) / 12 / 500) * 500;

  const typeLabel = PROPERTY_TYPE_LABELS[propertyType];
  const title =
    propertyType === 'studio'
      ? `Studio Apartment in ${community}`
      : `${beds} BHK ${typeLabel} in ${community}`;

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
    // Jitter around the city centre so points cluster realistically.
    lat: center[0] + faker.number.float({ min: -0.08, max: 0.08 }),
    lng: center[1] + faker.number.float({ min: -0.08, max: 0.08 }),
    // Houses lead with a facade shot, flats with an interior; the gallery then
    // mixes both so every listing shows rooms and (where relevant) the building.
    images: (() => {
      const isHouse = HOUSE_TYPES.includes(propertyType);
      const hero = faker.helpers.arrayElement(
        isHouse ? EXTERIOR_PHOTOS : INTERIOR_PHOTOS,
      );
      const rest = faker.helpers.arrayElements(
        [...INTERIOR_PHOTOS, ...EXTERIOR_PHOTOS].filter((u) => u !== hero),
        faker.number.int({ min: 3, max: 5 }),
      );
      return [hero, ...rest];
    })(),
    agent: {
      name: faker.person.fullName(),
      agency: `${faker.company.name()} Realtors`,
      phone: `+91 ${faker.string.numeric({ length: 5 })} ${faker.string.numeric({ length: 5 })}`,
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
