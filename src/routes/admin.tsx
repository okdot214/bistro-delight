import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteHeader } from "@/components/site-header";
import { supabase } from "@/integrations/supabase/client";
import { listMenuItems, upsertMenuItem, deleteMenuItem, checkIsAdmin } from "@/lib/menu.functions";
import { listCateringRequests, updateCateringRequestStatus, deleteCateringRequest } from "@/lib/catering.functions";
import { Plus, Trash2, Save, LogOut, Mail, CalendarDays, Users, Archive, MailOpen, RotateCcw } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin · Bistro Gambrinus" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type Row = { id?: string; name: string; description: string; price: string; sort_order: number };

function AdminPage() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const checkAdminFn = useServerFn(checkIsAdmin);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { setAuthed(false); navigate({ to: "/login" }); return; }
      setAuthed(true);
      try {
        const r = await checkAdminFn();
        setIsAdmin(r.isAdmin);
      } catch { setIsAdmin(false); }
    })();
  }, [checkAdminFn, navigate]);

  if (authed === null || (authed && isAdmin === null)) {
    return <CenterMsg>Verifica accesso…</CenterMsg>;
  }
  if (authed && isAdmin === false) {
    return (
      <CenterMsg>
        <p>Il tuo account non ha permessi di amministratore.</p>
        <p className="mt-2 text-sm text-muted-foreground">Contatta un amministratore per ottenere l'accesso.</p>
        <button onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/login" }); }}
          className="mt-6 px-5 py-2 rounded-full bg-foreground text-background text-sm">Esci</button>
      </CenterMsg>
    );
  }

  return <AdminDashboard />;
}

function CenterMsg({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <div className="flex-1 flex items-center justify-center px-6 text-center">{children}</div>
    </div>
  );
}

function AdminDashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [tab, setTab] = useState<"menu" | "requests">("menu");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 pt-28 pb-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <div className="text-gold uppercase tracking-[0.3em] text-xs mb-2">{t.admin.kicker}</div>
              <h1 className="font-display text-4xl md:text-5xl">
                {tab === "menu" ? t.admin.menuTitle : t.admin.requestsTitle}
              </h1>
              <p className="text-muted-foreground mt-2">
                {tab === "menu" ? t.admin.menuLead : t.admin.requestsLead}
              </p>
            </div>
            <button onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/login" }); }}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4" /> {t.admin.logout}
            </button>
          </div>

          <Tabs value={tab} onValueChange={(v) => setTab(v as "menu" | "requests")}>
            <TabsList className="mb-8">
              <TabsTrigger value="menu">{t.admin.tabMenu}</TabsTrigger>
              <TabsTrigger value="requests">{t.admin.tabRequests}</TabsTrigger>
            </TabsList>
            <TabsContent value="menu"><MenuEditor /></TabsContent>
            <TabsContent value="requests"><RequestsInbox /></TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

function MenuEditor() {
  const { t } = useLanguage();
  const qc = useQueryClient();
  const listFn = useServerFn(listMenuItems);
  const upsertFn = useServerFn(upsertMenuItem);
  const deleteFn = useServerFn(deleteMenuItem);

  const { data } = useQuery({ queryKey: ["menu-items"], queryFn: () => listFn() });
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    if (data) {
      setRows(data.map((d) => ({
        id: d.id, name: d.name, description: d.description ?? "",
        price: d.price != null ? String(d.price) : "", sort_order: d.sort_order,
      })));
    }
  }, [data]);

  const addRow = () => setRows((r) => [...r, { name: "", description: "", price: "", sort_order: r.length }]);
  const updateRow = (i: number, patch: Partial<Row>) => setRows((r) => r.map((row, idx) => idx === i ? { ...row, ...patch } : row));

  const saveRow = async (i: number) => {
    const r = rows[i];
    if (!r.name.trim()) { toast.error(t.admin.nameRequired); return; }
    try {
      const res = await upsertFn({ data: {
        id: r.id, name: r.name.trim(),
        description: r.description.trim() || null,
        price: r.price ? Number(r.price) : null,
        sort_order: i,
      }});
      updateRow(i, { id: res.id });
      toast.success(t.admin.saved);
      qc.invalidateQueries({ queryKey: ["menu-items"] });
    } catch (e) { toast.error((e as Error).message); }
  };

  const removeRow = async (i: number) => {
    const r = rows[i];
    if (r.id) {
      try { await deleteFn({ data: { id: r.id } }); toast.success(t.admin.deleted); }
      catch (e) { toast.error((e as Error).message); return; }
    }
    setRows((rs) => rs.filter((_, idx) => idx !== i));
    qc.invalidateQueries({ queryKey: ["menu-items"] });
  };

  return (
    <>
      <div className="space-y-3">
        {rows.map((r, i) => (
          <div key={r.id ?? `new-${i}`} className="bg-card border border-border rounded-xl p-4 md:p-5 grid gap-3 md:grid-cols-[1fr_1.6fr_110px_auto]">
            <input value={r.name} onChange={(e) => updateRow(i, { name: e.target.value })} placeholder={t.admin.dishName}
              className="rounded-lg border border-input bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold/40" />
            <input value={r.description} onChange={(e) => updateRow(i, { description: e.target.value })} placeholder={t.admin.dishDesc}
              className="rounded-lg border border-input bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold/40" />
            <input value={r.price} onChange={(e) => updateRow(i, { price: e.target.value.replace(",", ".") })} placeholder="€"
              inputMode="decimal"
              className="rounded-lg border border-input bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold/40" />
            <div className="flex gap-2">
              <button onClick={() => saveRow(i)} className="px-3 py-2.5 rounded-lg bg-foreground text-background hover:opacity-90" title={t.admin.saved}>
                <Save className="h-4 w-4" />
              </button>
              <button onClick={() => removeRow(i)} className="px-3 py-2.5 rounded-lg border border-border hover:bg-destructive hover:text-destructive-foreground" title={t.admin.delete}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={addRow}
        className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gold text-gold-foreground font-semibold hover:opacity-90">
        <Plus className="h-4 w-4" /> {t.admin.addDish}
      </button>
    </>
  );
}

function RequestsInbox() {
  const { t } = useLanguage();
  const qc = useQueryClient();
  const listFn = useServerFn(listCateringRequests);
  const updateFn = useServerFn(updateCateringRequestStatus);
  const deleteFn = useServerFn(deleteCateringRequest);

  const { data, isLoading } = useQuery({
    queryKey: ["catering-requests"],
    queryFn: () => listFn(),
  });

  useEffect(() => {
    const ch = supabase
      .channel("catering-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "catering_requests" }, () => {
        qc.invalidateQueries({ queryKey: ["catering-requests"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [qc]);

  const setStatus = async (id: string, status: "new" | "read" | "archived") => {
    try { await updateFn({ data: { id, status } }); qc.invalidateQueries({ queryKey: ["catering-requests"] }); }
    catch (e) { toast.error((e as Error).message); }
  };
  const remove = async (id: string) => {
    try { await deleteFn({ data: { id } }); toast.success(t.admin.deleted); qc.invalidateQueries({ queryKey: ["catering-requests"] }); }
    catch (e) { toast.error((e as Error).message); }
  };

  if (isLoading) return <div className="p-12 text-center text-muted-foreground">…</div>;
  if (!data || data.length === 0) {
    return <div className="p-12 text-center text-muted-foreground bg-card border border-border rounded-xl">{t.admin.requestsEmpty}</div>;
  }

  const daysUntil = (iso: string) => Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="space-y-4">
      {data.map((r) => {
        const badge = r.status === "new"
          ? "bg-gold/15 text-gold border-gold/30"
          : r.status === "read"
            ? "bg-muted text-muted-foreground border-border"
            : "bg-secondary text-foreground/60 border-border";
        return (
          <article key={r.id} className={`bg-card border border-border rounded-xl p-5 md:p-6 ${r.status === "new" ? "ring-1 ring-gold/20" : ""}`}>
            <header className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-xl text-foreground">{r.name}</h3>
                <a href={`mailto:${r.email}`} className="text-sm text-muted-foreground hover:text-gold inline-flex items-center gap-1.5 mt-1">
                  <Mail className="h-3.5 w-3.5" /> {r.email}
                </a>
              </div>
              <span className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${badge}`}>
                {t.admin.status[r.status]}
              </span>
            </header>
            <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-foreground/80">
                <CalendarDays className="h-4 w-4 text-gold" />
                <span><span className="text-muted-foreground">{t.admin.eventDate}:</span> {new Date(r.event_date).toLocaleDateString()}</span>
              </div>
              {r.guests != null && (
                <div className="flex items-center gap-2 text-foreground/80">
                  <Users className="h-4 w-4 text-gold" />
                  <span><span className="text-muted-foreground">{t.admin.guests}:</span> {r.guests}</span>
                </div>
              )}
            </div>
            {r.requests && (
              <div className="mt-4 p-4 rounded-lg bg-secondary/60 text-sm text-foreground/90 whitespace-pre-wrap">
                {r.requests}
              </div>
            )}
            <footer className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
              <div className="flex flex-wrap gap-4">
                <span>{t.admin.receivedOn} {new Date(r.created_at).toLocaleString()}</span>
                <span>{t.admin.expiresIn} {daysUntil(r.expires_at)} {t.admin.days}</span>
              </div>
              <div className="flex gap-2">
                {r.status === "new" && (
                  <button onClick={() => setStatus(r.id, "read")} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border hover:bg-accent text-foreground">
                    <MailOpen className="h-3.5 w-3.5" /> {t.admin.markRead}
                  </button>
                )}
                {r.status !== "archived" ? (
                  <button onClick={() => setStatus(r.id, "archived")} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border hover:bg-accent text-foreground">
                    <Archive className="h-3.5 w-3.5" /> {t.admin.archive}
                  </button>
                ) : (
                  <button onClick={() => setStatus(r.id, "new")} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border hover:bg-accent text-foreground">
                    <RotateCcw className="h-3.5 w-3.5" /> {t.admin.unarchive}
                  </button>
                )}
                <button onClick={() => remove(r.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border hover:bg-destructive hover:text-destructive-foreground hover:border-destructive">
                  <Trash2 className="h-3.5 w-3.5" /> {t.admin.delete}
                </button>
              </div>
            </footer>
          </article>
        );
      })}
    </div>
  );
}