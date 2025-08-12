"use client"

import { Suspense, useState } from "react"
import HomeSearchResults from "@/components/home-search-results"
import HomePropertyListingsClient from "@/components/home-property-listings-client"
import type { Property } from "@/lib/properties-data"

interface HomePageContentProps {
  featuredProperties: Property[]
}

export default function HomePageContent({ featuredProperties }: HomePageContentProps) {
  const [hasActiveSearch, setHasActiveSearch] = useState(false)

  return (
    <>
      {/* Suspense wrapper for search results since it uses useSearchParams */}
      <Suspense fallback={null}>
        <HomeSearchResults onSearchStateChange={setHasActiveSearch} />
      </Suspense>
      
      {/* Only show featured properties when no search is active */}
      {!hasActiveSearch && (
        <HomePropertyListingsClient properties={featuredProperties} />
      )}
    </>
  )
}
