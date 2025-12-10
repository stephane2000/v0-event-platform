"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User, Session } from "@supabase/supabase-js"

interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: string | null
  phone: string | null
  location: string | null
  bio: string | null
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  isLoading: boolean
  signOut: () => Promise<void>
  refreshAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
  refreshAuth: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient()

  const fetchProfile = useCallback(
    async (userId: string) => {
      try {
        const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

        if (error) {
          console.error("Error fetching profile:", error)
          return null
        }
        return data as Profile
      } catch (error) {
        console.error("Error fetching profile:", error)
        return null
      }
    },
    [supabase],
  )

  const refreshAuth = useCallback(async () => {
    try {
      setIsLoading(true)

      // Get current session
      const {
        data: { session: currentSession },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        console.error("Session error:", sessionError)
        setSession(null)
        setUser(null)
        setProfile(null)
        return
      }

      if (currentSession?.user) {
        setSession(currentSession)
        setUser(currentSession.user)

        // Fetch profile
        const profileData = await fetchProfile(currentSession.user.id)
        setProfile(profileData)
      } else {
        setSession(null)
        setUser(null)
        setProfile(null)
      }
    } catch (error) {
      console.error("Auth refresh error:", error)
      setSession(null)
      setUser(null)
      setProfile(null)
    } finally {
      setIsLoading(false)
    }
  }, [supabase, fetchProfile])

  useEffect(() => {
    // Initial auth check
    refreshAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("[v0] Auth state changed:", event)

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        setSession(newSession)
        setUser(newSession?.user ?? null)

        if (newSession?.user) {
          const profileData = await fetchProfile(newSession.user.id)
          setProfile(profileData)
        }
        setIsLoading(false)
      } else if (event === "SIGNED_OUT") {
        setSession(null)
        setUser(null)
        setProfile(null)
        setIsLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, refreshAuth, fetchProfile])

  const signOut = async () => {
    setIsLoading(true)
    await supabase.auth.signOut()
    setSession(null)
    setUser(null)
    setProfile(null)
    setIsLoading(false)
    window.location.href = "/"
  }

  return (
    <AuthContext.Provider value={{ user, profile, session, isLoading, signOut, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
