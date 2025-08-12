"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Bed, Bath, Square, X, Maximize2, Minimize2, Navigation, Layers, Filter } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { useFilters } from "@/contexts/filter-context"
import OpenStreetMap from "./open-street-map"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PropertyMapProps {
  selectedProperty?: number | null
  onPropertySelect?: (id: number | null) => void
  className?: string
}

export default function PropertyMap({ selectedProperty, onPropertySelect, className }: PropertyMapProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedPropertyData, setSelectedPropertyData] = useState<any>(null)
  const [mapStyle, setMapStyle] = useState("default")
  const [showFilters, setShowFilters] = useState(false)
  const { t, isRTL } = useI18n()
  const { filteredProperties, selectedProperty: contextSelectedProperty, setSelectedProperty } = useFilters()

  // Use context selected property if no prop is provided
  const currentSelectedProperty = selectedProperty ?? contextSelectedProperty

  useEffect(() => {
    if (currentSelectedProperty) {
      const property = filteredProperties.find((p) => p.id === currentSelectedProperty)
      setSelectedPropertyData(property)
    } else {
      setSelectedPropertyData(null)
    }
  }, [currentSelectedProperty, filteredProperties])

  const handlePropertyClick = useCallback(
    (property: any) => {
      setSelectedPropertyData(property)
      if (onPropertySelect) {
        onPropertySelect(property.id)
      } else {
        setSelectedProperty(property.id)
      }
    },
    [onPropertySelect, setSelectedProperty],
  )

  const closePropertyDetails = useCallback(() => {
    setSelectedPropertyData(null)
    if (onPropertySelect) {
      onPropertySelect(null)
    } else {
      setSelectedProperty(null)
    }
  }, [onPropertySelect, setSelectedProperty])

  const formatPrice = (price: string | number): string => {
    if (typeof price === "string") return price
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const mapStyleOptions = [
    { value: "default", label: t("map.style.default") || "Default" },
    { value: "satellite", label: t("map.style.satellite") || "Satellite" },
    { value: "terrain", label: t("map.style.terrain") || "Terrain" },
  ]

  return (
    <TooltipProvider>
      <div className={`relative bg-white rounded-lg overflow-hidden shadow-lg ${className}`}>
        {/* Map Container */}
        <div className={`relative ${isFullscreen ? "fixed inset-0 z-50" : "h-[600px]"}`}>
          <OpenStreetMap
            selectedProperty={currentSelectedProperty}
            onPropertySelect={handlePropertyClick}
            height={isFullscreen ? "100vh" : "600px"}
            className="w-full"
            properties={filteredProperties}
          />

          {/* Map Controls */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            {/* Fullscreen Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="bg-white/90 hover:bg-white backdrop-blur-sm"
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isFullscreen ? t("map.minimize") || "Minimize" : t("map.fullscreen") || "Fullscreen"}
              </TooltipContent>
            </Tooltip>

            {/* Map Style Selector */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-white/90 hover:bg-white backdrop-blur-sm"
                >
                  <Layers className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("map.layers") || "Map Layers"}</TooltipContent>
            </Tooltip>

            {/* Center Map */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/90 hover:bg-white backdrop-blur-sm"
                  onClick={() => {
                    // Center map on filtered properties
                    console.log("Center map on properties")
                  }}
                >
                  <Navigation className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("map.center") || "Center Map"}</TooltipContent>
            </Tooltip>
          </div>

          {/* Map Style Panel */}
          {showFilters && (
            <div className="absolute top-4 right-20 z-50 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg transform translate-y-0">
              <div className="space-y-3">
                <h4 className="font-medium text-sm">{t("map.style.title") || "Map Style"}</h4>
                <Select value={mapStyle} onValueChange={setMapStyle}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mapStyleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)} className="w-full">
                  {t("common.close") || "Close"}
                </Button>
              </div>
            </div>
          )}

          {/* Property Details Card */}
          {selectedPropertyData && (
            <div className="absolute bottom-4 left-4 right-4 md:left-4 md:right-auto md:w-96 z-10">
              <Card className="bg-white shadow-xl border-0">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-vl-blue line-clamp-1">{selectedPropertyData.title}</h3>
                    <Button variant="ghost" size="sm" onClick={closePropertyDetails} className="h-6 w-6 p-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="text-sm line-clamp-1">{selectedPropertyData.location}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                    <div className="flex flex-col items-center">
                      <Bed className="h-4 w-4 text-vl-blue mb-1" />
                      <span className="text-sm font-medium">{selectedPropertyData.bedrooms}</span>
                      <span className="text-xs text-gray-500">{t("property.bedrooms") || "Beds"}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Bath className="h-4 w-4 text-vl-blue mb-1" />
                      <span className="text-sm font-medium">{selectedPropertyData.bathrooms}</span>
                      <span className="text-xs text-gray-500">{t("property.bathrooms") || "Baths"}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Square className="h-4 w-4 text-vl-blue mb-1" />
                      <span className="text-sm font-medium">
                        {selectedPropertyData.squareFeet
                          ? `${selectedPropertyData.squareFeet.toLocaleString()}`
                          : selectedPropertyData.area || "N/A"}
                      </span>
                      <span className="text-xs text-gray-500">{t("property.sqft") || "Sq Ft"}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xl font-bold text-vl-yellow">{formatPrice(selectedPropertyData.price)}</div>
                    <Badge
                      className={`${
                        selectedPropertyData.status === "Ready"
                          ? "bg-green-500"
                          : selectedPropertyData.status === "Off-plan"
                            ? "bg-blue-500"
                            : "bg-purple-500"
                      } text-white`}
                    >
                      {selectedPropertyData.status === "Ready"
                        ? t("properties.status.ready") || "Ready"
                        : selectedPropertyData.status === "Off-plan"
                          ? t("properties.status.offplan") || "Off-plan"
                          : selectedPropertyData.status}
                    </Badge>
                  </div>

                  {/* Property Highlights */}
                  {selectedPropertyData.highlights && selectedPropertyData.highlights.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {selectedPropertyData.highlights.slice(0, 2).map((highlight: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-vl-blue/10 text-vl-blue">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-vl-blue hover:bg-vl-blue-dark text-white"
                      onClick={() => window.open(`/properties/${selectedPropertyData.id}`, "_blank")}
                    >
                      {t("properties.view.details") || "View Details"}
                    </Button>
                    <Button
                      variant="outline"
                      className="border-vl-blue text-vl-blue hover:bg-vl-blue hover:text-white"
                      onClick={() => {
                        // Handle contact action
                        console.log("Contact about property:", selectedPropertyData.id)
                      }}
                    >
                      {t("property.contact") || "Contact"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-sm shadow-lg">
            <h4 className="font-medium mb-2">{t("map.legend") || "Legend"}</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-vl-blue"></div>
                <span>{t("properties.map.available") || "Available"}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-vl-yellow"></div>
                <span>{t("properties.map.selected") || "Selected"}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>{t("properties.map.featured") || "Featured"}</span>
              </div>
            </div>
          </div>

          {/* Property Count */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm font-medium shadow-lg">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-vl-blue" />
              <span>
                {filteredProperties.length} {t("properties.map.properties") || "Properties"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
