import { PropertyService } from "@/lib/properties-service"
import PropertiesPageClient from "./properties-page-client"

export default async function PropertiesPageServer({ page = 1, pageSize = 12 }: { page?: number; pageSize?: number }) {
  try {
    // Check if database is available first
    if (!PropertyService.isDatabaseAvailable()) {
      console.warn('⚠️  Database not configured, showing empty state for properties page')
      return <PropertiesPageClient properties={[]} page={1} hasNext={false} />
    }

    const offset = (page - 1) * pageSize
    // Fetch one extra to determine if next page exists
    const properties = await PropertyService.getAllProperties({ limit: pageSize + 1, offset })
    const hasNext = properties.length > pageSize
    const pageItems = hasNext ? properties.slice(0, pageSize) : properties
    return <PropertiesPageClient properties={pageItems} page={page} hasNext={hasNext} />
  } catch (error) {
    console.error('❌ Error loading properties on server:', error)
    // Return client component with empty properties on error
    return <PropertiesPageClient properties={[]} page={1} hasNext={false} />
  }
}