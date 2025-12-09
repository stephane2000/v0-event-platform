import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Calendar, Users, MessageSquare, Search, Shield, Zap, Camera, Music, Utensils, Flower2 } from "lucide-react"

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  const features = [
    {
      icon: Search,
      title: "Recherche simplifiée",
      description: "Trouvez rapidement les prestataires qui correspondent à vos besoins.",
    },
    {
      icon: MessageSquare,
      title: "Messagerie intégrée",
      description: "Communiquez directement avec les prestataires depuis la plateforme.",
    },
    {
      icon: Shield,
      title: "Profils vérifiés",
      description: "Tous les prestataires sont vérifiés pour garantir la qualité.",
    },
    {
      icon: Zap,
      title: "Réponse rapide",
      description: "Recevez des devis et réponses en quelques heures.",
    },
  ]

  const categories = [
    { icon: Music, name: "DJ & Musique" },
    { icon: Utensils, name: "Traiteur" },
    { icon: Camera, name: "Photographe" },
    { icon: Flower2, name: "Fleuriste" },
  ]

  return (
    <div className="flex flex-col min-h-svh">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">EventConnect</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Connexion</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">S'inscrire</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-balance">
                Organisez vos événements avec les meilleurs <span className="text-primary">prestataires</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground text-pretty">
                EventConnect met en relation clients et professionnels de l'événementiel. Trouvez le DJ, traiteur ou
                photographe idéal pour votre prochain événement.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/auth/sign-up">
                    <Users className="mr-2 h-5 w-5" />
                    Créer un compte gratuit
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/auth/login">Se connecter</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold text-center mb-10">Catégories populaires</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {categories.map((category) => (
                <Card key={category.name} className="group cursor-pointer hover:border-primary/50 transition-colors">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <category.icon className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="mt-3 text-sm font-medium">{category.name}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold text-center mb-4">Pourquoi EventConnect ?</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Une plateforme pensée pour simplifier l'organisation de vos événements
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {features.map((feature) => (
                <Card key={feature.title} className="border-border/50">
                  <CardContent className="pt-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-4">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-medium mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-semibold mb-4">Prêt à organiser votre événement ?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Rejoignez des milliers d'organisateurs et de prestataires sur EventConnect.
            </p>
            <Button size="lg" asChild>
              <Link href="/auth/sign-up">Commencer gratuitement</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 EventConnect. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}
