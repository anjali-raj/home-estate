import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getListingById, getListingIds } from '@/lib/listings-repo';
import { PROPERTY_TYPE_LABELS } from '@/lib/types';
import {
  formatArea,
  formatBeds,
  formatPrice,
  relativeDate,
  titleCase,
} from '@/lib/format';
import { Gallery } from '@/components/gallery';
import { FavouriteButton } from '@/components/favourite-button';

type Params = { params: Promise<{ id: string }> };

// Pre-render every listing at build time (SSG); great for SEO + TTFB.
export function generateStaticParams() {
  return getListingIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const listing = getListingById(id);
  if (!listing) return { title: 'Listing not found' };

  const title = `${listing.title} — ${formatPrice(listing)}`;
  return {
    title,
    description: listing.description.slice(0, 155),
    openGraph: {
      title,
      description: `${formatBeds(listing.beds)} · ${formatArea(listing.area)} in ${listing.community}, ${listing.city}`,
      images: [listing.images[0]],
      type: 'website',
    },
  };
}

export default async function ListingPage({ params }: Params) {
  const { id } = await params;
  const listing = getListingById(id);
  if (!listing) notFound();

  const stats = [
    { label: 'Type', value: PROPERTY_TYPE_LABELS[listing.propertyType] },
    { label: 'Bedrooms', value: formatBeds(listing.beds) },
    { label: 'Bathrooms', value: String(listing.baths) },
    { label: 'Area', value: formatArea(listing.area) },
    { label: 'Furnishing', value: listing.furnished ? 'Furnished' : 'Unfurnished' },
    { label: 'Listed', value: relativeDate(listing.createdAt) },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <nav className="mb-4 text-sm text-muted">
        <Link href="/" className="hover:text-foreground">Search</Link>
        <span className="mx-2" aria-hidden>/</span>
        <span className="text-foreground">{listing.community}, {listing.city}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <Gallery images={listing.images} alt={listing.title} />

          <section className="mt-6">
            <h2 className="text-lg font-semibold">Description</h2>
            <div className="mt-2 space-y-3 whitespace-pre-line text-muted">
              {listing.description}
            </div>
          </section>

          <section className="mt-6">
            <h2 className="text-lg font-semibold">Amenities</h2>
            <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {listing.amenities.map((a) => (
                <li
                  key={a}
                  className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                >
                  {a}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-primary">
                  For {titleCase(listing.listingType)}
                </span>
                <p className="mt-2 text-2xl font-bold text-primary">
                  {formatPrice(listing)}
                </p>
              </div>
              <FavouriteButton id={listing.id} />
            </div>

            <h1 className="mt-3 text-xl font-semibold">{listing.title}</h1>
            <p className="mt-1 text-sm text-muted">{listing.address}</p>

            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border pt-5 text-sm">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="text-xs uppercase tracking-wide text-muted">
                    {s.label}
                  </dt>
                  <dd className="font-medium">{s.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 border-t border-border pt-5">
              <p className="text-sm font-semibold">{listing.agent.name}</p>
              <p className="text-sm text-muted">{listing.agent.agency}</p>
              <a
                href={`tel:${listing.agent.phone}`}
                className="mt-3 block rounded-lg bg-primary py-2.5 text-center text-sm font-medium text-primary-fg hover:opacity-90"
              >
                Call {listing.agent.phone}
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
