"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { SERVICE_CATEGORIES, REGIONS_DEPARTEMENTS } from "@/lib/constants"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Filter, X } from "lucide-react"

export function PrestatairesFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [category, setCategory] = useState(searchParams.get("category") || "")
  const [location, setLocation] = useState(searchParams.get("location") || "")

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (category) params.set("category", category)
    if (location) params.set("location", location)
    router.push(`/prestataires?${params.toString()}`)
  }

  const clearFilters = () => {
    setCategory("")
    setLocation("")
    router.push("/prestataires")
  }

  const hasFilters = category || location

  return (
    <Card className="sticky top-20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Filtres
          </CardTitle>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground h-8">
              <X className="h-4 w-4 mr-1" />
              Effacer
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label>Catégorie de service</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent>
              {SERVICE_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Région</Label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Toutes les régions" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(REGIONS_DEPARTEMENTS).map((reg) => (
                <SelectItem key={reg} value={reg}>
                  {reg}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={applyFilters}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
        >
          Appliquer les filtres
        </Button>
      </CardContent>
    </Card>
  )
}
