"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EVENT_TYPES, REGIONS_DEPARTEMENTS } from "@/lib/constants"
import { ImageUpload } from "@/components/image-upload"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Loader2, Megaphone, Calendar, MapPin, Euro, FileText, AlertCircle, ImageIcon } from "lucide-react"
import { toast } from "sonner"

export default function CreateAnnoncePage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [eventType, setEventType] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [region, setRegion] = useState("")
  const [departement, setDepartement] = useState("")
  const [budgetMin, setBudgetMin] = useState("")
  const [budgetMax, setBudgetMax] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isCheckingRole, setIsCheckingRole] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    async function checkUserRole() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/auth/login")
          return
        }

        setUserId(user.id)

        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

        setUserRole(profile?.role || "client")
      } catch (error) {
        console.error("Error checking role:", error)
        setUserRole("client")
      } finally {
        setIsCheckingRole(false)
      }
    }

    checkUserRole()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (images.length === 0) {
      toast.error("Veuillez ajouter au moins une image")
      return
    }

    if (!userId) {
      toast.error("Vous devez être connecté")
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()
      const location = departement || region

      const { error } = await supabase.from("annonces").insert({
        user_id: userId,
        title,
        description,
        event_type: eventType,
        event_date: eventDate,
        location,
        budget_min: budgetMin ? Number.parseInt(budgetMin) : null,
        budget_max: budgetMax ? Number.parseInt(budgetMax) : null,
        images,
        status: "active",
      })

      if (error) throw error

      toast.success("Annonce créée avec succès!")
      router.push("/annonces/mes-annonces")
    } catch (error) {
      console.error("Error creating annonce:", error)
      toast.error(error instanceof Error ? error.message : "Erreur lors de la création")
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
      </div>
    )
  }

  if (userRole === "prestataire") {
    return (
      <div className="min-h-screen bg-muted/30 py-12">
        <div className="container mx-auto px-4 max-w-lg">
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Accès réservé aux clients</h2>
              <p className="text-muted-foreground mb-4">
                En tant que prestataire, vous ne pouvez pas créer d'annonces. Vous pouvez cependant proposer vos
                services.
              </p>
              <Button
                onClick={() => router.push("/services/create")}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                Créer un service
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <Megaphone className="h-7 w-7 text-white" />
            </div>
            <CardTitle className="text-2xl">Créer une annonce client</CardTitle>
            <CardDescription>Décrivez votre événement pour trouver les meilleurs prestataires</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Images de l'événement *
                </Label>
                <ImageUpload images={images} onChange={setImages} maxImages={5} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Titre de l'annonce
                </Label>
                <Input
                  id="title"
                  placeholder="Ex: Recherche DJ pour mariage"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description détaillée</Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez votre événement, vos attentes, le nombre d'invités..."
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Type d'événement
                  </Label>
                  <Select value={eventType} onValueChange={setEventType} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventDate" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date de l'événement
                  </Label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Région
                  </Label>
                  <Select
                    value={region}
                    onValueChange={(val) => {
                      setRegion(val)
                      setDepartement("")
                    }}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une région" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(REGIONS_DEPARTEMENTS).map((reg) => (
                        <SelectItem key={reg} value={reg}>
                          {reg}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Département (optionnel)</Label>
                  <Select value={departement} onValueChange={setDepartement} disabled={!region}>
                    <SelectTrigger>
                      <SelectValue placeholder="Préciser le département" />
                    </SelectTrigger>
                    <SelectContent>
                      {region &&
                        REGIONS_DEPARTEMENTS[region as keyof typeof REGIONS_DEPARTEMENTS]?.map((dep) => (
                          <SelectItem key={dep} value={dep}>
                            {dep}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Euro className="h-4 w-4" />
                  Budget (optionnel)
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="Minimum"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Maximum"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création...
                  </>
                ) : (
                  "Publier mon annonce"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
