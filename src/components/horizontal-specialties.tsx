import { useEffect, useRef, useState } from "react";
import aperitivi from "@/assets/specialty-aperitivi.jpg";
import pranzi from "@/assets/specialty-pranzi.jpg";
import caffe from "@/assets/specialty-caffetteria.jpg";
import { useLanguage } from "@/lib/i18n";

const images = [aperitivi, pranzi, caffe];

export function HorizontalSpecialties() {
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [tx, setTx] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const { t } = useLanguage();

  const items = t.specialties.items.map((it, i) => ({
    img: images[i],
    kicker: `0${i + 1}`,
    title: it.title,
    text: it.text,
  }));

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const upd = () => setIsDesktop(mq.matches);
    upd();
    mq.addEventListener("change", upd);
    return () => mq.removeEventListener("change", upd);
  }, []);

  useEffect(() => {
    if (!isDesktop) { setTx(0); return; }
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = stickyRef.current;
        const track = trackRef.current;
        if (!el || !track) return;
        const rect = el.getBoundingClientRect();
        const total = el.offsetHeight - window.innerHeight;
        const progress = Math.min(1, Math.max(0, -rect.top / total));
        const maxShift = track.scrollWidth - window.innerWidth;
        setTx(progress * maxShift);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [isDesktop]);

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 pt-24 pb-10">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <div className="text-gold uppercase tracking-[0.3em] text-xs mb-3">{t.specialties.kicker}</div>
            <h2 className="font-display text-4xl md:text-6xl text-foreground max-w-2xl text-balance">
              {t.specialties.title} <span className="italic">{t.specialties.titleItalic}</span>
            </h2>
          </div>
          <p className="max-w-sm text-muted-foreground text-pretty">
            {t.specialties.lead}
          </p>
        </div>
      </div>

      {/* Desktop: sticky horizontal scroll */}
      <div ref={stickyRef} className="hidden lg:block relative" style={{ height: "260vh" }}>
        <div className="sticky top-0 h-screen overflow-hidden flex items-center">
          <div
            ref={trackRef}
            className="flex gap-10 pl-[10vw] pr-[10vw] will-change-transform"
            style={{ transform: `translate3d(${-tx}px, 0, 0)`, transition: "transform 60ms linear" }}
          >
            {items.map((it) => <SpecialtyCard key={it.title} {...it} />)}
          </div>
        </div>
      </div>

      {/* Mobile/tablet: native horizontal scroll */}
      <div className="lg:hidden overflow-x-auto scrollbar-hide snap-x snap-mandatory">
        <div className="flex gap-6 px-6 pb-12">
          {items.map((it) => (
            <div key={it.title} className="snap-center flex-shrink-0 w-[82vw] max-w-md">
              <SpecialtyCard {...it} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SpecialtyCard({ img, kicker, title, text }: { img: string; kicker: string; title: string; text: string }) {
  return (
    <article className="w-full lg:w-[34rem] flex-shrink-0 group">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
        <img src={img} alt={title} loading="lazy" width={1024} height={1280}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute top-5 left-5 text-cream font-display text-2xl drop-shadow">{kicker}</div>
      </div>
      <div className="mt-6 px-1">
        <h3 className="font-display text-3xl text-foreground">{title}</h3>
        <p className="mt-3 text-muted-foreground max-w-md leading-relaxed">{text}</p>
      </div>
    </article>
  );
}