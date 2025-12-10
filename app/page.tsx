import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Calendar, MapPin, Music, Camera, Utensils, Sparkles, Star, AlertCircle } from "lucide-react"
import Link from "next/link"

export default async function HomePage() {
  const supabase = await createClient()

  const { data: featuredAnnonces } = await supabase
    .from("annonces")
    .select("*, profiles(*)")
    .eq("status", "active")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(3)

  const { data: featuredPrestataires } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "prestataire")
    .eq("featured", true)
    .limit(4)

  const categories = [
    { name: "DJ / Musique", icon: Music, color: "from-purple-500 to-pink-500" },
    { name: "Photographe", icon: Camera, color: "from-blue-500 to-cyan-500" },
    { name: "Traiteur", icon: Utensils, color: "from-orange-500 to-red-500" },
    { name: "Décoration", icon: Sparkles, color: "from-green-500 to-emerald-500" },
  ]

  const hasFeaturedAnnonces = featuredAnnonces && featuredAnnonces.length > 0
  const hasFeaturedPrestataires = featuredPrestataires && featuredPrestataires.length > 0

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50" />
        <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-5" />
        <div className="container relative mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Organisez vos{" "}
              <span className="bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
                événements
              </span>{" "}
              en toute sérénité
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Prest'Event met en relation clients et prestataires pour vos mariages, anniversaires, séminaires et tous
              vos événements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/annonces">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white w-full sm:w-auto"
                >
                  Parcourir les annonces
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/prestataires">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Trouver un prestataire
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Catégories populaires</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link key={cat.name} href={`/prestataires?category=${encodeURIComponent(cat.name)}`} className="group">
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <cat.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="font-semibold">{cat.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Annonces Section - Show empty state if none featured */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
              Annonces en vedette
            </h2>
            <Link href="/annonces">
              <Button variant="ghost" className="text-rose-500 hover:text-rose-600">
                Voir tout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {hasFeaturedAnnonces ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredAnnonces.map((annonce) => (
                <Link key={annonce.id} href={`/annonces/${annonce.id}`}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                    <div className="aspect-video bg-gradient-to-br from-rose-100 to-orange-100 relative">
                      <img
                        src={
                          annonce.images?.[0] ||
                          `/placeholder.svg?height=200&width=400&query=${encodeURIComponent(annonce.event_type || "event")}`
                        }
                        alt={annonce.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-medium">
                          {annonce.event_type}
                        </span>
                        <span className="px-3 py-1 bg-amber-500 text-white rounded-full text-xs font-medium flex items-center gap-1">
                          <Star className="h-3 w-3 fill-white" />
                          Vedette
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-1">{annonce.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{annonce.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {annonce.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(annonce.event_date).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="p-12 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="font-semibold text-lg text-muted-foreground mb-2">Aucune annonce mise en avant</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Découvrez toutes les annonces disponibles sur la plateforme.
                </p>
                <Link href="/annonces">
                  <Button variant="outline">
                    Voir toutes les annonces
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Featured Prestataires Section - Show empty state if none featured */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
              Prestataires en vedette
            </h2>
            <Link href="/prestataires">
              <Button variant="ghost" className="text-rose-500 hover:text-rose-600">
                Voir tout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {hasFeaturedPrestataires ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredPrestataires.map((presta) => (
                <Link key={presta.id} href={`/prestataire/${presta.id}`}>
                  <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative">
                    <div className="absolute -top-2 -right-2 z-10">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-white">
                        <Star className="h-3 w-3 fill-white" />
                      </span>
                    </div>
                    <CardContent className="p-5 text-center">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-rose-500/20">
                        <img
                          src={presta.avatar_url || `/placeholder.svg?height=80&width=80&query=professional%20portrait`}
                          alt={presta.full_name || "Prestataire"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-semibold mb-1">{presta.full_name || "Prestataire"}</h3>
                      {presta.location && (
                        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {presta.location}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="p-12 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="font-semibold text-lg text-muted-foreground mb-2">Aucun prestataire mis en avant</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Découvrez tous les prestataires disponibles sur la plateforme.
                </p>
                <Link href="/prestataires">
                  <Button variant="outline">
                    Voir tous les prestataires
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-rose-500 to-orange-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Prêt à organiser votre événement ?</h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui ont trouvé leurs prestataires idéaux sur Prest'Event.
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg" variant="secondary" className="font-semibold">
              Créer un compte gratuit
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
