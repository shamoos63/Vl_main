import { NextRequest, NextResponse } from 'next/server'
import { ensurePropertyDldUrlColumn } from '@/lib/db/migrations'

export async function GET(_request: NextRequest) {
  try {
    await ensurePropertyDldUrlColumn()
    return NextResponse.json({ success: true, message: 'DLD URL column ensured' })
  } catch (error) {
    console.error('Error ensuring DLD URL column:', error)
    return NextResponse.json({ success: false, error: 'Migration failed' }, { status: 500 })
  }
}


