import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProvidersList } from "@/components/providers-list"

export default async function PrestatairesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch all providers with their services
  const { data: providers } = await supabase
    .from("profiles")
    .select(`
      *,
      services(*)
    `)
    .eq("role", "prestataire")
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Prestataires</h1>
        <p className="text-muted-foreground">Trouvez les prestataires idéaux pour votre événement</p>
      </div>

      <ProvidersList providers={providers || []} currentUserId={user.id} />
    </div>
  )
}
