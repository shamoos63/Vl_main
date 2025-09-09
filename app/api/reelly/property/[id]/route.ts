import { NextRequest, NextResponse } from 'next/server'
// Use dynamic import to avoid ESM/TS parsing during build step
const reellyPromise = import('@api/reelly').then(m => m.default)

function getApiKey(): string | null {
  return (
    process.env["Reely_x-api-key"] ||
    process.env.RELLY_API ||
    process.env.RELLY_API_KEY ||
    null
  )
}

export async function GET(_req: NextRequest, context: { params: { id: string } }) {
  try {
    const key = getApiKey()
    if (!key) return NextResponse.json({ success: false, error: 'Missing Reelly API key' }, { status: 500 })

    const { id: idParam } = context.params
    const id = Number(idParam)
    if (!id || Number.isNaN(id)) return NextResponse.json({ success: false, error: 'Invalid id' }, { status: 400 })

    const reelly = await reellyPromise
    reelly.auth(key)

    // Use the generated SDK method for property details
    const res: any = await (reelly as any).getPropertiesProperty_id({
      property_id: id,
      preferred_currency: 'AED',
      preferred_area_unit: 'sqft',
    })

    const raw = res?.data || {}

    // Normalize response to what the UI expects
    const unitBlocks = Array.isArray(raw.unit_blocks) ? raw.unit_blocks : []
    const minUnitPrice = unitBlocks
      .map((u: any) => Number(u?.units_price_from))
      .filter((n: number) => Number.isFinite(n))
      .sort((a: number, b: number) => a - b)[0]

    const normalized = {
      ...raw,
      cover: raw.cover_image_url ? { url: raw.cover_image_url } : undefined,
      developer_data: {
        name: raw.developer || undefined,
        website: raw.developer_website || raw.website || undefined,
      },
      min_price: Number.isFinite(minUnitPrice) ? minUnitPrice : undefined,
      price_currency: raw.price_currency || unitBlocks?.[0]?.price_currency || 'AED',
    }

    return NextResponse.json({ success: true, data: normalized })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    )
  }
}


