"use client"

import { useState, useEffect, useRef } from "react"
import { Loader } from "lucide-react"

interface GoogleMapProps {
  initialLocation?: { lat: number; lng: number }
  onLocationChange?: (location: { lat: number; lng: number }) => void
  height?: string
}

// Declare google as a global variable to satisfy Typescript
declare global {
  interface Window {
    google: any
  }
}

export function GoogleMap({ initialLocation, onLocationChange, height = "300px" }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [marker, setMarker] = useState<google.maps.Marker | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Default to a location in Yaoundé, Cameroon if no initial location is provided
  const defaultLocation = { lat: 3.848, lng: 11.502 }
  const location = initialLocation || defaultLocation

  useEffect(() => {
    // Load Google Maps API script
    const loadGoogleMapsAPI = () => {
      if (window.google && window.google.maps) {
        initializeMap()
        return
      }

      setLoading(true)

      // In a real app, you would use your own API key
      const apiKey = "GOOGLE_MAPS_API_KEY_PLACEHOLDER"
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
      script.async = true
      script.defer = true

      script.onload = () => {
        initializeMap()
      }

      script.onerror = () => {
        setError("Failed to load Google Maps. Please try again later.")
        setLoading(false)
      }

      document.head.appendChild(script)
    }

    const initializeMap = () => {
      if (!mapRef.current) return

      try {
        // Create the map
        const newMap = new window.google.maps.Map(mapRef.current, {
          center: location,
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        })

        // Create a marker
        const newMarker = new window.google.maps.Marker({
          position: location,
          map: newMap,
          draggable: true,
          animation: window.google.maps.Animation.DROP,
        })

        // Add event listener for marker drag end
        window.google.maps.event.addListener(newMarker, "dragend", () => {
          const position = newMarker.getPosition()
          if (position && onLocationChange) {
            onLocationChange({
              lat: position.lat(),
              lng: position.lng(),
            })
          }
        })

        // Add event listener for map click
        window.google.maps.event.addListener(newMap, "click", (event) => {
          const clickedLocation = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          }

          newMarker.setPosition(clickedLocation)

          if (onLocationChange) {
            onLocationChange(clickedLocation)
          }
        })

        setMap(newMap)
        setMarker(newMarker)
        setLoading(false)
      } catch (err) {
        setError("An error occurred while initializing the map.")
        setLoading(false)
      }
    }

    loadGoogleMapsAPI()

    return () => {
      // Clean up
      if (map) {
        window.google.maps.event.clearInstanceListeners(map)
      }
      if (marker) {
        window.google.maps.event.clearInstanceListeners(marker)
      }
    }
  }, [])

  // Update marker position when initialLocation changes
  useEffect(() => {
    if (marker && initialLocation) {
      marker.setPosition(initialLocation)
      if (map) {
        map.panTo(initialLocation)
      }
    }
  }, [initialLocation, marker, map])

  if (error) {
    return (
      <div
        className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center justify-center"
        style={{ height }}
      >
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="relative rounded-md overflow-hidden" style={{ height }}>
      <div ref={mapRef} className="w-full h-full" />

      {loading && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-70 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader className="h-5 w-5 animate-spin text-green-600" />
            <span>Loading map...</span>
          </div>
        </div>
      )}
    </div>
  )
}
