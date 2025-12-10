import Link from "next/link"
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-xl">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                PE
              </div>
              <span className="bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
                Prest'Event
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              La plateforme de référence pour trouver les meilleurs prestataires événementiels.
              Organisez vos événements en toute sérénité.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-background hover:bg-gradient-to-br hover:from-rose-500 hover:to-orange-500 hover:text-white transition-all duration-300 flex items-center justify-center border"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-background hover:bg-gradient-to-br hover:from-rose-500 hover:to-orange-500 hover:text-white transition-all duration-300 flex items-center justify-center border"
              >
                <Instagram className="h-4 w-4" />
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-background hover:bg-gradient-to-br hover:from-rose-500 hover:to-orange-500 hover:text-white transition-all duration-300 flex items-center justify-center border"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-background hover:bg-gradient-to-br hover:from-rose-500 hover:to-orange-500 hover:text-white transition-all duration-300 flex items-center justify-center border"
              >
                <Twitter className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider">Navigation</h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/annonces"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Annonces
                </Link>
              </li>
              <li>
                <Link
                  href="/prestataires"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Prestataires
                </Link>
              </li>
              <li>
                <Link
                  href="/services/create"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Devenir prestataire
                </Link>
              </li>
              <li>
                <Link
                  href="/annonces/create"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Publier une annonce
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider">Support</h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/aide"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Centre d'aide
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Nous contacter
                </Link>
              </li>
              <li>
                <Link
                  href="/conditions"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link
                  href="/confidentialite"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link
                  href="/mentions-legales"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>123 Avenue des Champs-Élysées<br />75008 Paris, France</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href="tel:+33123456789">+33 1 23 45 67 89</a>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href="mailto:contact@prestevent.fr">contact@prestevent.fr</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© {currentYear} Prest'Event. Tous droits réservés.</p>
            <p className="text-xs">
              Conçu avec passion pour simplifier l'organisation de vos événements
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
