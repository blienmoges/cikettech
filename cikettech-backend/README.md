# CIKETTECH Backend

REST API powering the CIKETTECH marketing site and admin portal — built with
Node.js, Express, and SQLite.

## Requirements

- Node.js >= 20.9.0

## Setup

```bash
npm install
cp .env.example .env   # then edit .env — see below
npm run dev            # starts on http://localhost:4000, auto-restarts on file changes
```

Run `npm start` instead of `npm run dev` for a plain, non-watching process (production-style).

### Running with Docker

```bash
docker build -t cikettech-backend .
docker run -p 4000:4000 --env-file .env -v cikettech-data:/app/db \
  -e DB_PATH=/app/db/data.sqlite cikettech-backend
```

Or, to run both services together, use `docker-compose.yml` in the repo root
(one level up — see that file for the full setup, including volumes for the
database, uploads, and backups).

### Environment variables

| Variable          | Required | Default                 | Purpose                                                              |
| ------------------ | -------- | ------------------------ | --------------------------------------------------------------------- |
| `PORT`             | no       | `4000`                   | Port the server listens on.                                          |
| `JWT_SECRET`       | **yes**  | —                         | Signs admin session tokens. The server refuses to start without one. Generate one with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`. |
| `ALLOWED_ORIGINS`  | no       | `http://localhost:3000`  | Comma-separated list of origins allowed to call this API (CORS).     |
| `DB_PATH`          | no       | `<repo>/data.sqlite`     | SQLite database file location. Tests set this to `:memory:`.         |
| `UPLOADS_DIR`      | no       | `<repo>/uploads`         | Where uploaded files are written/served from.                        |
| `BACKUP_DIR`       | no       | `<repo>/backups`         | Where daily SQLite backups are written.                              |
| `GEMINI_API_KEY`   | no       | —                         | Enables the LLM-backed AI assistant (free tier — see `.env.example`). Without it, the assistant falls back to keyword search. |
| `GEMINI_MODEL`     | no       | `gemini-3.6-flash`       | Gemini model used by the assistant.                                   |

## Data & storage

- **Database**: SQLite via `better-sqlite3`, stored at `data.sqlite` in the repo
  root (WAL mode). Every admin-managed resource (products, news, projects,
  awards, images, downloads, customer inquiries, knowledge base, settings,
  users) persists here and survives restarts. Seed data loads once, the first
  time each table is empty — editing content afterward is safe.
- **Uploaded files**: saved to `uploads/` on local disk and served from
  `/uploads/<filename>`. This is fine for local development, but **most
  cloud hosts wipe local disk on every redeploy** — before deploying, swap
  the storage layer in `src/routes/admin/uploads.js` for a real object-storage
  provider (S3, Cloudinary, Backblaze B2, etc.).
- **Backups**: a daily snapshot of `data.sqlite` is taken automatically
  (`src/db/backup.js`, started from `server.js`) into `backups/`, keeping the
  last 14. `uploads/` itself still isn't backed up — copy it separately.

## Authentication

Admin login issues a JWT (`POST /api/admin/auth/login`), which the frontend
sends as `Authorization: Bearer <token>`. Only mutating requests (POST/PUT/
PATCH/DELETE) to `/api/admin/*` require a valid token — GETs are public so
Server Components can render admin-authored content without a session.

Two roles: **Administrator** (full access) and **Editor** (can create/edit
every resource but not delete it, and can't reach `/api/admin/users`, which
requires Administrator on every method — user emails/roles are sensitive
enough that even GET needs auth there, unlike other admin resources).
Manage accounts via `/api/admin/users` (list/create/PATCH role/delete);
there must always be at least one Administrator, and you can't delete your
own account while logged in as it.

Demo credentials (change the password after first login via Settings):

```
email:    admin@cikettech.com
password: CikettechAdmin!2024
```

## API overview

**Public marketing site** — `/api/home`, `/api/about`, `/api/products`,
`/api/technology`, `/api/innovation`, `/api/impact`, `/api/contact`,
`/api/assistant`, `/api/quote`, `/api/news`, `/api/projects`, `/api/awards`,
`/api/social-links`. All read-only except `/api/contact` and `/api/quote`
(POST), which create a customer inquiry.

**Admin portal** — everything under `/api/admin/*`: `auth`, `dashboard`,
`analytics`, `languages`, `settings`, `products`, `news`, `projects`,
`awards`, `images`, `downloads`, `inquiries`, `knowledge-base`, `uploads`,
`users`. Most content resources are generic CRUD routers built with the
factory in `src/utils/crud.js`, which also gates DELETE to specific roles
via its `deleteRoles` option (Administrator-only on every resource here).

The AI assistant (`/api/assistant/message`) is backed by Google's Gemini API
(free tier — see `GEMINI_API_KEY` in `.env.example`). Each request is grounded
with a system prompt built from the product catalog and the **published**
entries in the Knowledge Base, so editing an entry in `/admin/knowledge-base`
on the frontend changes the assistant's replies immediately, with no code
changes or redeploy needed. Without `GEMINI_API_KEY` set, it falls back to a
keyword search over the same published entries — same grounding guarantee,
lower quality answers — so the widget still works with zero configuration.

## Tests

```bash
npm test
```

Runs the Jest + Supertest suite against an in-memory database (`DB_PATH=:memory:`,
set in `test/setupEnv.js`) — it never touches your real `data.sqlite`.

## Project structure

```
src/
  app.js              Express app: middleware, route mounting
  db/                 SQLite connection + one-time seeding
  middleware/auth.js  JWT issuance/verification, requireAuth(ForMutations)
  data/               Business logic + seed data, one file per resource
  routes/             Thin Express routers, one file per resource
  utils/crud.js       Generic REST router factory used by most admin resources
uploads/              User-uploaded files (gitignored)
test/                 Jest + Supertest suite
```

## Security

- `helmet` sets standard security headers (CSP, HSTS, `X-Content-Type-Options`,
  etc.) on every response. `crossOriginResourcePolicy` is relaxed to
  `cross-origin` since the frontend (a different origin/port) legitimately
  loads `/uploads` images and documents from here.
- CORS is locked to `ALLOWED_ORIGINS`.
- JWT bearer auth (not cookies) for the admin API — CSRF doesn't meaningfully
  apply here since browsers don't auto-attach an `Authorization` header the
  way they do session cookies.
- Passwords are hashed with bcrypt; role-based access control (Administrator/
  Editor) on every mutating admin route.
- Automated daily SQLite backups (`src/db/backup.js`), 14-day rotation.

## Deployment (Render)

Deployed as a free Render web service (`render.yaml` in this folder) — see the
frontend's `cikettech-website/render.yaml` for the matching frontend setup.

1. On [render.com](https://render.com), New → Web Service → connect the
   `blienmoges/cikettech` GitHub repo.
2. Set **Root Directory** to `cikettech-backend`.
3. Render should pick up `render.yaml` automatically (Node runtime, free plan).
   If not, set Build Command to `npm install` and Start Command to
   `node server.js` manually.
4. Set the `ALLOWED_ORIGINS` and `GEMINI_API_KEY` env vars in the dashboard
   (marked `sync: false` in `render.yaml`, so Render prompts for them rather
   than storing them in the repo). `ALLOWED_ORIGINS` should be your Vercel
   frontend's URL once you have it.
5. `JWT_SECRET` is auto-generated by Render (`generateValue: true`).

**Important caveat**: Render's free plan has no persistent disk — the SQLite
database and any uploaded files reset to their seeded/empty state on every
redeploy (not on every restart/sleep-wake, only when you push new code or
manually redeploy). Acceptable for a low-traffic site, but know that any admin
content edited after the last deploy will be lost the next time you deploy.
If that becomes a problem, moving to a paid Render disk, or externalizing the
database (e.g. Turso) and uploads (e.g. Cloudinary) to free hosted services
that don't depend on the app server's own filesystem, would remove this risk
entirely — ask if you want that migration done.

## Known gaps

- No cloud object storage (see above) — `uploads/` is local disk only, and
  ephemeral in the current Render deployment (see Deployment above).
- No reverse-proxy / TLS config needed manually — Render terminates HTTPS for
  you automatically.
- CI (`.github/workflows/ci.yml`) runs tests and a Docker build check, but
  deployment itself happens via Render's own GitHub integration, not CI.
- Input validation is hand-rolled per-route rather than a schema library
  (joi/zod) — functional, but not centrally enforced.
