"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Shield, Megaphone, Users, Star, MapPin, Calendar, Loader2, AlertTriangle, LayoutDashboard } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { Profile, Annonce } from "@/lib/types"

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [annonces, setAnnonces] = useState<Annonce[]>([])
  const [prestataires, setPrestataires] = useState<Profile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkAdminAndLoadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (!profile?.is_admin) {
        setIsAdmin(false)
        setIsLoading(false)
        return
      }

      setIsAdmin(true)

      // Load annonces
      const { data: annoncesData } = await supabase
        .from("annonces")
        .select("*, profiles(*)")
        .eq("status", "active")
        .order("created_at", { ascending: false })

      // Load prestataires
      const { data: prestatairesData } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "prestataire")
        .order("created_at", { ascending: false })

      setAnnonces(annoncesData || [])
      setPrestataires(prestatairesData || [])
      setIsLoading(false)
    }

    checkAdminAndLoadData()
  }, [supabase, router])

  const toggleFeaturedAnnonce = async (id: string, currentValue: boolean) => {
    setUpdatingId(id)
    try {
      const { error } = await supabase.from("annonces").update({ featured: !currentValue }).eq("id", id)

      if (error) throw error

      setAnnonces((prev) => prev.map((a) => (a.id === id ? { ...a, featured: !currentValue } : a)))

      toast.success(!currentValue ? "Annonce mise en avant" : "Annonce retirée de la mise en avant")
    } catch (error) {
      toast.error("Erreur lors de la mise à jour")
    } finally {
      setUpdatingId(null)
    }
  }

  const toggleFeaturedPrestataire = async (id: string, currentValue: boolean) => {
    setUpdatingId(id)
    try {
      const { data, error } = await supabase.from("profiles").update({ featured: !currentValue }).eq("id", id).select()

      if (error) {
        console.error("Error updating prestataire featured status:", error)
        throw error
      }

      console.log("Prestataire updated successfully:", data)

      setPrestataires((prev) => prev.map((p) => (p.id === id ? { ...p, featured: !currentValue } : p)))

      toast.success(!currentValue ? "Prestataire mis en avant" : "Prestataire retiré de la mise en avant")
    } catch (error) {
      console.error("Full error:", error)
      toast.error("Erreur lors de la mise à jour")
    } finally {
      setUpdatingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-muted/30 py-12">
        <div className="container mx-auto px-4 max-w-lg">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Accès refusé</h2>
              <p className="text-muted-foreground mb-4">
                Vous n'avez pas les droits administrateur pour accéder à cette page.
              </p>
              <Button onClick={() => router.push("/")} variant="outline">
                Retour à l'accueil
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const featuredAnnoncesCount = annonces.filter((a) => a.featured).length
  const featuredPrestatairesCount = prestataires.filter((p) => p.featured).length

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-600 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-white" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">Administration</h1>
          </div>
          <p className="text-white/80">Gérez les mises en avant sur la page d'accueil</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center">
                <Megaphone className="h-6 w-6 text-rose-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{annonces.length}</p>
                <p className="text-sm text-muted-foreground">Annonces</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{prestataires.length}</p>
                <p className="text-sm text-muted-foreground">Prestataires</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <Star className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{featuredAnnoncesCount}</p>
                <p className="text-sm text-muted-foreground">Annonces vedette</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <LayoutDashboard className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{featuredPrestatairesCount}</p>
                <p className="text-sm text-muted-foreground">Presta vedette</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="annonces" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="annonces" className="flex items-center gap-2">
              <Megaphone className="h-4 w-4" />
              Annonces
            </TabsTrigger>
            <TabsTrigger value="prestataires" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Prestataires
            </TabsTrigger>
          </TabsList>

          {/* Annonces Tab */}
          <TabsContent value="annonces">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des annonces</CardTitle>
                <CardDescription>
                  Activez la mise en avant pour afficher les annonces sur la page d'accueil
                </CardDescription>
              </CardHeader>
              <CardContent>
                {annonces.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Aucune annonce disponible</p>
                ) : (
                  <div className="space-y-4">
                    {annonces.map((annonce) => (
                      <div
                        key={annonce.id}
                        className="flex items-center gap-4 p-4 rounded-lg border bg-background hover:bg-muted/50 transition-colors"
                      >
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                          <img
                            src={
                              annonce.images?.[0] ||
                              `/placeholder.svg?height=64&width=64&query=${encodeURIComponent(annonce.event_type) || "/placeholder.svg"}`
                            }
                            alt={annonce.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{annonce.title}</h4>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {annonce.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(annonce.event_date).toLocaleDateString("fr-FR")}
                            </span>
                          </div>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-muted rounded text-xs">
                            {annonce.event_type}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          {annonce.featured && <Star className="h-5 w-5 text-amber-500 fill-amber-500" />}
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Vedette</span>
                            <Switch
                              checked={annonce.featured || false}
                              onCheckedChange={() => toggleFeaturedAnnonce(annonce.id, annonce.featured || false)}
                              disabled={updatingId === annonce.id}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Prestataires Tab */}
          <TabsContent value="prestataires">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des prestataires</CardTitle>
                <CardDescription>
                  Activez la mise en avant pour afficher les prestataires sur la page d'accueil
                </CardDescription>
              </CardHeader>
              <CardContent>
                {prestataires.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Aucun prestataire disponible</p>
                ) : (
                  <div className="space-y-4">
                    {prestataires.map((presta) => (
                      <div
                        key={presta.id}
                        className="flex items-center gap-4 p-4 rounded-lg border bg-background hover:bg-muted/50 transition-colors"
                      >
                        <Avatar className="h-14 w-14 ring-2 ring-blue-500/20">
                          <AvatarImage src={presta.avatar_url || undefined} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                            {presta.full_name?.charAt(0) || "P"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{presta.full_name || "Prestataire"}</h4>
                          {presta.location && (
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {presta.location}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">{presta.email}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          {presta.featured && <Star className="h-5 w-5 text-amber-500 fill-amber-500" />}
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Vedette</span>
                            <Switch
                              checked={presta.featured || false}
                              onCheckedChange={() => toggleFeaturedPrestataire(presta.id, presta.featured || false)}
                              disabled={updatingId === presta.id}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
