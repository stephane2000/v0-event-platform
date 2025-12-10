import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Calendar, Euro, ArrowLeft, MessageSquare } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ContactButton } from "@/components/contact-button"

export default async function AnnonceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: annonce } = await supabase.from("annonces").select("*, profiles(*)").eq("id", id).single()

  if (!annonce) {
    notFound()
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isOwner = user?.id === annonce.user_id

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero Image */}
      <div className="relative h-64 md:h-80 bg-gradient-to-br from-rose-500 to-orange-500">
        <img
          src={`/.jpg?height=400&width=1200&query=${encodeURIComponent(annonce.event_type + " event celebration")}`}
          alt={annonce.title}
          className="w-full h-full object-cover mix-blend-overlay opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-4 left-4">
          <Link href="/annonces">
            <Button variant="secondary" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          </Link>
        </div>
        <div className="absolute bottom-6 left-0 right-0 container mx-auto px-4">
          <div className="flex gap-2 mb-3">
            <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-sm font-medium">
              {annonce.event_type}
            </span>
            <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium">Annonce Client</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">{annonce.title}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-semibold text-lg mb-4">Description</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{annonce.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="font-semibold text-lg mb-4">Détails de l'événement</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    <Calendar className="h-5 w-5 text-rose-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">
                        {new Date(annonce.event_date).toLocaleDateString("fr-FR", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    <MapPin className="h-5 w-5 text-rose-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Localisation</p>
                      <p className="font-medium">{annonce.location}</p>
                    </div>
                  </div>
                  {(annonce.budget_min || annonce.budget_max) && (
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 sm:col-span-2">
                      <Euro className="h-5 w-5 text-rose-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Budget</p>
                        <p className="font-medium">
                          {annonce.budget_min && annonce.budget_max
                            ? `${annonce.budget_min}€ - ${annonce.budget_max}€`
                            : annonce.budget_max
                              ? `Maximum ${annonce.budget_max}€`
                              : `Minimum ${annonce.budget_min}€`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Card */}
            <Card>
              <CardContent className="p-6">
                <h2 className="font-semibold text-lg mb-4">Publié par</h2>
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 ring-2 ring-rose-500/20">
                    <AvatarImage src={annonce.profiles?.avatar_url || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                      {annonce.profiles?.full_name?.charAt(0) || "C"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{annonce.profiles?.full_name || "Client"}</p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Client
                    </span>
                  </div>
                </div>
                {!isOwner && user && (
                  <div className="mt-4">
                    <ContactButton targetUserId={annonce.user_id} annonceId={annonce.id} />
                  </div>
                )}
                {!user && (
                  <div className="mt-4">
                    <Link href="/auth/login">
                      <Button className="w-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Connectez-vous pour contacter
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">
                  Publiée le{" "}
                  {new Date(annonce.created_at).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
