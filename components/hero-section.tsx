"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, DollarSign, Home, X, Navigation, Loader2 } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import AnimatedCounter from "./animated-counter"
import { Input } from "@/components/ui/input"

// UAE locations for autocomplete with coordinates
const uaeLocations = [
  // Dubai
  { name: "Dubai Marina", lat: 25.0757, lng: 55.1395, emirate: "Dubai" },
  { name: "Downtown Dubai", lat: 25.1972, lng: 55.2744, emirate: "Dubai" },
  { name: "Palm Jumeirah", lat: 25.1124, lng: 55.139, emirate: "Dubai" },
  { name: "Business Bay", lat: 25.1877, lng: 55.2633, emirate: "Dubai" },
  { name: "Jumeirah Village Circle", lat: 25.0581, lng: 55.2067, emirate: "Dubai" },
  { name: "Dubai Maritime City", lat: 25.2467, lng: 55.3102, emirate: "Dubai" },
  { name: "Jumeirah Beach Residence", lat: 25.0785, lng: 55.1336, emirate: "Dubai" },
  { name: "Dubai Hills Estate", lat: 25.1108, lng: 55.2458, emirate: "Dubai" },
  { name: "Arabian Ranches", lat: 25.0515, lng: 55.2708, emirate: "Dubai" },
  { name: "Emirates Hills", lat: 25.1167, lng: 55.1833, emirate: "Dubai" },
  { name: "Jumeirah Lake Towers", lat: 25.0693, lng: 55.1429, emirate: "Dubai" },
  { name: "Dubai Silicon Oasis", lat: 25.1167, lng: 55.3833, emirate: "Dubai" },
  { name: "Dubai Sports City", lat: 24.9967, lng: 55.2167, emirate: "Dubai" },
  { name: "Jumeirah Islands", lat: 25.1167, lng: 55.1667, emirate: "Dubai" },
  { name: "Dubai Creek Harbour", lat: 25.2167, lng: 55.3167, emirate: "Dubai" },
  { name: "Meydan", lat: 25.1667, lng: 55.3167, emirate: "Dubai" },
  { name: "Damac Hills", lat: 25.0667, lng: 55.2167, emirate: "Dubai" },
  { name: "Al Barsha", lat: 25.1167, lng: 55.2, emirate: "Dubai" },
  { name: "Dubai Investment Park", lat: 24.9833, lng: 55.1667, emirate: "Dubai" },
  { name: "Dubai Motor City", lat: 25.05, lng: 55.2167, emirate: "Dubai" },
  { name: "Dubai Studio City", lat: 25.0333, lng: 55.2, emirate: "Dubai" },
  { name: "Dubai Production City", lat: 25.0167, lng: 55.1833, emirate: "Dubai" },
  { name: "International City", lat: 25.1667, lng: 55.4167, emirate: "Dubai" },
  { name: "Jumeirah Park", lat: 25.0833, lng: 55.1667, emirate: "Dubai" },
  { name: "The Springs", lat: 25.0833, lng: 55.1833, emirate: "Dubai" },
  { name: "The Meadows", lat: 25.0833, lng: 55.1833, emirate: "Dubai" },
  { name: "The Lakes", lat: 25.0833, lng: 55.1833, emirate: "Dubai" },
  { name: "The Greens", lat: 25.0833, lng: 55.15, emirate: "Dubai" },
  { name: "Dubai Internet City", lat: 25.0833, lng: 55.15, emirate: "Dubai" },
  { name: "Dubai Media City", lat: 25.0833, lng: 55.1333, emirate: "Dubai" },
  { name: "Dubai Knowledge Park", lat: 25.0667, lng: 55.1333, emirate: "Dubai" },

  // Abu Dhabi
  { name: "Al Reem Island", lat: 24.4833, lng: 54.4167, emirate: "Abu Dhabi" },
  { name: "Al Raha Beach", lat: 24.4167, lng: 54.6167, emirate: "Abu Dhabi" },
  { name: "Saadiyat Island", lat: 24.5333, lng: 54.4333, emirate: "Abu Dhabi" },
  { name: "Yas Island", lat: 24.4833, lng: 54.6, emirate: "Abu Dhabi" },
  { name: "Al Reef", lat: 24.3833, lng: 54.5167, emirate: "Abu Dhabi" },
  { name: "Khalifa City", lat: 24.4167, lng: 54.5833, emirate: "Abu Dhabi" },
  { name: "Al Bateen", lat: 24.45, lng: 54.3167, emirate: "Abu Dhabi" },
  { name: "Al Khalidiyah", lat: 24.4667, lng: 54.35, emirate: "Abu Dhabi" },
  { name: "Corniche", lat: 24.4833, lng: 54.35, emirate: "Abu Dhabi" },
  { name: "Al Maryah Island", lat: 24.5, lng: 54.3833, emirate: "Abu Dhabi" },

  // Sharjah
  { name: "Al Majaz", lat: 25.3333, lng: 55.3833, emirate: "Sharjah" },
  { name: "Al Khan", lat: 25.3167, lng: 55.3833, emirate: "Sharjah" },
  { name: "Al Nahda", lat: 25.3, lng: 55.3833, emirate: "Sharjah" },
  { name: "Al Taawun", lat: 25.35, lng: 55.4, emirate: "Sharjah" },
  { name: "Muwaileh", lat: 25.2833, lng: 55.4333, emirate: "Sharjah" },

  // Other Emirates
  { name: "Ajman Downtown", lat: 25.4167, lng: 55.5, emirate: "Ajman" },
  { name: "Ras Al Khaimah Corniche", lat: 25.7833, lng: 55.95, emirate: "Ras Al Khaimah" },
  { name: "Fujairah Beach", lat: 25.1167, lng: 56.3333, emirate: "Fujairah" },
  { name: "Umm Al Quwain Marina", lat: 25.5667, lng: 55.6833, emirate: "Umm Al Quwain" },
]

// Function to calculate distance between two coordinates
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLng = (lng2 - lng1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Function to highlight matching text
const highlightMatch = (text: string, query: string) => {
  if (!query) return text

  const regex = new RegExp(`(${query})`, "gi")
  const parts = text.split(regex)

  return parts.map((part, index) =>
    regex.test(part) ? (
      <span key={index} className="bg-vl-yellow/30 font-semibold text-vl-blue">
        {part}
      </span>
    ) : (
      part
    ),
  )
}

export default function HeroSection() {
  const [searchData, setSearchData] = useState({
    propertyType: "",
    location: "",
    priceRange: "",
    bedrooms: "",
  })
  const [locationInput, setLocationInput] = useState("")
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)
  const [filteredLocations, setFilteredLocations] = useState<typeof uaeLocations>([])
  const [nearbyLocations, setNearbyLocations] = useState<typeof uaeLocations>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const locationDropdownRef = useRef<HTMLDivElement>(null)
  const locationInputRef = useRef<HTMLInputElement>(null)
  const { t, isRTL, language } = useI18n()
  const router = useRouter()

  // Detect user's location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      setIsDetectingLocation(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lng: longitude })

          // Find nearby locations (within 50km)
          const nearby = uaeLocations
            .map((location) => ({
              ...location,
              distance: calculateDistance(latitude, longitude, location.lat, location.lng),
            }))
            .filter((location) => location.distance <= 50)
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 5)

          setNearbyLocations(nearby)
          setIsDetectingLocation(false)
        },
        (error) => {
          console.log("Geolocation error:", error)
          setIsDetectingLocation(false)
        },
        {
          timeout: 10000,
          enableHighAccuracy: false,
        },
      )
    }
  }, [])

  // Filter locations based on input
  useEffect(() => {
    if (locationInput.trim()) {
      const filtered = uaeLocations.filter((location) =>
        location.name.toLowerCase().includes(locationInput.toLowerCase()),
      )
      setFilteredLocations(filtered.slice(0, 8))
      setShowLocationDropdown(filtered.length > 0)
      setSelectedIndex(-1)
    } else {
      setShowLocationDropdown(false)
      setSelectedIndex(-1)
    }
  }, [locationInput])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showLocationDropdown) return

    const totalItems = filteredLocations.length + (nearbyLocations.length > 0 ? nearbyLocations.length : 0)

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0) {
          if (nearbyLocations.length > 0 && selectedIndex < nearbyLocations.length) {
            selectLocation(nearbyLocations[selectedIndex].name)
          } else {
            const adjustedIndex = nearbyLocations.length > 0 ? selectedIndex - nearbyLocations.length : selectedIndex
            if (adjustedIndex >= 0 && adjustedIndex < filteredLocations.length) {
              selectLocation(filteredLocations[adjustedIndex].name)
            }
          }
        }
        break
      case "Escape":
        setShowLocationDropdown(false)
        setSelectedIndex(-1)
        locationInputRef.current?.blur()
        break
    }
  }

  const selectLocation = (location: string) => {
    setLocationInput(location)
    setSearchData({ ...searchData, location })
    setShowLocationDropdown(false)
    setSelectedIndex(-1)
  }

  const clearLocation = () => {
    setLocationInput("")
    setSearchData({ ...searchData, location: "" })
    setShowLocationDropdown(false)
    setSelectedIndex(-1)
    locationInputRef.current?.focus()
  }

  const detectLocation = () => {
    if (navigator.geolocation) {
      setIsDetectingLocation(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lng: longitude })

          // Find the closest location
          const closest = uaeLocations
            .map((location) => ({
              ...location,
              distance: calculateDistance(latitude, longitude, location.lat, location.lng),
            }))
            .sort((a, b) => a.distance - b.distance)[0]

          if (closest && closest.distance <= 50) {
            selectLocation(closest.name)
          }
          setIsDetectingLocation(false)
        },
        (error) => {
          console.log("Geolocation error:", error)
          setIsDetectingLocation(false)
        },
        {
          timeout: 10000,
          enableHighAccuracy: true,
        },
      )
    }
  }

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Build search parameters
    const searchParams = new URLSearchParams()
    
    if (searchData.propertyType) {
      searchParams.set('propertyType', searchData.propertyType)
    }
    if (locationInput || searchData.location) {
      searchParams.set('location', locationInput || searchData.location)
    }
    if (searchData.priceRange) {
      searchParams.set('priceRange', searchData.priceRange)
    }
    if (searchData.bedrooms) {
      searchParams.set('bedrooms', searchData.bedrooms)
    }
    
    // Navigate to homepage with search parameters
    const queryString = searchParams.toString()
    if (queryString) {
      router.push(`/?${queryString}`)
    } else {
      // If no filters selected, just navigate to homepage
      router.push('/')
    }
  }

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-visible -mt-24"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex items-center text-black "></div>
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/hero.webp')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-24 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl pt-3 mt-3 lg:text-7xl font-bold text-white mb-2 font-sansumi">
            {t("hero.title")} 
          </h1>
          <h1 className="text-xl md:text-3xl md:pt-1 lg:pt-3 pt-2 lg:text-3xl font-bold text-white mb-6 font-sansumi">
            {t("hero.title.highlight")} 
          </h1>

          <p className={`text-sm md:text-sm text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed font-sansumi font-semibold ${ language === "ar" ? "text-lg md:text-lg" : ""  }`}>
            {t("hero.subtitle")}
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="glassmorphism rounded-2xl p-6 md:p-8 max-w-4xl mx-auto relative mb-4 z-[1000]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Select onValueChange={(value) => setSearchData({ ...searchData, propertyType: value })}>
                <SelectTrigger className="h-12 bg-white/90 border-0 hover:bg-white transition-colors text-vl-blue hero-search-select">
                  <div className="flex items-center text-white">
                    <Home className="h-4 w-4 mr-2 text-white" />
                    <SelectValue className="text-black" placeholder={t("search.property.type")} />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">{t("search.apartment")}</SelectItem>
                  <SelectItem value="villa">{t("search.villa")}</SelectItem>
                  <SelectItem value="townhouse">{t("search.townhouse")}</SelectItem>
                  <SelectItem value="penthouse">{t("search.penthouse")}</SelectItem>
                </SelectContent>
              </Select>

  
              <div className="relative z-[1000]" ref={locationDropdownRef}>
              
      <div className="flex text-black items-center h-12 bg-transparent border-0 rounded-md px-3 transition-colors group  focus-within:ring-2 focus-within:ring-vl-yellow/50 text-black">
  
  

  <Input
    ref={locationInputRef}
    value={locationInput}
    onChange={(e) => setLocationInput(e.target.value)}
    onKeyDown={handleKeyDown}
    onFocus={() => {
      if (locationInput.trim() && filteredLocations.length > 0) {
        setShowLocationDropdown(true)
      } else if (!locationInput.trim() && nearbyLocations.length > 0) {
        setShowLocationDropdown(true)
      }
    }}
    placeholder={t("search.location")}
    className="border-0 text-left ml-1 bg-transparent text-sm focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-full placeholder:text-white"
  />

  <div className="flex items-center space-x-1">
    {locationInput && (
      <button
        onClick={clearLocation}
        className="text-black hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
        type="button"
      >
        <X className="h-3 w-3 items-start" />
      </button>
    )}
    <button
      onClick={detectLocation}
      disabled={isDetectingLocation}
      className="text-vl-blue hover:text-vl-blue-dark transition-colors p-1 rounded-full hover:bg-vl-yellow/20"
      type="button"
      title="Detect my location"
    >
      {isDetectingLocation ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <Navigation className={`h-4 w-4`} />
      )}
    </button>
    
  </div>
</div>

                {/* Enhanced Autocomplete Dropdown with Geolocation */}
                {showLocationDropdown && (
                  <div className="absolute z-[1100] top-14 left-0 right-0 w-full bg-white rounded-xl shadow-2xl border border-gray-200 max-h-80 overflow-hidden search-dropdown transform translate-y-0">
                    <div className="py-2">
                      {/* Nearby Locations Section */}
                      {nearbyLocations.length > 0 && !locationInput.trim() && (
                        <>
                          <div className="px-4 py-2 text-xs font-medium text-vl-blue uppercase tracking-wide border-b border-gray-100 flex items-center">
                            <Navigation className="h-3 w-3 mr-1" />
                            {t("testimonials.nearby.locations")}
                          </div>
                          <div className="max-h-32 overflow-y-auto">
                            {nearbyLocations.map((location, index) => (
                              <div
                                key={`nearby-${index}`}
                                className={`px-4 py-3 cursor-pointer flex items-center transition-all duration-150 ${
                                  index === selectedIndex
                                    ? "bg-vl-yellow/20 border-l-4 border-vl-yellow"
                                    : "hover:bg-gray-50 border-l-4 border-transparent"
                                }`}
                                onClick={() => selectLocation(location.name)}
                                onMouseEnter={() => setSelectedIndex(index)}
                              >
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 transition-colors ${
                                    index === selectedIndex
                                      ? "bg-vl-yellow text-vl-blue"
                                      : "bg-green-100 text-green-600"
                                  }`}
                                >
                                  <Navigation className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-gray-900">{location.name}</div>
                                  <div className="text-xs text-gray-500">
                                    {location.emirate} • {location.distance.toFixed(1)} km away
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          {filteredLocations.length > 0 && <div className="border-t border-gray-100 my-1"></div>}
                        </>
                      )}

                      {/* Search Results Section */}
                      {filteredLocations.length > 0 && (
                        <>
                          <div className="px-4 py-2 text-xs font-medium text-black uppercase tracking-wide border-b border-gray-100">
                            {filteredLocations.length} {t("testimonials.locations.found")}
                          </div>
                          <div className="max-h-64 overflow-y-auto">
                            {filteredLocations.map((location, index) => {
                              const adjustedIndex = nearbyLocations.length > 0 ? index + nearbyLocations.length : index
                              return (
                                <div
                                  key={`search-${index}`}
                                  className={`px-4 py-3 cursor-pointer flex items-center transition-all duration-150 ${
                                    adjustedIndex === selectedIndex
                                      ? "bg-vl-yellow/20 border-l-4 border-vl-yellow"
                                      : "hover:bg-gray-50 border-l-4 border-transparent"
                                  }`}
                                  onClick={() => selectLocation(location.name)}
                                  onMouseEnter={() => setSelectedIndex(adjustedIndex)}
                                >
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 transition-colors ${
                                      adjustedIndex === selectedIndex
                                        ? "bg-vl-yellow text-vl-blue"
                                        : "bg-gray-100 text-gray-500"
                                    }`}
                                  >
                                    <MapPin className="h-4 w-4" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-900">
                                      {highlightMatch(location.name, locationInput)}
                                    </div>
                                    <div className="text-xs text-gray-500">{location.emirate}, UAE</div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </>
                      )}

                      {/* Empty State */}
                      {filteredLocations.length === 0 && nearbyLocations.length === 0 && locationInput && (
                        <div className="px-4 py-6 text-center text-gray-500">
                          <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                          <div className="text-sm">{t("testimonials.no.locations")}</div>
                          <div className="text-xs">{t("testimonials.try.different")}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Select onValueChange={(value) => setSearchData({ ...searchData, priceRange: value })}>
                <SelectTrigger className="h-12 bg-white/90 border-0 hover:bg-white transition-colors text-vl-blue hero-search-select">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-black" />
                    <SelectValue className="text-black" placeholder={t("search.price.range")} />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                  <SelectItem value="1m-2m">$1M - $2M</SelectItem>
                  <SelectItem value="2m-5m">$2M - $5M</SelectItem>
                  <SelectItem value="5m+">$5M+</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => setSearchData({ ...searchData, bedrooms: value })}>
                <SelectTrigger className="h-12 bg-white/90 border-0 hover:bg-white transition-colors text-vl-blue hero-search-select">
                  <div className="flex items-center">
                    <Home className="h-4 w-4 mr-2 text-black" />
                    <SelectValue className="text-black" placeholder={t("search.bedrooms")} />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">{t("search.1.bedroom")}</SelectItem>
                  <SelectItem value="2">{t("search.2.bedrooms")}</SelectItem>
                  <SelectItem value="3">{t("search.3.bedrooms")}</SelectItem>
                  <SelectItem value="4+">{t("search.4plus.bedrooms")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full md:w-auto text-white bg-transparent hover:text-vl-yellow font-semibold px-12 py-4 text-lg  transition-all duration-300 hover:scale-105 border-2 border-vl-yellow hover:border-black"
            >
              <Search className="h-5 w-5 mr-2" />
              {t("hero.search.button")}
            </Button>
          </form>

          {/* Enhanced Stats with Staggered Animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 sm:pt-4 sm:mb-6  md:grid-cols-3 gap-8 mb-8">
            <div className="text-center group">
              <div className="relative">
                <AnimatedCounter
                  end={15}
                  suffix="+"
                  delay={200}
                    className={`text-2xl md:text-4xl font-poppins font-bold text-vl-yellow mb-2 transition-all duration-300 group-hover:scale-110 ${
  isRTL ? "text-lg md:text-xl mt-2" : "text-2xl md:text-4xl"
}`}
                  glowEffect={true}
                  pulseOnComplete={true}
                />
              </div>
              <div   className={`text-white/80 font-medium transition-all duration-300 group-hover:text-white ${
  isRTL ? "text-xl" : ""
}`}>
                {t("hero.stats.experience")}
              </div>
            </div>

            <div className="text-center group">
              <div className="relative">
                <AnimatedCounter
                  end={600}
                  suffix="+"
                  delay={600}
                    className={`text-2xl md:text-4xl font-poppins font-bold text-vl-yellow mb-2 transition-all duration-300 group-hover:scale-110 ${
  isRTL ? "text-lg md:text-xl mt-2" : "text-2xl md:text-4xl"
}`}
                  glowEffect={true}
                  pulseOnComplete={true}
                />
              </div>
              <div   className={`text-white/80 font-medium transition-all duration-300 group-hover:text-white ${
  isRTL ? "text-xl" : ""
}`}>
                {t("hero.stats.properties")}
              </div>
            </div>

           <div className="text-center group">
  <div className="relative">
    <AnimatedCounter
      prefix={isRTL ? '+' : 'AED '}
      end={1.9}
      suffix={isRTL ? 'مليار درهم إماراتي' : 'B+'}
      decimals={1}
      delay={400}
      duration={3000}
      className={`whitespace-nowrap font-poppins font-bold text-vl-yellow mb-2 transition-all duration-300 group-hover:scale-110 ${
  isRTL ? "text-lg md:text-xl mt-2" : "text-2xl md:text-4xl"
}`}

      glowEffect={true}
      pulseOnComplete={true}
    />
  </div>
  <div   className={`text-white/80 font-medium transition-all duration-300 group-hover:text-white ${
  isRTL ? "text-xl" : ""
}`}>
    {t("hero.stats.value")}
  </div>
</div>
          </div>
        </div>
      </div>
    </section>
  )
}
