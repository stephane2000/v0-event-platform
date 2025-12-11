import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function MentionsLegalesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Mentions légales</h1>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Éditeur du site</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                <strong>Nom de la société :</strong> Prest'Event SARL
                <br />
                <strong>Forme juridique :</strong> Société à Responsabilité Limitée
                <br />
                <strong>Capital social :</strong> 10 000 €
                <br />
                <strong>Siège social :</strong> 123 Avenue des Événements, 75001 Paris, France
                <br />
                <strong>RCS :</strong> Paris B 123 456 789
                <br />
                <strong>SIRET :</strong> 123 456 789 00010
                <br />
                <strong>TVA intracommunautaire :</strong> FR 12 123456789
              </p>
              <p className="mt-4">
                <strong>Directeur de la publication :</strong> [Nom du directeur]
                <br />
                <strong>Email :</strong>{" "}
                <a href="mailto:contact@prestevent.fr" className="text-rose-500 hover:underline">
                  contact@prestevent.fr
                </a>
                <br />
                <strong>Téléphone :</strong> +33 1 23 45 67 89
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Hébergement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Le site est hébergé par :
                <br />
                <strong>Vercel Inc.</strong>
                <br />
                340 S Lemon Ave #4133
                <br />
                Walnut, CA 91789, USA
                <br />
                Site web :{" "}
                <a
                  href="https://vercel.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-500 hover:underline"
                >
                  vercel.com
                </a>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Propriété intellectuelle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                L'ensemble du contenu de ce site (structure, textes, logos, images, vidéos, etc.) est la propriété
                exclusive de Prest'Event, sauf mention contraire. Toute reproduction, distribution, modification,
                adaptation, retransmission ou publication de ces différents éléments est strictement interdite sans
                l'accord exprès par écrit de Prest'Event.
              </p>
              <p className="mt-4">
                Les marques et logos figurant sur le site sont des marques déposées. Toute reproduction totale ou
                partielle de ces marques ou logos sans autorisation préalable est prohibée.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Protection des données personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Conformément à la loi "Informatique et Libertés" du 6 janvier 1978 modifiée et au Règlement Général
                sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de
                suppression et d'opposition aux données personnelles vous concernant.
              </p>
              <p className="mt-4">
                Pour exercer ces droits, contactez-nous à :{" "}
                <a href="mailto:privacy@prestevent.fr" className="text-rose-500 hover:underline">
                  privacy@prestevent.fr
                </a>
              </p>
              <p className="mt-4">
                Pour plus d'informations, consultez notre{" "}
                <a href="/confidentialite" className="text-rose-500 hover:underline">
                  Politique de confidentialité
                </a>
                .
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Le site utilise des cookies pour améliorer l'expérience utilisateur et réaliser des statistiques
                de visite. Vous pouvez paramétrer votre navigateur pour refuser les cookies, mais certaines
                fonctionnalités du site pourraient ne plus être accessibles.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Responsabilité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Prest'Event s'efforce d'assurer au mieux l'exactitude et la mise à jour des informations diffusées
                sur ce site. Toutefois, Prest'Event ne peut garantir l'exactitude, la précision ou l'exhaustivité
                des informations mises à disposition sur ce site.
              </p>
              <p className="mt-4">
                Prest'Event ne pourra être tenu responsable des dommages directs ou indirects causés au matériel
                de l'utilisateur lors de l'accès au site, et résultant soit de l'utilisation d'un matériel ne
                répondant pas aux spécifications, soit de l'apparition d'un bug ou d'une incompatibilité.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Liens hypertextes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Le site peut contenir des liens vers d'autres sites. Prest'Event n'exerce aucun contrôle sur ces
                sites et décline toute responsabilité quant à leur contenu.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Droit applicable et juridiction compétente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Les présentes mentions légales sont régies par le droit français. En cas de litige et à défaut
                d'accord amiable, le litige sera porté devant les tribunaux français conformément aux règles de
                compétence en vigueur.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
