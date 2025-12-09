"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Briefcase, MapPin, Euro, Eye, Edit, Trash2 } from "lucide-react"
import type { Profile, Service } from "@/lib/types"
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

interface ProviderDashboardProps {
  profile: Profile
  services: Service[]
}

export function ProviderDashboard({ profile, services }: ProviderDashboardProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    const supabase = createClient()
    await supabase.from("services").delete().eq("id", id)
    router.refresh()
    setDeletingId(null)
  }

  const formatPrice = (min: number | null, max: number | null) => {
    if (!min && !max) return "Sur devis"
    if (min && max) return `${min}€ - ${max}€`
    if (min) return `À partir de ${min}€`
    return `Jusqu'à ${max}€`
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-primary/10 text-primary border-0">Actif</Badge>
      case "inactive":
        return <Badge variant="secondary">Inactif</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Bonjour, {profile.full_name || "Prestataire"}</h1>
          <p className="text-muted-foreground">Gérez vos services et répondez aux annonces</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/services/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau service
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-semibold">{services.length}</div>
            <p className="text-sm text-muted-foreground">Services proposés</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-semibold">{services.filter((s) => s.status === "active").length}</div>
            <p className="text-sm text-muted-foreground">Services actifs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-semibold">0</div>
            <p className="text-sm text-muted-foreground">Demandes reçues</p>
          </CardContent>
        </Card>
      </div>

      {/* Services List */}
      <Card>
        <CardHeader>
          <CardTitle>Mes services</CardTitle>
          <CardDescription>Vos prestations événementielles</CardDescription>
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">Aucun service</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Créez votre premier service pour être visible des clients
              </p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/services/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Créer un service
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border border-border/50 hover:border-border transition-colors"
                >
                  <div className="flex-1 mb-4 md:mb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{service.name}</h3>
                      {getStatusBadge(service.status)}
                      <Badge variant="outline">{service.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{service.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      {service.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {service.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Euro className="h-4 w-4" />
                        {formatPrice(service.price_min, service.price_max)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/services/${service.id}`}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Voir</span>
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/services/${service.id}/edit`}>
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
                          <AlertDialogTitle>Supprimer ce service ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action est irréversible. Le service sera définitivement supprimé.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(service.id)}
                            disabled={deletingId === service.id}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {deletingId === service.id ? "Suppression..." : "Supprimer"}
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
