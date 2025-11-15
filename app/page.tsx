import { Suspense } from "react"
import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import { PropertyService } from "@/lib/properties-service"
import HomePageContent from "@/components/home-page-content"
import TestimonialsSection from "@/components/testimonials-section"
import FaqSection from "@/components/faq-section"
import Footer from "@/components/footer"
import type { Property } from "@/lib/properties-data"

export default async function HomePage() {
  // Fetch featured properties on the server
  let featuredProperties: Property[] = []
  
  try {
    // Check if database is available first
    if (PropertyService.isDatabaseAvailable()) {
     
      featuredProperties = await PropertyService.getFeaturedProperties(6)
     
    } else {
      console.warn('⚠️  Database not configured, showing empty state for properties')
    }
  } catch (error) {
    console.error('❌ Error loading featured properties on server:', error)
  }

  return (
    <main className="min-h-screen pt-24 bg-transparent">
      <Header />
      <HeroSection />
      
      {/* Pass featured properties to client component for state management */}
      <HomePageContent featuredProperties={featuredProperties} />
      
      <FaqSection />
      <TestimonialsSection />
      <Footer />
    </main>
  )
}
