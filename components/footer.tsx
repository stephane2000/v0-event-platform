import Link from "next/link"
import { Instagram, Linkedin, Twitter } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/40">
      <div className="container mx-auto px-4">
        {/* Main Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-8">
          {/* Logo & Description */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-white font-bold text-xs">
                PE
              </div>
              <span className="font-semibold text-lg bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
                Prest'Event
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs text-center md:text-left">
              Trouvez les meilleurs prestataires pour vos événements
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link
              href="/annonces"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Annonces
            </Link>
            <Link
              href="/prestataires"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Prestataires
            </Link>
            <Link
              href="/contact"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/aide"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Aide
            </Link>
          </nav>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </Link>
            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/40 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>© {currentYear} Prest'Event. Tous droits réservés.</p>
            <div className="flex items-center gap-4">
              <Link href="/confidentialite" className="hover:text-foreground transition-colors">
                Confidentialité
              </Link>
              <Link href="/conditions" className="hover:text-foreground transition-colors">
                Conditions
              </Link>
              <Link href="/mentions-legales" className="hover:text-foreground transition-colors">
                Mentions légales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
