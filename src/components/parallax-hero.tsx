import { useEffect, useRef, useState } from "react";
import heroImg from "@/assets/hero-bistro.jpg";
import { useLanguage } from "@/lib/i18n";

export function ParallaxHero() {
  const ref = useRef<HTMLDivElement>(null);
  const [y, setY] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setY(window.scrollY));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section ref={ref} className="relative h-screen min-h-[640px] overflow-hidden bg-espresso">
      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translate3d(0, ${y * 0.4}px, 0) scale(1.1)` }}
      >
        <img
          src={heroImg}
          alt="Interno luminoso del Bistro Gambrinus a Bolzano"
          className="h-full w-full object-cover"
          width={1920}
          height={1280}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
      </div>

      <div
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 will-change-transform"
        style={{ transform: `translate3d(0, ${y * 0.15}px, 0)`, opacity: Math.max(0, 1 - y / 600) }}
      >
        <span className="text-gold uppercase tracking-[0.35em] text-xs md:text-sm mb-6 animate-fade-in">
          {t.hero.kicker}
        </span>
        <h1 className="font-display text-white text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium leading-[1.05] max-w-5xl text-balance animate-fade-up">
          {t.hero.title}
          <span className="block mt-2 italic text-gold/95 text-3xl sm:text-4xl md:text-5xl">
            {t.hero.subtitle}
          </span>
        </h1>
        <p className="mt-8 text-white/80 max-w-xl text-base md:text-lg leading-relaxed animate-fade-up" style={{ animationDelay: "120ms" }}>
          {t.hero.lead}
        </p>
        <div className="mt-10 flex flex-wrap gap-3 justify-center animate-fade-up" style={{ animationDelay: "240ms" }}>
          <a href="#menu-giorno" className="px-7 py-3.5 rounded-full bg-gold text-gold-foreground font-semibold text-sm tracking-wide hover:opacity-90 transition">
            {t.hero.ctaMenu}
          </a>
          <a href="/catering" className="px-7 py-3.5 rounded-full border border-white/40 text-white font-semibold text-sm tracking-wide hover:bg-white/10 transition">
            {t.hero.ctaQuote}
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 inset-x-0 z-10 flex justify-center">
        <div className="h-12 w-px bg-gradient-to-b from-transparent via-white/60 to-white/0 animate-pulse" />
      </div>
    </section>
  );
}