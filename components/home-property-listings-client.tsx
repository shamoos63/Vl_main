"use client"

import { FilterProvider } from "@/contexts/filter-context"
import PropertyListings from "@/components/property-listings"
import type { Property } from "@/lib/properties-data"
import { useI18n } from "@/lib/i18n"

interface HomePropertyListingsClientProps {
  properties: Property[]
}

export default function HomePropertyListingsClient({ properties }: HomePropertyListingsClientProps) {
  const { t } = useI18n()

  if (!properties || properties.length === 0) {
    return (
      <div className="text-center pt-3 bg-transparent">
        <div className="text-center mb-6 bg-transparent">
          <h2 className="text-3xl font-bold text-vl-yellow mb-2"><br/>{t("home.properties.title")}</h2>
          <p className="text-gray-600">{t("home.properties.subtitle")}</p>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No featured properties available at the moment.</p>
          <p className="text-sm text-gray-400">
            Please check back later or contact us for available properties.
          </p>
        </div>
      </div>
    )
  }

  return (
    <FilterProvider initialProperties={properties}>
      <div className="text-center pt-3 bg-transparent">
        <div className="text-center mb-6 bg-transparent">
          <h2 className="text-3xl font-bold text-vl-yellow mb-2"><br/>{t("home.properties.title")}</h2>
          <p className="text-gray-600">{t("home.properties.subtitle")}</p>
        </div>
        <PropertyListings />
      </div>
    </FilterProvider>
  )
}