import { NextRequest, NextResponse } from 'next/server'
import reelly from '@api/reelly'

function getApiKey(): string | null {
  return (
    process.env["Reely_x-api-key"] ||
    process.env.RELLY_API ||
    process.env.RELLY_API_KEY ||
    null
  )
}

export async function GET(request: NextRequest) {
  try {
    const key = getApiKey()
    if (!key) {
      return NextResponse.json({ success: false, error: 'Missing Reelly API key' }, { status: 500 })
    }

    reelly.auth(key)
    // Forward query params (e.g., unit_bedrooms, unit_price_from, unit_price_to, etc.)
    const searchParams = Object.fromEntries(new URL(request.url).searchParams.entries()) as Record<string, string>
    const { data } = await (reelly as any).getPropertyMarkers?.(searchParams) ?? await (reelly as any).getPropertyMarkers()
    return NextResponse.json({ success: true, data })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    )
  }
}


