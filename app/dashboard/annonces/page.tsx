import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AnnoncesList } from "@/components/annonces-list"

export default async function AnnoncesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch all active annonces with profiles
  const { data: annonces } = await supabase
    .from("annonces")
    .select(`
      *,
      profiles(*)
    `)
    .eq("status", "active")
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Annonces</h1>
        <p className="text-muted-foreground">Consultez les demandes de prestations et proposez vos services</p>
      </div>

      <AnnoncesList annonces={annonces || []} currentUserId={user.id} />
    </div>
  )
}
