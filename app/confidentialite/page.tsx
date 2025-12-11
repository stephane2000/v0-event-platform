import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ConfidentialitePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Politique de confidentialité</h1>
        <p className="text-muted-foreground mb-8">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Introduction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Chez Prest'Event, nous accordons une grande importance à la protection de vos données personnelles.
                Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Données collectées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Nous collectons les types de données suivantes :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Informations d'identification (nom, prénom, email)</li>
                <li>Informations professionnelles pour les prestataires</li>
                <li>Données de navigation et d'utilisation du site</li>
                <li>Messages et communications via la plateforme</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Utilisation des données</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Vos données sont utilisées pour :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Créer et gérer votre compte</li>
                <li>Faciliter la mise en relation entre clients et prestataires</li>
                <li>Améliorer nos services</li>
                <li>Vous envoyer des communications importantes</li>
                <li>Assurer la sécurité de la plateforme</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Protection des données</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées
                pour protéger vos données contre tout accès non autorisé, modification, divulgation ou destruction.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Vos droits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Conformément au RGPD, vous disposez des droits suivants :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Droit d'accès à vos données</li>
                <li>Droit de rectification</li>
                <li>Droit à l'effacement</li>
                <li>Droit à la limitation du traitement</li>
                <li>Droit à la portabilité</li>
                <li>Droit d'opposition</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Notre site utilise des cookies pour améliorer votre expérience de navigation. Vous pouvez
                contrôler l'utilisation des cookies via les paramètres de votre navigateur.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits,
                contactez-nous à : <a href="mailto:privacy@prestevent.fr" className="text-rose-500 hover:underline">privacy@prestevent.fr</a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
