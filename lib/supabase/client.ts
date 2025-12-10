import { createBrowserClient } from "@supabase/ssr"

let client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (client) return client

  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return document.cookie.split(';').map(cookie => {
            const [name, value] = cookie.trim().split('=')
            return { name, value: decodeURIComponent(value) }
          }).filter(cookie => cookie.name)
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            document.cookie = `${name}=${encodeURIComponent(value)}; path=${options?.path || '/'}; max-age=${options?.maxAge || 31536000}; SameSite=${options?.sameSite || 'Lax'}${options?.secure ? '; Secure' : ''}`
          })
        },
      },
    }
  )

  return client
}
