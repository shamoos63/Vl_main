"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Loader2, Filter, Grid, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/lib/i18n"
import EnhancedPropertyCard from "./enhanced-property-card"
import type { Property } from "@/lib/properties-data"

interface HomeSearchResultsProps {
  onSearchStateChange?: (hasSearch: boolean) => void
}

export default function HomeSearchResults({ onSearchStateChange }: HomeSearchResultsProps) {
  const searchParams = useSearchParams()
  const { t } = useI18n()
  
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  })
  const [searchMetadata, setSearchMetadata] = useState<{
    hasSearch: boolean
    searchQuery: string
    filters: {
      propertyType?: string
      location?: string
      priceRange?: string
      bedrooms?: string
      minPrice?: string
      maxPrice?: string
    }
  }>({
    hasSearch: false,
    searchQuery: '',
    filters: {}
  })

  // Check if there are any search parameters
  const hasSearchParams = searchParams.toString().length > 0

  useEffect(() => {
    const fetchData = async () => {
      if (hasSearchParams) {
        setLoading(true)
        try {
          const response = await fetch(`/api/properties/search?${searchParams.toString()}`)
          const result = await response.json()
          
          if (result.success) {
            setProperties(result.data.properties)
            setPagination(result.data.pagination)
            setSearchMetadata(result.data.metadata)
          } else {
            console.error('Search failed:', result.error)
            setProperties([])
          }
        } catch (error) {
          console.error('Error fetching search results:', error)
          setProperties([])
        } finally {
          setLoading(false)
        }
      }
    }

    fetchData()
  }, [searchParams, hasSearchParams])

  // Notify parent component about search state
  useEffect(() => {
    if (onSearchStateChange) {
      onSearchStateChange(hasSearchParams)
    }
  }, [hasSearchParams, onSearchStateChange])



  // Get active filters for display
  const getActiveFilters = () => {
    const filters = []
    
    if (searchMetadata.searchQuery) {
      filters.push({ key: 'query', value: searchMetadata.searchQuery, label: `Search: "${searchMetadata.searchQuery}"` })
    }
    
    if (searchMetadata.filters.propertyType) {
      filters.push({ key: 'propertyType', value: searchMetadata.filters.propertyType, label: `Type: ${searchMetadata.filters.propertyType}` })
    }
    
    if (searchMetadata.filters.location) {
      filters.push({ key: 'location', value: searchMetadata.filters.location, label: `Location: ${searchMetadata.filters.location}` })
    }
    
    if (searchMetadata.filters.priceRange) {
      const priceLabels = {
        '500k-1m': '$500K - $1M',
        '1m-2m': '$1M - $2M',
        '2m-5m': '$2M - $5M',
        '5m+': '$5M+'
      }
      filters.push({ 
        key: 'priceRange', 
        value: searchMetadata.filters.priceRange, 
        label: `Price: ${priceLabels[searchMetadata.filters.priceRange as keyof typeof priceLabels] || searchMetadata.filters.priceRange}` 
      })
    }
    
    if (searchMetadata.filters.bedrooms) {
      const bedroomLabel = searchMetadata.filters.bedrooms === '4+' ? '4+ Bedrooms' : `${searchMetadata.filters.bedrooms} Bedroom${searchMetadata.filters.bedrooms === '1' ? '' : 's'}`
      filters.push({ key: 'bedrooms', value: searchMetadata.filters.bedrooms, label: bedroomLabel })
    }
    
    return filters
  }

  const clearFilter = (filterKey: string) => {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.delete(filterKey)
    
    // Update URL without reloading
    window.history.replaceState({}, '', `${window.location.pathname}${newParams.toString() ? `?${newParams.toString()}` : ''}`)
    
    // Trigger a new search
    window.location.reload()
  }

  const clearAllFilters = () => {
    window.history.replaceState({}, '', window.location.pathname)
    window.location.reload()
  }

  // Don't render anything if there are no search parameters
  if (!hasSearchParams) {
    return null
  }

  const activeFilters = getActiveFilters()

  return (
    <section className="py-16 bg-transparent">
      <div className="container mx-auto px-4">
        {/* Search Results Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold text-vl-yellow">
              {t("properties.results.title") || "Search Results"}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Grid className="h-4 w-4" />
              {loading ? (
                <span>Loading...</span>
              ) : (
                <span>
                  {t("properties.showing") || "Showing"} {properties.length} {t("properties.of") || "of"} {pagination.total} {t("properties.results") || "results"}
                </span>
              )}
            </div>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-sm text-gray-600 mr-2">
                <Filter className="h-4 w-4 inline mr-1" />
                Filters:
              </span>
              {activeFilters.map((filter) => (
                <Badge
                  key={filter.key}
                  variant="secondary"
                  className="bg-vl-blue text-white hover:bg-vl-blue/80"
                >
                  {filter.label}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-2 text-white hover:text-white"
                    onClick={() => clearFilter(filter.key)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs"
              >
                Clear All
              </Button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-vl-blue mr-3" />
            <span className="text-gray-600">Searching properties...</span>
          </div>
        )}

        {/* Search Results */}
        {!loading && (
          <>
            {properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <EnhancedPropertyCard
                    key={property.id}
                    property={property}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Grid className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {t("properties.no.results") || "No Properties Found"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t("properties.try.different.filters") || "Try adjusting your search filters to see more results."}
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  {t("properties.suggestions") || "Suggestions: Try expanding your price range, location, or property type filters."}
                </p>
                <Button
                  onClick={clearAllFilters}
                  className="bg-vl-yellow hover:bg-vl-yellow/80 text-vl-blue font-semibold"
                >
                  Clear All Filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {properties.length > 0 && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <Button
                  variant="outline"
                  disabled={!pagination.hasPrev}
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams.toString())
                    newParams.set('page', (pagination.page - 1).toString())
                    window.history.replaceState({}, '', `${window.location.pathname}?${newParams.toString()}`)
                    window.location.reload()
                  }}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={!pagination.hasNext}
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams.toString())
                    newParams.set('page', (pagination.page + 1).toString())
                    window.history.replaceState({}, '', `${window.location.pathname}?${newParams.toString()}`)
                    window.location.reload()
                  }}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
