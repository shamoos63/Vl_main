"use client"

import { FilterProvider } from "@/contexts/filter-context"
import PropertyListings from "@/components/property-listings"
import PropertyFiltersPanel from "@/components/property-filters-panel"
import PropertyMap from "@/components/property-map"
import { Button } from "@/components/ui/button"
import { Map, Grid } from "lucide-react"
import { useFilters } from "@/contexts/filter-context"
import type { Property } from "@/lib/properties-data"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PropertiesPageClientProps {
  properties: Property[]
  page?: number
  hasNext?: boolean
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

import Link from "next/link"

export default function PropertiesPageClient({ properties, page = 1, hasNext = false }: PropertiesPageClientProps) {
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
      <div className="container mx-auto px-4 pb-12">
        <div className="mt-6 flex items-center justify-center gap-4">
          {page > 1 ? (
            <Button asChild variant="outline" className="glass border-vl-yellow/40 text-white hover:text-vl-yellow rounded-full px-5">
              <Link href={`/properties?page=${page - 1}`} prefetch={false}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
          ) : (
            <Button variant="outline" disabled className="glass border-white/20 text-gray-400 rounded-full px-5">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}

          <span className="text-sm text-gray-300 px-3 py-2 rounded-full border border-white/10 glass">
            Page {page}
          </span>

          {hasNext ? (
            <Button asChild className="bg-transparent border-2 border-vl-yellow text-white hover:text-vl-yellow rounded-full px-5">
              <Link href={`/properties?page=${page + 1}`} prefetch={false}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          ) : (
            <Button disabled className="bg-transparent border-2 border-white/20 text-gray-400 rounded-full px-5">
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </FilterProvider>
  )
}