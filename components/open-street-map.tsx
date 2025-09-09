"use client"
import { useEffect, useRef, useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Bed, Bath, Square, Eye, X, Maximize2, Minimize2, Home } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import Link from "next/link"
import Script from "next/script"
import PropertyImage from "./property-image"

interface OpenStreetMapProps {
  selectedProperty?: number | null
  onPropertySelect?: (id: number | null) => void
  onSetInterest?: (property: any) => void
  className?: string
  height?: string
  properties?: any[]
  showHeatmap?: boolean
  hideInlineDetails?: boolean
}

const propertyCoordinates: { [key: string]: { lat: number; lng: number } } = {
  "Dubai Marina": { lat: 25.0772, lng: 55.1392 },
  "Downtown Dubai": { lat: 25.1972, lng: 55.2744 },
  "Palm Jumeirah": { lat: 25.1124, lng: 55.139 },
  "Business Bay": { lat: 25.1877, lng: 55.2633 },
  "Jumeirah Village Circle": { lat: 25.0515, lng: 55.2065 },
  "Dubai Maritime City": { lat: 25.2285, lng: 55.2761 },
  "Jumeirah Beach Residence": { lat: 25.0785, lng: 55.133 },
  "Dubai Hills Estate": { lat: 25.1107, lng: 55.2441 },
}

export default function OpenStreetMap({
  selectedProperty,
  onPropertySelect,
  onSetInterest,
  className = "",
  height = "600px",
  properties = [],
  showHeatmap = true,
  hideInlineDetails = false,
}: OpenStreetMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const markerClusterRef = useRef<any>(null)
  const heatLayerRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [leafletLoaded, setLeafletLoaded] = useState(false)
  const [markerClusterLoaded, setMarkerClusterLoaded] = useState(false)
  const [heatLoaded, setHeatLoaded] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedPropertyData, setSelectedPropertyData] = useState<any>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImages, setLightboxImages] = useState<string[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [lightboxZoom, setLightboxZoom] = useState(1)
  const selectedMarkerRef = useRef<any>(null)
  const { t, isRTL } = useI18n()

  const scriptsLoaded = leafletLoaded && markerClusterLoaded

  useEffect(() => {
    if (!scriptsLoaded || !mapRef.current || leafletMapRef.current) return
    if (typeof window === "undefined" || !window.L) {
      console.error("Leaflet library not loaded")
      return
    }

    try {
      const map = window.L.map(mapRef.current, {
        center: [25.2048, 55.2708],
        zoom: 11,
        zoomControl: false,
      })

      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)

      window.L.control.zoom({ position: "topright" }).addTo(map)
      leafletMapRef.current = map

      map.on('popupclose', () => {
        setLightboxOpen(false)
        setLightboxImages([])
        setLightboxIndex(0)
        setLightboxZoom(1)
        try {
          const prev = selectedMarkerRef.current
          const pin = prev?._icon?.querySelector?.('.marker-pin')
          if (pin) pin.classList.remove('selected')
          prev?.setZIndexOffset?.(0)
          selectedMarkerRef.current = null
        } catch {}
      })

      addPropertyMarkers()

      if (showHeatmap && (window as any).L?.heatLayer) {
        addOrUpdateHeatLayer()
      }

      setIsLoaded(true)
    } catch (error) {
      console.error("Error initializing map:", error)
    }

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }
    }
  }, [scriptsLoaded])

  const extractImages = useCallback((details: any): string[] => {
    const urls: string[] = []
    const pushArr = (arr: any[]) => { if (Array.isArray(arr)) arr.forEach((x: any) => { if (x?.url && typeof x.url === 'string') urls.push(x.url) }) }
    pushArr(details?.architecture)
    pushArr(details?.interior)
    pushArr(details?.lobby)
    pushArr(details?.master_plan)
    if (urls.length === 0 && Array.isArray(details?.unit_blocks)) {
      details.unit_blocks.forEach((u: any) => {
        if (typeof u?.typical_unit_image_url === 'string' && u.typical_unit_image_url.startsWith('[')) {
          try {
            const arr = JSON.parse(u.typical_unit_image_url)
            if (Array.isArray(arr)) arr.forEach((o: any) => { if (o?.url) urls.push(o.url) })
          } catch {}
        }
      })
    }
    return urls
  }, [])

  const loadAndShowDetails = useCallback(async (property: any, marker: any) => {
    try {
      setLightboxOpen(false)
      setLightboxImages([])
      setLightboxIndex(0)
      setLightboxZoom(1)
      onPropertySelect?.(property.id)

      const loadingEl = document.createElement('div')
      loadingEl.className = 'property-popup'
      loadingEl.innerHTML = `
        <div class="popup-title">${property.title}</div>
        <div class="text-sm text-gray-600">Loading details…</div>
      `
      const popup = marker.getPopup?.() || (window as any).L.popup({
        className: 'property-popup-container small',
        maxWidth: 380,
        minWidth: 280,
        autoPan: true,
        closeButton: true,
        offset: (window as any).L.point(0, -20),
      })
      popup.setContent(loadingEl)
      marker.bindPopup(popup).openPopup()

      try {
        const prev = selectedMarkerRef.current
        const pinPrev = prev?._icon?.querySelector?.('.marker-pin')
        if (pinPrev) pinPrev.classList.remove('selected')
        prev?.setZIndexOffset?.(0)
      } catch {}
      try {
        const pin = marker?._icon?.querySelector?.('.marker-pin')
        if (pin) pin.classList.add('selected')
        marker.setZIndexOffset?.(1000)
        selectedMarkerRef.current = marker
      } catch {}

      const res = await fetch(`/api/reelly/property/${property.id}`, { cache: 'no-store' })
      const json = await res.json()
      if (!json?.success) return
      const d = json.data
      const images = extractImages(d)
      setLightboxImages(images)

      const popupContent = document.createElement('div')
      popupContent.className = 'property-popup'

      const priceText = (() => {
        const p = Number(d?.min_price)
        return Number.isFinite(p)
          ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(p)
          : ''
      })()

      const cover = images[0]

      popupContent.innerHTML = `
        ${cover ? `<img class="popup-cover" src="${cover}" alt="${d?.name || 'Cover'}" />` : ''}
        <div class="popup-title">${d?.name || 'Property details'}</div>
        <div class="popup-sub text-sm">${d?.developer_data?.name || ''}${d?.area ? (d?.developer_data?.name ? ' • ' : '') + d.area : ''}</div>
        <div class="popup-price">${priceText}</div>
        ${d?.overview ? `<div class="popup-desc clamp" id="popup-desc">${d.overview}</div><button class="popup-readmore">Read more</button>` : ''}
        <div class="popup-actions">
          <button class="view-details-btn" id="popup-interest">${t('property.contact')}</button>
        </div>
      `
      if (cover) {
        const img = popupContent.querySelector('.popup-cover') as HTMLImageElement | null
        if (img) {
          img.addEventListener('click', (e) => {
            e.stopPropagation()
            setLightboxIndex(0)
            setLightboxZoom(1)
            setLightboxOpen(true)
          })
        }
      }

      const readBtn = popupContent.querySelector('.popup-readmore') as HTMLButtonElement | null
      if (readBtn) {
        readBtn.addEventListener('click', (e) => {
          e.stopPropagation()
          const el = popupContent.querySelector('#popup-desc') as HTMLElement | null
          if (!el) return
          const expanded = el.classList.toggle('expanded')
          readBtn.textContent = expanded ? 'Show less' : 'Read more'
          if (expanded) {
            // When expanded, ensure popup scrolls to show the text
            try {
              el.style.maxHeight = '220px'
              el.style.overflow = 'auto'
              const popupContainer = (popupContent.parentElement as HTMLElement) // leaflet-popup-content
              popupContainer?.scrollTo?.({ top: popupContainer.scrollHeight, behavior: 'smooth' })
            } catch {}
          } else {
            el.style.maxHeight = ''
            el.style.overflow = ''
          }
        })
      }

      const interestBtn = popupContent.querySelector('#popup-interest') as HTMLButtonElement | null
      if (interestBtn) {
        interestBtn.addEventListener('click', (e) => {
          e.stopPropagation()
          if (onSetInterest) onSetInterest(property)
        })
      }

      popup.setContent(popupContent)
    } catch (e) {
      // ignore
    }
  }, [extractImages, onPropertySelect, onSetInterest, t])

  const addPropertyMarkers = useCallback(() => {
    if (!scriptsLoaded || !leafletMapRef.current || typeof window === "undefined" || !window.L) return

    try {
      if (markerClusterRef.current) {
        markerClusterRef.current.clearLayers()
      }

      const markerCluster = window.L.markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 40,
        zoomToBoundsOnClick: false,
        spiderfyOnEveryClick: false,
        spiderfyOnMaxZoom: true,
        disableClusteringAtZoom: 14,
        chunkedLoading: true,
        iconCreateFunction: (cluster) => {
          const count = cluster.getChildCount()
          let size, className

          if (count < 10) {
            size = "small"
            className = "marker-cluster-small"
          } else if (count < 20) {
            size = "medium"
            className = "marker-cluster-medium"
          } else {
            size = "large"
            className = "marker-cluster-large"
          }

          return window.L.divIcon({
            html: `<div><span>${count}</span></div>`,
            className: `marker-cluster ${className}`,
            iconSize: window.L.point(40, 40),
          })
        },
      })

      properties.forEach((property) => {
        const coordinates = propertyCoordinates[property.location] || { lat: 25.2048, lng: 55.2708 }
        const lat = typeof property.lat === 'number' ? property.lat : (typeof property.latitude === 'number' ? property.latitude : coordinates.lat)
        const lng = typeof property.lng === 'number' ? property.lng : (typeof property.longitude === 'number' ? property.longitude : coordinates.lng)

        const isSelected = false
        const icon = window.L.divIcon({
          className: "custom-marker",
          html: `<div class="marker-pin ${isSelected ? "selected" : ""}"></div>`,
          iconSize: [30, 42],
          iconAnchor: [15, 42],
        })

        if (typeof lat !== 'number' || typeof lng !== 'number') {
          return
        }
        
        const marker = window.L.marker([lat, lng], { icon })
        ;(marker as any).__property = property

        
        marker.on("click", () => {
          loadAndShowDetails(property, marker)
        })

        markerCluster.addLayer(marker)
        markersRef.current.push(marker)
      })

      // Handle cluster click: zoom to show a chosen child, then open it
      markerCluster.on('clusterclick', (e: any) => {
        try {
          e?.originalEvent?.preventDefault?.()
          e?.originalEvent?.stopPropagation?.()
          const latlng = e?.latlng
          const children: any[] = e.layer.getAllChildMarkers?.() || []
          if (children.length > 0) {
            let chosen = children[0]
            if (latlng && typeof window !== 'undefined') {
              let best = Number.POSITIVE_INFINITY
              for (const m of children) {
                const ll = m.getLatLng?.()
                if (ll) {
                  const d = Math.hypot((ll.lat - latlng.lat), (ll.lng - latlng.lng))
                  if (d < best) { best = d; chosen = m }
                }
              }
            }
            const p = (chosen as any).__property
            if (p) {
              markerCluster.zoomToShowLayer(chosen, () => {
                // After zoom/spiderfy finishes, open chosen marker's details
                loadAndShowDetails(p, chosen)
              })
            }
          }
        } catch {}
      })

      leafletMapRef.current.addLayer(markerCluster)
      markerClusterRef.current = markerCluster
    } catch (error) {
      console.error("Error adding property markers:", error)
    }
  }, [t, scriptsLoaded, properties, onSetInterest, loadAndShowDetails])

  const addOrUpdateHeatLayer = useCallback(() => {
    if (!leafletMapRef.current || !(window as any).L?.heatLayer) return
    try {
      const points: [number, number, number][] = []
      const prices = properties
        .map((p) => (typeof p.price === 'number' ? p.price : parseFloat((p.price || '').toString().replace(/[^0-9.-]+/g, '') || '0')))
        .filter((v) => v > 0)
      const maxPrice = prices.length ? Math.max(...prices) : 1

      properties.forEach((p) => {
        const lat = p.lat ?? p.latitude
        const lng = p.lng ?? p.longitude
        if (typeof lat === 'number' && typeof lng === 'number') {
          const price = typeof p.price === 'number' ? p.price : parseFloat((p.price || '').toString().replace(/[^0-9.-]+/g, '') || '0')
          const intensity = Math.min(1, price / (maxPrice || 1)) || 0.2
          points.push([lat, lng, intensity])
        }
      })

      if (heatLayerRef.current) {
        heatLayerRef.current.setLatLngs(points)
      } else {
        heatLayerRef.current = (window as any).L.heatLayer(points, { radius: 25, blur: 20, minOpacity: 0.2 })
        leafletMapRef.current.addLayer(heatLayerRef.current)
      }
    } catch (e) {
      console.error('Error adding heat layer', e)
    }
  }, [properties])

  const handleMarkerClick = useCallback(
    (property: any) => {
      const propertyWithImage = {
        ...property,
        image:
          property.image && property.image.startsWith("/")
            ? property.image
            : `/placeholder.svg?height=160&width=320&text=${encodeURIComponent(property.title)}`,
      }
      setSelectedPropertyData(propertyWithImage)
      onPropertySelect?.(property.id)

      const coordinates = propertyCoordinates[property.location] || { lat: 25.2048, lng: 55.2708 }
      if (leafletMapRef.current) {
        leafletMapRef.current.setView([coordinates.lat, coordinates.lng], 15)
      }
    },
    [onPropertySelect],
  )

  useEffect(() => {
    if (leafletMapRef.current && scriptsLoaded) {
      addPropertyMarkers()
      if (showHeatmap && (window as any).L?.heatLayer) addOrUpdateHeatLayer()
    }
  }, [addPropertyMarkers, scriptsLoaded, addOrUpdateHeatLayer, showHeatmap])

  useEffect(() => {
    if (!leafletMapRef.current) return
    if (showHeatmap && heatLoaded && (window as any).L?.heatLayer) {
      addOrUpdateHeatLayer()
    }
  }, [heatLoaded, showHeatmap, addOrUpdateHeatLayer])

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    setTimeout(() => {
      if (leafletMapRef.current) {
        leafletMapRef.current.invalidateSize()
      }
    }, 100)
  }

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    window.addEventListener("keydown", handleEscKey)
    return () => {
      window.removeEventListener("keydown", handleEscKey)
    }
  }, [isFullscreen])

  const handleScriptError = () => {
    console.error("Failed to load map script")
  }

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css"
        crossOrigin="anonymous"
      />
      <Script
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        crossOrigin="anonymous"
        onLoad={() => setLeafletLoaded(true)}
        onError={handleScriptError}
        strategy="afterInteractive"
      />
      <Script
        src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js"
        crossOrigin="anonymous"
        onLoad={() => setMarkerClusterLoaded(true)}
        onError={handleScriptError}
        strategy="afterInteractive"
      />
      {showHeatmap && (
        <Script
          src="https://unpkg.com/leaflet.heat/dist/leaflet-heat.js"
          crossOrigin="anonymous"
          onLoad={() => setHeatLoaded(true)}
          onError={handleScriptError}
          strategy="afterInteractive"
        />
      )}
      <style jsx global>{`
        .leaflet-pane, .leaflet-top, .leaflet-bottom { z-index: 1000; }
        .leaflet-popup-pane { z-index: 1005; }
        .leaflet-marker-pane { z-index: 1006; }
        .leaflet-tooltip-pane { z-index: 1007; }
        .leaflet-overlay-pane { z-index: 1002; }
        .custom-marker {
          background: transparent;
          border: none;
        }
        .marker-pin {
          width: 30px;
          height: 30px;
          border-radius: 50% 50% 50% 0;
          background: #1e3a8a;
          position: absolute;
          transform: rotate(-45deg);
          left: 50%;
          top: 50%;
          margin: -20px 0 0 -15px;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        }
        .marker-pin.selected {
          background: #fbbf24;
        }
        .marker-pin::after {
          content: '';
          width: 14px;
          height: 14px;
          margin: 6px 0 0 6px;
          background: #fff;
          position: absolute;
          border-radius: 50%;
        }
        /* Refined cluster styling */
        .marker-cluster { background: transparent; }
        .marker-cluster div {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0b1220 0%, #18253d 100%);
          border: 2px solid rgba(255,255,255,0.8);
          color: #fbbf24;
          font-weight: 800;
          box-shadow: 0 6px 16px rgba(0,0,0,0.35);
        }
        .marker-cluster-small div { width: 32px; height: 32px; }
        .marker-cluster-medium div { width: 38px; height: 38px; }
        .marker-cluster-large div { width: 44px; height: 44px; }
        .leaflet-popup-content-wrapper.property-popup-container,
        .property-popup-container {
          min-width: 260px;
          max-width: 360px;
          background: transparent !important;
          box-shadow: none;
        }
        .leaflet-popup-content .property-popup,
        .property-popup {
          padding: 20px;
          color: #f3f4f6;
          background: rgba(10, 10, 10, 0.85);
          border-radius: 16px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .property-popup .popup-title {
          margin: 0 0 8px 0;
          font-size: 20px;
          font-weight: 700;
          color: #fbbf24;
          text-align: left;
        }
        .property-popup .popup-sub {
          color: #a0a0a0;
          font-size: 14px;
          margin-bottom: 12px;
        }
        .property-popup .location {
          margin: 0 0 10px 0;
          font-size: 14px;
          color: #e5e7eb;
          display: flex;
          align-items: center;
          text-align: left;
        }
        .property-popup .icon {
          margin-right: 8px;
          color: #fbbf24;
        }
        .property-popup .popup-cover {
          width: 100%;
          height: 160px;
          object-fit: cover;
          border-radius: 12px;
          cursor: zoom-in;
          margin-bottom: 15px;
        }
        .property-popup .details {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          font-size: 14px;
          color: #e5e7eb;
        }
        .property-popup .details > div {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .property-popup .price-status {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        .property-popup .price,
        .property-popup .price-vl {
          font-size: 24px;
          font-weight: 800;
          color: #fbbf24 !important;
        }
        .property-popup .status {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          color: #111827;
        }
        .property-popup .status.ready {
          background-color: #34d399;
        }
        .property-popup .status.offplan {
          background-color: #60a5fa;
        }
        .property-popup .view-details-btn {
          width: 100%;
          padding: 12px;
          background-color: #ffffff;
          color: #111827;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease, color 0.3s ease;
        }
        .property-popup .view-details-btn:hover {
          background-color: #f3f4f6;
        }
        .property-popup .view-details-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background-color: #e5e7eb;
        }
        .property-popup .popup-desc.clamp {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          color: #d1d5db;
          font-size: 14px;
          margin-bottom: 15px;
        }
        .property-popup .popup-desc.expanded {
          -webkit-line-clamp: initial;
          overflow: auto;
          max-height: 220px;
        }
      `}</style>
      <div
        className={`relative bg-white rounded-lg overflow-visible border transition-all duration-300 ${
          isFullscreen ? "fixed inset-0 z-50 rounded-none border-0" : ""
        } ${className}`}
        style={{ height: isFullscreen ? "100vh" : height }}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div ref={mapRef} className="w-full h-full" />
        {lightboxOpen && lightboxImages.length > 0 && (
          <div className="fixed inset-0 z-[1002] bg-black/80 flex items-center justify-center" onClick={() => { setLightboxOpen(false); setLightboxZoom(1) }}>
            <button className="absolute left-6 top-1/2 -translate-y-1/2 text-white text-3xl" onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => (i - 1 + lightboxImages.length) % lightboxImages.length); setLightboxZoom(1) }}>{'‹'}</button>
            <img
              src={lightboxImages[lightboxIndex]}
              alt="Photo"
              className="max-h-[90vh] max-w-[90vw] object-contain rounded shadow-2xl"
              style={{ transform: `scale(${lightboxZoom})`, transition: 'transform 0.2s ease' }}
              onClick={(e) => {
                e.stopPropagation()
                setLightboxZoom((z) => (z >= 2 ? 1 : z + 0.25))
              }}
            />
            <button className="absolute right-6 top-1/2 -translate-y-1/2 text-white text-3xl" onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => (i + 1) % lightboxImages.length); setLightboxZoom(1) }}>{'›'}</button>
            <button className="absolute top-6 right-6 text-white text-2xl" onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); setLightboxZoom(1) }}>✕</button>
          </div>
        )}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vl-blue mx-auto mb-4"></div>
              <p className="text-gray-600">{t("common.loading")}</p>
            </div>
          </div>
        )}
        <div className={`absolute top-4 ${isRTL ? "left-16" : "right-16"} flex flex-col gap-2 z-[1000]`}>
          <Button
            variant="outline"
            size="sm"
            className="bg-white/90 hover:bg-white h-10 text-vl-blue border-vl-blue/20 hover:border-vl-blue/40"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
        <div
          className={`absolute top-4 ${isRTL ? "right-4" : "left-4"} bg-white/90 rounded-lg px-3 py-2 text-sm font-medium shadow-md z-[1000]`}
        >
          <div className="flex items-center gap-2">
            <Home className="h-4 w-4 text-vl-blue" />
            <span className="text-vl-blue">
              {properties.length} {t("map.properties.found")}
            </span>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 bg-white/90 rounded-lg p-3 text-sm shadow-md z-[1000]">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-vl-blue border border-white"></div>
            <span className="text-vl-blue">{t("map.available.properties")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-vl-yellow border border-white"></div>
            <span className="text-vl-blue">{t("map.selected.property")}</span>
          </div>
        </div>
        {!hideInlineDetails && selectedPropertyData && (
          <div className="absolute bottom-4 right-4 w-80 max-w-[calc(100vw-2rem)] md:block hidden z-[1000]">
            <Card className="bg-white shadow-xl">
              <div className="relative">
                <PropertyImage
                  src={selectedPropertyData.image}
                  alt={selectedPropertyData.title}
                  width={320}
                  height={160}
                  className="w-full h-40 object-cover rounded-t-lg"
                  fallbackText="Property Image"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white text-vl-blue"
                  onClick={() => {
                    setSelectedPropertyData(null)
                    onPropertySelect?.(null)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="absolute top-2 left-2 flex gap-2">
                  <Badge
                    className={`${selectedPropertyData.status === "Ready" ? "bg-green-500" : "bg-blue-500"} text-white`}
                  >
                    {selectedPropertyData.status === "Ready"
                      ? t("properties.status.ready")
                      : t("properties.status.offplan")}
                  </Badge>
                  {selectedPropertyData.featured && (
                    <Badge className="bg-vl-yellow text-vl-blue">{t("properties.status.featured")}</Badge>
                  )}
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-vl-blue">{selectedPropertyData.title}</h3>
                  <div className="text-xl font-bold text-vl-yellow">{selectedPropertyData.price}</div>
                </div>
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{selectedPropertyData.location}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    <span>{selectedPropertyData.bedrooms}</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    <span>{selectedPropertyData.bathrooms}</span>
                  </div>
                  <div className="flex items-center">
                    <Square className="h-4 w-4 mr-1" />
                    <span>{selectedPropertyData.area}</span>
                  </div>
                </div>
                <Link href={`/properties/${selectedPropertyData.id}`}>
                  <Button className="w-full bg-vl-blue hover:bg-vl-blue-dark text-white">
                    <Eye className="h-4 w-4 mr-2" />
                    {t("properties.view.details")}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  )
}