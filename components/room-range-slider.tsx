"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { useI18n } from "@/lib/i18n"

interface RoomRangeSliderProps {
  minValue: number
  maxValue: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  label: string
  className?: string
}

export default function RoomRangeSlider({
  minValue,
  maxValue,
  value,
  onChange,
  label,
  className = "",
}: RoomRangeSliderProps) {
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
          <h3 className="text-sm font-medium text-gray-700">{label}</h3>
          <span className="text-xs text-gray-500">
            {localValue[0]} - {localValue[1]}
          </span>
        </div>

        <Slider
          defaultValue={[minValue, maxValue]}
          value={localValue}
          min={minValue}
          max={maxValue}
          step={1}
          onValueChange={handleChange}
          onValueCommit={handleChangeEnd}
          className="py-1"
        />

        <div className="flex justify-between text-xs text-gray-500">
          <span>{minValue}</span>
          <span>{maxValue}</span>
        </div>
      </div>
    </div>
  )
}
