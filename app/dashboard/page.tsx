import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ClientDashboard } from "@/components/dashboard/client-dashboard"
import { ProviderDashboard } from "@/components/dashboard/provider-dashboard"
import type { Profile } from "@/lib/types"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) {
    redirect("/auth/login")
  }

  if (profile.role === "prestataire") {
    // Fetch provider's services
    const { data: services } = await supabase
      .from("services")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    return <ProviderDashboard profile={profile as Profile} services={services || []} />
  }

  // Fetch client's annonces
  const { data: annonces } = await supabase
    .from("annonces")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return <ClientDashboard profile={profile as Profile} annonces={annonces || []} />
}
