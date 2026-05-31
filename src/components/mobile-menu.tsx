import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { X, Phone, MapPin, Clock, Facebook } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { LanguageSwitcher } from "./language-switcher";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLanguage();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const links = [
    { to: "/", label: t.nav.home },
    { to: "/catering", label: t.nav.catering },
    { to: "/pasticceria", label: t.nav.pasticceria },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      className={`md:hidden fixed inset-0 z-[60] transition-opacity duration-300 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="absolute inset-0 bg-espresso" />
      <div
        className={`relative h-full w-full flex flex-col text-cream transition-transform duration-500 ${
          open ? "translate-y-0" : "-translate-y-4"
        }`}
      >
        <div className="flex items-center justify-between px-6 h-16">
          <span className="font-display text-xl">
            Bistro <span className="italic text-gold">Gambrinus</span>
          </span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-2 -mr-2 text-cream/90 hover:text-gold transition"
          >
            <X className="h-7 w-7" />
          </button>
        </div>

        <nav className="flex-1 flex flex-col items-center justify-center gap-7 px-6" aria-label="Mobile">
          {links.map((l, i) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={onClose}
              className="group relative font-display text-4xl sm:text-5xl text-cream hover:text-gold transition-colors duration-300"
              style={{
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(12px)",
                transition: `opacity 500ms ${120 + i * 80}ms, transform 500ms ${120 + i * 80}ms, color 250ms`,
              }}
            >
              {l.label}
              <span className="absolute left-1/2 -bottom-2 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full group-hover:-translate-x-1/2" />
            </Link>
          ))}

          <div className="mt-6">
            <LanguageSwitcher variant="light" size="lg" />
          </div>
        </nav>

        <div className="px-6 pb-10 space-y-5">
          <a
            href="tel:+390471283242"
            className="flex items-center justify-center gap-2 w-full py-4 rounded-full bg-gold text-gold-foreground font-semibold tracking-wide"
          >
            <Phone className="h-4 w-4" /> 0471 283242
          </a>
          <div className="flex flex-col items-center gap-2 text-cream/70 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold" />
              <span>{t.mobileMenu.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gold" />
              <span>{t.mobileMenu.hoursShort}</span>
            </div>
            <a
              href="https://www.facebook.com/p/Caffè-Bistrò-Gambrinus-100057267767133/?locale=it_IT"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-cream/70 hover:text-gold transition"
            >
              <Facebook className="h-4 w-4" /> Facebook
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
