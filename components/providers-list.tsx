"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, MessageSquare, Users } from "lucide-react"
import type { Profile, Service } from "@/lib/types"
import { SERVICE_CATEGORIES, LOCATIONS } from "@/lib/types"

interface ProviderWithServices extends Profile {
  services: Service[]
}

interface ProvidersListProps {
  providers: ProviderWithServices[]
  currentUserId: string
}

export function ProvidersList({ providers, currentUserId }: ProvidersListProps) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<string>("all")
  const [location, setLocation] = useState<string>("all")

  const filteredProviders = providers.filter((provider) => {
    const matchesSearch =
      provider.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      provider.services.some(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.category.toLowerCase().includes(search.toLowerCase()),
      )

    const matchesCategory = category === "all" || provider.services.some((s) => s.category === category)

    const matchesLocation =
      location === "all" || provider.location === location || provider.services.some((s) => s.location === location)

    return matchesSearch && matchesCategory && matchesLocation
  })

  const getUniqueCategories = (services: Service[]) => {
    return [...new Set(services.map((s) => s.category))]
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un prestataire..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes catégories</SelectItem>
            {SERVICE_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
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
      {filteredProviders.length === 0 ? (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">Aucun prestataire trouvé</h3>
          <p className="mt-2 text-sm text-muted-foreground">Essayez de modifier vos critères de recherche</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProviders.map((provider) => (
            <Card key={provider.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={provider.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-lg">
                      {provider.full_name?.charAt(0) || provider.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{provider.full_name || "Prestataire"}</h3>
                    {provider.location && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {provider.location}
                      </p>
                    )}
                  </div>
                </div>

                {provider.bio && <p className="mt-4 text-sm text-muted-foreground line-clamp-2">{provider.bio}</p>}

                <div className="mt-4 flex flex-wrap gap-1">
                  {getUniqueCategories(provider.services)
                    .slice(0, 3)
                    .map((cat) => (
                      <Badge key={cat} variant="secondary" className="text-xs">
                        {cat}
                      </Badge>
                    ))}
                  {getUniqueCategories(provider.services).length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{getUniqueCategories(provider.services).length - 3}
                    </Badge>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                    <Link href={`/prestataire/${provider.id}`}>Voir le profil</Link>
                  </Button>
                  {provider.id !== currentUserId && (
                    <Button size="sm" asChild>
                      <Link href={`/messages/new?to=${provider.id}`}>
                        <MessageSquare className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
