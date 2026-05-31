## Scope

Four changes to Bistro Gambrinus:

1. Catering form → save to DB (no email)
2. Admin panel → switcher between "Daily Menu" and "Requests Inbox"
3. Requests auto-expire after 3 months
4. Navbar → IT/EN language switcher + redesigned fullscreen mobile menu

---

## 1. Database

New migration creating `catering_requests`:

- Fields: `name`, `email`, `event_date`, `guests` (nullable int), `requests` (nullable text), `status` (enum: `new` / `read` / `archived`, default `new`), `expires_at` (timestamptz, default `now() + interval '3 months'`), standard `id` / `created_at` / `updated_at`.
- GRANTs: `INSERT` to `anon` + `authenticated` (public form submissions); `SELECT/UPDATE/DELETE` to `authenticated` only; `ALL` to `service_role`.
- RLS policies:
  - Anyone can INSERT (public form, server-side input validation via Zod).
  - Only admins (`has_role(auth.uid(), 'admin')`) can SELECT / UPDATE / DELETE.
- Auto-cleanup of expired rows: enable `pg_cron` + schedule a daily job that runs `DELETE FROM catering_requests WHERE expires_at < now()`.
- `updated_at` trigger reusing existing `set_updated_at()`.

## 2. Server functions

New `src/lib/catering.functions.ts`:

- `submitCateringRequest` (public, POST, Zod-validated: name 1–100, email valid 1–255, event_date ISO, guests 1–500 nullable, requests max 1000 nullable) — uses `supabaseAdmin` to insert. Trim + sanitize.
- `listCateringRequests` (admin-only, mirrors `checkIsAdmin` pattern) — returns rows ordered by `created_at desc`, excludes already-expired.
- `updateCateringRequestStatus` (admin-only) — mark `read` / `archived`.
- `deleteCateringRequest` (admin-only).

## 3. Catering form (`src/routes/catering.tsx`)

- Remove the simulated `setTimeout` submission.
- Call `submitCateringRequest` via `useServerFn`.
- Keep current UI; show success toast in current language; reset form on success.
- Surface server error messages via `toast.error`.

## 4. Admin panel (`src/routes/admin.tsx`)

- Add a `Tabs` (shadcn) or simple segmented control at top: **Menù del giorno** / **Richieste catering**.
- Extract existing menu editor into `MenuEditor` component (no behavior change).
- New `RequestsInbox` component:
  - Lists requests in cards: name, email (mailto), event date, guests, message, submitted-at, expires-in (e.g. "scade tra 2 mesi"), status badge.
  - Actions per row: "Segna come letto", "Archivia", "Elimina".
  - Empty state when no requests.
  - Real-time refresh via `useQuery` + Supabase realtime subscription on `catering_requests` (mirroring `daily-menu.tsx`).
- Note in UI: "Le richieste vengono eliminate automaticamente dopo 3 mesi."

## 5. i18n (IT/EN)

Lightweight in-house solution — no new dependencies:

- `src/lib/i18n.tsx`: React context `LanguageProvider` with `lang` (`'it' | 'en'`), `setLang`, `t(key)`. Persists choice in `localStorage` (`bg.lang`) and sets `<html lang>`. Default `it`.
- `src/lib/translations.ts`: nested dictionary covering all visible strings: header nav + CTA, home sections (hero, specialties, daily-menu, footer), catering page (hero, services, form labels + toasts), pasticceria page, admin tabs/labels, login page.
- Wrap app in `LanguageProvider` inside `src/routes/__root.tsx`.
- Replace hard-coded Italian strings in all public-facing components with `t('...')`. Admin/login can be partially translated (labels yes, but kept simple).
- Update each route's `head()` so `title` / `description` / `og:*` reflect current language (read from provider via small client effect that updates `document.title` and meta tags on language change — since `head()` is static, we add a `useDocumentMeta` hook in page components).

## 6. Navbar language switcher (`src/components/site-header.tsx`)

- Add a compact `IT | EN` toggle (pill style, gold underline on active) next to the phone button on desktop and inside the mobile menu.
- Uses `useLanguage()` hook.

## 7. Fullscreen mobile menu

Replace current dropdown panel with a polished fullscreen overlay:

- Fixed full-viewport panel, cream/espresso themed, opens with fade + slide; body scroll locked while open.
- Top bar: logo (left) + close X (right).
- Centered large serif nav links (Playfair Display, `text-4xl`), each with subtle gold underline animation on hover/active.
- Below links: language switcher (IT / EN pill).
- Bottom: phone CTA pill + small address line ("Bolzano · Bistro Gambrinus") + opening hours blurb (if available) + social icons placeholder.
- Smooth open/close transition (~300ms), Escape key closes, route change closes (already handled).
- Accessibility: `role="dialog"`, `aria-modal`, focus trap kept simple (focus close button on open), `aria-label` on nav.

## Technical notes

- Migration order: CREATE TABLE → GRANT → ENABLE RLS → POLICIES → trigger → enable extensions → cron schedule.
- Realtime: `ALTER PUBLICATION supabase_realtime ADD TABLE public.catering_requests;`
- pg_cron job posts a SQL `DELETE` (Option 1 pattern — SQL-only task, no HTTP needed).
- Form submission stays client-side validated AND server-side Zod-validated.
- All new colors/tokens reuse existing `gold`, `espresso`, `cream`, `background`, `foreground`, `border`.
- No new npm packages required (use existing shadcn `Tabs`, `Badge`).

## Files

**New**
- `supabase/migrations/<ts>_catering_requests.sql`
- `src/lib/catering.functions.ts`
- `src/lib/i18n.tsx`
- `src/lib/translations.ts`
- `src/components/admin/menu-editor.tsx`
- `src/components/admin/requests-inbox.tsx`
- `src/components/language-switcher.tsx`
- `src/components/mobile-menu.tsx`

**Edited**
- `src/routes/__root.tsx` (wrap with LanguageProvider)
- `src/routes/catering.tsx` (real submit + i18n)
- `src/routes/admin.tsx` (tabs)
- `src/routes/index.tsx` (i18n)
- `src/routes/pasticceria.tsx` (i18n)
- `src/routes/login.tsx` (i18n)
- `src/components/site-header.tsx` (lang switcher + fullscreen mobile menu integration)
- `src/components/site-footer.tsx` (i18n)
- `src/components/daily-menu.tsx`, `horizontal-specialties.tsx`, `parallax-hero.tsx` (i18n)
