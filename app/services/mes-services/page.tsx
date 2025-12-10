import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Euro, Plus, Briefcase } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function MesServicesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Mes services</h1>
            <p className="text-muted-foreground">Gérez vos offres de services</p>
          </div>
          <Link href="/services/create">
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau service
            </Button>
          </Link>
        </div>

        {!services || services.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Briefcase className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Aucun service</h3>
            <p className="text-muted-foreground mb-4">Créez votre premier service pour attirer des clients</p>
            <Link href="/services/create">
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                <Plus className="h-4 w-4 mr-2" />
                Créer un service
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-all">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-cyan-100 relative">
                  <img
                    src={
                      service.images?.[0] ||
                      `/placeholder.svg?height=200&width=400&query=${encodeURIComponent(service.category + " service") || "/placeholder.svg"}`
                    }
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${
                      service.status === "active" ? "bg-blue-500 text-white" : "bg-gray-500 text-white"
                    }`}
                  >
                    {service.status === "active" ? "Actif" : "Inactif"}
                  </span>
                </div>
                <CardContent className="p-5">
                  <span className="text-xs font-medium text-blue-600">{service.category}</span>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1">{service.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{service.description}</p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {service.location}
                    </span>
                    {(service.price_min || service.price_max) && (
                      <span className="flex items-center gap-1 text-blue-600 font-medium">
                        <Euro className="h-4 w-4" />
                        {service.price_min && service.price_max
                          ? `${service.price_min}-${service.price_max}€`
                          : service.price_max
                            ? `Max ${service.price_max}€`
                            : `Min ${service.price_min}€`}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/services/${service.id}`} className="flex-1">
                      <Button variant="outline" className="w-full bg-transparent" size="sm">
                        Voir
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
