"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare } from "lucide-react"
import type { Conversation, Profile, Message, Annonce, Service } from "@/lib/types"

interface ConversationWithDetails extends Conversation {
  profiles_participant_1: Profile
  profiles_participant_2: Profile
  annonces: Annonce | null
  services: Service | null
  last_message: Message | null
  unread_count: number
}

interface ConversationsListProps {
  conversations: ConversationWithDetails[]
  currentUserId: string
}

export function ConversationsList({ conversations, currentUserId }: ConversationsListProps) {
  const getOtherParticipant = (conv: ConversationWithDetails) => {
    return conv.participant_1 === currentUserId ? conv.profiles_participant_2 : conv.profiles_participant_1
  }

  const formatTime = (date: string) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    } else if (days === 1) {
      return "Hier"
    } else if (days < 7) {
      return d.toLocaleDateString("fr-FR", { weekday: "short" })
    } else {
      return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
    }
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-medium">Aucune conversation</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Contactez un prestataire ou répondez à une annonce pour démarrer une conversation
        </p>
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y divide-border/50">
          {conversations.map((conv) => {
            const otherUser = getOtherParticipant(conv)
            return (
              <Link
                key={conv.id}
                href={`/messages/${conv.id}`}
                className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={otherUser.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {otherUser.full_name?.charAt(0) || otherUser.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {conv.unread_count > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs font-medium bg-primary text-primary-foreground rounded-full">
                      {conv.unread_count}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`font-medium truncate ${conv.unread_count > 0 ? "text-foreground" : ""}`}>
                      {otherUser.full_name || "Utilisateur"}
                    </h3>
                    {conv.last_message && (
                      <span className="text-xs text-muted-foreground shrink-0">
                        {formatTime(conv.last_message.created_at)}
                      </span>
                    )}
                  </div>

                  {(conv.annonces || conv.services) && (
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="outline" className="text-xs py-0">
                        {conv.annonces ? conv.annonces.title : conv.services?.name}
                      </Badge>
                    </div>
                  )}

                  {conv.last_message && (
                    <p
                      className={`text-sm truncate mt-1 ${conv.unread_count > 0 ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {conv.last_message.sender_id === currentUserId ? "Vous: " : ""}
                      {conv.last_message.content}
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
