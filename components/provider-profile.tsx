import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Phone, Mail, Euro, MessageSquare } from "lucide-react"
import type { Profile, Service } from "@/lib/types"
import { Navbar } from "@/components/navbar"

interface ProviderWithServices extends Profile {
  services: Service[]
}

interface ProviderProfileProps {
  provider: ProviderWithServices
  currentUserId: string | null
}

export function ProviderProfile({ provider, currentUserId }: ProviderProfileProps) {
  const formatPrice = (min: number | null, max: number | null) => {
    if (!min && !max) return "Sur devis"
    if (min && max) return `${min}€ - ${max}€`
    if (min) return `À partir de ${min}€`
    return `Jusqu'à ${max}€`
  }

  return (
    <div className="min-h-svh flex flex-col">
      <Navbar profile={currentUserId ? ({ id: currentUserId } as Profile) : null} />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/dashboard/prestataires">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={provider.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary text-3xl">
                    {provider.full_name?.charAt(0) || provider.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h1 className="text-xl font-semibold">{provider.full_name || "Prestataire"}</h1>
                <Badge className="mt-2 bg-primary/10 text-primary border-0">Prestataire</Badge>

                {provider.bio && <p className="mt-4 text-sm text-muted-foreground">{provider.bio}</p>}

                <div className="mt-6 w-full space-y-3 text-sm">
                  {provider.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {provider.location}
                    </div>
                  )}
                  {provider.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {provider.phone}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {provider.email}
                  </div>
                </div>

                {currentUserId && currentUserId !== provider.id && (
                  <Button className="w-full mt-6" asChild>
                    <Link href={`/messages/new?to=${provider.id}`}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contacter
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Services proposés</CardTitle>
              <CardDescription>
                {provider.services.filter((s) => s.status === "active").length} service(s) actif(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {provider.services.filter((s) => s.status === "active").length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Aucun service disponible</p>
              ) : (
                <div className="space-y-4">
                  {provider.services
                    .filter((s) => s.status === "active")
                    .map((service) => (
                      <div key={service.id} className="p-4 rounded-lg border border-border/50">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium">{service.name}</h3>
                              <Badge variant="outline">{service.category}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="flex items-center gap-1 text-sm font-medium text-primary">
                              <Euro className="h-4 w-4" />
                              {formatPrice(service.price_min, service.price_max)}
                            </div>
                            {service.location && (
                              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 justify-end">
                                <MapPin className="h-3 w-3" />
                                {service.location}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
