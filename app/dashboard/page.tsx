import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MapPin, Mail, Phone, Megaphone, Briefcase, MessageSquare, Settings } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) {
    redirect("/auth/login")
  }

  // Get counts
  const isClient = profile.role === "client"

  const { count: annoncesCount } = isClient
    ? await supabase.from("annonces").select("*", { count: "exact", head: true }).eq("user_id", user.id)
    : { count: 0 }

  const { count: servicesCount } = !isClient
    ? await supabase.from("services").select("*", { count: "exact", head: true }).eq("user_id", user.id)
    : { count: 0 }

  const { count: messagesCount } = await supabase
    .from("conversations")
    .select("*", { count: "exact", head: true })
    .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)

  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 ring-4 ring-rose-500/20">
                    <AvatarImage src={profile.avatar_url || undefined} />
                    <AvatarFallback
                      className={`text-white text-2xl ${isClient ? "bg-gradient-to-br from-green-500 to-emerald-500" : "bg-gradient-to-br from-blue-500 to-cyan-500"}`}
                    >
                      {profile.full_name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <h1 className="text-2xl font-bold mt-4">{profile.full_name || "Utilisateur"}</h1>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${isClient ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}
                  >
                    {isClient ? "Client" : "Prestataire"}
                  </span>

                  {profile.location && (
                    <p className="flex items-center gap-1 text-muted-foreground mt-3">
                      <MapPin className="h-4 w-4" />
                      {profile.location}
                    </p>
                  )}

                  <div className="w-full mt-6 space-y-3">
                    {profile.email && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm truncate">{profile.email}</span>
                      </div>
                    )}
                    {profile.phone && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{profile.phone}</span>
                      </div>
                    )}
                  </div>

                  <Link href="/settings" className="w-full mt-4">
                    <Button variant="outline" className="w-full bg-transparent">
                      <Settings className="h-4 w-4 mr-2" />
                      Modifier mon profil
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats & Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats */}
            <div className="grid sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center ${isClient ? "bg-green-100" : "bg-blue-100"}`}
                  >
                    {isClient ? (
                      <Megaphone className="h-6 w-6 text-green-600" />
                    ) : (
                      <Briefcase className="h-6 w-6 text-blue-600" />
                    )}
                  </div>
                  <p className="text-3xl font-bold mt-3">{isClient ? annoncesCount : servicesCount}</p>
                  <p className="text-sm text-muted-foreground">{isClient ? "Annonces" : "Services"}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-rose-100 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-rose-600" />
                  </div>
                  <p className="text-3xl font-bold mt-3">{messagesCount}</p>
                  <p className="text-sm text-muted-foreground">Conversations</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-amber-100 flex items-center justify-center">
                    <Settings className="h-6 w-6 text-amber-600" />
                  </div>
                  <p className="text-sm font-medium mt-3">Paramètres</p>
                  <Link href="/settings">
                    <Button variant="link" className="text-amber-600 p-0 h-auto">
                      Gérer
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isClient ? (
                  <>
                    <Link href="/annonces/create" className="block">
                      <Button className="w-full justify-start bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                        <Megaphone className="h-4 w-4 mr-2" />
                        Créer une nouvelle annonce
                      </Button>
                    </Link>
                    <Link href="/annonces/mes-annonces" className="block">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        Voir mes annonces
                      </Button>
                    </Link>
                    <Link href="/prestataires" className="block">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        Rechercher des prestataires
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/services/create" className="block">
                      <Button className="w-full justify-start bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                        <Briefcase className="h-4 w-4 mr-2" />
                        Ajouter un nouveau service
                      </Button>
                    </Link>
                    <Link href="/services/mes-services" className="block">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        Voir mes services
                      </Button>
                    </Link>
                    <Link href="/annonces" className="block">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        Rechercher des annonces
                      </Button>
                    </Link>
                  </>
                )}
                <Link href="/messages" className="block">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Mes messages
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
