"use client"

import Image from "next/image"
import { useState } from "react"

interface PropertyImageProps {
  src?: string
  alt: string
  width: number
  height: number
  className?: string
  fallbackText?: string
}

export default function PropertyImage({ src, alt, width, height, className = "", fallbackText }: PropertyImageProps) {
  const [imageError, setImageError] = useState(false)
  const [imageSrc, setImageSrc] = useState(
    src || `/placeholder.svg?height=${height}&width=${width}&text=${encodeURIComponent(fallbackText || alt)}`,
  )

  const handleError = () => {
    if (!imageError) {
      setImageError(true)
      setImageSrc(`/placeholder.svg?height=${height}&width=${width}&text=${encodeURIComponent(fallbackText || alt)}`)
    }
  }

  return (
    <Image
      src={imageSrc || "/placeholder.svg"}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      priority={false}
    />
  )
}
