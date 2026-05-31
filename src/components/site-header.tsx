import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { LanguageSwitcher } from "./language-switcher";
import { MobileMenu } from "./mobile-menu";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { t } = useLanguage();

  const nav = [
    { to: "/", label: t.nav.home },
    { to: "/catering", label: t.nav.catering },
    { to: "/pasticceria", label: t.nav.pasticceria },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const onHome = pathname === "/";
  const transparent = onHome && !scrolled;

  return (
    <>
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        transparent
          ? "bg-transparent"
          : "bg-background/85 backdrop-blur-md border-b border-border/60"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10 h-16 md:h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span
            className={`font-display text-xl md:text-2xl font-semibold tracking-tight ${
              transparent ? "text-white" : "text-foreground"
            }`}
          >
            Bistro <span className="italic text-gold">Gambrinus</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {nav.map((n) => {
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`text-sm tracking-wide uppercase font-medium transition-colors ${
                  transparent
                    ? "text-white/85 hover:text-white"
                    : "text-foreground/70 hover:text-foreground"
                } ${active ? "!text-gold" : ""}`}
              >
                {n.label}
              </Link>
            );
          })}
          <LanguageSwitcher variant={transparent ? "light" : "dark"} />
          <a
            href="tel:+390471283242"
            className="text-sm font-semibold px-5 py-2 rounded-full bg-gold text-gold-foreground hover:opacity-90 transition"
          >
            0471 283242
          </a>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className={`md:hidden p-2 ${transparent ? "text-white" : "text-foreground"}`}
          aria-label="Apri menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
    </header>
    <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}