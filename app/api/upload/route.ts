import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File | null
    const expiration = (formData.get('expiration') as string) || '0'

    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const apiKey = process.env.IMG_BB
    if (!apiKey) {
      return NextResponse.json({ error: 'IMG_BB key is not configured' }, { status: 500 })
    }

    const upstream = new FormData()
    // Prefer sending the binary file directly to avoid base64 overhead
    // imgbb accepts multipart file data in the "image" field
    upstream.append('image', file)

    // Optional name for better management on imgbb
    if (formData.get('name')) {
      upstream.append('name', String(formData.get('name')))
    }

    const res = await fetch(`https://api.imgbb.com/1/upload?expiration=${encodeURIComponent(expiration)}&key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        body: upstream,
      }
    )

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      return NextResponse.json({ error: 'imgbb upload failed', details: text }, { status: 502 })
    }

    const data = await res.json()
    // Normalize a compact response for the client while keeping raw for debugging
    const payload = {
      success: data?.success === true,
      status: data?.status,
      url: data?.data?.url ?? null,
      display_url: data?.data?.display_url ?? null,
      url_viewer: data?.data?.url_viewer ?? null,
      delete_url: data?.data?.delete_url ?? null,
      raw: data,
    }

    if (!payload.url) {
      return NextResponse.json({ error: 'imgbb did not return a URL', data }, { status: 502 })
    }

    return NextResponse.json(payload)
  } catch (err: any) {
    return NextResponse.json({ error: 'Unexpected error during upload', details: err?.message || String(err) }, { status: 500 })
  }
}


