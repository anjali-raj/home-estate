import { NextRequest, NextResponse } from 'next/server';
import { getListingById } from '@/lib/listings-repo';

/** Resolve a set of ids to full listings, preserving the requested order. */
export async function GET(req: NextRequest) {
  const idsParam = req.nextUrl.searchParams.get('ids') ?? '';
  const ids = idsParam.split(',').map((s) => s.trim()).filter(Boolean);

  const results = ids
    .map((id) => getListingById(id))
    .filter((l): l is NonNullable<typeof l> => Boolean(l));

  return NextResponse.json({ results });
}
