import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { headers } from "next/headers"

export async function POST(request: Request) {
  const supabase = await createClient()

  await supabase.auth.signOut()

  const headersList = await headers()
  const origin = headersList.get("origin") || headersList.get("referer") || ""
  const url = new URL("/auth/login", origin || request.url)

  return NextResponse.redirect(url)
}
