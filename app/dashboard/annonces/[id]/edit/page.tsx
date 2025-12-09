import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { AnnonceEditForm } from "@/components/annonce-edit-form"

export default async function EditAnnoncePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: annonce } = await supabase.from("annonces").select("*").eq("id", id).eq("user_id", user.id).single()

  if (!annonce) {
    notFound()
  }

  return <AnnonceEditForm annonce={annonce} />
}
