import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/connexion")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-svh bg-background p-6 md:p-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tableau de bord</h1>
            <p className="text-muted-foreground">Bienvenue, {profile?.full_name || user.email}</p>
          </div>
          <form action="/api/auth/signout" method="POST">
            <Button variant="outline" type="submit">
              Déconnexion
            </Button>
          </form>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Mes annonces</CardTitle>
              <CardDescription>Gérez vos annonces d'événements</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/mes-annonces">Voir mes annonces</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mes services</CardTitle>
              <CardDescription>Gérez vos services proposés</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/mes-services">Voir mes services</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>Consultez vos conversations</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/conversations">Voir les messages</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mon profil</CardTitle>
              <CardDescription>Modifiez vos informations</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/profile">Modifier le profil</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
