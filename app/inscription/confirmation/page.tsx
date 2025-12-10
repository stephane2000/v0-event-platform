import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"
import Link from "next/link"

export default function ConfirmationPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Vérifiez votre email</CardTitle>
            <CardDescription className="text-base">
              Un email de confirmation a été envoyé à votre adresse.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Cliquez sur le lien dans l'email pour activer votre compte. Si vous ne trouvez pas l'email, vérifiez votre
              dossier spam.
            </p>
            <Link href="/connexion" className="text-primary underline underline-offset-4 hover:text-primary/80">
              Retour à la connexion
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
