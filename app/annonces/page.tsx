import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Calendar, Euro, Search } from "lucide-react"
import Link from "next/link"
import { AnnonceFilters } from "@/components/annonce-filters"

export default async function AnnoncesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from("annonces")
    .select("*, profiles(*)")
    .eq("status", "active")
    .order("created_at", { ascending: false })

  if (params.event_type) {
    query = query.eq("event_type", params.event_type)
  }
  if (params.location) {
    query = query.ilike("location", `%${params.location}%`)
  }

  const { data: annonces } = await query

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-gradient-to-br from-rose-500 to-orange-500 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Annonces clients</h1>
          <p className="text-white/80">Trouvez des événements qui correspondent à vos services</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-72 shrink-0">
            <AnnonceFilters />
          </aside>

          {/* Annonces Grid */}
          <div className="flex-1">
            {!annonces || annonces.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Aucune annonce trouvée</h3>
                <p className="text-muted-foreground">Essayez de modifier vos filtres de recherche</p>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {annonces.map((annonce) => (
                  <Link key={annonce.id} href={`/annonces/${annonce.id}`}>
                    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
                      <div className="aspect-[16/9] bg-gradient-to-br from-rose-100 to-orange-100 relative overflow-hidden">
                        <img
                          src={`/.jpg?height=200&width=400&query=${encodeURIComponent(annonce.event_type + " event")}`}
                          alt={annonce.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute top-3 left-3 flex gap-2">
                          <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-medium">
                            {annonce.event_type}
                          </span>
                          <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-medium">
                            Client
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="font-semibold text-lg text-white line-clamp-1">{annonce.title}</h3>
                        </div>
                      </div>
                      <CardContent className="p-5">
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{annonce.description}</p>
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {annonce.location}
                          </span>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {new Date(annonce.event_date).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          {(annonce.budget_min || annonce.budget_max) && (
                            <span className="flex items-center gap-1 text-rose-600 font-medium">
                              <Euro className="h-4 w-4" />
                              {annonce.budget_min && annonce.budget_max
                                ? `${annonce.budget_min} - ${annonce.budget_max}€`
                                : annonce.budget_max
                                  ? `Max ${annonce.budget_max}€`
                                  : `Min ${annonce.budget_min}€`}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
