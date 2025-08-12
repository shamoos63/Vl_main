import { PropertyService } from "@/lib/properties-service"
import HomePropertyListingsClient from "@/components/home-property-listings-client"

export default async function HomePropertyListingsServer() {
  try {
    // Check if database is available first
    if (!PropertyService.isDatabaseAvailable()) {
      console.warn('⚠️  Database not configured, showing empty state for properties')
      return <HomePropertyListingsClient properties={[]} />
    }

    console.log('📊 Fetching featured properties from database...')
    const properties = await PropertyService.getFeaturedProperties(6)
    console.log(`✅ Successfully loaded ${properties.length} featured properties`)
    return <HomePropertyListingsClient properties={properties} />
  } catch (error) {
    console.error('❌ Error loading featured properties on server:', error)
    // Return client component with empty properties on error
    return <HomePropertyListingsClient properties={[]} />
  }
}