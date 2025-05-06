"use client"

import { useState } from "react"
import { MapPin, ChevronDown } from "lucide-react"
import { motion } from "framer-motion"
import { useLocation } from "@/contexts/location-context"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function LocationSelector() {
  const { selectedRegion, selectedCity, setSelectedRegion, setSelectedCity, allRegions, citiesInSelectedRegion } =
    useLocation()
  const [isOpen, setIsOpen] = useState(false)

  if (!selectedRegion || !selectedCity) {
    return null // Don't render until we have a selected region and city
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <MapPin className="h-4 w-4 text-green-600" />
          <span className="text-sm">{selectedCity.name}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[220px] max-h-[400px] overflow-auto">
        <div className="p-2">
          <h4 className="text-sm font-medium mb-1">Region</h4>
          <div className="grid grid-cols-1 gap-1">
            {allRegions.map((region) => (
              <DropdownMenuItem
                key={region.id}
                onClick={() => setSelectedRegion(region)}
                className={selectedRegion.id === region.id ? "bg-green-50 text-green-600" : ""}
              >
                {region.name}
                {selectedRegion.id === region.id && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
                    <Badge variant="outline" className="ml-2 bg-green-100 text-green-600 text-xs">
                      Selected
                    </Badge>
                  </motion.div>
                )}
              </DropdownMenuItem>
            ))}
          </div>
        </div>

        <DropdownMenuSeparator />

        <div className="p-2">
          <h4 className="text-sm font-medium mb-1">City</h4>
          <div className="grid grid-cols-1 gap-1">
            {citiesInSelectedRegion.map((city) => (
              <DropdownMenuItem
                key={city.id}
                onClick={() => setSelectedCity(city)}
                className={selectedCity.id === city.id ? "bg-green-50 text-green-600" : ""}
              >
                {city.name}
                {selectedCity.id === city.id && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
                    <Badge variant="outline" className="ml-2 bg-green-100 text-green-600 text-xs">
                      Selected
                    </Badge>
                  </motion.div>
                )}
              </DropdownMenuItem>
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
