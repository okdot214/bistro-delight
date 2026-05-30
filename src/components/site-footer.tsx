import { Link } from "@tanstack/react-router";
import { Facebook, MapPin, Phone, Clock } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-espresso text-cream mt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <h3 className="font-display text-3xl">
            Bistro <span className="italic text-gold">Gambrinus</span>
          </h3>
          <p className="mt-4 text-cream/70 max-w-md leading-relaxed">
            Il tuo momento di gusto a Bolzano. Caffetteria, pranzi veloci,
            aperitivi e pasticceria artigianale dal cuore della città.
          </p>
          <a
            href="https://www.facebook.com/p/Caffè-Bistrò-Gambrinus-100057267767133/?locale=it_IT"
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-cream/80 hover:text-gold transition"
          >
            <Facebook className="h-5 w-5" />
            Seguici su Facebook
          </a>
        </div>

        <div>
          <h4 className="font-display text-lg mb-4 text-gold">Contatti</h4>
          <ul className="space-y-3 text-sm text-cream/80">
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Viale Duca d'Aosta<br />39100 Bolzano BZ</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <a href="tel:+390471283242" className="hover:text-gold">
                0471 283242
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg mb-4 text-gold">Orari</h4>
          <ul className="space-y-2 text-sm text-cream/80">
            <li className="flex items-start gap-2">
              <Clock className="h-4 w-4 mt-0.5" />
              <div>
                <div>Lun – Ven · 07:30 – 20:00</div>
                <div>Sab · 07:30 – 13:15</div>
                <div>Dom · Chiuso</div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-cream/50">
          <span>© {new Date().getFullYear()} Bistro Gambrinus · Bolzano</span>
          <Link to="/admin" className="hover:text-gold transition">
            Area riservata
          </Link>
        </div>
      </div>
    </footer>
  );
}