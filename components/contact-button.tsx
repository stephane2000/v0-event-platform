"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { MessageSquare, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

interface ContactButtonProps {
  targetUserId: string
  annonceId?: string
  serviceId?: string
}

export function ContactButton({ targetUserId, annonceId, serviceId }: ContactButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleContact = async () => {
    setIsLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Non authentifié")

      // Check for existing conversation
      const { data: existingConversation } = await supabase
        .from("conversations")
        .select("id")
        .or(
          `and(participant_1.eq.${user.id},participant_2.eq.${targetUserId}),and(participant_1.eq.${targetUserId},participant_2.eq.${user.id})`,
        )
        .maybeSingle()

      if (existingConversation) {
        router.push(`/messages/${existingConversation.id}`)
        return
      }

      // Create new conversation
      const { data: newConversation, error } = await supabase
        .from("conversations")
        .insert({
          participant_1: user.id,
          participant_2: targetUserId,
          annonce_id: annonceId || null,
          service_id: serviceId || null,
        })
        .select()
        .single()

      if (error) throw error

      router.push(`/messages/${newConversation.id}`)
    } catch (error) {
      toast.error("Erreur lors de la création de la conversation")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleContact}
      className="w-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600"
      disabled={isLoading}
    >
      {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <MessageSquare className="h-4 w-4 mr-2" />}
      Contacter
    </Button>
  )
}
