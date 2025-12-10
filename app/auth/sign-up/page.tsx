"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader2, User, Briefcase } from "lucide-react"
import { cn } from "@/lib/utils"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [role, setRole] = useState<"client" | "prestataire">("client")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName,
            role: role,
          },
        },
      })

      if (signUpError) throw signUpError

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: data.user.id,
          email: email,
          full_name: fullName,
          role: role,
        })

        if (profileError) throw profileError
      }

      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
              PE
            </div>
            <CardTitle className="text-2xl">Créer un compte</CardTitle>
            <CardDescription>Rejoignez la communauté Prest'Event</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-5">
              {/* Role Selection */}
              <div className="space-y-3">
                <Label>Je suis un(e)</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("client")}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                      role === "client"
                        ? "border-rose-500 bg-rose-50 text-rose-700"
                        : "border-border hover:border-muted-foreground",
                    )}
                  >
                    <User className="h-6 w-6" />
                    <span className="font-medium">Client</span>
                    <span className="text-xs text-muted-foreground">Je cherche des prestataires</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("prestataire")}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                      role === "prestataire"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-border hover:border-muted-foreground",
                    )}
                  >
                    <Briefcase className="h-6 w-6" />
                    <span className="font-medium">Prestataire</span>
                    <span className="text-xs text-muted-foreground">Je propose mes services</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Nom complet</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Jean Dupont"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimum 6 caractères"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création...
                  </>
                ) : (
                  "Créer mon compte"
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Déjà un compte ?{" "}
                <Link href="/auth/login" className="text-rose-500 hover:underline font-medium">
                  Se connecter
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
