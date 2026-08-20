import { NextRequest, NextResponse } from 'next/server';
import { queryListings } from '@/lib/listings-repo';
import { searchParamsSchema } from '@/lib/types';

export async function GET(req: NextRequest) {
  const raw = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = searchParamsSchema.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid query parameters', issues: parsed.error.issues },
      { status: 400 },
    );
  }

  // Simulate a little network latency so loading states are real.
  await new Promise((r) => setTimeout(r, 150));

  const data = queryListings(parsed.data);
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'public, max-age=0, s-maxage=60' },
  });
}
