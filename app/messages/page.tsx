import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ConversationsList } from "@/components/conversations-list"

export default async function MessagesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch all conversations for the current user
  const { data: conversations } = await supabase
    .from("conversations")
    .select(`
      *,
      profiles_participant_1:profiles!conversations_participant_1_fkey(*),
      profiles_participant_2:profiles!conversations_participant_2_fkey(*),
      annonces(*),
      services(*)
    `)
    .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
    .order("updated_at", { ascending: false })

  // Get last message and unread count for each conversation
  const conversationsWithMessages = await Promise.all(
    (conversations || []).map(async (conv) => {
      const { data: lastMessage } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conv.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      const { count: unreadCount } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("conversation_id", conv.id)
        .eq("is_read", false)
        .neq("sender_id", user.id)

      return {
        ...conv,
        last_message: lastMessage,
        unread_count: unreadCount || 0,
      }
    }),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Messages</h1>
        <p className="text-muted-foreground">Vos conversations avec clients et prestataires</p>
      </div>

      <ConversationsList conversations={conversationsWithMessages} currentUserId={user.id} />
    </div>
  )
}
