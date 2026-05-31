import { useLanguage } from "@/lib/i18n";
import type { Lang } from "@/lib/translations";

export function LanguageSwitcher({
  variant = "light",
  size = "sm",
}: {
  variant?: "light" | "dark";
  size?: "sm" | "lg";
}) {
  const { lang, setLang } = useLanguage();
  const langs: Lang[] = ["it", "en"];

  const base = size === "lg" ? "text-base px-4 py-2" : "text-xs px-3 py-1.5";
  const inactive =
    variant === "light"
      ? "text-white/60 hover:text-white"
      : "text-foreground/50 hover:text-foreground";
  const active = "text-gold";
  const divider = variant === "light" ? "bg-white/25" : "bg-foreground/20";

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border ${
        variant === "light" ? "border-white/20" : "border-border"
      }`}
      role="group"
      aria-label="Language"
    >
      {langs.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && <span className={`h-3 w-px ${divider}`} aria-hidden />}
          <button
            type="button"
            onClick={() => setLang(l)}
            className={`${base} font-semibold tracking-wider uppercase rounded-full transition-colors ${
              lang === l ? active : inactive
            }`}
            aria-pressed={lang === l}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  );
}
