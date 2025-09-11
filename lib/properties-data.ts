// Property interface - keep for type definitions
export interface Property {
  id: number
  title: string
  location: string
  price: string | number
  bedrooms: number
  bathrooms: number
  area?: string
  squareFeet?: number
  image: string
  status: "Ready" | "Off-plan" | "For Rent" | "Sold" | "For Sale"
  featured: boolean
  description: string
  features: string[]
  amenities: string[]
  videoId?: string
  images: string[]
  // Enhanced properties
  type:
    | "Villa"
    | "Apartment"
    | "Penthouse"
    | "Mansion"
    | "House"
    | "Townhouse"
    | "Studio"
    | "Cottage"
    | "Cabin"
    | "Chalet"
  yearBuilt?: number
  parkingSpaces?: number
  furnished?: boolean
  petFriendly?: boolean
  pricePerSqFt?: number
  lastUpdated?: string
  viewCount?: number
  agent?: {
    name: string
    phone: string
    email: string
    image?: string
  }
  highlights?: string[]
  nearbyPlaces?: {
    schools?: string[]
    hospitals?: string[]
    shopping?: string[]
    transport?: string[]
  }
  coordinates?: {
    lat: number
    lng: number
  }
}