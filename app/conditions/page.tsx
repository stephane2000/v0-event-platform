import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ConditionsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Conditions générales d'utilisation</h1>
        <p className="text-muted-foreground mb-8">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Objet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation de la plateforme
                Prest'Event, accessible à l'adresse https://prestevent.fr. En utilisant notre plateforme, vous
                acceptez ces conditions dans leur intégralité.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Présentation du service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Prest'Event est une plateforme de mise en relation entre clients recherchant des prestataires
                pour l'organisation d'événements et professionnels de l'événementiel. La plateforme facilite
                les échanges mais n'intervient pas dans les contrats conclus entre les parties.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Inscription</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Pour utiliser certaines fonctionnalités de la plateforme, vous devez créer un compte :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Vous devez être majeur ou avoir l'autorisation de vos représentants légaux</li>
                <li>Les informations fournies doivent être exactes et à jour</li>
                <li>Vous êtes responsable de la confidentialité de vos identifiants</li>
                <li>Chaque personne ne peut créer qu'un seul compte</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Utilisation de la plateforme</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Vous vous engagez à :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Utiliser la plateforme de manière loyale et conforme à sa destination</li>
                <li>Ne pas diffuser de contenu illicite, offensant ou contraire aux bonnes mœurs</li>
                <li>Respecter les droits de propriété intellectuelle</li>
                <li>Ne pas tenter de perturber le fonctionnement de la plateforme</li>
                <li>Fournir des informations véridiques dans vos annonces</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Responsabilités</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Prest'Event agit en qualité d'intermédiaire technique et ne peut être tenu responsable :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>De la qualité des prestations fournies par les prestataires</li>
                <li>Des litiges entre utilisateurs</li>
                <li>Du non-respect des engagements pris entre les parties</li>
                <li>Des interruptions temporaires du service pour maintenance</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Propriété intellectuelle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Tous les éléments de la plateforme (textes, graphismes, logiciels, etc.) sont protégés par
                le droit d'auteur. Toute reproduction ou utilisation non autorisée est interdite.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Résiliation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Vous pouvez supprimer votre compte à tout moment depuis les paramètres. Prest'Event se réserve
                le droit de suspendre ou supprimer un compte en cas de non-respect des présentes CGU.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Modification des CGU</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Prest'Event se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs
                seront informés des modifications importantes par email ou via la plateforme.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Droit applicable</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Les présentes CGU sont soumises au droit français. En cas de litige, les tribunaux français
                seront seuls compétents.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Pour toute question concernant ces conditions, contactez-nous à :{" "}
                <a href="mailto:legal@prestevent.fr" className="text-rose-500 hover:underline">legal@prestevent.fr</a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
