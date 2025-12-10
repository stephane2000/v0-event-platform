"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EVENT_TYPES, SERVICE_CATEGORIES, REGIONS_DEPARTEMENTS } from "@/lib/constants"
import { Search, X } from "lucide-react"

interface TopFiltersProps {
  type: "annonces" | "prestataires"
}

export function TopFilters({ type }: TopFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [category, setCategory] = useState(searchParams.get("category") || searchParams.get("event_type") || "")
  const [location, setLocation] = useState(searchParams.get("location") || "")

  const categories = type === "annonces" ? EVENT_TYPES : SERVICE_CATEGORIES
  const categoryParam = type === "annonces" ? "event_type" : "category"

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (category) params.set(categoryParam, category)
    if (location) params.set("location", location)
    router.push(`/${type}?${params.toString()}`)
  }

  const clearFilters = () => {
    setCategory("")
    setLocation("")
    router.push(`/${type}`)
  }

  const hasFilters = category || location

  return (
    <div className="bg-background rounded-xl border shadow-sm p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={type === "annonces" ? "Type d'événement" : "Catégorie"} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Région / Département" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(REGIONS_DEPARTEMENTS).map(([region, deps]) => (
                <div key={region}>
                  <SelectItem value={region} className="font-semibold">
                    {region}
                  </SelectItem>
                  {deps.map((dep) => (
                    <SelectItem key={dep} value={dep} className="pl-6">
                      {dep}
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={applyFilters}
            className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white"
          >
            <Search className="h-4 w-4 mr-2" />
            Rechercher
          </Button>
          {hasFilters && (
            <Button variant="outline" onClick={clearFilters}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
