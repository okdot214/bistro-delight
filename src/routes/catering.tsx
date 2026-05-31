import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import cateringHero from "@/assets/catering-hero.jpg";
import { CalendarDays, Users, MessageSquare, User, Mail } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { submitCateringRequest } from "@/lib/catering.functions";

export const Route = createFileRoute("/catering")({
  head: () => ({
    meta: [
      { title: "Catering & Eventi · Bistro Gambrinus Bolzano" },
      { name: "description", content: "Cene private a richiesta, catering per compleanni, feste di laurea ed eventi a Bolzano." },
      { property: "og:title", content: "Catering & Eventi · Bistro Gambrinus" },
      { property: "og:description", content: "Cene private, compleanni ed eventi personalizzati a Bolzano." },
    ],
  }),
  component: CateringPage,
});

function CateringPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main>
        <section className="relative h-[70vh] min-h-[500px] overflow-hidden bg-espresso">
          <img src={cateringHero} alt="Cena privata con catering Gambrinus" className="absolute inset-0 h-full w-full object-cover opacity-70" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80" />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
            <span className="text-gold uppercase tracking-[0.35em] text-xs mb-5">{t.catering.kicker}</span>
            <h1 className="font-display text-white text-5xl md:text-7xl max-w-4xl text-balance animate-fade-up">
              {t.catering.title1}<br /><span className="italic text-gold/95">{t.catering.title2}</span>
            </h1>
          </div>
        </section>

        <section className="py-24 bg-background">
          <div className="mx-auto max-w-6xl px-6 lg:px-10 grid md:grid-cols-3 gap-8">
            {t.catering.services.map((s, i) => (
              <div key={s.title} className="p-8 rounded-2xl border border-border bg-card hover:border-gold/40 transition">
                <div className="text-gold font-display text-3xl">0{i + 1}</div>
                <h3 className="mt-4 font-display text-2xl text-foreground">{s.title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        <QuoteForm />
      </main>
      <SiteFooter />
    </div>
  );
}

function QuoteForm() {
  const { t } = useLanguage();
  const submitFn = useServerFn(submitCateringRequest);
  const [form, setForm] = useState({ name: "", email: "", date: "", guests: "", requests: "" });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.date) {
      toast.error(t.catering.form.errorRequired);
      return;
    }
    setSubmitting(true);
    try {
      await submitFn({
        data: {
          name: form.name.trim(),
          email: form.email.trim(),
          event_date: form.date,
          guests: form.guests ? Number(form.guests) : null,
          requests: form.requests.trim() || null,
        },
      });
      toast.success(t.catering.form.success);
      setForm({ name: "", email: "", date: "", guests: "", requests: "" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-secondary/60">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <div className="text-center mb-12">
          <div className="text-gold uppercase tracking-[0.3em] text-xs mb-4">{t.catering.form.kicker}</div>
          <h2 className="font-display text-4xl md:text-5xl text-foreground text-balance">{t.catering.form.title}</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">{t.catering.form.lead}</p>
        </div>
        <form onSubmit={onSubmit} className="bg-card rounded-2xl p-8 md:p-10 border border-border shadow-sm space-y-5">
          <Field icon={<User className="h-4 w-4" />} label={t.catering.form.name} value={form.name} onChange={(v) => setForm({ ...form, name: v })} maxLength={100} />
          <Field icon={<Mail className="h-4 w-4" />} label={t.catering.form.email} type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} maxLength={120} />
          <div className="grid md:grid-cols-2 gap-5">
            <Field icon={<CalendarDays className="h-4 w-4" />} label={t.catering.form.date} type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
            <Field icon={<Users className="h-4 w-4" />} label={t.catering.form.guests} type="number" value={form.guests} onChange={(v) => setForm({ ...form, guests: v })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> {t.catering.form.requests}
            </label>
            <textarea rows={4} maxLength={1000} value={form.requests} onChange={(e) => setForm({ ...form, requests: e.target.value })}
              className="w-full rounded-lg border border-input bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/40" />
          </div>
          <button type="submit" disabled={submitting}
            className="w-full py-3.5 rounded-full bg-foreground text-background font-semibold tracking-wide hover:opacity-90 transition disabled:opacity-50">
            {submitting ? t.catering.form.submitting : t.catering.form.submit}
          </button>
        </form>
      </div>
    </section>
  );
}

function Field({ icon, label, value, onChange, type = "text", maxLength }: { icon: React.ReactNode; label: string; value: string; onChange: (v: string) => void; type?: string; maxLength?: number }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">{icon} {label}</label>
      <input type={type} value={value} maxLength={maxLength} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-input bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/40" />
    </div>
  );
}