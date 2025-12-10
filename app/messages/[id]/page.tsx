import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { ChatBox } from "@/components/chat-box"

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get conversation
  const { data: conversation } = await supabase.from("conversations").select("*").eq("id", id).single()

  if (!conversation) {
    notFound()
  }

  // Check if user is part of this conversation
  if (conversation.participant_1 !== user.id && conversation.participant_2 !== user.id) {
    redirect("/messages")
  }

  // Get other user profile
  const otherUserId = conversation.participant_1 === user.id ? conversation.participant_2 : conversation.participant_1

  const { data: otherUser } = await supabase.from("profiles").select("*").eq("id", otherUserId).single()

  // Get initial messages
  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", id)
    .order("created_at", { ascending: true })

  return <ChatBox conversationId={id} currentUserId={user.id} otherUser={otherUser} initialMessages={messages || []} />
}
