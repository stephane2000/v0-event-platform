import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { NewConversation } from "@/components/new-conversation"

export default async function NewMessagePage({
  searchParams,
}: {
  searchParams: Promise<{ to?: string; annonce?: string; service?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  if (!params.to) {
    redirect("/messages")
  }

  // Check if user exists
  const { data: recipient } = await supabase.from("profiles").select("*").eq("id", params.to).single()

  if (!recipient) {
    notFound()
  }

  // Check if conversation already exists
  const { data: existingConversation } = await supabase
    .from("conversations")
    .select("id")
    .or(
      `and(participant_1.eq.${user.id},participant_2.eq.${params.to}),and(participant_1.eq.${params.to},participant_2.eq.${user.id})`,
    )
    .eq("annonce_id", params.annonce || null)
    .eq("service_id", params.service || null)
    .single()

  if (existingConversation) {
    redirect(`/messages/${existingConversation.id}`)
  }

  // Get annonce or service details if provided
  let annonce = null
  let service = null

  if (params.annonce) {
    const { data } = await supabase.from("annonces").select("*").eq("id", params.annonce).single()
    annonce = data
  }

  if (params.service) {
    const { data } = await supabase.from("services").select("*").eq("id", params.service).single()
    service = data
  }

  return (
    <NewConversation
      recipient={recipient}
      currentUserId={user.id}
      annonceId={params.annonce || null}
      serviceId={params.service || null}
      annonce={annonce}
      service={service}
    />
  )
}
