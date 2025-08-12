"use client"
import PropertyListings from "./components/PropertyListings"
import PropertyFiltersPanel from "./components/PropertyFiltersPanel"
import { FilterProvider } from "./contexts/FilterContext"

const PropertiesClient = () => {
  return (
    <FilterProvider>
      <div className="flex flex-col md:flex-row">
        <PropertyFiltersPanel />
        <PropertyListings />
      </div>
    </FilterProvider>
  )
}

export default PropertiesClient
