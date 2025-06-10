"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { MapPin, Navigation, AlertTriangle, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MapLocationPickerProps {
  onLocationChange?: (location: { lat: number; lng: number }) => void
  height?: string
  language?: string
}

// Common locations in Cameroon
const commonLocations = [
  { name: "Yaoundé - Centre", lat: 3.848, lng: 11.502 },
  { name: "Douala - Littoral", lat: 4.051, lng: 9.767 },
  { name: "Bamenda - North West", lat: 5.959, lng: 10.146 },
  { name: "Bafoussam - West", lat: 5.478, lng: 10.418 },
  { name: "Garoua - North", lat: 9.302, lng: 13.392 },
  { name: "Maroua - Far North", lat: 10.591, lng: 14.316 },
  { name: "Ngaoundéré - Adamawa", lat: 7.322, lng: 13.583 },
  { name: "Bertoua - East", lat: 4.578, lng: 13.685 },
  { name: "Ebolowa - South", lat: 2.914, lng: 11.15 },
  { name: "Limbe - South West", lat: 4.023, lng: 9.209 },
]

export function MapLocationPicker({ onLocationChange, height = "300px", language = "en" }: MapLocationPickerProps) {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [geolocationSupported, setGeolocationSupported] = useState(true)
  const [geolocationAttempted, setGeolocationAttempted] = useState(false)

  // Default to a location in Yaoundé, Cameroon
  const defaultLocation = { lat: 3.848, lng: 11.502 }

  // Check if geolocation is supported on component mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeolocationSupported(false)
      setLocationError(
        language === "en"
          ? "Geolocation is not supported by your browser. Please select a location from the list or on the map."
          : "La géolocalisation n'est pas prise en charge par votre navigateur. Veuillez sélectionner un emplacement dans la liste ou sur la carte.",
      )
    }
  }, [language])

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeolocationSupported(false)
      setLocationError(
        language === "en"
          ? "Geolocation is not supported by your browser. Please select a location from the list or on the map."
          : "La géolocalisation n'est pas prise en charge par votre navigateur. Veuillez sélectionner un emplacement dans la liste ou sur la carte.",
      )
      return
    }

    setIsLocating(true)
    setLocationError(null)
    setGeolocationAttempted(true)

    // Set a timeout for the geolocation request - increased to 15 seconds
    const timeoutId = setTimeout(() => {
      setIsLocating(false)
      setLocationError(
        language === "en"
          ? "Location request timed out. Please select a location from the list or on the map."
          : "La demande de localisation a expiré. Veuillez sélectionner un emplacement dans la liste ou sur la carte.",
      )
    }, 15000) // 15 second timeout

    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeoutId)
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setCurrentLocation(newLocation)
          if (onLocationChange) {
            onLocationChange(newLocation)
          }
          setIsLocating(false)
        },
        (error) => {
          clearTimeout(timeoutId)
          console.error("Geolocation error:", error)

          let errorMessage = ""
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                language === "en"
                  ? "Location permission denied. Please select a location from the list or on the map."
                  : "Permission de localisation refusée. Veuillez sélectionner un emplacement dans la liste ou sur la carte."
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage =
                language === "en"
                  ? "Location information is unavailable. Please select a location from the list or on the map."
                  : "Les informations de localisation ne sont pas disponibles. Veuillez sélectionner un emplacement dans la liste ou sur la carte."
              break
            case error.TIMEOUT:
              errorMessage =
                language === "en"
                  ? "Location request timed out. This is common in preview environments. Please select a location from the list or on the map."
                  : "La demande de localisation a expiré. Cela est courant dans les environnements de prévisualisation. Veuillez sélectionner un emplacement dans la liste ou sur la carte."
              break
            default:
              errorMessage =
                language === "en"
                  ? "An unknown error occurred. Please select a location from the list or on the map."
                  : "Une erreur inconnue s'est produite. Veuillez sélectionner un emplacement dans la liste ou sur la carte."
          }

          setLocationError(errorMessage)
          setIsLocating(false)
        },
        {
          enableHighAccuracy: false, // Set to false to improve performance and reduce timeouts
          timeout: 15000, // 15 seconds
          maximumAge: 60000, // Accept positions up to 1 minute old
        },
      )
    } catch (err) {
      clearTimeout(timeoutId)
      console.error("Geolocation error:", err)
      setLocationError(
        language === "en"
          ? "An error occurred while trying to get your location. Please select a location from the list or on the map."
          : "Une erreur s'est produite lors de la tentative d'obtention de votre position. Veuillez sélectionner un emplacement dans la liste ou sur la carte.",
      )
      setIsLocating(false)
    }
  }

  // Handle selection from the dropdown
  const handleLocationSelect = (value: string) => {
    const selectedLocation = commonLocations.find((loc) => `${loc.lat},${loc.lng}` === value)
    if (selectedLocation) {
      const newLocation = {
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
      }
      setCurrentLocation(newLocation)
      if (onLocationChange) {
        onLocationChange(newLocation)
      }
      // Clear any previous errors
      setLocationError(null)
    }
  }

  // Simulate clicking on the map by allowing manual coordinate entry
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Get click position relative to the map container
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left // x position within the element
    const y = e.clientY - rect.top // y position within the element

    // Convert to a simulated lat/lng (this is just for visual effect)
    // In a real app with Google Maps, you'd get actual coordinates
    const mapWidth = rect.width
    const mapHeight = rect.height

    // Create a small random offset around Yaoundé
    const latOffset = (y / mapHeight - 0.5) * 0.1
    const lngOffset = (x / mapWidth - 0.5) * 0.1

    const newLocation = {
      lat: defaultLocation.lat + latOffset,
      lng: defaultLocation.lng + lngOffset,
    }

    setCurrentLocation(newLocation)
    if (onLocationChange) {
      onLocationChange(newLocation)
    }

    // Clear any previous errors when user selects a location manually
    setLocationError(null)
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-600" />
            <span className="font-medium">
              {language === "en" ? "Select Delivery Location" : "Sélectionner l'emplacement de livraison"}
            </span>
          </div>
          {geolocationSupported && !geolocationAttempted && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={getCurrentLocation}
              disabled={isLocating}
              className="text-green-600"
            >
              {isLocating
                ? language === "en"
                  ? "Locating..."
                  : "Localisation..."
                : language === "en"
                  ? "Use My Location"
                  : "Utiliser ma position"}
            </Button>
          )}
        </div>

        {/* Common locations dropdown */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === "en" ? "Select a common location" : "Sélectionner un emplacement commun"}
          </label>
          <Select onValueChange={handleLocationSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={language === "en" ? "Choose a city" : "Choisir une ville"} />
            </SelectTrigger>
            <SelectContent>
              {commonLocations.map((location) => (
                <SelectItem key={`${location.lat},${location.lng}`} value={`${location.lat},${location.lng}`}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {locationError && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-700 flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1">{language === "en" ? "Location Notice" : "Avis de localisation"}</p>
            <p>{locationError}</p>
          </div>
        </div>
      )}

      {/* Map section with "or" divider */}
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-2 text-sm text-gray-500">
            {language === "en" ? "OR click on map" : "OU cliquez sur la carte"}
          </span>
        </div>
      </div>

      <div
        className="relative border rounded-md overflow-hidden bg-gray-100 cursor-crosshair"
        style={{ height }}
        onClick={handleMapClick}
      >
        {/* Map placeholder with Cameroon-like styling */}
        <div className="absolute inset-0 bg-[#E8F4D9]">
          {/* Simulated roads */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300"></div>
          <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-gray-300"></div>
          <div className="absolute top-1/4 left-1/4 right-0 h-0.5 bg-gray-300"></div>
          <div className="absolute top-3/4 left-0 right-1/4 h-0.5 bg-gray-300"></div>
          <div className="absolute top-0 bottom-0 left-3/4 w-0.5 bg-gray-300"></div>
          <div className="absolute top-0 bottom-0 left-1/4 w-0.5 bg-gray-300"></div>

          {/* City labels */}
          {commonLocations.map((city, index) => {
            // Calculate position based on lat/lng relative to Yaoundé
            const left = 50 + ((city.lng - defaultLocation.lng) / 0.1) * 50
            const top = 50 + ((city.lat - defaultLocation.lat) / 0.1) * 50

            // Only show cities that would appear on our simplified map
            if (left >= 0 && left <= 100 && top >= 0 && top <= 100) {
              return (
                <div
                  key={index}
                  className="absolute bg-white px-2 py-1 rounded-md text-xs border border-gray-300 transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    fontWeight: city.name.includes("Yaoundé") ? "bold" : "normal",
                  }}
                >
                  {city.name.split(" - ")[0]}
                </div>
              )
            }
            return null
          })}
        </div>

        {/* Location marker */}
        {currentLocation && (
          <div
            className="absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2 z-10"
            style={{
              left: `${50 + ((currentLocation.lng - defaultLocation.lng) / 0.1) * 50}%`,
              top: `${50 + ((currentLocation.lat - defaultLocation.lat) / 0.1) * 50}%`,
            }}
          >
            <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center animate-pulse">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <div className="w-16 h-16 bg-green-600 bg-opacity-20 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10"></div>
          </div>
        )}

        {/* Instructions overlay */}
        {!currentLocation && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10">
            <div className="bg-white p-3 rounded-md shadow-md text-center max-w-xs">
              <Navigation className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium">
                {language === "en"
                  ? "Click on the map to select your delivery location"
                  : "Cliquez sur la carte pour sélectionner votre lieu de livraison"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {language === "en"
                  ? "Or use the dropdown menu above to select a city"
                  : "Ou utilisez le menu déroulant ci-dessus pour sélectionner une ville"}
              </p>
            </div>
          </div>
        )}
      </div>

      {currentLocation && (
        <div className="bg-green-50 border border-green-200 rounded-md p-2 text-sm text-green-700 flex items-center gap-2">
          <div className="flex-shrink-0">
            <Check className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="font-medium">{language === "en" ? "Location selected" : "Emplacement sélectionné"}</p>
            <p className="text-xs">
              {language === "en" ? "Coordinates" : "Coordonnées"}: {currentLocation.lat.toFixed(6)},{" "}
              {currentLocation.lng.toFixed(6)}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
