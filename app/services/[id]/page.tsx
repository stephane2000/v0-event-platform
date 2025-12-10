import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Euro, ArrowLeft, MessageSquare, Briefcase } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ContactButton } from "@/components/contact-button"

export default async function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: service } = await supabase.from("services").select("*, profiles(*)").eq("id", id).single()

  if (!service) {
    notFound()
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isOwner = user?.id === service.user_id

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero Images */}
      <div className="relative h-64 md:h-80 bg-gradient-to-br from-blue-500 to-cyan-500">
        <img
          src={
            service.images?.[0] ||
            `/placeholder.svg?height=400&width=1200&query=${encodeURIComponent(service.category + " service professional") || "/placeholder.svg"}`
          }
          alt={service.name}
          className="w-full h-full object-cover mix-blend-overlay opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-4 left-4">
          <Link href="/prestataires">
            <Button variant="secondary" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          </Link>
        </div>
        <div className="absolute bottom-6 left-0 right-0 container mx-auto px-4">
          <div className="flex gap-2 mb-3">
            <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-sm font-medium">
              {service.category}
            </span>
            <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-medium">
              Service Prestataire
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">{service.name}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-semibold text-lg mb-4">Description</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{service.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="font-semibold text-lg mb-4">Détails du service</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    <MapPin className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Zone d'intervention</p>
                      <p className="font-medium">{service.location}</p>
                    </div>
                  </div>
                  {(service.price_min || service.price_max) && (
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                      <Euro className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Tarifs</p>
                        <p className="font-medium">
                          {service.price_min && service.price_max
                            ? `${service.price_min}€ - ${service.price_max}€`
                            : service.price_max
                              ? `Jusqu'à ${service.price_max}€`
                              : `À partir de ${service.price_min}€`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Gallery */}
            {service.images && service.images.length > 1 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-semibold text-lg mb-4">Galerie</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {service.images.map((img: string, idx: number) => (
                      <div key={idx} className="aspect-square rounded-lg overflow-hidden">
                        <img
                          src={img || "/placeholder.svg"}
                          alt={`${service.name} ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Card */}
            <Card>
              <CardContent className="p-6">
                <h2 className="font-semibold text-lg mb-4">Proposé par</h2>
                <Link href={`/prestataire/${service.user_id}`}>
                  <div className="flex items-center gap-4 hover:bg-muted/50 rounded-lg p-2 -m-2 transition-colors">
                    <Avatar className="h-14 w-14 ring-2 ring-blue-500/20">
                      <AvatarImage src={service.profiles?.avatar_url || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                        {service.profiles?.full_name?.charAt(0) || "P"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{service.profiles?.full_name || "Prestataire"}</p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        <Briefcase className="h-3 w-3 mr-1" />
                        Prestataire
                      </span>
                    </div>
                  </div>
                </Link>
                {!isOwner && user && (
                  <div className="mt-4">
                    <ContactButton targetUserId={service.user_id} serviceId={service.id} />
                  </div>
                )}
                {!user && (
                  <div className="mt-4">
                    <Link href="/auth/login">
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Connectez-vous pour contacter
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
