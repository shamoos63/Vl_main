"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Bed, Bath, Square, Eye, X, Maximize2, Minimize2, Home } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import Link from "next/link"
// Note: Static properties import removed - properties should be passed as props from parent component
import Script from "next/script"
import PropertyImage from "./property-image"

interface OpenStreetMapProps {
  selectedProperty?: number | null
  onPropertySelect?: (id: number | null) => void
  className?: string
  height?: string
}

// Property coordinates for Dubai locations
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
  className = "",
  height = "600px",
}: OpenStreetMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const markerClusterRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [leafletLoaded, setLeafletLoaded] = useState(false)
  const [markerClusterLoaded, setMarkerClusterLoaded] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedPropertyData, setSelectedPropertyData] = useState<any>(null)
  const { t, isRTL } = useI18n()

  // Check if both scripts are loaded
  const scriptsLoaded = leafletLoaded && markerClusterLoaded

  // Initialize map after scripts are loaded
  useEffect(() => {
    if (!scriptsLoaded || !mapRef.current || leafletMapRef.current) return

    // Safety check to ensure Leaflet is available
    if (typeof window === "undefined" || !window.L) {
      console.error("Leaflet library not loaded")
      return
    }

    try {
      // Create map instance
      const map = window.L.map(mapRef.current, {
        center: [25.2048, 55.2708], // Dubai center
        zoom: 11,
        zoomControl: false, // We'll add custom zoom control
      })

      // Add OpenStreetMap tiles
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)

      // Add zoom control to top-right
      window.L.control.zoom({ position: "topright" }).addTo(map)

      // Store map reference
      leafletMapRef.current = map

      // Add property markers
      addPropertyMarkers()

      setIsLoaded(true)
    } catch (error) {
      console.error("Error initializing map:", error)
    }

    // Cleanup on unmount
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }
    }
  }, [scriptsLoaded])

  // Add property markers with clustering
  const addPropertyMarkers = useCallback(() => {
    if (!scriptsLoaded || !leafletMapRef.current || typeof window === "undefined" || !window.L) return

    try {
      // Clear existing markers
      if (markerClusterRef.current) {
        markerClusterRef.current.clearLayers()
      }

      // Create marker cluster group
      const markerCluster = window.L.markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 40,
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

      // Add markers for each property
      properties.forEach((property) => {
        const coordinates = propertyCoordinates[property.location] || { lat: 25.2048, lng: 55.2708 }

        // Create custom icon
        const isSelected = selectedProperty === property.id
        const icon = window.L.divIcon({
          className: "custom-marker",
          html: `<div class="marker-pin ${isSelected ? "selected" : ""}"></div>`,
          iconSize: [30, 42],
          iconAnchor: [15, 42],
        })

        // Create marker
        const marker = window.L.marker([coordinates.lat, coordinates.lng], { icon })

        // Add popup
        marker.bindPopup(
          () => {
            const popupContent = document.createElement("div")
            popupContent.className = "property-popup"
            popupContent.innerHTML = `
            <h3>${property.title}</h3>
            <p class="location"><span class="icon">📍</span> ${property.location}</p>
            <div class="details">
              <span>🛏️ ${property.bedrooms}</span>
              <span>🚿 ${property.bathrooms}</span>
              <span>📐 ${property.area}</span>
            </div>
            <div class="price-status">
              <span class="price">${property.price}</span>
              <span class="status ${property.status === "Ready" ? "ready" : "offplan"}">${
                property.status === "Ready" ? t("properties.status.ready") : t("properties.status.offplan")
              }</span>
            </div>
          `

            // Add view details button
            const viewButton = document.createElement("button")
            viewButton.className = "view-details-btn"
            viewButton.textContent = t("properties.view.details")
            viewButton.onclick = (e) => {
              e.stopPropagation()
              handleMarkerClick(property)
            }
            popupContent.appendChild(viewButton)

            return popupContent
          },
          {
            closeButton: true,
            className: "property-popup-container",
          },
        )

        // Add click handler
        marker.on("click", () => {
          handleMarkerClick(property)
        })

        // Add to cluster
        markerCluster.addLayer(marker)
        markersRef.current.push(marker)
      })

      // Add cluster to map
      leafletMapRef.current.addLayer(markerCluster)
      markerClusterRef.current = markerCluster

      // If a property is selected, find and open its popup
      if (selectedProperty) {
        const property = properties.find((p) => p.id === selectedProperty)
        if (property) {
          const coordinates = propertyCoordinates[property.location] || { lat: 25.2048, lng: 55.2708 }
          leafletMapRef.current.setView([coordinates.lat, coordinates.lng], 15)
        }
      }
    } catch (error) {
      console.error("Error adding property markers:", error)
    }
  }, [selectedProperty, t, scriptsLoaded])

  // Handle marker click
  const handleMarkerClick = useCallback(
    (property: any) => {
      // Ensure we have a valid image or use placeholder
      const propertyWithImage = {
        ...property,
        image:
          property.image && property.image.startsWith("/")
            ? property.image
            : `/placeholder.svg?height=160&width=320&text=${encodeURIComponent(property.title)}`,
      }
      setSelectedPropertyData(propertyWithImage)
      onPropertySelect?.(property.id)

      // Center map on property
      const coordinates = propertyCoordinates[property.location] || { lat: 25.2048, lng: 55.2708 }
      if (leafletMapRef.current) {
        leafletMapRef.current.setView([coordinates.lat, coordinates.lng], 15)
      }
    },
    [onPropertySelect],
  )

  // Update markers when selected property changes
  useEffect(() => {
    if (leafletMapRef.current && scriptsLoaded) {
      addPropertyMarkers()
    }
  }, [selectedProperty, addPropertyMarkers, scriptsLoaded])

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    // Trigger map resize after fullscreen toggle
    setTimeout(() => {
      if (leafletMapRef.current) {
        leafletMapRef.current.invalidateSize()
      }
    }, 100)
  }

  // Handle escape key for fullscreen
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

  // Handle script loading errors
  const handleScriptError = () => {
    console.error("Failed to load map script")
  }

  return (
    <>
      {/* Load Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin="anonymous"
      />

      {/* Load Leaflet MarkerCluster CSS */}
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

      {/* Load Leaflet JS */}
      <Script
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        crossOrigin="anonymous"
        onLoad={() => setLeafletLoaded(true)}
        onError={handleScriptError}
        strategy="beforeInteractive"
      />

      {/* Load Leaflet MarkerCluster JS */}
      <Script
        src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js"
        crossOrigin="anonymous"
        onLoad={() => setMarkerClusterLoaded(true)}
        onError={handleScriptError}
        strategy="beforeInteractive"
      />

      {/* Custom styles for markers and clusters */}
      <style jsx global>{`
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
        
        .marker-cluster {
          background-color: rgba(30, 58, 138, 0.6);
          border: 2px solid #ffffff;
          border-radius: 50%;
          color: #ffffff;
          text-align: center;
          font-weight: bold;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .marker-cluster div {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: rgba(30, 58, 138, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .marker-cluster-large {
          background-color: rgba(251, 191, 36, 0.6);
        }
        
        .marker-cluster-large div {
          background-color: rgba(251, 191, 36, 0.8);
          color: #1e3a8a;
        }
        
        .property-popup-container {
          min-width: 200px;
        }
        
        .property-popup {
          padding: 5px;
        }
        
        .property-popup h3 {
          margin: 0 0 5px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1e3a8a;
        }
        
        .property-popup .location {
          margin: 0 0 5px 0;
          font-size: 14px;
          color: #666;
          display: flex;
          align-items: center;
        }
        
        .property-popup .icon {
          margin-right: 5px;
        }
        
        .property-popup .details {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          font-size: 14px;
          color: #666;
        }
        
        .property-popup .price-status {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        
        .property-popup .price {
          font-size: 16px;
          font-weight: bold;
          color: #fbbf24;
        }
        
        .property-popup .status {
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          color: white;
        }
        
        .property-popup .status.ready {
          background-color: #10b981;
        }
        
        .property-popup .status.offplan {
          background-color: #3b82f6;
        }
        
        .property-popup .view-details-btn {
          width: 100%;
          padding: 6px 12px;
          background-color: #1e3a8a;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .property-popup .view-details-btn:hover {
          background-color: #1e40af;
        }
      `}</style>

      <div
        className={`relative bg-white rounded-lg overflow-hidden border transition-all duration-300 ${
          isFullscreen ? "fixed inset-0 z-50 rounded-none border-0" : ""
        } ${className}`}
        style={{ height: isFullscreen ? "100vh" : height }}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Map Container */}
        <div ref={mapRef} className="w-full h-full" />

        {/* Loading State */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vl-blue mx-auto mb-4"></div>
              <p className="text-gray-600">{t("common.loading")}</p>
            </div>
          </div>
        )}

        {/* Map Controls */}
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

        {/* Property Count */}
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

        {/* Legend */}
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

        {/* Property Details Card */}
        {selectedPropertyData && (
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
