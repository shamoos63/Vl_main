"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useI18n } from "@/lib/i18n"
import { Filter, Search, SlidersHorizontal, X, MapPin, Home, DollarSign, Bed } from "lucide-react"
import {
  useFilters,
  MIN_PRICE,
  MAX_PRICE,
  MIN_BEDROOMS,
  MAX_BEDROOMS,
  MIN_BATHROOMS,
  MAX_BATHROOMS,
  PROPERTY_TYPES,
  COUNTRIES,
} from "@/contexts/filter-context"
import PriceRangeSlider from "./price-range-slider"
import RoomRangeSlider from "./room-range-slider"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface PropertyFiltersPanelProps {
  className?: string
}

export default function PropertyFiltersPanel({ className = "" }: PropertyFiltersPanelProps) {
  const { t, isRTL } = useI18n()
  const { filters, setFilters, resetFilters, activeFiltersCount, filteredProperties, updateFilter, clearFilter } =
    useFilters()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  const statusOptions = [
    { id: "ready", label: t("filters.status.ready") || "Ready" },
    { id: "off-plan", label: t("filters.status.offplan") || "Off Plan" },
    { id: "for-rent", label: t("filters.status.for-rent") || "For Rent" },
    { id: "sold", label: t("filters.status.sold") || "Sold" },
  ]

  const amenityOptions = [
    { id: "pool", label: t("filters.amenities.pool") || "Swimming Pool" },
    { id: "garden", label: t("filters.amenities.garden") || "Garden" },
    { id: "garage", label: t("filters.amenities.garage") || "Garage" },
    { id: "balcony", label: t("filters.amenities.balcony") || "Balcony" },
    { id: "gym", label: t("filters.amenities.gym") || "Gym" },
    { id: "security", label: t("filters.amenities.security") || "24/7 Security" },
    { id: "elevator", label: t("filters.amenities.elevator") || "Elevator" },
    { id: "parking", label: t("filters.amenities.parking") || "Parking" },
  ]

  const sortOptions = [
    { value: "default", label: t("filters.sort.default") || "Default" },
    { value: "price-asc", label: t("filters.sort.price-asc") || "Price: Low to High" },
    { value: "price-desc", label: t("filters.sort.price-desc") || "Price: High to Low" },
    { value: "newest", label: t("filters.sort.newest") || "Newest First" },
    { value: "oldest", label: t("filters.sort.oldest") || "Oldest First" },
    { value: "bedrooms-asc", label: t("filters.sort.bedrooms-asc") || "Bedrooms: Low to High" },
    { value: "bedrooms-desc", label: t("filters.sort.bedrooms-desc") || "Bedrooms: High to Low" },
  ]

  const handlePropertyTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked ? [...filters.propertyTypes, type] : filters.propertyTypes.filter((t) => t !== type)
    updateFilter("propertyTypes", newTypes)
  }

  const handleStatusChange = (status: string, checked: boolean) => {
    const newStatus = checked ? [...filters.status, status] : filters.status.filter((s) => s !== status)
    updateFilter("status", newStatus)
  }

  const handleLocationChange = (location: string, checked: boolean) => {
    const newLocations = checked ? [...filters.locations, location] : filters.locations.filter((l) => l !== location)
    updateFilter("locations", newLocations)
  }

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    const newAmenities = checked ? [...filters.amenities, amenity] : filters.amenities.filter((a) => a !== amenity)
    updateFilter("amenities", newAmenities)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilter("searchQuery", e.target.value)
  }

  const handleSortChange = (value: string) => {
    updateFilter("sortBy", value)
  }

  const toggleFilters = () => {
    if (isMobile) {
      setIsSheetOpen(true)
    } else {
      setIsExpanded(!isExpanded)
    }
  }

  // Enhanced filter content with better organization
  const filterContent = (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Search className="h-4 w-4" />
            {t("filters.search") || "Search"}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t("filters.search.placeholder") || "Search properties..."}
              className="pl-9"
              value={filters.searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            {t("filters.price.range") || "Price Range"}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <PriceRangeSlider
            minPrice={MIN_PRICE}
            maxPrice={MAX_PRICE}
            value={filters.priceRange}
            onChange={(value) => updateFilter("priceRange", value)}
          />
        </CardContent>
      </Card>

      {/* Bedrooms & Bathrooms */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Bed className="h-4 w-4" />
            {t("filters.rooms") || "Rooms"}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <RoomRangeSlider
            minValue={MIN_BEDROOMS}
            maxValue={MAX_BEDROOMS}
            value={filters.bedroomRange}
            onChange={(value) => updateFilter("bedroomRange", value)}
            label={t("filters.bedrooms.range") || "Bedrooms"}
          />
          <RoomRangeSlider
            minValue={MIN_BATHROOMS}
            maxValue={MAX_BATHROOMS}
            value={filters.bathroomRange}
            onChange={(value) => updateFilter("bathroomRange", value)}
            label={t("filters.bathrooms.range") || "Bathrooms"}
          />
        </CardContent>
      </Card>

      {/* Property Type */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Home className="h-4 w-4" />
            {t("filters.property.type") || "Property Type"}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-2">
            {PROPERTY_TYPES.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type}`}
                  checked={filters.propertyTypes.includes(type)}
                  onCheckedChange={(checked) => handlePropertyTypeChange(type, checked === true)}
                />
                <Label htmlFor={`type-${type}`} className="text-sm font-normal cursor-pointer capitalize">
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">{t("filters.status") || "Status"}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-2">
            {statusOptions.map((status) => (
              <div key={status.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${status.id}`}
                  checked={filters.status.includes(status.id)}
                  onCheckedChange={(checked) => handleStatusChange(status.id, checked === true)}
                />
                <Label htmlFor={`status-${status.id}`} className="text-sm font-normal cursor-pointer">
                  {status.label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Locations */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {t("filters.location") || "Location"}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {COUNTRIES.map((location) => (
              <div key={location} className="flex items-center space-x-2">
                <Checkbox
                  id={`location-${location}`}
                  checked={filters.locations.includes(location)}
                  onCheckedChange={(checked) => handleLocationChange(location, checked === true)}
                />
                <Label htmlFor={`location-${location}`} className="text-sm font-normal cursor-pointer">
                  {location}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Amenities */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">{t("filters.amenities") || "Amenities"}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-2">
            {amenityOptions.map((amenity) => (
              <div key={amenity.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`amenity-${amenity.id}`}
                  checked={filters.amenities.includes(amenity.id)}
                  onCheckedChange={(checked) => handleAmenityChange(amenity.id, checked === true)}
                />
                <Label htmlFor={`amenity-${amenity.id}`} className="text-sm font-normal cursor-pointer">
                  {amenity.label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sort */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">{t("filters.sort.label") || "Sort By"}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Select value={filters.sortBy} onValueChange={handleSortChange}>
            <SelectTrigger>
              <SelectValue placeholder={t("filters.sort.default") || "Default"} />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  )

  // Mobile sheet version
  if (isMobile) {
    return (
      <div className={className} dir={isRTL ? "rtl" : "ltr"}>
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="outline"
            onClick={toggleFilters}
            className="flex items-center gap-2 border-vl-blue text-vl-blue"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>{t("filters.title") || "Filters"}</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1 bg-vl-blue text-white">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>

          <div className="text-sm text-gray-500">
            {filteredProperties.length} {t("properties.found") || "properties found"}
          </div>
        </div>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-xl pt-6">
            <SheetHeader>
              <SheetTitle className="text-vl-blue text-xl flex items-center justify-between">
                {t("filters.title") || "Filters"}
                <Badge variant="outline" className="ml-2">
                  {filteredProperties.length} {t("properties.found") || "properties found"}
                </Badge>
              </SheetTitle>
            </SheetHeader>
            <div className="py-4 overflow-y-auto max-h-[calc(85vh-140px)]">{filterContent}</div>
            <SheetFooter className="flex flex-row justify-between gap-4 pt-4 border-t">
              <Button variant="outline" size="lg" onClick={resetFilters} className="flex-1">
                {t("filters.reset") || "Reset"}
              </Button>
              <Button
                size="lg"
                onClick={() => setIsSheetOpen(false)}
                className="flex-1 bg-vl-blue hover:bg-vl-blue-dark text-white"
              >
                {t("filters.apply") || "Apply"} ({activeFiltersCount})
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    )
  }

  // Desktop version
  return (
    <div className={`${className} text-vl-blue bg-transparent`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <Button
            variant={isExpanded ? "default" : "outline"}
            onClick={toggleFilters}
            className={`flex items-center gap-2 ${
              isExpanded
                ? "bg-transparent hover:bg-vl-blue-dark text-white"
                : "border-vl-blue text-vl-blue hover:bg-vl-blue hover:text-white"
            }`}
          >
            <Filter className="h-4 w-4" />
            <span>{t("filters.title") || "Filters"}</span>
            {activeFiltersCount > 0 && (
              <Badge
                variant={isExpanded ? "secondary" : "default"}
                className={`ml-1 ${isExpanded ? "bg-transparent text-vl-blue" : "bg-vl-blue text-white"}`}
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>

          <div className="text-sm text-gray-500">
            {filteredProperties.length} {t("properties.found") || "properties found"}
          </div>
        </div>

        {/* Quick sort dropdown */}
        <div className="flex items-center gap-2">
          <Label htmlFor="quick-sort" className="text-sm font-medium whitespace-nowrap">
            {t("filters.sort.label") || "Sort By"}:
          </Label>
          <Select value={filters.sortBy} onValueChange={handleSortChange}>
            <SelectTrigger id="quick-sort" className="w-[180px]">
              <SelectValue placeholder={t("filters.sort.default") || "Default"} />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isExpanded && (
        <div className="bg-transparent p-6 rounded-lg border-0 shadow-2xl mb-6 animate-in slide-in-from-top-2 duration-200">
          {filterContent}

          <Separator className="my-6" />

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={resetFilters} className="text-gray-500">
                <X className="h-4 w-4 mr-1" />
                {t("filters.reset") || "Reset All"}
              </Button>
              {activeFiltersCount > 0 && (
                <span className="text-sm text-gray-500">
                  {activeFiltersCount} {t("filters.active") || "active filters"}
                </span>
              )}
            </div>

            <Button onClick={() => setIsExpanded(false)} className="bg-vl-blue hover:bg-vl-blue-dark text-white">
              {t("filters.apply") || "Apply Filters"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
