import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Search, Briefcase, Euro } from "lucide-react"
import Link from "next/link"
import { TopFilters } from "@/components/top-filters"

export default async function PrestatairesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Get prestataires
  let query = supabase.from("profiles").select("*").eq("role", "prestataire")

  if (params.location) {
    query = query.ilike("location", `%${params.location}%`)
  }

  const { data: prestataires } = await query.order("created_at", { ascending: false })

  // If category filter, get services and filter prestataires
  let filteredPrestataires = prestataires || []

  if (params.category && prestataires) {
    const { data: services } = await supabase.from("services").select("user_id").eq("category", params.category)

    const userIdsWithCategory = [...new Set(services?.map((s) => s.user_id) || [])]
    filteredPrestataires = prestataires.filter((p) => userIdsWithCategory.includes(p.id))
  }

  // Get services for each prestataire (show up to 2 services)
  const prestatairesWithServices = await Promise.all(
    filteredPrestataires.map(async (presta) => {
      const { data: services } = await supabase
        .from("services")
        .select("*")
        .eq("user_id", presta.id)
        .eq("status", "active")
        .limit(2)

      const { count } = await supabase
        .from("services")
        .select("*", { count: "exact", head: true })
        .eq("user_id", presta.id)
        .eq("status", "active")

      return { ...presta, services: services || [], serviceCount: count || 0 }
    }),
  )

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-cyan-500 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Prestataires</h1>
          <p className="text-white/80">Trouvez le prestataire idéal pour votre événement</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <TopFilters type="prestataires" />

        {/* Prestataires Grid */}
        <div className="mt-8">
          {prestatairesWithServices.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Aucun prestataire trouvé</h3>
              <p className="text-muted-foreground">Essayez de modifier vos filtres de recherche</p>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {prestatairesWithServices.map((presta) => (
                <Link key={presta.id} href={`/prestataire/${presta.id}`}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                    <CardContent className="p-6">
                      {/* Header with avatar */}
                      <div className="flex items-start gap-4 mb-4">
                        <Avatar className="h-16 w-16 ring-4 ring-blue-500/20">
                          <AvatarImage src={presta.avatar_url || undefined} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xl">
                            {presta.full_name?.charAt(0) || "P"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg truncate">{presta.full_name || "Prestataire"}</h3>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            <Briefcase className="h-3 w-3 mr-1" />
                            Prestataire
                          </span>
                          {presta.location && (
                            <p className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                              <MapPin className="h-3 w-3" />
                              {presta.location}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Bio */}
                      {presta.bio && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{presta.bio}</p>}

                      {/* Services preview */}
                      {presta.services.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Services</p>
                          <div className="space-y-2">
                            {presta.services.map((service: any) => (
                              <div
                                key={service.id}
                                className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                              >
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{service.name}</p>
                                  <p className="text-xs text-muted-foreground">{service.category}</p>
                                </div>
                                {(service.price_min || service.price_max) && (
                                  <span className="text-xs font-medium text-blue-600 flex items-center">
                                    <Euro className="h-3 w-3 mr-0.5" />
                                    {service.price_min && service.price_max
                                      ? `${service.price_min}-${service.price_max}`
                                      : service.price_min
                                        ? `${service.price_min}+`
                                        : `${service.price_max}`}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                          {presta.serviceCount > 2 && (
                            <p className="text-xs text-blue-600 font-medium">
                              +{presta.serviceCount - 2} autre{presta.serviceCount - 2 > 1 ? "s" : ""} service
                              {presta.serviceCount - 2 > 1 ? "s" : ""}
                            </p>
                          )}
                        </div>
                      )}

                      {presta.services.length === 0 && (
                        <p className="text-sm text-muted-foreground italic">Aucun service publié</p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
