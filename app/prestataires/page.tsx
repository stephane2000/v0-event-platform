import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Search, Briefcase } from "lucide-react"
import Link from "next/link"
import { PrestatairesFilters } from "@/components/prestataires-filters"

export default async function PrestatairesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Get prestataires with their services count
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

  // Get service count for each prestataire
  const prestatairesWithServices = await Promise.all(
    filteredPrestataires.map(async (presta) => {
      const { count } = await supabase
        .from("services")
        .select("*", { count: "exact", head: true })
        .eq("user_id", presta.id)
        .eq("status", "active")

      return { ...presta, serviceCount: count || 0 }
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
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters */}
          <aside className="lg:w-72 shrink-0">
            <PrestatairesFilters />
          </aside>

          {/* Prestataires Grid */}
          <div className="flex-1">
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
                      <CardContent className="p-6 text-center">
                        <Avatar className="h-20 w-20 mx-auto ring-4 ring-blue-500/20">
                          <AvatarImage src={presta.avatar_url || undefined} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-2xl">
                            {presta.full_name?.charAt(0) || "P"}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="font-semibold text-lg mt-4">{presta.full_name || "Prestataire"}</h3>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 mt-1">
                          <Briefcase className="h-3 w-3 mr-1" />
                          Prestataire
                        </span>
                        {presta.location && (
                          <p className="flex items-center justify-center gap-1 text-sm text-muted-foreground mt-2">
                            <MapPin className="h-4 w-4" />
                            {presta.location}
                          </p>
                        )}
                        {presta.bio && <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{presta.bio}</p>}
                        <p className="text-sm font-medium text-blue-600 mt-3">
                          {presta.serviceCount} service{presta.serviceCount > 1 ? "s" : ""}
                        </p>
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
