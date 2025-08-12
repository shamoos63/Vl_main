"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { useI18n } from "@/lib/i18n"
import { formatPrice } from "@/lib/utils"

interface PriceRangeSliderProps {
  minPrice: number
  maxPrice: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  className?: string
}

export default function PriceRangeSlider({
  minPrice,
  maxPrice,
  value,
  onChange,
  className = "",
}: PriceRangeSliderProps) {
  const { t, isRTL } = useI18n()
  const [localValue, setLocalValue] = useState<[number, number]>(value)

  // Update local value when external value changes
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  // Handle slider change
  const handleChange = (newValue: number[]) => {
    const typedValue: [number, number] = [newValue[0], newValue[1]]
    setLocalValue(typedValue)
  }

  // Handle slider release - only update parent when user finishes dragging
  const handleChangeEnd = () => {
    onChange(localValue)
  }

  return (
    <div className={`space-y-5 ${className}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">{t("filters.price.range")}</h3>
          <span className="text-xs text-gray-500">
            {formatPrice(localValue[0])} - {formatPrice(localValue[1])}
          </span>
        </div>

        <Slider
          defaultValue={[minPrice, maxPrice]}
          value={localValue}
          min={minPrice}
          max={maxPrice}
          step={50000}
          onValueChange={handleChange}
          onValueCommit={handleChangeEnd}
          className="py-1"
        />

        <div className="flex justify-between text-xs text-gray-500">
          <span>{formatPrice(minPrice)}</span>
          <span>{formatPrice(maxPrice)}</span>
        </div>
      </div>
    </div>
  )
}
