import Link from 'next/link';
import { PROPERTY_TYPE_LABELS, type Listing } from '@/lib/types';
import { formatArea, formatBeds, formatPrice, relativeDate, titleCase } from '@/lib/format';
import { FavouriteButton } from './favourite-button';
import { CardCarousel } from './card-carousel';

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition hover:shadow-lg">
      {/* Media + controls live outside the link so buttons/carousel are valid,
          focusable interactive elements. */}
      <div className="relative">
        <CardCarousel images={listing.images} alt={listing.title} />
        <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-fg">
          For {titleCase(listing.listingType)}
        </span>
        <FavouriteButton id={listing.id} className="absolute right-3 top-3 z-10" />
      </div>

      <Link
        href={`/listings/${listing.id}`}
        className="flex flex-1 flex-col p-4 focus-visible:outline-none"
      >
        <p className="text-lg font-bold text-primary">{formatPrice(listing)}</p>
        <h3 className="mt-1 line-clamp-1 font-semibold group-hover:text-primary">
          {listing.title}
        </h3>
        <p className="mt-0.5 line-clamp-1 text-sm text-muted">
          {listing.community}, {listing.city}
        </p>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
          <span>{formatBeds(listing.beds)}</span>
          <span>{listing.baths} Bath{listing.baths > 1 ? 's' : ''}</span>
          <span>{formatArea(listing.area)}</span>
        </div>

        <p className="mt-auto pt-3 text-xs text-muted">
          {PROPERTY_TYPE_LABELS[listing.propertyType]} · Listed {relativeDate(listing.createdAt)}
        </p>
      </Link>
    </article>
  );
}
