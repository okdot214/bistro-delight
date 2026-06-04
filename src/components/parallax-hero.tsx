import { useEffect, useRef, useState, useMemo } from "react";
import heroImg from "@/assets/hero-bistro.jpg";
import { useLanguage } from "@/lib/i18n";

export function ParallaxHero() {
  const ref = useRef<HTMLDivElement>(null);
  const [y, setY] = useState(0);
  const { t, lang } = useLanguage();

  const phrases = useMemo(() => {
    return lang === "it"
      ? [
          "Il tuo momento di gusto",
          "Il tuo caffè quotidiano",
          "Il tuo pranzo veloce",
          "Il tuo aperitivo serale",
          "La tua pasticceria artigianale",
        ]
      : [
          "Dein Genussmoment",
          "Dein täglicher Kaffee",
          "Dein schnelles Mittagessen",
          "Dein abendlicher Aperitif",
          "Deine handwerkliche Konditorei",
        ];
  }, [lang]);

  const [index, setIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState(
    "opacity-100 translate-y-0 transition-all duration-500",
  );

  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Slide up and fade out
      setAnimationClass("opacity-0 -translate-y-8 transition-all duration-500");

      // 2. Position at bottom instantly after animation ends
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % phrases.length);
        setAnimationClass("opacity-0 translate-y-8");

        // 3. Slide up to center in next paint cycle
        setTimeout(() => {
          setAnimationClass("opacity-100 translate-y-0 transition-all duration-500");
        }, 50);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, [phrases]);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setY(window.scrollY));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={ref} className="relative h-screen min-h-160 overflow-hidden bg-espresso">
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
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/50 to-black/90" />
      </div>

      <div
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 will-change-transform"
        style={{ transform: `translate3d(0, ${y * 0.15}px, 0)`, opacity: Math.max(0, 1 - y / 600) }}
      >
        <span className="text-gold uppercase tracking-[0.35em] text-xs md:text-sm mb-6 animate-fade-in">
          {t.hero.kicker}
        </span>
        <h1 className="font-display text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium leading-[1.05] max-w-5xl text-balance animate-fade-up">
          {t.hero.title}
          <span className="mt-2 h-[1.2em] relative overflow-hidden flex justify-center items-center">
            <span
              className={`absolute italic text-gold/95 text-4xl sm:text-4xl md:text-5xl ${animationClass}`}
            >
              {phrases[index]}
            </span>
          </span>
        </h1>
        <p
          className="mt-8 text-white/80 max-w-xl text-base md:text-lg leading-relaxed animate-fade-up"
          style={{ animationDelay: "120ms" }}
        >
          {t.hero.lead}
        </p>
        <div
          className="mt-10 flex flex-wrap gap-3 justify-center animate-fade-up"
          style={{ animationDelay: "240ms" }}
        >
          <a
            href="#menu-giorno"
            className="px-7 py-3.5 rounded-full bg-gold text-gold-foreground font-semibold text-sm tracking-wide hover:opacity-90 transition"
          >
            {t.hero.ctaMenu}
          </a>
          <a
            href="/catering"
            className="px-7 py-3.5 rounded-full border border-white/40 text-white font-semibold text-sm tracking-wide hover:bg-white/10 transition"
          >
            {t.hero.ctaQuote}
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 inset-x-0 z-10 flex justify-center">
        <div className="h-12 w-px bg-linear-to-b from-transparent via-white/60 to-white/0 animate-pulse" />
      </div>
    </section>
  );
}
