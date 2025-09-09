import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://search-listings-production.up.railway.app/v1/properties';

function getReellyApiKey(): string | null {
  // Support hyphenated env var name via bracket access
  const fromHyphen = process.env["Reely_x-api-key"] || process.env["REELY_X_API_KEY"];
  return (
    fromHyphen ||
    // Fallbacks provided earlier by the user
    process.env.RELLY_API ||
    process.env.RELLY_API_KEY ||
    null
  );
}

export async function GET(request: NextRequest) {
  try {
    const apiKey = getReellyApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'Missing Reelly API key. Set Reely_x-api-key (or RELLY_API) in environment.' },
        { status: 500 },
      );
    }

    const { searchParams } = new URL(request.url);

    // Default to Dubai bounding box if not provided
    const params = new URLSearchParams(searchParams);
    if (!params.has('bbox_sw_lat')) params.set('bbox_sw_lat', '24.9500');
    if (!params.has('bbox_sw_lng')) params.set('bbox_sw_lng', '55.0000');
    if (!params.has('bbox_ne_lat')) params.set('bbox_ne_lat', '25.4500');
    if (!params.has('bbox_ne_lng')) params.set('bbox_ne_lng', '55.6500');
    if (!params.has('per_page')) params.set('per_page', '50');

    const url = `${BASE_URL}?${params.toString()}`;

    const upstream = await fetch(url, {
      headers: {
        'X-api-key': apiKey,
        'Accept': 'application/json',
      },
      // Disable Next caching for live data
      cache: 'no-store',
    });

    if (!upstream.ok) {
      const errorBody = await upstream.text();
      return NextResponse.json(
        { success: false, error: `Upstream error ${upstream.status}`, details: errorBody },
        { status: upstream.status },
      );
    }

    const data = await upstream.json();
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}


