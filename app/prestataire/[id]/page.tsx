import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ProviderProfile } from "@/components/provider-profile"

export default async function ProviderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: provider } = await supabase
    .from("profiles")
    .select(`
      *,
      services(*)
    `)
    .eq("id", id)
    .eq("role", "prestataire")
    .single()

  if (!provider) {
    notFound()
  }

  return <ProviderProfile provider={provider} currentUserId={user?.id || null} />
}
