"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, MapPin, Euro, Eye, Edit, Trash2 } from "lucide-react"
import type { Profile, Annonce } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ClientDashboardProps {
  profile: Profile
  annonces: Annonce[]
}

export function ClientDashboard({ profile, annonces }: ClientDashboardProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    const supabase = createClient()
    await supabase.from("annonces").delete().eq("id", id)
    router.refresh()
    setDeletingId(null)
  }

  const formatDate = (date: string | null) => {
    if (!date) return "Non définie"
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatBudget = (min: number | null, max: number | null) => {
    if (!min && !max) return "Non défini"
    if (min && max) return `${min}€ - ${max}€`
    if (min) return `À partir de ${min}€`
    return `Jusqu'à ${max}€`
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-primary/10 text-primary border-0">Active</Badge>
      case "closed":
        return <Badge variant="secondary">Clôturée</Badge>
      case "cancelled":
        return <Badge variant="destructive">Annulée</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Bonjour, {profile.full_name || "Client"}</h1>
          <p className="text-muted-foreground">Gérez vos annonces et trouvez des prestataires</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/annonces/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle annonce
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-semibold">{annonces.length}</div>
            <p className="text-sm text-muted-foreground">Annonces créées</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-semibold">{annonces.filter((a) => a.status === "active").length}</div>
            <p className="text-sm text-muted-foreground">Annonces actives</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-semibold">{annonces.filter((a) => a.status === "closed").length}</div>
            <p className="text-sm text-muted-foreground">Événements réalisés</p>
          </CardContent>
        </Card>
      </div>

      {/* Annonces List */}
      <Card>
        <CardHeader>
          <CardTitle>Mes annonces</CardTitle>
          <CardDescription>Vos demandes de prestations événementielles</CardDescription>
        </CardHeader>
        <CardContent>
          {annonces.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">Aucune annonce</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Créez votre première annonce pour trouver des prestataires
              </p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/annonces/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Créer une annonce
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {annonces.map((annonce) => (
                <div
                  key={annonce.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border border-border/50 hover:border-border transition-colors"
                >
                  <div className="flex-1 mb-4 md:mb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{annonce.title}</h3>
                      {getStatusBadge(annonce.status)}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{annonce.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(annonce.event_date)}
                      </span>
                      {annonce.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {annonce.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Euro className="h-4 w-4" />
                        {formatBudget(annonce.budget_min, annonce.budget_max)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/annonces/${annonce.id}`}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Voir</span>
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/annonces/${annonce.id}/edit`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Modifier</span>
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Supprimer</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer cette annonce ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action est irréversible. L'annonce sera définitivement supprimée.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(annonce.id)}
                            disabled={deletingId === annonce.id}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {deletingId === annonce.id ? "Suppression..." : "Supprimer"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
