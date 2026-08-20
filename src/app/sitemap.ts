import type { MetadataRoute } from 'next';
import { getListingIds } from '@/lib/listings-repo';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/favourites`, changeFrequency: 'weekly', priority: 0.3 },
    { url: `${SITE_URL}/saved-searches`, changeFrequency: 'weekly', priority: 0.3 },
  ];

  const listingPages: MetadataRoute.Sitemap = getListingIds().map((id) => ({
    url: `${SITE_URL}/listings/${id}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticPages, ...listingPages];
}
