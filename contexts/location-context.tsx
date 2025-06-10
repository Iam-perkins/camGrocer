"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { regions, type City, type Region, getCityById } from "@/lib/location-data"

type LocationContextType = {
  selectedRegion: Region | null
  selectedCity: City | null
  setSelectedRegion: (region: Region) => void
  setSelectedCity: (city: City) => void
  allRegions: Region[]
  citiesInSelectedRegion: City[]
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

export function LocationProvider({ children }: { children: ReactNode }) {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null)
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [citiesInSelectedRegion, setCitiesInSelectedRegion] = useState<City[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Load saved location from localStorage on mount
  useEffect(() => {
    try {
      const savedCityId = localStorage.getItem("selectedCityId")

      if (savedCityId) {
        const cityId = Number.parseInt(savedCityId)
        const city = getCityById(cityId)

        if (city) {
          // Find the region this city belongs to
          const region = regions.find((r) => r.cities.some((c) => c.id === cityId))

          if (region) {
            setSelectedRegion(region)
            setSelectedCity(city)
          }
        }
      } else {
        // Default to first region and city if nothing is saved
        setSelectedRegion(regions[0])
        setSelectedCity(regions[0].cities[0])
      }

      setIsInitialized(true)
    } catch (error) {
      console.error("Error initializing location context:", error)
      // Set defaults in case of error
      setSelectedRegion(regions[0])
      setSelectedCity(regions[0].cities[0])
      setIsInitialized(true)
    }
  }, [])

  // Update cities when region changes
  useEffect(() => {
    if (selectedRegion) {
      setCitiesInSelectedRegion(selectedRegion.cities)

      // If no city is selected or the selected city is not in this region,
      // default to the first city in the region
      if (!selectedCity || !selectedRegion.cities.some((c) => c.id === selectedCity.id)) {
        setSelectedCity(selectedRegion.cities[0])
      }
    }
  }, [selectedRegion, selectedCity])

  // Save selected city to localStorage
  useEffect(() => {
    if (selectedCity) {
      try {
        localStorage.setItem("selectedCityId", selectedCity.id.toString())
      } catch (error) {
        console.error("Error saving to localStorage:", error)
      }
    }
  }, [selectedCity])

  const handleSetSelectedRegion = (region: Region) => {
    setSelectedRegion(region)
  }

  const handleSetSelectedCity = (city: City) => {
    setSelectedCity(city)

    // Also update the region if needed
    const region = regions.find((r) => r.cities.some((c) => c.id === city.id))
    if (region && (!selectedRegion || selectedRegion.id !== region.id)) {
      setSelectedRegion(region)
    }
  }

  return (
    <LocationContext.Provider
      value={{
        selectedRegion,
        selectedCity,
        setSelectedRegion: handleSetSelectedRegion,
        setSelectedCity: handleSetSelectedCity,
        allRegions: regions,
        citiesInSelectedRegion,
      }}
    >
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const context = useContext(LocationContext)
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider")
  }
  return context
}
