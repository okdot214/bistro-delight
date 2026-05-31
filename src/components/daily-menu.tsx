import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listMenuItems } from "@/lib/menu.functions";
import { supabase } from "@/integrations/supabase/client";
import { UtensilsCrossed } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function DailyMenu() {
  const fetchMenu = useServerFn(listMenuItems);
  const qc = useQueryClient();
  const { t } = useLanguage();
  const { data, isLoading } = useQuery({
    queryKey: ["menu-items"],
    queryFn: () => fetchMenu(),
  });

  useEffect(() => {
    const ch = supabase
      .channel("menu-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "daily_menu_items" }, () => {
        qc.invalidateQueries({ queryKey: ["menu-items"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [qc]);

  return (
    <section id="menu-giorno" className="relative bg-secondary/60 py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-gold uppercase tracking-[0.3em] text-xs mb-4">{t.menu.kicker}</div>
          <h2 className="font-display text-4xl md:text-5xl text-foreground text-balance">
            {t.menu.title}<br />
            <span className="italic">{t.menu.titleItalic}</span>
          </h2>
          <div className="gold-rule w-32 mx-auto mt-8" />
        </div>

        <div className="mt-14 bg-card rounded-2xl shadow-[0_30px_80px_-30px_rgba(60,30,10,0.25)] border border-border/60 overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-muted-foreground">{t.menu.loading}</div>
          ) : !data || data.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              {t.menu.empty}
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {data.map((item) => (
                <li key={item.id} className="p-6 md:p-8 flex items-start gap-5 hover:bg-accent/30 transition">
                  <UtensilsCrossed className="h-5 w-5 mt-1 text-gold flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-display text-xl md:text-2xl text-foreground">{item.name}</h3>
                      {item.price != null && (
                        <span className="font-semibold text-foreground whitespace-nowrap">
                          € {Number(item.price).toFixed(2)}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="mt-1 text-sm md:text-base text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}