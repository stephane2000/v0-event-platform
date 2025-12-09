"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Send } from "lucide-react"
import type { Profile, Annonce, Service } from "@/lib/types"

interface NewConversationProps {
  recipient: Profile
  currentUserId: string
  annonceId: string | null
  serviceId: string | null
  annonce: Annonce | null
  service: Service | null
}

export function NewConversation({
  recipient,
  currentUserId,
  annonceId,
  serviceId,
  annonce,
  service,
}: NewConversationProps) {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isSending) return

    setIsSending(true)
    setError(null)

    const supabase = createClient()

    // Create conversation
    const { data: conversation, error: convError } = await supabase
      .from("conversations")
      .insert({
        participant_1: currentUserId,
        participant_2: recipient.id,
        annonce_id: annonceId,
        service_id: serviceId,
      })
      .select()
      .single()

    if (convError) {
      setError(convError.message)
      setIsSending(false)
      return
    }

    // Send first message
    const { error: msgError } = await supabase.from("messages").insert({
      conversation_id: conversation.id,
      sender_id: currentUserId,
      content: message.trim(),
    })

    if (msgError) {
      setError(msgError.message)
      setIsSending(false)
      return
    }

    router.push(`/messages/${conversation.id}`)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/messages">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Nouvelle conversation</CardTitle>
          <CardDescription>Envoyez un message à {recipient.full_name || "cet utilisateur"}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Recipient */}
          <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 mb-6">
            <Avatar className="h-12 w-12">
              <AvatarImage src={recipient.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {recipient.full_name?.charAt(0) || recipient.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{recipient.full_name || "Utilisateur"}</p>
              <Badge variant="outline" className="text-xs">
                {recipient.role === "prestataire" ? "Prestataire" : "Client"}
              </Badge>
            </div>
          </div>

          {/* Context */}
          {(annonce || service) && (
            <div className="mb-6 p-4 rounded-lg border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">À propos de</p>
              <p className="font-medium">{annonce ? annonce.title : service?.name}</p>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {annonce ? annonce.description : service?.description}
              </p>
            </div>
          )}

          {/* Message Form */}
          <form onSubmit={handleSend} className="space-y-4">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Présentez-vous et expliquez votre demande..."
              rows={6}
              required
            />

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex gap-4">
              <Button type="button" variant="outline" asChild className="flex-1 bg-transparent">
                <Link href="/messages">Annuler</Link>
              </Button>
              <Button type="submit" disabled={!message.trim() || isSending} className="flex-1">
                <Send className="mr-2 h-4 w-4" />
                {isSending ? "Envoi..." : "Envoyer"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
