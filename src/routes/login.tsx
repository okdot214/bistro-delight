import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site-header";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Accesso · Bistro Gambrinus" }, { name: "robots", content: "noindex" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate({ to: "/admin", replace: true });
    });
    supabase.auth.getUser().then(({ data }) => { if (data.user) navigate({ to: "/admin", replace: true }); });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
    } else {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      if (error) toast.error(error.message);
      else toast.success("Account creato. Controlla la tua email per confermare.");
    }
    setBusy(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 pt-28 pb-20 flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 md:p-10 shadow-sm">
          <div className="text-center mb-8">
            <div className="text-gold uppercase tracking-[0.3em] text-xs mb-2">Area riservata</div>
            <h1 className="font-display text-3xl">{mode === "signin" ? "Accedi" : "Crea account"}</h1>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/40" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/40" />
            </div>
            <button type="submit" disabled={busy}
              className="w-full py-3.5 rounded-full bg-foreground text-background font-semibold disabled:opacity-50">
              {busy ? "Attendere…" : mode === "signin" ? "Accedi" : "Crea account"}
            </button>
          </form>
          <button onClick={() => setMode((m) => m === "signin" ? "signup" : "signin")}
            className="mt-6 w-full text-center text-sm text-muted-foreground hover:text-foreground">
            {mode === "signin" ? "Non hai un account? Registrati" : "Hai già un account? Accedi"}
          </button>
          <p className="mt-6 text-xs text-muted-foreground text-center">
            I permessi di amministratore vanno assegnati dal database (tabella user_roles).
          </p>
        </div>
      </main>
    </div>
  );
}