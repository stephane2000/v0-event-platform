"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Send } from "lucide-react"
import type { Conversation, Profile, Message, Annonce, Service } from "@/lib/types"

interface ConversationWithDetails extends Conversation {
  profiles_participant_1: Profile
  profiles_participant_2: Profile
  annonces: Annonce | null
  services: Service | null
}

interface MessageWithProfile extends Message {
  profiles: Profile
}

interface ChatInterfaceProps {
  conversation: ConversationWithDetails
  messages: MessageWithProfile[]
  currentUserId: string
}

export function ChatInterface({ conversation, messages: initialMessages, currentUserId }: ChatInterfaceProps) {
  const router = useRouter()
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const otherUser =
    conversation.participant_1 === currentUserId
      ? conversation.profiles_participant_2
      : conversation.profiles_participant_1

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Subscribe to new messages
  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`messages:${conversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversation.id}`,
        },
        async (payload) => {
          const { data: newMsg } = await supabase
            .from("messages")
            .select("*, profiles(*)")
            .eq("id", payload.new.id)
            .single()

          if (newMsg) {
            setMessages((prev) => [...prev, newMsg])

            // Mark as read if not from current user
            if (newMsg.sender_id !== currentUserId) {
              await supabase.from("messages").update({ is_read: true }).eq("id", newMsg.id)
            }
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversation.id, currentUserId])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || isSending) return

    setIsSending(true)
    const supabase = createClient()

    const { error } = await supabase.from("messages").insert({
      conversation_id: conversation.id,
      sender_id: currentUserId,
      content: newMessage.trim(),
    })

    if (!error) {
      // Update conversation updated_at
      await supabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversation.id)

      setNewMessage("")
      router.refresh()
    }

    setIsSending(false)
  }

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (date: string) => {
    const d = new Date(date)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (d.toDateString() === today.toDateString()) {
      return "Aujourd'hui"
    } else if (d.toDateString() === yesterday.toDateString()) {
      return "Hier"
    } else {
      return d.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    }
  }

  // Group messages by date
  const groupedMessages = messages.reduce(
    (groups, message) => {
      const date = new Date(message.created_at).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
      return groups
    },
    {} as Record<string, MessageWithProfile[]>,
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card className="flex flex-col h-[calc(100vh-12rem)]">
        <CardHeader className="border-b border-border/50 p-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/messages">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>

            <Avatar className="h-10 w-10">
              <AvatarImage src={otherUser.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {otherUser.full_name?.charAt(0) || otherUser.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <h2 className="font-medium truncate">{otherUser.full_name || "Utilisateur"}</h2>
              {(conversation.annonces || conversation.services) && (
                <Badge variant="outline" className="text-xs mt-0.5">
                  {conversation.annonces ? conversation.annonces.title : conversation.services?.name}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>Démarrez la conversation</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedMessages).map(([date, msgs]) => (
                <div key={date}>
                  <div className="flex items-center justify-center mb-4">
                    <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                      {formatDate(msgs[0].created_at)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {msgs.map((message) => {
                      const isOwn = message.sender_id === currentUserId
                      return (
                        <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                          <div className={`flex gap-2 max-w-[80%] ${isOwn ? "flex-row-reverse" : ""}`}>
                            {!isOwn && (
                              <Avatar className="h-8 w-8 shrink-0">
                                <AvatarImage src={message.profiles.avatar_url || undefined} />
                                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                  {message.profiles.full_name?.charAt(0) ||
                                    message.profiles.email.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div>
                              <div
                                className={`px-4 py-2 rounded-2xl ${
                                  isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
                                }`}
                              >
                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                              </div>
                              <p className={`text-xs text-muted-foreground mt-1 ${isOwn ? "text-right" : ""}`}>
                                {formatTime(message.created_at)}
                                {isOwn && message.is_read && " • Lu"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </CardContent>

        <div className="border-t border-border/50 p-4">
          <form onSubmit={handleSend} className="flex gap-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Écrivez votre message..."
              className="min-h-[44px] max-h-32 resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend(e)
                }
              }}
            />
            <Button type="submit" size="icon" disabled={!newMessage.trim() || isSending}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Envoyer</span>
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
