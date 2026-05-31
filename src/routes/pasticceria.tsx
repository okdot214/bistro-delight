import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import bakeryHero from "@/assets/bakery-hero.jpg";
import cake1 from "@/assets/bakery-cake-1.jpg";
import cake2 from "@/assets/bakery-cake-2.jpg";
import pastries from "@/assets/bakery-pastries.jpg";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/pasticceria")({
  head: () => ({
    meta: [
      { title: "Pasticceria & Bakery · Bistro Gambrinus" },
      { name: "description", content: "Torte artigianali, dolci personalizzati e pasticceria fresca a Bolzano." },
      { property: "og:title", content: "Pasticceria · Bistro Gambrinus" },
      { property: "og:description", content: "Creazioni artigianali e torte su misura." },
    ],
  }),
  component: PasticceriaPage,
});

const galleryImages = [cake1, pastries, cake2];
const gallerySpans = ["md:col-span-2 md:row-span-2", "md:col-span-2", ""];

function PasticceriaPage() {
  const { t } = useLanguage();
  const gallery = t.pasticceria.gallery.map((g, i) => ({
    src: galleryImages[i],
    title: g.title,
    span: gallerySpans[i],
  }));
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main>
        <section className="relative h-[60vh] min-h-[460px] overflow-hidden bg-espresso">
          <img src={bakeryHero} alt="Pasticceria artigianale Gambrinus" className="absolute inset-0 h-full w-full object-cover opacity-70" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80" />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
            <span className="text-gold uppercase tracking-[0.35em] text-xs mb-5">{t.pasticceria.kicker}</span>
            <h1 className="font-display text-white text-5xl md:text-7xl text-balance animate-fade-up">
              {t.pasticceria.title1} <span className="italic text-gold/95">{t.pasticceria.title2}</span>
            </h1>
            <p className="mt-6 text-white/80 max-w-xl">
              {t.pasticceria.lead}
            </p>
          </div>
        </section>

        <section className="py-24 bg-background">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[260px] md:auto-rows-[300px] gap-5">
              {gallery.map((g) => (
                <figure key={g.title} className={`relative overflow-hidden rounded-2xl group ${g.span}`}>
                  <img src={g.src} alt={g.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <figcaption className="absolute bottom-4 left-4 right-4 text-white font-display text-2xl drop-shadow-lg">
                    {g.title}
                  </figcaption>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-secondary/60">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="font-display text-4xl md:text-5xl text-foreground text-balance">{t.pasticceria.ctaTitle}</h2>
            <p className="mt-4 text-muted-foreground">{t.pasticceria.ctaLead}</p>
            <a href="tel:+390471283242" className="mt-8 inline-block px-7 py-3.5 rounded-full bg-gold text-gold-foreground font-semibold hover:opacity-90 transition">
              0471 283242
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}