"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { useI18n } from "@/lib/i18n"
import { Filter, X, SlidersHorizontal } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

export interface PropertyFilters {
  propertyTypes: string[]
  priceRange: [number, number]
  status: string[]
  bedrooms: number | null
  bathrooms: number | null
}

interface PropertyMapFiltersProps {
  filters: PropertyFilters
  onChange: (filters: PropertyFilters) => void
  onReset: () => void
  maxPrice: number
  minPrice: number
  activeFiltersCount: number
}

export default function PropertyMapFilters({
  filters,
  onChange,
  onReset,
  maxPrice,
  minPrice,
  activeFiltersCount,
}: PropertyMapFiltersProps) {
  const { t, isRTL } = useI18n()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [tempFilters, setTempFilters] = useState<PropertyFilters>(filters)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const filterRef = useRef<HTMLDivElement>(null)

  // Update temp filters when main filters change
  useEffect(() => {
    setTempFilters(filters)
  }, [filters])

  // Handle click outside to close dropdown on desktop
  useEffect(() => {
    if (!isMobile) {
      const handleClickOutside = (event: MouseEvent) => {
        if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
          setIsExpanded(false)
        }
      }

      if (isExpanded) {
        document.addEventListener("mousedown", handleClickOutside)
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [isExpanded, isMobile])

  const propertyTypes = [
    { id: "villa", label: t("filters.property.types.villa") },
    { id: "apartment", label: t("filters.property.types.apartment") },
    { id: "penthouse", label: t("filters.property.types.penthouse") },
    { id: "mansion", label: t("filters.property.types.mansion") },
  ]

  const statusOptions = [
    { id: "ready", label: t("filters.status.ready") },
    { id: "off-plan", label: t("filters.status.offplan") },
  ]

  const handlePropertyTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked
      ? [...tempFilters.propertyTypes, type]
      : tempFilters.propertyTypes.filter((t) => t !== type)

    setTempFilters({ ...tempFilters, propertyTypes: newTypes })
  }

  const handleStatusChange = (status: string, checked: boolean) => {
    const newStatus = checked ? [...tempFilters.status, status] : tempFilters.status.filter((s) => s !== status)

    setTempFilters({ ...tempFilters, status: newStatus })
  }

  const handlePriceChange = (value: number[]) => {
    setTempFilters({ ...tempFilters, priceRange: [value[0], value[1]] })
  }

  const formatPrice = (price: number) => {
    return `$${(price / 1000000).toFixed(1)}M`
  }

  const applyFilters = () => {
    onChange(tempFilters)
    if (isMobile) {
      setIsSheetOpen(false)
    } else {
      setIsExpanded(false)
    }
  }

  const handleReset = () => {
    onReset()
    setTempFilters({
      propertyTypes: [],
      priceRange: [minPrice, maxPrice],
      status: [],
      bedrooms: null,
      bathrooms: null,
    })
    if (isMobile) {
      setIsSheetOpen(false)
    } else {
      setIsExpanded(false)
    }
  }

  const toggleFilters = () => {
    if (isMobile) {
      setIsSheetOpen(true)
    } else {
      setIsExpanded(!isExpanded)
    }
  }

  const renderFilterContent = () => (
    <>
      <Accordion type="single" collapsible className="w-full">
        {/* Price Range Filter */}
        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-medium py-3">{t("filters.price.range")}</AccordionTrigger>
          <AccordionContent>
            <div className="pt-4 px-1">
              <Slider
                value={[tempFilters.priceRange[0], tempFilters.priceRange[1]]}
                min={minPrice}
                max={maxPrice}
                step={100000}
                onValueChange={handlePriceChange}
                className="mb-6"
              />
              <div className="flex justify-between text-xs text-gray-600">
                <span>{formatPrice(tempFilters.priceRange[0])}</span>
                <span>{formatPrice(tempFilters.priceRange[1])}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Property Type Filter */}
        <AccordionItem value="type">
          <AccordionTrigger className="text-sm font-medium py-3">{t("filters.property.type")}</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {propertyTypes.map((type) => (
                <div key={type.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={`type-${type.id}`}
                    checked={tempFilters.propertyTypes.includes(type.id)}
                    onCheckedChange={(checked) => handlePropertyTypeChange(type.id, checked === true)}
                    className="h-5 w-5"
                  />
                  <Label htmlFor={`type-${type.id}`} className="text-sm font-normal cursor-pointer">
                    {type.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Status Filter */}
        <AccordionItem value="status">
          <AccordionTrigger className="text-sm font-medium py-3">{t("filters.status")}</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {statusOptions.map((status) => (
                <div key={status.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={`status-${status.id}`}
                    checked={tempFilters.status.includes(status.id)}
                    onCheckedChange={(checked) => handleStatusChange(status.id, checked === true)}
                    className="h-5 w-5"
                  />
                  <Label htmlFor={`status-${status.id}`} className="text-sm font-normal cursor-pointer">
                    {status.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Bedrooms Filter */}
        <AccordionItem value="bedrooms">
          <AccordionTrigger className="text-sm font-medium py-3">{t("filters.bedrooms")}</AccordionTrigger>
          <AccordionContent>
            <Select
              value={tempFilters.bedrooms?.toString() || "any"}
              onValueChange={(value) =>
                setTempFilters({
                  ...tempFilters,
                  bedrooms: value === "any" ? null : Number.parseInt(value),
                })
              }
            >
              <SelectTrigger className="w-full h-10">
                <SelectValue placeholder={t("filters.any")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">{t("filters.any")}</SelectItem>
                {[1, 2, 3, 4, 5].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}+
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        {/* Bathrooms Filter */}
        <AccordionItem value="bathrooms">
          <AccordionTrigger className="text-sm font-medium py-3">{t("filters.bathrooms")}</AccordionTrigger>
          <AccordionContent>
            <Select
              value={tempFilters.bathrooms?.toString() || "any"}
              onValueChange={(value) =>
                setTempFilters({
                  ...tempFilters,
                  bathrooms: value === "any" ? null : Number.parseInt(value),
                })
              }
            >
              <SelectTrigger className="w-full h-10">
                <SelectValue placeholder={t("filters.any")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">{t("filters.any")}</SelectItem>
                {[1, 2, 3, 4, 5].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}+
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )

  // Mobile sheet version
  if (isMobile) {
    return (
      <div dir={isRTL ? "rtl" : "ltr"}>
        <Button
          variant="outline"
          size="sm"
          className="bg-white/90 hover:bg-white flex items-center gap-2 h-10 px-4"
          onClick={toggleFilters}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>{t("map.filters")}</span>
          {activeFiltersCount > 0 && (
            <span className="ml-1 bg-vl-blue text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {activeFiltersCount}
            </span>
          )}
        </Button>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-xl pt-6">
            <SheetHeader>
              <SheetTitle className="text-vl-blue text-xl">{t("map.filters")}</SheetTitle>
            </SheetHeader>
            <div className="py-4 overflow-y-auto max-h-[calc(85vh-140px)]">{renderFilterContent()}</div>
            <SheetFooter className="flex flex-row justify-between gap-4 pt-4 border-t">
              <Button variant="outline" size="lg" onClick={handleReset} className="flex-1">
                {t("filters.reset")}
              </Button>
              <Button size="lg" onClick={applyFilters} className="flex-1 bg-vl-blue hover:bg-vl-blue-dark text-white">
                {t("filters.apply")} ({activeFiltersCount})
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    )
  }

  // Desktop dropdown version
  return (
    <div className="relative" dir={isRTL ? "rtl" : "ltr"} ref={filterRef}>
      <Button
        variant="outline"
        size="sm"
        className="bg-white/90 hover:bg-white flex items-center gap-2"
        onClick={toggleFilters}
      >
        <Filter className="h-4 w-4" />
        {t("map.filters")}
        {activeFiltersCount > 0 && (
          <span className="ml-1 bg-vl-blue text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {activeFiltersCount}
          </span>
        )}
      </Button>

      {isExpanded && (
        <div className="absolute top-12 right-0 z-50 w-80 bg-white rounded-lg shadow-lg p-4 border transform translate-y-0">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-vl-blue">{t("map.filters")}</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto pr-1">{renderFilterContent()}</div>

          <div className="mt-4 flex justify-between pt-4 border-t">
            <Button variant="outline" size="sm" onClick={handleReset} className="text-sm">
              {t("filters.reset")}
            </Button>
            <Button size="sm" onClick={applyFilters} className="bg-vl-blue hover:bg-vl-blue-dark text-white text-sm">
              {t("filters.apply")}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
