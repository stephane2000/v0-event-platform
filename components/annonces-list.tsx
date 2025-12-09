"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, MapPin, Euro, MessageSquare, Megaphone } from "lucide-react"
import type { Annonce, Profile } from "@/lib/types"
import { EVENT_TYPES, LOCATIONS } from "@/lib/types"

interface AnnonceWithProfile extends Annonce {
  profiles: Profile
}

interface AnnoncesListProps {
  annonces: AnnonceWithProfile[]
  currentUserId: string
}

export function AnnoncesList({ annonces, currentUserId }: AnnoncesListProps) {
  const [search, setSearch] = useState("")
  const [eventType, setEventType] = useState<string>("all")
  const [location, setLocation] = useState<string>("all")

  const filteredAnnonces = annonces.filter((annonce) => {
    const matchesSearch =
      annonce.title.toLowerCase().includes(search.toLowerCase()) ||
      annonce.description.toLowerCase().includes(search.toLowerCase())

    const matchesEventType = eventType === "all" || annonce.event_type === eventType

    const matchesLocation = location === "all" || annonce.location === location

    return matchesSearch && matchesEventType && matchesLocation
  })

  const formatDate = (date: string | null) => {
    if (!date) return "Date flexible"
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatBudget = (min: number | null, max: number | null) => {
    if (!min && !max) return "Budget non défini"
    if (min && max) return `${min}€ - ${max}€`
    if (min) return `À partir de ${min}€`
    return `Jusqu'à ${max}€`
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une annonce..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={eventType} onValueChange={setEventType}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Type d'événement" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous types</SelectItem>
            {EVENT_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Localisation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes villes</SelectItem>
            {LOCATIONS.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      {filteredAnnonces.length === 0 ? (
        <div className="text-center py-12">
          <Megaphone className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">Aucune annonce trouvée</h3>
          <p className="mt-2 text-sm text-muted-foreground">Essayez de modifier vos critères de recherche</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAnnonces.map((annonce) => (
            <Card key={annonce.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <Avatar className="h-12 w-12 shrink-0">
                    <AvatarImage src={annonce.profiles.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {annonce.profiles.full_name?.charAt(0) || annonce.profiles.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                      <h3 className="font-medium">{annonce.title}</h3>
                      <Badge variant="outline">{annonce.event_type}</Badge>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{annonce.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(annonce.event_date)}
                      </span>
                      {annonce.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {annonce.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Euro className="h-4 w-4" />
                        {formatBudget(annonce.budget_min, annonce.budget_max)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        Par {annonce.profiles.full_name || "Client"} •{" "}
                        {new Date(annonce.created_at).toLocaleDateString("fr-FR")}
                      </p>

                      {annonce.user_id !== currentUserId && (
                        <Button size="sm" asChild>
                          <Link href={`/messages/new?to=${annonce.user_id}&annonce=${annonce.id}`}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Contacter
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
