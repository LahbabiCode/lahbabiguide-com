import { NextResponse } from 'next/server';
import { getAdPlacements } from '@/lib/db/queries';

export async function GET() {
  const ads = await getAdPlacements();
  return NextResponse.json(ads, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
