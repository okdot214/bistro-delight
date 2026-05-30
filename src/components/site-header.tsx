import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const nav = [
  { to: "/", label: "Home" },
  { to: "/catering", label: "Catering & Eventi" },
  { to: "/pasticceria", label: "Pasticceria" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (r) => r.location.pathname });

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

        <nav className="hidden md:flex items-center gap-10">
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

      {open && (
        <div className="md:hidden border-t border-border bg-background animate-fade-in">
          <nav className="px-6 py-6 flex flex-col gap-5">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="text-base uppercase tracking-wide font-medium text-foreground/80"
              >
                {n.label}
              </Link>
            ))}
            <a
              href="tel:+390471283242"
              className="mt-2 inline-flex items-center justify-center px-5 py-3 rounded-full bg-gold text-gold-foreground font-semibold"
            >
              Chiama 0471 283242
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}