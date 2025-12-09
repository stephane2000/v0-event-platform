import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { ServiceEditForm } from "@/components/service-edit-form"

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: service } = await supabase.from("services").select("*").eq("id", id).eq("user_id", user.id).single()

  if (!service) {
    notFound()
  }

  return <ServiceEditForm service={service} />
}
