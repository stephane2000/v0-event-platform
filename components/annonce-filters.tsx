"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { EVENT_TYPES, REGIONS_DEPARTEMENTS } from "@/lib/constants"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Filter, X } from "lucide-react"

export function AnnonceFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [eventType, setEventType] = useState(searchParams.get("event_type") || "")
  const [region, setRegion] = useState(searchParams.get("location") || "")

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (eventType) params.set("event_type", eventType)
    if (region) params.set("location", region)
    router.push(`/annonces?${params.toString()}`)
  }

  const clearFilters = () => {
    setEventType("")
    setRegion("")
    router.push("/annonces")
  }

  const hasFilters = eventType || region

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
          <Label>Type d'événement</Label>
          <Select value={eventType} onValueChange={setEventType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent>
              {EVENT_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Région</Label>
          <Select value={region} onValueChange={setRegion}>
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
          className="w-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600"
        >
          Appliquer les filtres
        </Button>
      </CardContent>
    </Card>
  )
}
