"use client"

import { useState } from "react"
import Image, { type ImageProps } from "next/image"

interface ImageWithFallbackProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string
}

export function ImageWithFallback({
  src,
  alt,
  fallbackSrc = "/placeholder.svg",
  ...rest
}: ImageWithFallbackProps) {
  // Convert to string, trim whitespace, and handle undefined/null
  const cleanedSrc = src ? (typeof src === "string" ? src.trim() : src.toString().trim()) : fallbackSrc
  const [imgSrc, setImgSrc] = useState(cleanedSrc)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      console.log(`Image failed to load: ${imgSrc}`)
      setHasError(true)
      setImgSrc(fallbackSrc)
    }
  }

  return (
    <Image
      {...rest}
      src={imgSrc}
      alt={alt}
      onError={handleError}
      unoptimized={true} // Add this since you have unoptimized: true in config
      onLoad={() => setHasError(false)} // Reset error state on successful load
    />
  )
}