"use client"

import { useState, useEffect } from "react"
import OpenStreetMap from "./open-street-map"

interface MapWrapperProps {
  selectedProperty?: number | null
  onPropertySelect?: (id: number | null) => void
  className?: string
  height?: string
}

export default function MapWrapper(props: MapWrapperProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div
        className={`bg-gray-100 rounded-lg flex items-center justify-center ${props.className}`}
        style={{ height: props.height || "600px" }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vl-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }

  return <OpenStreetMap {...props} />
}
