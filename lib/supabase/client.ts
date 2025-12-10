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
          const cookies = document.cookie.split(';')
          return cookies.map(cookie => {
            const trimmed = cookie.trim()
            const separatorIndex = trimmed.indexOf('=')
            if (separatorIndex === -1) return null

            const name = trimmed.substring(0, separatorIndex)
            const value = trimmed.substring(separatorIndex + 1)

            return { name, value: decodeURIComponent(value || '') }
          }).filter((cookie): cookie is { name: string; value: string } =>
            cookie !== null && cookie.name.length > 0
          )
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            const cookieParts = [
              `${name}=${encodeURIComponent(value)}`,
              `path=${options?.path || '/'}`,
              `max-age=${options?.maxAge || 31536000}`,
              `SameSite=${options?.sameSite || 'Lax'}`
            ]

            if (options?.secure !== false) {
              cookieParts.push('Secure')
            }

            document.cookie = cookieParts.join('; ')
          })
        },
      },
    }
  )

  return client
}
