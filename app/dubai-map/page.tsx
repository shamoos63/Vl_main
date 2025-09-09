"use client"

import { useEffect, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PropertyContactModal from "@/components/property-contact-modal"
import PropertyMapFilters, { type PropertyFilters } from "@/components/property-map-filters"

// Load our Leaflet implementation dynamically to avoid SSR issues
const OpenStreetMap = dynamic(() => import("@/components/open-street-map"), { ssr: false })

interface ApiProperty { [key: string]: any }

function extractLatLng(p: ApiProperty): { lat?: number; lng?: number } {
  const n = (v: any) => (typeof v === 'number' && isFinite(v) ? v : undefined)
  let lat = n(p.latitude) ?? n(p.lat)
  let lng = n(p.longitude) ?? n(p.lng) ?? n(p.lon)

  // Common nested shapes
  lat = lat ?? n(p?.coordinates?.lat) ?? n(p?.location?.lat) ?? n(p?.geo?.lat) ?? n(p?.project?.lat)
  lng = lng ?? n(p?.coordinates?.lng) ?? n(p?.location?.lng) ?? n(p?.geo?.lng) ?? n(p?.project?.lng)

  // GeoJSON-like: geometry.coordinates [lng, lat]
  const arr = p?.geometry?.coordinates || p?.point?.coordinates || p?.location?.coordinates || p?.coordinates
  if (Array.isArray(arr) && arr.length >= 2) {
    const [maybeLng, maybeLat] = arr
    lat = lat ?? n(maybeLat)
    lng = lng ?? n(maybeLng)
  }

  return { lat, lng }
}

function toMapItem(p: ApiProperty) {
  const { lat, lng } = extractLatLng(p)
  return {
    id: typeof p.id === "string" ? parseInt(p.id) || Math.random() : (p.id as number) ?? Math.random(),
    title: p.title || p.name || "Property",
    price: p.price ?? "",
    bedrooms: p.bedrooms ?? undefined,
    bathrooms: p.bathrooms ?? undefined,
    area: p.area ?? undefined,
    location: p.location?.name || p.location || p.area?.name || "Dubai",
    lat,
    lng,
    image: p.photoUrl || p.images?.[0]?.url || "/placeholder.svg?height=160&width=320&text=Property",
    status: p.status || "For Sale",
  }
}

export default function DubaiMapPage() {
  const [properties, setProperties] = useState<any[]>([])
  const [apiItems, setApiItems] = useState<ApiProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null)
  const [interestOpen, setInterestOpen] = useState(false)
  const [expandedDetails, setExpandedDetails] = useState<Record<number, any>>({})

  // Simple quick filters
  const [bedrooms, setBedrooms] = useState<string>("any")
  const [minPrice, setMinPrice] = useState<string>("")
  const [maxPrice, setMaxPrice] = useState<string>("")

  // Advanced panel model aligned with PropertyMapFilters
  const [filters, setFilters] = useState<PropertyFilters>({
    propertyTypes: [],
    priceRange: [0, 100000000],
    status: [],
    bedrooms: null,
    bathrooms: null,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Use official markers endpoint; it returns { markers: [...] }
        // Forward filter params, mapping bedrooms to Reelly's unit_bedrooms
        const qp = new URLSearchParams()
        if (bedrooms !== "any") qp.set('unit_bedrooms', bedrooms)
        if (minPrice) qp.set('unit_price_from', minPrice)
        if (maxPrice) qp.set('unit_price_to', maxPrice)
        const res = await fetch(`/api/reelly/markers?${qp.toString()}`, { cache: "no-store" })
        const json = await res.json()
        if (!json.success) throw new Error(json.error || "Failed to fetch markers")

        const arr: ApiProperty[] = Array.isArray(json.data?.markers) ? json.data.markers : []
        const mapped = arr.map((m) => {
          // coordinates comes as "lat, lng" string
          let lat: number | undefined
          let lng: number | undefined
          if (typeof m.coordinates === 'string') {
            const parts = m.coordinates.split(',').map((s: string) => parseFloat(s.trim()))
            if (parts.length >= 2 && isFinite(parts[0]) && isFinite(parts[1])) {
              lat = parts[0]
              lng = parts[1]
            }
          }
          return {
            id: m.id,
            title: m.name,
            price: m.min_price,
            bedrooms: m.bedrooms,
            bathrooms: m.bathrooms,
            area: m.area,
            location: m.area || "Dubai",
            lat,
            lng,
            image: (() => {
              // Prefer typical_unit_image_url if available (may be a JSON string of array)
              try {
                if (typeof m.typical_unit_image_url === 'string' && m.typical_unit_image_url.startsWith('[')) {
                  const arr = JSON.parse(m.typical_unit_image_url)
                  const first = Array.isArray(arr) ? arr[0] : null
                  if (first?.url) return first.url
                }
              } catch {}
              try {
                if (typeof m.cover_image_url === 'string' && m.cover_image_url.startsWith('{')) {
                  const obj = JSON.parse(m.cover_image_url)
                  if (obj?.url) return obj.url
                }
              } catch {}
              return "/placeholder.svg?height=160&width=320&text=Property"
            })(),
            status: m.status || m.sale_status || "For Sale",
          }
        })
        setApiItems(arr)
        setProperties(mapped)
      } catch (e: any) {
        setError(e?.message || "Unknown error")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [bedrooms, minPrice, maxPrice])

  const activeFiltersCount = useMemo(() => {
    let c = 0
    if (filters.propertyTypes.length) c++
    if (filters.status.length) c++
    if (filters.bedrooms != null) c++
    if (filters.bathrooms != null) c++
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000000) c++
    return c
  }, [filters])

  return (
    <div className="px-4 md:px-8 py-6 space-y-4">
    

      {error && <div className="text-red-600">{error}</div>}

      <OpenStreetMap
        selectedProperty={selectedProperty}
        onPropertySelect={(id) => { setSelectedProperty(id) }}
        onSetInterest={(p) => { setSelectedProperty(p?.id ?? null); setInterestOpen(true); }}
        className="w-full"
        height="70vh"
        properties={properties}
        showHeatmap
        hideInlineDetails
      />

      {selectedProperty != null && (
        <PropertyContactModal
          isOpen={interestOpen}
          onClose={() => setInterestOpen(false)}
          // @ts-ignore ensure shape: reuse map item converted to PropertyContactModal type via minimal fields
          property={properties.find((p) => p.id === selectedProperty) ?? { id: selectedProperty, title: "Property", price: "" }}
        />
      )}

   
    </div>
  )



}