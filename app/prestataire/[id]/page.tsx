import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Mail, Phone, ArrowLeft, Briefcase, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ContactButton } from "@/components/contact-button"

export default async function PrestatairePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Get the prestataire profile
  const { data: prestataire, error } = await supabase.from("profiles").select("*").eq("id", id).single()

  if (error || !prestataire) {
    notFound()
  }

  // Get prestataire's services
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("user_id", id)
    .eq("status", "active")
    .order("created_at", { ascending: false })

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isOwner = user?.id === prestataire.id

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header Banner */}
      <div className="relative h-48 md:h-64 bg-gradient-to-br from-blue-500 to-cyan-500">
        <div className="absolute inset-0 bg-[url('/abstract-geometric-flow.png')] opacity-10" />
        <div className="absolute top-4 left-4">
          <Link href="/prestataires">
            <Button variant="secondary" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-28 w-28 ring-4 ring-white shadow-lg">
                    <AvatarImage src={prestataire.avatar_url || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-3xl">
                      {prestataire.full_name?.charAt(0) || "P"}
                    </AvatarFallback>
                  </Avatar>
                  <h1 className="text-2xl font-bold mt-4">{prestataire.full_name || "Prestataire"}</h1>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 mt-2">
                    <Briefcase className="h-4 w-4 mr-1" />
                    Prestataire
                  </span>

                  {prestataire.location && (
                    <p className="flex items-center gap-1 text-muted-foreground mt-3">
                      <MapPin className="h-4 w-4" />
                      {prestataire.location}
                    </p>
                  )}

                  {prestataire.bio && <p className="text-muted-foreground mt-4 text-sm">{prestataire.bio}</p>}

                  <div className="w-full mt-6 space-y-3">
                    {prestataire.email && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm truncate">{prestataire.email}</span>
                      </div>
                    )}
                    {prestataire.phone && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{prestataire.phone}</span>
                      </div>
                    )}
                  </div>

                  {!isOwner && user && (
                    <div className="w-full mt-6">
                      <ContactButton targetUserId={prestataire.id} />
                    </div>
                  )}

                  {!user && (
                    <div className="w-full mt-6">
                      <Link href="/auth/login">
                        <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                          Connectez-vous pour contacter
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Services */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Star className="h-6 w-6 text-blue-500" />
              Services proposés
            </h2>

            {!services || services.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Ce prestataire n'a pas encore ajouté de services.</p>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {services.map((service) => (
                  <Link key={service.id} href={`/services/${service.id}`}>
                    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
                      <div className="aspect-video bg-gradient-to-br from-blue-100 to-cyan-100 relative overflow-hidden">
                        <img
                          src={
                            service.images?.[0] ||
                            `/placeholder.svg?height=200&width=400&query=${encodeURIComponent(service.category + " service") || "/placeholder.svg"}`
                          }
                          alt={service.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-medium">
                          {service.category}
                        </span>
                      </div>
                      <CardContent className="p-5">
                        <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{service.description}</p>
                        {(service.price_min || service.price_max) && (
                          <p className="text-blue-600 font-semibold">
                            {service.price_min && service.price_max
                              ? `${service.price_min}€ - ${service.price_max}€`
                              : service.price_max
                                ? `Jusqu'à ${service.price_max}€`
                                : `À partir de ${service.price_min}€`}
                          </p>
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
    </div>
  )
}
