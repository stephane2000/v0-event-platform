"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import type { Profile, Message } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send, Loader2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface ChatBoxProps {
  conversationId: string
  currentUserId: string
  otherUser: Profile | null
  initialMessages: Message[]
}

export function ChatBox({ conversationId, currentUserId, otherUser, initialMessages }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Mark messages as read
  useEffect(() => {
    const markAsRead = async () => {
      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("conversation_id", conversationId)
        .neq("sender_id", currentUserId)
        .eq("is_read", false)
    }
    markAsRead()
  }, [conversationId, currentUserId, supabase])

  useEffect(() => {
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message
          setMessages((prev) => {
            // Avoid duplicates
            if (prev.some((m) => m.id === newMsg.id)) return prev
            return [...prev, newMsg]
          })

          // Mark as read if not from current user
          if (newMsg.sender_id !== currentUserId) {
            supabase.from("messages").update({ is_read: true }).eq("id", newMsg.id)
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, currentUserId, supabase])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || isSending) return

    setIsSending(true)
    const messageContent = newMessage.trim()
    setNewMessage("")

    try {
      const { data, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          sender_id: currentUserId,
          content: messageContent,
          is_read: false,
        })
        .select()
        .single()

      if (error) throw error

      // Add message optimistically (real-time will also add it, but we check for duplicates)
      setMessages((prev) => {
        if (prev.some((m) => m.id === data.id)) return prev
        return [...prev, data]
      })

      // Update conversation timestamp
      await supabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversationId)
    } catch (error) {
      console.error("Error sending message:", error)
      setNewMessage(messageContent) // Restore message on error
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="border-b bg-background px-4 py-3 flex items-center gap-4">
        <Link href="/messages">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <Avatar className="h-10 w-10">
          <AvatarImage src={otherUser?.avatar_url || undefined} />
          <AvatarFallback className="bg-gradient-to-br from-rose-500 to-orange-500 text-white">
            {otherUser?.full_name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">{otherUser?.full_name || "Utilisateur"}</h2>
          <span
            className={cn(
              "text-xs px-2 py-0.5 rounded-full",
              otherUser?.role === "prestataire" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700",
            )}
          >
            {otherUser?.role === "prestataire" ? "Prestataire" : "Client"}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>Aucun message pour l'instant.</p>
            <p className="text-sm">Envoyez un message pour démarrer la conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.sender_id === currentUserId
            return (
              <div key={message.id} className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-2",
                    isOwn
                      ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-br-md"
                      : "bg-background border rounded-bl-md",
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className={cn("text-xs mt-1", isOwn ? "text-white/70" : "text-muted-foreground")}>
                    {new Date(message.created_at).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t bg-background p-4">
        <form onSubmit={handleSend} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrivez votre message..."
            className="flex-1"
            disabled={isSending}
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600"
          >
            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  )
}
