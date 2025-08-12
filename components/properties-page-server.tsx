import { PropertyService } from "@/lib/properties-service"
import PropertiesPageClient from "./properties-page-client"

export default async function PropertiesPageServer() {
  try {
    // Check if database is available first
    if (!PropertyService.isDatabaseAvailable()) {
      console.warn('⚠️  Database not configured, showing empty state for properties page')
      return <PropertiesPageClient properties={[]} />
    }

    console.log('📊 Fetching ALL properties from database for properties page...')
    // Fetch ALL properties, not just featured ones
    const properties = await PropertyService.getAllProperties({ limit: 100 }) // Reasonable limit
    console.log(`✅ Successfully loaded ${properties.length} total properties`)
    return <PropertiesPageClient properties={properties} />
  } catch (error) {
    console.error('❌ Error loading properties on server:', error)
    // Return client component with empty properties on error
    return <PropertiesPageClient properties={[]} />
  }
}