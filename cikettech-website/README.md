# CIKETTECH Website

Public marketing site and admin portal for CIKETTECH, built with Next.js
(App Router). All content is served by the companion [`cikettech-backend`](../cikettech-backend)
API — this app has no data of its own.

## Requirements

- Node.js >= 20.9.0
- The `cikettech-backend` API running (see its own README) — most pages will
  fail to render without it, since almost every page fetches data from it.

## Setup

```bash
npm install
npm run dev   # http://localhost:3000
```

By default the app talks to the backend at `http://localhost:4000`. To point
at a different backend (e.g. a deployed one), set:

```bash
NEXT_PUBLIC_API_BASE=https://your-backend-url npm run dev
```

### Running with Docker

```bash
docker build -t cikettech-website --build-arg NEXT_PUBLIC_API_BASE=http://localhost:4000 .
docker run -p 3000:3000 cikettech-website
```

`NEXT_PUBLIC_API_BASE` is baked into the client bundle at build time (it has
to be — it's read in the browser), so pass it as a `--build-arg`, not a
runtime `-e`. If you run this alongside the backend in separate containers
(see `docker-compose.yml` in the repo root), also set `INTERNAL_API_BASE`
(e.g. `http://backend:4000`) as a **runtime** env var — server-side page
rendering happens inside this container, where `localhost` doesn't reach a
sibling container.

## Deployment (Vercel)

Deployed on Vercel's free plan — no `render.yaml`/Docker needed there, Vercel
builds Next.js natively.

1. On [vercel.com](https://vercel.com), New Project → import the
   `blienmoges/cikettech` GitHub repo.
2. Set **Root Directory** to `cikettech-website`.
3. Framework preset should auto-detect as Next.js; leave build/output
   settings default.
4. Add environment variables:
   - `NEXT_PUBLIC_API_BASE` — your deployed backend's URL (e.g. the Render
     backend's `https://cikettech-backend.onrender.com`).
   - `NEXT_PUBLIC_SITE_URL` — this site's own URL, once Vercel assigns it
     (used for metadata/sitemap).
5. Deploy. `INTERNAL_API_BASE` (used for Docker Compose networking) isn't
   needed on Vercel — server-side rendering there reaches the backend over
   the public internet, same as the browser does.
6. Once you have this site's URL, set it as `ALLOWED_ORIGINS` on the backend
   (Render dashboard) so CORS allows it, then redeploy the backend.

## Admin portal

Log in at `/admin/login`:

```
email:    admin@cikettech.com
password: CikettechAdmin!2024
```

From there you can manage Products, News, Projects, Awards, Images,
Downloads, Languages, Customer Inquiries, Analytics, Users, and the AI
Knowledge Base — all of it backed by the real database in
`cikettech-backend`, not mock data.

Two roles exist: **Administrator** (full access, including deleting content
and managing other users) and **Editor** (can create and edit everything
except delete it, and can't see the Users page). Manage accounts from
`/admin/users`. The admin portal also has its own dark mode (toggle in the
topbar) — the public site doesn't, by design (see Known gaps).

## Bilingual content (English / Amharic)

The header's language toggle sets a cookie that every Server Component reads
via `apiGet()` (`app/lib/server-content.ts`) — the backend returns
already-localized content for Home, Technology, Innovation, Impact, About,
Contact, and all 4 products, no client-side translation logic involved.
Amharic text is machine-translated; swap in professional translations
directly in the backend's `src/data/*.js` files whenever available.

## Project structure

```
app/
  page.tsx, about/, technology/, innovation/, impact/,
  products/, news/, projects/, awards/, contact/, assistant/   Public marketing site
  admin/                                                        Admin portal (login + protected (portal) route group)
  components/                                                   Shared site chrome (header/footer) and small widgets
  lib/api.ts             Client-safe helpers: API_BASE, adminFetch, token storage, resolveMediaUrl, getCurrentUser
  lib/server-content.ts  Server Components only: apiGet() — adds language + resolves the internal API base in Docker
  lib/locale.ts, i18n.ts Cookie-based locale reading + the static UI-string dictionary
```

Most public pages are async Server Components that call `apiGet("/api/...")`
from `lib/server-content.ts`. Admin pages follow the same pattern for reads,
and use `adminFetch` (from `lib/api.ts`, which attaches the bearer token and
redirects to `/admin/login` on a 401) for writes. The Users page is fully
client-rendered instead, since user data needs auth on reads too.

## Known gaps

- Interactive form controls (Contact/Quote form labels, buttons) and each
  product's bespoke hero copy stay English-only — only page *content* is
  localized, not client-side UI chrome inside those specific forms.
- Dark mode is scoped to the admin portal only — the public site's ~400
  one-off hex colors across bespoke per-page styling weren't worth the risk
  of a blind global conversion.
- Public-facing photos (catalog cards, home/about/product hero and gallery
  images) use `next/image` for optimization, responsive sizing, and lazy
  loading. Admin-portal thumbnails (list tables, form previews) and a few
  static decorative backgrounds baked into the CSS (e.g. the home hero and
  about-page hero banners) were deliberately left as plain CSS background
  images — lower value for the effort given the time available.
- Wikimedia-hosted photos are rendered `unoptimized` (served directly,
  bypassing Next's image-optimization proxy) — Wikimedia's abuse mitigation
  blocks/rate-limits the generic server-side fetch Next's optimizer makes,
  while a normal browser request works fine.
- No automated tests for the frontend (see `cikettech-backend` for the API
  test suite).
