import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { ChatInterface } from "@/components/chat-interface"

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch conversation with participants
  const { data: conversation } = await supabase
    .from("conversations")
    .select(`
      *,
      profiles_participant_1:profiles!conversations_participant_1_fkey(*),
      profiles_participant_2:profiles!conversations_participant_2_fkey(*),
      annonces(*),
      services(*)
    `)
    .eq("id", id)
    .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
    .single()

  if (!conversation) {
    notFound()
  }

  // Fetch messages
  const { data: messages } = await supabase
    .from("messages")
    .select(`
      *,
      profiles(*)
    `)
    .eq("conversation_id", id)
    .order("created_at", { ascending: true })

  // Mark unread messages as read
  await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("conversation_id", id)
    .neq("sender_id", user.id)
    .eq("is_read", false)

  return <ChatInterface conversation={conversation} messages={messages || []} currentUserId={user.id} />
}
