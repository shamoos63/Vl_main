"use client"

import { useState } from "react"
import { useI18n } from "@/lib/i18n"
import { useFilters } from "@/contexts/filter-context"
import EnhancedPropertyCard from "./enhanced-property-card"
import { Badge } from "@/components/ui/badge"

export default function PropertyListings() {
  const [favorites, setFavorites] = useState<number[]>([])
  const { t, isRTL } = useI18n()
  const { filteredProperties = [] } = useFilters() // Provide default empty array

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
  }

  return (
    <div className="space-y-6 bg-transparent" dir={isRTL ? "rtl" : "ltr"}>
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-transparent rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-vl-yellow">{t("properties.results.title") || "Search Results"}</h3>
          <Badge variant="secondary" className="bg-vl-blue/10 text-vl-yellow border-vl-blue/20">
            {filteredProperties?.length || 0} {t("properties.found") || "properties found"}
          </Badge>
        </div>

        <div className="text-sm text-gray-500 bg-transparent">
          {t("properties.showing") || "Showing"} {filteredProperties?.length || 0} {t("properties.of") || "of"}{" "}
          {filteredProperties?.length || 0} 
        </div>
      </div>

      {/* Properties Grid or Empty State */}
      {!filteredProperties?.length ? (
        <div className="bg-transpaent rounded-lg shadow-sm border border-gray-200 p-12">
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-3">
              {t("properties.no.results") || "No Properties Found"}
            </h3>
            <p className="text-gray-500 mb-6">
              {t("properties.try.different.filters") || "Try adjusting your search filters to see more results."}
            </p>
            <div className="text-sm text-gray-400">
              {t("properties.suggestions") ||
                "Suggestions: Try expanding your price range, location, or property type filters."}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 bg-transparent p-6 rounded-lg shadow-sm">
          {filteredProperties.map((property) => (
            <div key={property.id} className="transform transition-all duration-200 hover:scale-[1.02]">
              <EnhancedPropertyCard
                property={property}
                onFavoriteToggle={toggleFavorite}
                isFavorite={favorites.includes(property.id)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Load More Button (if needed for pagination) */}
      {filteredProperties?.length > 0 && (
        <div className="text-center pt-8 bg-transparent">
          <div className="text-sm text-gray-500 bg-transparent">
            {t("properties.end.of.results") || "You've seen all available properties matching your criteria."}
          </div>
        </div>
      )}
    </div>
  )
}
