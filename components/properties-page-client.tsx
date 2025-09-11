"use client"

import { FilterProvider } from "@/contexts/filter-context"
import PropertyListings from "@/components/property-listings"
import PropertyFiltersPanel from "@/components/property-filters-panel"
import PropertyMap from "@/components/property-map"
import { Button } from "@/components/ui/button"
import { Map, Grid } from "lucide-react"
import { useFilters } from "@/contexts/filter-context"
import type { Property } from "@/lib/properties-data"

interface PropertiesPageClientProps {
  properties: Property[]
}

function PropertiesContent() {
  const { viewMode, setViewMode, selectedProperty, setSelectedProperty } = useFilters()

  return (
    <>
      {/* Filters Panel */}
      <section className="py-6 bg-transparent">
        <div className="container mx-auto px-4">
          <PropertyFiltersPanel />
        </div>
      </section>

      {/* View Toggle */}
      <section className="py-8 bg-transparent">
        <div className="container mx-auto px-4">
        {/*  <div className="flex justify-center gap-4 mb-8">
               <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              onClick={() => setViewMode("grid")}
              className={
                viewMode === "grid"
                  ? "bg-vl-blue text-white hover:bg-vl-blue-dark"
                  : "border-vl-blue text-vl-blue hover:bg-vl-blue-light"
              }
            >

             
              <Grid className="h-4 w-4 mr-2" />
              Grid View
            </Button>
             
            <Button
              variant={viewMode === "map" ? "default" : "outline"}
              onClick={() => setViewMode("map")}
              className={
                viewMode === "map"
                  ? "bg-vl-blue text-white hover:bg-vl-blue-dark"
                  : "border-vl-blue text-vl-blue hover:bg-vl-blue-light"
              }
            >
              <Map className="h-4 w-4 mr-2" />
              Map View
            </Button>
          </div> */}

          {viewMode === "map" ? (
            <div className="max-w-7xl mx-auto">
              <PropertyMap selectedProperty={selectedProperty} onPropertySelect={setSelectedProperty} />
            </div>
          ) : (
            <PropertyListings />
          )}
        </div>
      </section>
    </>
  )
}

export default function PropertiesPageClient({ properties }: PropertiesPageClientProps) {
  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Properties Available</h2>
        <p className="text-gray-500 mb-4">
          There are currently no properties available in our database.
        </p>
        <p className="text-sm text-gray-400">
          Please check back later or contact us for more information.
        </p>
      </div>
    )
  }

  return (
    <FilterProvider initialProperties={properties}>
      <PropertiesContent />
    </FilterProvider>
  )
}