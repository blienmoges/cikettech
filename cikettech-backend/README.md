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

The AI assistant (`/api/assistant/message`) answers from the **published**
entries in the Knowledge Base — editing an entry in
`/admin/knowledge-base` on the frontend changes the assistant's replies
immediately, with no code changes or redeploy needed.

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

## Known gaps

- No cloud object storage (see above) — `uploads/` is local disk only.
- No reverse-proxy / TLS config — terminate HTTPS in front of this (Nginx,
  Caddy, or your host's load balancer) rather than in the app itself.
- CI (`.github/workflows/ci.yml`) runs tests and a Docker build check, but
  nothing is wired up to actually deploy anywhere yet.
