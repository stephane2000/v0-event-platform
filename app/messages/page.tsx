import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function MessagesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get all conversations for the user
  const { data: conversations } = await supabase
    .from("conversations")
    .select("*")
    .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
    .order("updated_at", { ascending: false })

  // Get profiles for other participants
  const conversationsWithProfiles = await Promise.all(
    (conversations || []).map(async (conv) => {
      const otherUserId = conv.participant_1 === user.id ? conv.participant_2 : conv.participant_1

      const { data: profile } = await supabase.from("profiles").select("*").eq("id", otherUserId).single()

      // Get last message
      const { data: lastMessage } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conv.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      // Count unread messages
      const { count: unreadCount } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("conversation_id", conv.id)
        .eq("is_read", false)
        .neq("sender_id", user.id)

      return {
        ...conv,
        otherUser: profile,
        lastMessage,
        unreadCount: unreadCount || 0,
      }
    }),
  )

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Messages</h1>

        {conversationsWithProfiles.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Aucune conversation</h3>
            <p className="text-muted-foreground">
              Contactez un prestataire ou un client pour démarrer une conversation
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {conversationsWithProfiles.map((conv) => (
              <Link key={conv.id} href={`/messages/${conv.id}`}>
                <Card className="hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={conv.otherUser?.avatar_url || undefined} />
                          <AvatarFallback className="bg-gradient-to-br from-rose-500 to-orange-500 text-white">
                            {conv.otherUser?.full_name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        {conv.unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-semibold truncate">{conv.otherUser?.full_name || "Utilisateur"}</h3>
                          {conv.lastMessage && (
                            <span className="text-xs text-muted-foreground shrink-0">
                              {new Date(conv.lastMessage.created_at).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "short",
                              })}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {conv.lastMessage?.content || "Aucun message"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
