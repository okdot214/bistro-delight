import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ParallaxHero } from "@/components/parallax-hero";
import { HorizontalSpecialties } from "@/components/horizontal-specialties";
import { DailyMenu } from "@/components/daily-menu";
import { MapPin, Phone, Clock } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bistro Gambrinus — Il tuo momento di gusto a Bolzano" },
      { name: "description", content: "Caffetteria, pranzi veloci, aperitivi e pasticceria a Bolzano. Menù del giorno con ingredienti freschi." },
      { property: "og:title", content: "Bistro Gambrinus — Bolzano" },
      { property: "og:description", content: "Il tuo momento di gusto a Bolzano." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main>
        <ParallaxHero />
        <IntroSection />
        <HorizontalSpecialties />
        <DailyMenu />
        <InfoSection />
      </main>
      <SiteFooter />
    </div>
  );
}

function IntroSection() {
  return (
    <section className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-10 text-center">
        <div className="text-gold uppercase tracking-[0.3em] text-xs mb-5">Benvenuti</div>
        <p className="font-display text-2xl md:text-4xl text-foreground leading-relaxed text-balance">
          Un luogo dove il <span className="italic">tempo rallenta</span>, il caffè
          è una piccola cerimonia e ogni piatto racconta la freschezza degli
          ingredienti di stagione.
        </p>
        <div className="gold-rule w-24 mx-auto mt-10" />
      </div>
    </section>
  );
}

function InfoSection() {
  return (
    <section className="bg-background py-24 md:py-32 border-t border-border/60">
      <div className="mx-auto max-w-6xl px-6 lg:px-10 grid md:grid-cols-3 gap-10">
        <InfoCard icon={<MapPin className="h-5 w-5" />} title="Dove siamo"
          lines={["Viale Duca d'Aosta", "39100 Bolzano BZ"]} />
        <InfoCard icon={<Phone className="h-5 w-5" />} title="Telefono"
          lines={["0471 283242"]}
          cta={{ href: "tel:+390471283242", label: "Chiama ora" }} />
        <InfoCard icon={<Clock className="h-5 w-5" />} title="Orari"
          lines={["Lun – Ven · 07:30 – 20:00", "Sab · 07:30 – 13:15", "Dom · Chiuso"]} />
      </div>
    </section>
  );
}

function InfoCard({ icon, title, lines, cta }: { icon: React.ReactNode; title: string; lines: string[]; cta?: { href: string; label: string } }) {
  return (
    <div className="p-8 rounded-2xl border border-border bg-card">
      <div className="h-10 w-10 rounded-full bg-gold/15 text-gold flex items-center justify-center">{icon}</div>
      <h3 className="mt-5 font-display text-2xl text-foreground">{title}</h3>
      <div className="mt-3 space-y-1 text-muted-foreground">
        {lines.map((l) => <div key={l}>{l}</div>)}
      </div>
      {cta && (
        <a href={cta.href} className="mt-5 inline-block text-sm font-semibold text-gold hover:underline">
          {cta.label} →
        </a>
      )}
    </div>
  );
}
