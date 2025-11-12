import { Suspense } from "react"
import type { Metadata } from "next"
import PropertyDetailsClient from "./property-details-client"
import LoadingFallback from "./loading-fallback"
import { headers } from "next/headers"

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const h = await headers()
    const host = h.get('x-forwarded-host') || h.get('host')
    const proto = h.get('x-forwarded-proto') || 'http'
    const baseUrl = `${proto}://${host}`

    const res = await fetch(`${baseUrl}/api/properties/${id}`, { cache: 'no-store' })
    if (res.ok) {
      const json = await res.json()
      const property = json?.data
      if (property) {
        return {
          title: `${property.title} | VL Real Estate`,
          description: property.description || "Detailed information about this luxury property in Dubai",
        }
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
  }

  return {
    title: `Property Details - ${id} | VL Real Estate`,
    description: "Detailed information about this luxury property in Dubai",
  }
}

export default async function PropertyDetailsPage({ params }: Props) {
  const { id } = await params;

  let property = null as any
  let error = null as string | null

  try {
    const h = await headers()
    const host = h.get('x-forwarded-host') || h.get('host')
    const proto = h.get('x-forwarded-proto') || 'http'
    const baseUrl = `${proto}://${host}`

    const res = await fetch(`${baseUrl}/api/properties/${id}`, { cache: 'no-store' })
    if (res.ok) {
      const json = await res.json()
      if (json?.success) {
        property = json.data
      } else {
        error = json?.error || 'Failed to load property'
      }
    } else if (res.status === 404) {
      error = 'Property not found'
    } else {
      error = 'Failed to fetch property'
    }
  } catch (err) {
    console.error('❌ Error loading property details:', err)
    error = err instanceof Error ? err.message : 'Unknown error'
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <PropertyDetailsClient propertyId={id} initialProperty={property} error={error} />
    </Suspense>
  )
}
