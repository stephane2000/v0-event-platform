import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Plus } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function MesAnnoncesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: annonces } = await supabase
    .from("annonces")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Mes annonces</h1>
            <p className="text-muted-foreground">Gérez vos annonces d'événements</p>
          </div>
          <Link href="/annonces/create">
            <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle annonce
            </Button>
          </Link>
        </div>

        {!annonces || annonces.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Aucune annonce</h3>
            <p className="text-muted-foreground mb-4">Créez votre première annonce pour trouver des prestataires</p>
            <Link href="/annonces/create">
              <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                <Plus className="h-4 w-4 mr-2" />
                Créer une annonce
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {annonces.map((annonce) => (
              <Card key={annonce.id} className="overflow-hidden hover:shadow-lg transition-all">
                <div className="aspect-video bg-gradient-to-br from-green-100 to-emerald-100 relative">
                  <img
                    src={`/.jpg?height=200&width=400&query=${encodeURIComponent(annonce.event_type + " event")}`}
                    alt={annonce.title}
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${
                      annonce.status === "active" ? "bg-green-500 text-white" : "bg-gray-500 text-white"
                    }`}
                  >
                    {annonce.status === "active" ? "Active" : "Fermée"}
                  </span>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1">{annonce.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{annonce.description}</p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {annonce.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(annonce.event_date).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/annonces/${annonce.id}`} className="flex-1">
                      <Button variant="outline" className="w-full bg-transparent" size="sm">
                        Voir
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
