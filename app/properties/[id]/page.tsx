import { Suspense } from "react"
import type { Metadata } from "next"
import PropertyDetailsClient from "./property-details-client"
import { PropertyService } from "@/lib/properties-service"
import LoadingFallback from "./loading-fallback"

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  try {
    // Try to parse as number first, then fallback to slug
    const numericId = parseInt(id);
    const property = !isNaN(numericId) 
      ? await PropertyService.getPropertyById(numericId)
      : await PropertyService.getPropertyBySlug(id);
      
    if (property) {
      return {
        title: `${property.title} | VL Real Estate`,
        description: property.description || "Detailed information about this luxury property in Dubai",
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }
  
  return {
    title: `Property Details - ${id} | VL Real Estate`,
    description: "Detailed information about this luxury property in Dubai",
  }
}

export default async function PropertyDetailsPage({ params }: Props) {
  const { id } = await params;
  
  let property = null;
  let error = null;
  
  try {
    // Check if database is available first
    if (PropertyService.isDatabaseAvailable()) {
      // Try to parse as number first, then fallback to slug
      const numericId = parseInt(id);
      property = !isNaN(numericId) 
        ? await PropertyService.getPropertyById(numericId)
        : await PropertyService.getPropertyBySlug(id);
    } else {
      console.warn('⚠️  Database not configured, property details will show empty state');
    }
  } catch (err) {
    console.error('❌ Error loading property details:', err);
    error = err instanceof Error ? err.message : 'Unknown error';
  }
  
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PropertyDetailsClient propertyId={id} initialProperty={property} error={error} />
    </Suspense>
  )
}
