import { NextResponse } from 'next/server';
import { getListingById } from '@/lib/listings-repo';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const listing = getListingById(id);

  if (!listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
  }

  return NextResponse.json(listing);
}
