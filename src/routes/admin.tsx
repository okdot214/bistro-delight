import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteHeader } from "@/components/site-header";
import { supabase } from "@/integrations/supabase/client";
import { listMenuItems, upsertMenuItem, deleteMenuItem, checkIsAdmin } from "@/lib/menu.functions";
import { Plus, Trash2, Save, LogOut } from "lucide-react";

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
    if (!r.name.trim()) { toast.error("Il nome è obbligatorio"); return; }
    try {
      const res = await upsertFn({ data: {
        id: r.id, name: r.name.trim(),
        description: r.description.trim() || null,
        price: r.price ? Number(r.price) : null,
        sort_order: i,
      }});
      updateRow(i, { id: res.id });
      toast.success("Salvato");
      qc.invalidateQueries({ queryKey: ["menu-items"] });
    } catch (e) { toast.error((e as Error).message); }
  };

  const removeRow = async (i: number) => {
    const r = rows[i];
    if (r.id) {
      try { await deleteFn({ data: { id: r.id } }); toast.success("Eliminato"); }
      catch (e) { toast.error((e as Error).message); return; }
    }
    setRows((rs) => rs.filter((_, idx) => idx !== i));
    qc.invalidateQueries({ queryKey: ["menu-items"] });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 pt-28 pb-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <div className="text-gold uppercase tracking-[0.3em] text-xs mb-2">Area amministratore</div>
              <h1 className="font-display text-4xl md:text-5xl">Menù del giorno</h1>
              <p className="text-muted-foreground mt-2">Aggiungi, modifica o rimuovi i piatti. Le modifiche sono immediate.</p>
            </div>
            <button onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/login" }); }}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4" /> Esci
            </button>
          </div>

          <div className="space-y-3">
            {rows.map((r, i) => (
              <div key={r.id ?? `new-${i}`} className="bg-card border border-border rounded-xl p-4 md:p-5 grid gap-3 md:grid-cols-[1fr_1.6fr_110px_auto]">
                <input value={r.name} onChange={(e) => updateRow(i, { name: e.target.value })} placeholder="Nome piatto"
                  className="rounded-lg border border-input bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold/40" />
                <input value={r.description} onChange={(e) => updateRow(i, { description: e.target.value })} placeholder="Descrizione (opzionale)"
                  className="rounded-lg border border-input bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold/40" />
                <input value={r.price} onChange={(e) => updateRow(i, { price: e.target.value.replace(",", ".") })} placeholder="€"
                  inputMode="decimal"
                  className="rounded-lg border border-input bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold/40" />
                <div className="flex gap-2">
                  <button onClick={() => saveRow(i)} className="px-3 py-2.5 rounded-lg bg-foreground text-background hover:opacity-90" title="Salva">
                    <Save className="h-4 w-4" />
                  </button>
                  <button onClick={() => removeRow(i)} className="px-3 py-2.5 rounded-lg border border-border hover:bg-destructive hover:text-destructive-foreground" title="Elimina">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button onClick={addRow}
            className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gold text-gold-foreground font-semibold hover:opacity-90">
            <Plus className="h-4 w-4" /> Aggiungi piatto
          </button>
        </div>
      </main>
    </div>
  );
}