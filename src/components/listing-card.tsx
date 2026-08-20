import Image from 'next/image';
import Link from 'next/link';
import type { Listing } from '@/lib/types';
import { formatArea, formatBeds, formatPrice, relativeDate, titleCase } from '@/lib/format';
import { FavouriteButton } from './favourite-button';

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-border">
        <Image
          src={listing.images[0]}
          alt={listing.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-fg">
          For {titleCase(listing.listingType)}
        </span>
        <FavouriteButton id={listing.id} className="absolute right-3 top-3" />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-lg font-bold text-primary">{formatPrice(listing)}</p>
        <h3 className="mt-1 line-clamp-1 font-semibold">{listing.title}</h3>
        <p className="mt-0.5 line-clamp-1 text-sm text-muted">
          {listing.community}, {listing.city}
        </p>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
          <span>{formatBeds(listing.beds)}</span>
          <span>{listing.baths} Bath{listing.baths > 1 ? 's' : ''}</span>
          <span>{formatArea(listing.area)}</span>
        </div>

        <p className="mt-auto pt-3 text-xs text-muted">
          {titleCase(listing.propertyType)} · Listed {relativeDate(listing.createdAt)}
        </p>
      </div>
    </Link>
  );
}
