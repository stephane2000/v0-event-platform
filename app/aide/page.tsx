import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle, Search, Users, Calendar, Shield } from "lucide-react"

export default function AidePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Centre d'aide</h1>
          <p className="text-muted-foreground text-lg">
            Trouvez des réponses à vos questions sur Prest'Event
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/20">
                  <Search className="h-5 w-5 text-rose-500" />
                </div>
                <div>
                  <CardTitle>Rechercher un prestataire</CardTitle>
                  <CardDescription>Comment trouver le bon professionnel</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                  <Users className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <CardTitle>Créer un compte</CardTitle>
                  <CardDescription>Inscription et configuration</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                  <Calendar className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <CardTitle>Gérer vos annonces</CardTitle>
                  <CardDescription>Création et suivi des annonces</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <Shield className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <CardTitle>Sécurité</CardTitle>
                  <CardDescription>Protection de vos données</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-rose-500" />
              <CardTitle>Questions fréquentes</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Comment créer un compte prestataire ?</AccordionTrigger>
                <AccordionContent>
                  Pour créer un compte prestataire, cliquez sur "S'inscrire" en haut à droite de la page.
                  Remplissez le formulaire d'inscription en sélectionnant le type de compte "Prestataire".
                  Vous pourrez ensuite compléter votre profil et ajouter vos services.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Comment publier une annonce ?</AccordionTrigger>
                <AccordionContent>
                  Une fois connecté, accédez à votre tableau de bord et cliquez sur "Créer une annonce".
                  Remplissez les informations demandées (titre, description, catégorie, budget) et publiez
                  votre annonce. Les prestataires pourront alors vous contacter.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Comment contacter un prestataire ?</AccordionTrigger>
                <AccordionContent>
                  Sur la page d'un prestataire, cliquez sur le bouton "Contacter". Vous pourrez envoyer
                  un message direct au prestataire. Assurez-vous d'être connecté pour accéder à cette fonctionnalité.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Est-ce que Prest'Event est gratuit ?</AccordionTrigger>
                <AccordionContent>
                  L'inscription et la consultation des annonces sont gratuites. Les prestataires peuvent
                  créer un profil gratuit et répondre aux annonces. Des fonctionnalités premium seront
                  disponibles prochainement pour améliorer la visibilité des prestataires.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Comment modifier mon profil ?</AccordionTrigger>
                <AccordionContent>
                  Connectez-vous à votre compte et accédez aux "Paramètres" depuis le menu utilisateur.
                  Vous pourrez modifier vos informations personnelles, votre description, vos services
                  et vos photos.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>Que faire si j'ai un problème technique ?</AccordionTrigger>
                <AccordionContent>
                  Si vous rencontrez un problème technique, contactez-nous via la page "Contact".
                  Décrivez le problème en détail et notre équipe technique vous répondra dans les plus
                  brefs délais.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
