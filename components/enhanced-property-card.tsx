"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/hooks/use-toast"
import {
  Heart,
  Bed,
  Bath,
  Square,
  MapPin,
  Eye,
  Calendar,
  Car,
  Shield,
  Star,
  Share2,
  Camera,
  Play,
  Clock,
  PawPrint,
  Sofa,
  MessageCircle,
  ExternalLink,
} from "lucide-react"
import { useI18n } from "@/lib/i18n"
import type { Property } from "@/lib/properties-data"
import { cn } from "@/lib/utils"
import PropertyContactModal from "./property-contact-modal"

interface EnhancedPropertyCardProps {
  property: Property
  onFavoriteToggle?: (id: number) => void
  isFavorite?: boolean
  className?: string
}

// Helper function to format price
const formatPrice = (price: string | number): string => {
  if (typeof price === "string") return price
  return new Intl.NumberFormat("En-US", {
    style: "currency",
    currency: "AED",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export default function EnhancedPropertyCard({
  property,
  onFavoriteToggle,
  isFavorite = false,
  className,
}: EnhancedPropertyCardProps) {
  const [showImageGallery, setShowImageGallery] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const { t, isRTL, language } = useI18n()

  // Handle share functionality with proper feedback
  const handleShare = async () => {
    setIsSharing(true)
    try {
      const shareData = {
        title: property.title,
        text: property.description || `Check out this property: ${property.title}`,
        url: `${window.location.origin}/properties/${property.id}`,
      }

      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData)
        toast({
          title: t("property.share.success") || "Shared successfully",
          description: t("property.share.success.desc") || "Property link has been shared",
        })
      } else {
        // Fallback to copying URL
        await navigator.clipboard.writeText(shareData.url)
        toast({
          title: t("property.link.copied") || "Link copied",
          description: t("property.link.copied.desc") || "Property link has been copied to clipboard",
        })
      }
    } catch (error) {
      console.error("Error sharing:", error)
      toast({
        title: t("property.share.error") || "Share failed",
        description: t("property.share.error.desc") || "Unable to share property. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSharing(false)
    }
  }

  const statusKeyMap = {
  "Ready": "property.status.ready",
  "Off-plan": "property.status.OffPlan",
  "For Rent": "property.status.ForRent",
  "Sold": "property.status.Sold",
};

  // Handle favorite toggle with loading state
  const handleFavoriteToggle = async () => {
    if (!onFavoriteToggle) return

    setFavoriteLoading(true)
    try {
      onFavoriteToggle(property.id)
      toast({
        title: isFavorite
          ? t("property.removed.favorites") || "Removed from favorites"
          : t("property.added.favorites") || "Added to favorites",
        description: isFavorite
          ? t("property.removed.favorites.desc") || "Property removed from your favorites"
          : t("property.added.favorites.desc") || "Property added to your favorites",
      })
    } catch (error) {
      console.error("Error toggling favorite:", error)
      toast({
        title: t("property.favorite.error") || "Error",
        description: t("property.favorite.error.desc") || "Unable to update favorites. Please try again.",
        variant: "destructive",
      })
    } finally {
      setFavoriteLoading(false)
    }
  }

  // Handle contact form
  const handleContactForm = () => {
    setShowContactForm(true)
  }

  // Handle video tour
  const handleVideoTour = () => {
    if (property.videoId) {
      window.open(`https://www.youtube.com/watch?v=${property.videoId}`, "_blank")
      toast({
        title: t("property.video.tour") || "Video tour",
        description: t("property.video.tour.desc") || "Opening video tour in new tab",
      })
    }
  }

  const pricePerSqFt =
    property.pricePerSqFt ||
    (typeof property.price === "number" && property.squareFeet
      ? Math.round(property.price / property.squareFeet)
      : null)

  // Ensure we have a valid image URL
  const imageUrl = imageError
    ? `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(property.title)}`
    : property.image || `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(property.title)}`

  // Get property images for gallery
  const propertyImages = property.images && property.images.length > 0 ? property.images : [imageUrl]
  const viewCount = property.viewCount ?? 0

  return (
    <TooltipProvider>
     <Card
        className={cn(
          "group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border-0 shadow-lg glass h-full flex flex-col",
          className,
        )}
      >
        {/* Image Section with Gallery */}
        <div className="relative overflow-hidden">
          <div className="relative">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={property.title}
              width={400}
              height={300}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImageError(true)}
              priority={false}
            />

            {/* Image Count Badge - Updated styling */}
            {propertyImages.length > 1 && (
              <Dialog open={showImageGallery} onOpenChange={setShowImageGallery}>
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-4 left-4 bg-transparent text-white hover:bg-white backdrop-blur-sm border border-white/20 transition-all duration-200"
                  >
                    <Camera className="h-4 w-4 mr-1 text-white" />
                    {propertyImages.length}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>
                      {property.title} - {t("property.gallery") || "Photo Gallery"}
                    </DialogTitle>
                  </DialogHeader>
                  <Carousel className="w-full">
                    <CarouselContent>
                      {propertyImages.map((image, index) => (
                        <CarouselItem key={index}>
                          <div className="relative">
                            <Image
                              src={image || "/placeholder.svg"}
                              alt={`${property.title} - Image ${index + 1}`}
                              width={800}
                              height={600}
                              className="w-full h-96 object-cover rounded-lg"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = `/placeholder.svg?height=600&width=800&text=${encodeURIComponent(property.title)}`
                              }}
                            />
                            <div className="absolute bottom-4 right-4 bg-transparent text-black text-sm px-3 py-1 rounded backdrop-blur-sm border border-white/20">
                              {index + 1} / {propertyImages.length}
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </DialogContent>
              </Dialog>
            )}

            {/* Video Tour Badge - Updated styling */}
            {property.videoId && (
              <Button
                variant="secondary"
                size="sm"
                className="absolute bottom-4 right-16 bg-transparent text-vl-blue hover:bg-white backdrop-blur-sm border border-transparent transition-all duration-200"
                onClick={handleVideoTour}
              >
                <Play className="h-4 w-4 mr-1 text-white" />
                {t("property.tour") || "Tour"}
              </Button>
            )}
          </div>

          {/* Status and Featured Badges */}
          <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
            <Badge
              className={cn(
                "text-white font-medium shadow-lg",
                property.status === "Ready" && "bg-green-500",
                property.status === "Off-plan" && "bg-blue-500 ",
                property.status === "For Rent" && "bg-purple-500",
                property.status === "Sold" && "bg-gray-500",
                !property.status && "bg-vl-blue",
              )}
            >
              {t(statusKeyMap[property.status] || "property.status.Available")}
            </Badge>
            {property.featured && (
              <Badge className="bg-vl-yellow text-vl-blue font-medium shadow-lg">
                <Star className="h-3 w-3 mr-1" />
                {t("property.featured") || "Featured"}
              </Badge>
            )}
            {property.yearBuilt && property.yearBuilt > new Date().getFullYear() - 2 && (
              <Badge className="bg-emerald-500 text-black shadow-lg">{t("property.new") || "New"}</Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-transparent text-white hover:bg-white backdrop-blur-sm transition-all duration-200 border border-white/20"
                  onClick={handleShare}
                  disabled={isSharing}
                >
                  {isSharing ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-vl-blue" />
                  ) : (
                    <Share2 className="h-4 w-4 text-vl-blue" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("property.share") || "Share Property"}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
               
              </TooltipTrigger>
              <TooltipContent>
                {isFavorite
                  ? t("property.remove.favorite") || "Remove from Favorites"
                  : t("property.add.favorite") || "Add to Favorites"}
              </TooltipContent>
            </Tooltip>
          </div>

          {/* View Count - Updated styling */}
          {viewCount > 0 && (
            <div className="absolute bottom-4 right-4 bg-transparent text-white text-xs px-2 py-1 rounded backdrop-blur-sm border border-white/20">
              <Eye className="h-3 w-3 inline mr-1 text-white" />
              {viewCount.toLocaleString()}
            </div>
          )}
        </div>

        <CardContent className="p-6 flex-1 flex flex-col">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-4">
    <div className="flex-1">
  <h3
    className={cn(
      "text-xl font-bold text-vl-yellow mb-1 line-clamp-2",
      language === "ar" ? "text-right ml-2" : "text-left"
    )}
  >
    {property.title}
  </h3>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className={`text-sm ${language === "ar" ? "ml-[-3rem] mr-2" : "mr-[-3rem]"}`}>
                  {property.location}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-vl-black">
                {property.type && (
                  <Badge className="text-xs">
                    {property.type}
                  </Badge>
                )}
                {property.yearBuilt && (
                  <span className="flex items-center text-white">
                    <Calendar className={`h-3 w-3 text-white ${ language === "ar" ? "ml-2" : "mr-2" }`} />
                    {property.yearBuilt}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-heading text-vl-yellow mb-1 font-bold">
                {formatPrice(property.price)}
              </div>
              {pricePerSqFt && <div className="text-xs text-gray-500">AED{pricePerSqFt}/{t("property.sqft")}</div>}
            </div>
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-transparent rounded-lg">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Bed className="h-4 w-4 text-vl-yellow" />
              </div>
              <div className="text-sm font-medium">
                {property.bedrooms === 0 ? (t("filters.studio") || "Studio") : (property.bedrooms || 0)}
              </div>
              {property.bedrooms !== 0 && (
                <div className="text-xs text-gray-500">{t("property.bedrooms") || "Bedrooms"}</div>
              )}
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Bath className="h-4 w-4 text-vl-yellow" />
              </div>
              <div className="text-sm font-medium">{property.bathrooms || 0}</div>
              <div className="text-xs text-gray-500">{t("property.bathrooms") || "Bathrooms"}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Square className="h-4 w-4 text-vl-yellow" />
              </div>
              <div className="text-sm font-medium">
                {property.squareFeet ? `${property.squareFeet.toLocaleString()}` : property.area || "N/A"}
              </div>
              <div className="text-xs text-gray-500">{t("property.sqft") || "Sq Ft"}</div>
            </div>
          </div>

          {/* Property Highlights */}
          {property.highlights && property.highlights.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {property.highlights.slice(0, 3).map((highlight, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-vl-blue/10 text-vl-yellow">
                    {highlight}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Additional Features Icons */}
          <div className="flex items-center gap-3 mb-4 text-gray-500">
            {property.parkingSpaces && (
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center text-xs cursor-help">
                
                    {property.parkingSpaces}
                    <Car className={`h-4 w-4 ${language === "ar" ? "mr-1" : "ml-1" }`} />
                  </div>
                </TooltipTrigger>
                <TooltipContent>{t("property.parking") || "Parking Spaces"}</TooltipContent>
              </Tooltip>
            )}
            {property.furnished && (
              <Tooltip>
                <TooltipTrigger>
                  <Sofa className="h-4 w-4 text-green-600 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>{t("property.furnished") || "Furnished"}</TooltipContent>
              </Tooltip>
            )}
            {property.petFriendly && (
              <Tooltip>
                <TooltipTrigger>
                  <PawPrint className="h-4 w-4 text-blue-600 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>{t("property.pet.friendly") || "Pet Friendly"}</TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger>
                <Shield className="h-4 w-4 text-green-600 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>{t("property.security") || "24/7 Security"}</TooltipContent>
            </Tooltip>
          </div>

          {/* Last Updated */}
          {property.lastUpdated && (
            <div className="flex items-center text-xs text-gray-500 mb-4">
              <Clock className="h-3 w-3 mr-1" />
              {t("property.updated") || "Updated"} {new Date(property.lastUpdated).toLocaleDateString()}
            </div>
          )}

          {/* Action Buttons */}
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full mt-auto">
  <Link href={`/properties/${property.id}`} className="flex-1">
    <Button
      className={`w-full text-white bg-transparent hover:text-vl-yellow font-semibold px-4 py-3 transition-all duration-300 hover:scale-95 border-2 border-vl-yellow hover:border-black ${ language === "ru" ? "text-xs" : "text-base"}`}
    >
      <Eye className="h-4 w-4 mr-1 group-hover:scale-90 transition-transform" /> {/* reduced margin to mr-1 */}
      {t("property.view.details") || "View Details"}
      <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" /> {/* reduced margin to ml-1 */}
    </Button>
  </Link>
  <Button
  className={`flex-1 text-blue bg-white font-semibold px-4 py-3 text-base transition-all duration-300 hover:scale-95 border border-blue-300 ${ language === "ru" ? "text-xs" : "text-base"}`}
    onClick={handleContactForm}
  >
    <MessageCircle className="h-4 w-4 mr-1" /> {/* reduced margin to mr-1 */}
    {t("property.contact") || "Contact"}
  </Button>
</div>
        </CardContent>
      </Card>
      
      {/* Property Contact Modal */}
      <PropertyContactModal
        isOpen={showContactForm}
        onClose={() => setShowContactForm(false)}
        property={property}
      />
    </TooltipProvider>
  )
}
