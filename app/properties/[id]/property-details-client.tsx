"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowLeft,
  Bed,
  Bath,
  Square,
  MapPin,
  Phone,
  Mail,
  Check,
  Play,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import PropertyContactModal from "@/components/property-contact-modal"
import type { Property } from "@/lib/properties-data"
import { useI18n } from "@/lib/i18n"

interface PropertyDetailsClientProps {
  propertyId: string
  initialProperty?: Property | null
  error?: string | null
}

export default function PropertyDetailsClient({ propertyId, initialProperty, error }: PropertyDetailsClientProps) {
  const { t,language, isRTL } = useI18n()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showVideo, setShowVideo] = useState(false)
  const [property, setProperty] = useState<Property | null>(initialProperty || null)
  const [loading, setLoading] = useState(!initialProperty && !error)
  const [showContactModal, setShowContactModal] = useState(false)
  const [similarProperties, setSimilarProperties] = useState<Property[]>([])
  const [loadingSimilar, setLoadingSimilar] = useState(false)

  // If we have an initial property or error, we're not loading
  useEffect(() => {
    if (initialProperty || error) {
      setLoading(false)
    }
  }, [initialProperty, error])

  // Fetch similar properties when property is available
  useEffect(() => {
    if (property?.id) {
      const fetchSimilarProperties = async () => {
        setLoadingSimilar(true)
        try {
          const response = await fetch(`/api/properties/${property.id}/similar`)
          const result = await response.json()
          if (result.success) {
            setSimilarProperties(result.data || [])
          }
        } catch (error) {
          console.error('Error fetching similar properties:', error)
        } finally {
          setLoadingSimilar(false)
        }
      }
      
      fetchSimilarProperties()
    }
  }, [property?.id])

  if (loading) {
    return (
      <main className="min-h-screen pt-24">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-96 bg-gray-200 rounded mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
              <div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-white pt-24">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-vl-yellow dark:text-white mb-6">{t("properties.error.loading")}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">{t("properties.error.message")} {error}</p>
          <Link href="/properties">
            <Button className="bg-vl-blue hover:bg-vl-blue-dark text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("properties.back.to.listings")}
            </Button>
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  if (!property) {
    return (
      <main className="min-h-screen pt-24">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-vl-yellow dark:text-white mb-6">{t("properties.not.found")}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">{t("properties.not.found.message")}</p>
          <Link href="/properties">
            <Button className="bg-vl-blue hover:bg-vl-blue-dark text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("properties.back.to.listings")}
            </Button>
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  // Ensure we have fallback values for arrays
  const propertyImages =
    property.images && property.images.length > 0
      ? property.images
      : [property.image || "/placeholder.svg?height=400&width=600&text=Property+Image"]

  const propertyFeatures = property.features || []
  const propertyAmenities = property.amenities || []

  const nextImage = () => {
    setShowVideo(false)
    setCurrentImageIndex((prev) => (prev + 1) % propertyImages.length)
  }

  const prevImage = () => {
    setShowVideo(false)
    setCurrentImageIndex((prev) => (prev === 0 ? propertyImages.length - 1 : prev - 1))
  }

  return (
    <main className="min-h-screen pt-24" dir={isRTL ? "rtl" : "ltr"}>
  <Header />
  <div className="container mx-auto px-4 py-16 min-h-screen bg-transparent">
    <div className="mb-8">
      <Link
        href="/properties"
        className="inline-flex items-center text-vl-yellow dark:text-white hover:text-vl-yellow transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t("properties.back.to.listings") || "Back to Properties"}
      </Link>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Images and Details */}
      <div className="lg:col-span-2">
        {/* Image Gallery - Already has 'glass' class on the container */}
        <div className="relative mb-8 rounded-xl overflow-hidden glass">
          <div className="relative aspect-[16/9] w-full">
            {showVideo && property.videoId ? (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${property.videoId}?autoplay=1&rel=0`}
                title={t("properties.video.tour.title")}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0"
              ></iframe>
            ) : (
              <Image
                src={
                  propertyImages[currentImageIndex] || "/placeholder.svg?height=400&width=600&text=Property+Image"
                }
                alt={`${property.title} - Image ${currentImageIndex + 1}`}
                fill
                className="object-cover"
              />
            )}
          </div>

          {/* Navigation Controls - The parent div here should not have 'glass' if it means to show the inner image through */}
          {/* Removed 'glass' from the absolute inset-0 div, as it would apply another layer of glass effect over the image/video */}
          {propertyImages.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between px-4"> 
              <Button
                variant="ghost"
                size="icon"
                className="glass text-black rounded-full" /* Individual buttons can be glass */
                onClick={prevImage}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="glass text-black rounded-full" /* Individual buttons can be glass */
                onClick={nextImage}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          )}

          {/* Video Button - Only show if video exists */}
          {property.videoId && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute bottom-4 right-4 bg-black hover:bg-black-light text-vl-yellow rounded-full flex items-center"
              onClick={() => setShowVideo(true)}
            >
              <Play className="h-4 w-4 mr-2" />
              {t("properties.watch.video") || "Watch Video"}
            </Button>
          )}
        </div>

        {/* Thumbnail Gallery - No 'glass' needed here, as it's a grid of small images */}
        {(propertyImages.length > 1 || property.videoId) && (
          <div className="grid grid-cols-5 gap-2 mb-8">
            {propertyImages.map((image, index) => (
              <div
                key={index}
                className={`relative aspect-[4/3] cursor-pointer rounded-md overflow-hidden ${
                  currentImageIndex === index && !showVideo ? "ring-2 ring-vl-yellow" : ""
                }`}
                onClick={() => {
                  setCurrentImageIndex(index)
                  setShowVideo(false)
                }}
              >
                <Image
                  src={image || "/placeholder.svg?height=100&width=100&text=Thumbnail"}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
            {property.videoId && (
              <div
                className={`relative aspect-[4/3] cursor-pointer rounded-md overflow-hidden bg-gray-800 flex items-center justify-center ${
                  showVideo ? "ring-2 ring-vl-yellow" : ""
                }`}
                onClick={() => setShowVideo(true)}
              >
                <Play className="h-8 w-8 text-white" />
              </div>
            )}
          </div>
        )}

        {/* Property Details Tabs - Already has 'glass' on Tabs and TabsContent */}
        <Tabs defaultValue="overview" className="mb-8"> {/* Glass applied to outer Tabs container */}
          <TabsList className="w-full grid grid-cols-3 glass bg-transparent">
            <TabsTrigger value="overview">{t("properties.tab.overview") || "Overview"}</TabsTrigger>
            <TabsTrigger value="features">{t("properties.tab.features") || "Features"}</TabsTrigger>
            <TabsTrigger value="amenities">{t("properties.tab.amenities") || "Amenities"}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="p-6 glass rounded-b-lg"> {/* Glass applied to each TabsContent */}
            <h3 className={`text-xl font-semibold text-vl-yellow dark:text-white mb-4 ${ language === "ar" ? "text-right " : "text-left" }`}>
              {t("properties.overview") || "Property Overview"}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              {property.description || t("properties.no.description")}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-transparent p-4 rounded-lg text-center"> {/* Keep these transparent or give a very light glass background if desired */}
                <Bed className="h-5 w-5 mx-auto mb-2 text-vl-yellow" />
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {t("properties.bedrooms") || "Bedrooms"}
                </div>
                <div className="font-semibold text-vl-yellow dark:text-white">{property.bedrooms || 0}</div>
              </div>
              <div className="bg-transparent p-4 rounded-lg text-center">
                <Bath className="h-5 w-5 mx-auto mb-2 text-vl-yellow" />
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {t("properties.bathrooms") || "Bathrooms"}
                </div>
                <div className="font-semibold text-vl-yellow dark:text-white">{property.bathrooms || 0}</div>
              </div>
              <div className="bg-transparent p-4 rounded-lg text-center">
                <Square className="h-5 w-5 mx-auto mb-2 text-vl-yellow" />
                <div className="text-sm text-gray-500 dark:text-gray-400">{t("properties.area") || "Area"}</div>
                <div className="font-semibold text-vl-yellow dark:text-white">
                  {property.area || `${property.squareFeet || 0} sq ft`}
                </div>
              </div>
              <div className="bg-transparent p-4 rounded-lg text-center">
                <MapPin className="h-5 w-5 mx-auto mb-2 text-vl-yellow" />
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {t("properties.location") || "Location"}
                </div>
                <div className="font-semibold text-vl-yellow dark:text-white">{property.location || "N/A"}</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="features" className="p-6 glass rounded-b-lg">
            <h3 className={`text-xl font-semibold text-vl-yellow dark:text-white mb-4 ${ language === "ar" ? "text-right " : "text-left" }`}>
              {t("properties.features") || "Property Features"}
            </h3>
            {propertyFeatures.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {propertyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="h-4 w-4 text-vl-yellow mr-2 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-300">{t("properties.no.features")}</p>
            )}
          </TabsContent>

          <TabsContent value="amenities" className="p-6 glass rounded-b-lg">
          <h3 className={`text-xl font-semibold text-vl-yellow dark:text-white mb-4 ${ language === "ar" ? "text-right " : "text-left" }`}>
              {t("properties.amenities") || "Building Amenities"}
            </h3>
            {propertyAmenities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {propertyAmenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="h-4 w-4 text-vl-yellow mr-2 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">{amenity}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-300">{t("properties.no.amenities")}</p>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Column - Contact and Details */}
      <div>
        <Card className="mb-6 glass"> 
          <CardContent className="p-6">
     <div className="flex items-start justify-between mb-4">
  <h1 className="text-2xl font-bold text-vl-yellow dark:text-white items-center sm:items-start">{property.title}</h1>
  <Badge className={`
      ${property.status === "Ready" ? "bg-green-500" : "bg-blue-500"} 
      text-white 
      whitespace-nowrap /* Add this class */
      flex-shrink-0 /* Optional: prevents the badge from shrinking if space is tight */
  `}>
    {property.status === "Ready"
      ? t("properties.status.ready") || "Ready"
      : t("properties.status.offplan") || "Off-plan"}
  </Badge>
</div>

            <div className="text-3xl font-bold text-vl-yellow mb-4">
              {typeof property.price === "number" ? `$${property.price.toLocaleString()}` : property.price}
            </div>

            <div className="flex items-center text-gray-600 dark:text-gray-300 mb-6">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{property.location}</span>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
              <h3 className="text-lg font-semibold text-vl-yellow dark:text-white mb-4">
                {t("properties.contact.agent") || "Contact Agent"}
              </h3>

              <div className="flex items-start mb-4">
                <Image
                  src="/victoria-photo-1.jpg"
                  alt="Victoria Lancaster"
                  width={60}
                  height={60}
                  className="rounded-full object-cover mr-4"
                />
                  <div className={`${language === "ar" ? "mr-4" : "ml-4"}`}>
                  <h4 className="font-semibold text-vl-yellow dark:text-white">{t("about.name")}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{t("about.tname")}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <Phone className={`h-4 w-4 ${ language === "ar" ? "ml-4" : "mr-4" }`} />
                  <span className="text-gray-600 dark:text-gray-300">00971-4279-4800</span>
                </div>
                <div className="flex items-center">
                  <Mail className={`h-4 w-4 ${ language === "ar" ? "ml-4" : "mr-4" }`} />
                  <span className="text-gray-600 dark:text-gray-300">victoria.lancaster@selectproperty.ae</span>
                </div>
              </div>

              <Button 
                className="w-full bg-transparent border-2 border-vl-yellow text-white hover:border-black font-semibold"
                onClick={() => setShowContactModal(true)}
              >
                {t("properties.contact.now") || "Contact Now"}
              </Button>
            </div>

           
          </CardContent>
        </Card>

        <Card className="glass"> {/* Applied 'glass' here */}
          <CardContent className="p-6"> {/* Removed 'glass' from here to avoid double application */}
            <h3 className="text-lg font-semibold text-vl-yellow dark:text-white mb-4">
              {t("properties.similar") || "Similar Properties"}
            </h3>

            <div className="space-y-4">
              {loadingSimilar ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="flex items-center p-2">
                        <div className="w-20 h-20 bg-gray-200 rounded-md mr-3"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : similarProperties.length > 0 ? (
                similarProperties.slice(0, 3).map((similarProperty) => (
                  <Link href={`/properties/${similarProperty.id}`} key={similarProperty.id}>
                    <div className="flex items-center p-2 rounded-lg  transition-transform duration-300 hover:scale-105">
                      <div className="relative w-20 h-20 rounded-md overflow-hidden mr-3">
                        <Image
                          src={similarProperty.image || "/placeholder.svg?height=80&width=80&text=Property"}
                          alt={similarProperty.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-vl-yellow dark:text-white text-sm line-clamp-2">{similarProperty.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {typeof similarProperty.price === "number"
                            ? `$${similarProperty.price.toLocaleString()}`
                            : similarProperty.price}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {similarProperty.location}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {t("properties.similar.unavailable") || "No similar properties found at this time."}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
  <Footer />
  
  {/* Property Contact Modal */}
  {property && (
    <PropertyContactModal
      isOpen={showContactModal}
      onClose={() => setShowContactModal(false)}
      property={property}
    />
  )}
</main>
  )
}
