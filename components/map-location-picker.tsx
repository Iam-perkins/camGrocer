"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { MapPin, Navigation, AlertTriangle, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LocationInfo {
  lat: number;
  lng: number;
  displayName?: string;
}

interface MapLocationPickerProps {
  onLocationChange?: (location: { lat: number; lng: number }) => void
  height?: string
  language?: string
}

// Buea location and boundaries
const BUEA_CENTER = { lat: 4.1534, lng: 9.2423 };
const BUEA_BOUNDS = {
  north: 4.2,
  south: 4.1,
  west: 9.18,
  east: 9.3
};

// Common locations in Buea
const commonLocations = [
  { name: "Buea Town - Central", lat: 4.1534, lng: 9.2423 },
  { name: "Molyko - Buea", lat: 4.1597, lng: 9.2649 },
  { name: "Muea - Buea", lat: 4.1367, lng: 9.2583 },
  { name: "Bonduma - Buea", lat: 4.1689, lng: 9.2581 },
  { name: "Great Soppo - Buea", lat: 4.1486, lng: 9.2314 },
  { name: "Small Soppo - Buea", lat: 4.1444, lng: 9.2208 },
  { name: "Mile 16 - Buea", lat: 4.1744, lng: 9.2792 },
  { name: "Mile 17 - Buea", lat: 4.1694, lng: 9.2708 },
  { name: "Mile 18 - Buea", lat: 4.1644, lng: 9.2625 },
  { name: "University of Buea", lat: 4.1667, lng: 9.2333 },
];

export function MapLocationPicker({ onLocationChange, height = "300px", language = "en" }: MapLocationPickerProps) {
  const [currentLocation, setCurrentLocation] = useState<LocationInfo | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [geolocationSupported, setGeolocationSupported] = useState(true)
  const [geolocationAttempted, setGeolocationAttempted] = useState(false)

  // Default to Buea center
  const defaultLocation = BUEA_CENTER

  // Check if geolocation is supported on component mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeolocationSupported(false)
      setLocationError(
        language === "en"
          ? "Geolocation is not supported by your browser. Please select a location from the list or on the map."
          : "La géolocalisation n'est pas prise en charge par votre navigateur. Veuillez sélectionner un emplacement dans la liste ou sur la carte.",
      )
    } else {
      // Try to get current location on mount if supported
      getCurrentLocation();
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

    // Set a timeout for the geolocation request
    const timeoutId = setTimeout(() => {
      setIsLocating(false)
      setLocationError(
        language === "en"
          ? "Location request timed out. Please select a location from the list or on the map."
          : "La demande de localisation a expiré. Veuillez sélectionner un emplacement dans la liste ou sur la carte.",
      )
    }, 10000) // 10 second timeout (reduced from 15)


    // Wrap in try-catch to handle any unexpected errors
    try {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          clearTimeout(timeoutId);
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // Show loading state
          setCurrentLocation({ lat, lng, displayName: 'Getting location...' });
          
          // Check if location is within Buea bounds
          if (isWithinBuea(lat, lng)) {
            try {
              // Get location name
              const locationName = await reverseGeocode(lat, lng);
              const newLocation = { lat, lng, displayName: locationName };
              
              setCurrentLocation(newLocation);
              if (onLocationChange) {
                onLocationChange(newLocation);
              }
              setLocationError(null);
            } catch (error) {
              console.error('Error getting location name:', error);
              const newLocation = { lat, lng, displayName: 'Your Location' };
              setCurrentLocation(newLocation);
              if (onLocationChange) {
                onLocationChange(newLocation);
              }
            }
          } else {
            setLocationError(
              language === "en"
                ? "Your current location is outside Buea. Please select a location within Buea on the map."
                : "Votre position actuelle est en dehors de Buea. Veuillez sélectionner un emplacement à Buea sur la carte."
            );
          }
          
          setIsLocating(false);
        },
        (error) => {
          clearTimeout(timeoutId)
          
          // Don't show error in console for denied permissions (common case)
          if (error.code !== error.PERMISSION_DENIED) {
            console.error("Geolocation error:", error)
          }

          let errorMessage = ""
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                language === "en"
                  ? "Location access was denied. Please enable location services or select a location from the map."
                  : "L'accès à la localisation a été refusé. Veuillez activer les services de localisation ou sélectionner un emplacement sur la carte."
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage =
                language === "en"
                  ? "Location information is currently unavailable. Please select a location from the map."
                  : "Les informations de localisation ne sont pas disponibles pour le moment. Veuillez sélectionner un emplacement sur la carte."
              break
            case error.TIMEOUT:
              errorMessage =
                language === "en"
                  ? "Location request took too long. Please select a location from the map."
                  : "La demande de localisation a pris trop de temps. Veuillez sélectionner un emplacement sur la carte."
              break
            default:
              errorMessage =
                language === "en"
                  ? "Couldn't get your location. Please select a location from the map."
                  : "Impossible d'obtenir votre position. Veuillez sélectionner un emplacement sur la carte."
          }

          setLocationError(errorMessage)
          setIsLocating(false)
        },
        {
          enableHighAccuracy: false, // Better performance
          timeout: 10000, // 10 seconds
          maximumAge: 30000, // Cache for 30 seconds
        }
      )
    } catch (err) {
      clearTimeout(timeoutId)
      console.error("Unexpected geolocation error:", err)
      setIsLocating(false)
      // Don't show a scary error, just let the user select manually
      setLocationError(
        language === "en"
          ? "Please select your location on the map."
          : "Veuillez sélectionner votre emplacement sur la carte."
      )
    }
  }

  // Known locations in Buea with their coordinates
  const knownBueaLocations = {
    // Untarred Malingo area
    '4.147,9.235': 'Untarred Malingo',
    '4.15,9.24': 'Untarred Malingo',
    '4.145,9.23': 'Untarred Malingo',
    // Other known locations in Buea
    '4.1534,9.2423': 'Buea Town',
    '4.1597,9.2649': 'Molyko',
    '4.1367,9.2583': 'Muea',
    '4.1689,9.2581': 'Bonduma',
    '4.1486,9.2314': 'Great Soppo',
    '4.1444,9.2208': 'Small Soppo',
    '4.1744,9.2792': 'Mile 16',
    '4.1694,9.2708': 'Mile 17',
    '4.1644,9.2625': 'Mile 18',
    '4.1667,9.2333': 'University of Buea'
  };

  // Check if coordinates are close to a known location
  const getKnownLocation = (lat: number, lng: number): string | null => {
    const precision = 3; // 3 decimal places (~100m precision)
    const latRounded = lat.toFixed(precision);
    const lngRounded = lng.toFixed(precision);
    
    // Check exact match first
    const exactKey = `${latRounded},${lngRounded}`;
    if (knownBueaLocations[exactKey as keyof typeof knownBueaLocations]) {
      return knownBueaLocations[exactKey as keyof typeof knownBueaLocations];
    }
    
    // If no exact match, check nearby coordinates
    for (const [coords, name] of Object.entries(knownBueaLocations)) {
      const [knownLat, knownLng] = coords.split(',').map(Number);
      const latDiff = Math.abs(knownLat - lat);
      const lngDiff = Math.abs(knownLng - lng);
      
      // Within ~200m
      if (latDiff < 0.002 && lngDiff < 0.002) {
        return name;
      }
    }
    
    return null;
  };

  // Reverse geocode coordinates to get location name
  const reverseGeocode = useCallback(async (lat: number, lng: number): Promise<string> => {
    try {
      // First check known locations
      const knownLocation = getKnownLocation(lat, lng);
      if (knownLocation) {
        return knownLocation;
      }
      
      // If not a known location, try to get from OSM
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();
      
      // Try to get the most specific name available
      const locationName = (
        data.address?.neighbourhood ||
        data.address?.suburb ||
        data.address?.quarter ||
        data.address?.road ||
        data.address?.village ||
        data.address?.town ||
        data.address?.city ||
        data.display_name?.split(',')[0] ||
        'Selected Location'
      );
      
      // If we got a generic name, try to make it more specific
      if (locationName === 'Buea' || locationName === 'Buea I' || locationName === 'Buea II') {
        // Check distance from known landmarks to give a better name
        const distanceToTown = Math.hypot(lat - 4.1534, lng - 9.2423);
        const distanceToMolyko = Math.hypot(lat - 4.1597, lng - 9.2649);
        
        if (distanceToMolyko < 0.02) return 'Molyko Area';
        if (distanceToTown < 0.02) return 'Buea Town Area';
        if (lat > 4.16) return 'Upper Buea';
        if (lat < 4.14) return 'Lower Buea';
      }
      
      return locationName;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return 'Selected Location';
    }
  }, []);

  // Check if a location is within Buea bounds
  const isWithinBuea = (lat: number, lng: number) => {
    return (
      lat >= BUEA_BOUNDS.south &&
      lat <= BUEA_BOUNDS.north &&
      lng >= BUEA_BOUNDS.west &&
      lng <= BUEA_BOUNDS.east
    );
  };

  // Handle selection from the dropdown
  const handleLocationSelect = async (value: string) => {
    const selectedLocation = commonLocations.find((loc) => `${loc.lat},${loc.lng}` === value)
    if (selectedLocation) {
      const { lat, lng } = selectedLocation;
      
      if (isWithinBuea(lat, lng)) {
        // Show loading state with the known name
        const displayName = selectedLocation.name.split(' - ')[0];
        setCurrentLocation({ lat, lng, displayName });
        
        try {
          // Try to get more specific name
          const locationName = await reverseGeocode(lat, lng);
          const newLocation = { lat, lng, displayName: locationName };
          
          setCurrentLocation(newLocation);
          if (onLocationChange) {
            onLocationChange(newLocation);
          }
        } catch (error) {
          console.error('Error getting location name:', error);
          // Keep the name from common locations if reverse geocoding fails
          const newLocation = { lat, lng, displayName };
          setCurrentLocation(newLocation);
          if (onLocationChange) {
            onLocationChange(newLocation);
          }
        }
        
        setLocationError(null);
      } else {
        setLocationError(
          language === "en" 
            ? "Selected location is outside Buea. Please choose a location within Buea."
            : "L'emplacement sélectionné est en dehors de Buea. Veuillez sélectionner un emplacement à Buea."
        )
      }
    }
  }

  // Handle map click to select a location
  const handleMapClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Calculate lat/lng based on click position within Buea bounds
    const lat = BUEA_BOUNDS.south + (1 - y / rect.height) * (BUEA_BOUNDS.north - BUEA_BOUNDS.south)
    const lng = BUEA_BOUNDS.west + (x / rect.width) * (BUEA_BOUNDS.east - BUEA_BOUNDS.west)

    if (isWithinBuea(lat, lng)) {
      // Show loading state
      setCurrentLocation({ lat, lng, displayName: 'Locating...' });
      
      try {
        // Get location name
        const locationName = await reverseGeocode(lat, lng);
        const newLocation = { lat, lng, displayName: locationName };
        
        setCurrentLocation(newLocation);
        if (onLocationChange) {
          onLocationChange(newLocation);
        }
        setLocationError(null);
      } catch (error) {
        console.error('Error getting location name:', error);
        const newLocation = { lat, lng, displayName: 'Selected Location' };
        setCurrentLocation(newLocation);
        if (onLocationChange) {
          onLocationChange(newLocation);
        }
      }
    } else {
      setLocationError(
        language === "en" 
          ? "Selected location is outside Buea. Please choose a location within Buea."
          : "L'emplacement sélectionné est en dehors de Buea. Veuillez sélectionner un emplacement à Buea."
      )
    }
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
        {/* Map with Buea styling */}
        <div className="absolute inset-0 bg-[#E8F4D9]">
          {/* Main roads */}
          <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-gray-400"></div>
          <div className="absolute top-0 bottom-0 left-1/2 w-1.5 bg-gray-400"></div>
          
          {/* Secondary roads */}
          <div className="absolute top-1/3 left-1/4 right-1/4 h-1 bg-gray-300"></div>
          <div className="absolute top-2/3 left-1/4 right-1/4 h-1 bg-gray-300"></div>
          <div className="absolute top-1/4 bottom-1/4 left-1/3 w-1 bg-gray-300"></div>
          <div className="absolute top-1/4 bottom-1/4 left-2/3 w-1 bg-gray-300"></div>

          {/* Buea boundary outline */}
          <div 
            className="absolute border-2 border-red-400 border-dashed"
            style={{
              left: '5%',
              top: '5%',
              width: '90%',
              height: '90%',
            }}
          >
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-2 text-xs text-red-600">
              {language === "en" ? "Buea Boundary" : "Limites de Buea"}
            </div>
          </div>

          {/* Location markers */}
          {commonLocations.map((location, index) => {
            const left = ((location.lng - BUEA_BOUNDS.west) / (BUEA_BOUNDS.east - BUEA_BOUNDS.west)) * 90 + 5;
            const top = ((BUEA_BOUNDS.north - location.lat) / (BUEA_BOUNDS.north - BUEA_BOUNDS.south)) * 90 + 5;
            
            return (
              <div
                key={index}
                className="absolute w-2 h-2 bg-blue-600 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                }}
                title={location.name}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-white px-1.5 py-0.5 rounded text-xs border border-gray-200 shadow-sm">
                  {location.name.split(" - ")[0]}
                </div>
              </div>
            );
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
        <div className="bg-green-50 border border-green-200 rounded-md p-3 text-sm text-green-700">
          <div className="flex items-start gap-2">
            <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">
                {currentLocation.displayName || (language === "en" ? "Selected Location" : "Emplacement sélectionné")}
              </p>
              <p className="text-xs mt-1 text-green-600">
                {language === "en" ? "Coordinates" : "Coordonnées"}: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
              </p>
              <p className="text-xs mt-1 text-green-600">
                {language === "en" ? "City" : "Ville"}: Buea, {language === "en" ? "Southwest Region" : "Région du Sud-Ouest"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
