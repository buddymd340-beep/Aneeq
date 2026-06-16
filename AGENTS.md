# Aneeq

This repository's main branch is essentially empty; the actual projects live on feature
branches. This branch contains **BrightPath Teaching**, a public Next.js teaching website
(no login) where visitors browse courses and send contact inquiries.

## Cursor Cloud specific instructions

### Stack / services
- Single service: a **Next.js 16 (App Router, Turbopack)** app backed by **Prisma 7 + SQLite**
  via the `better-sqlite3` driver adapter. There is no separate backend; API routes
  (e.g. `src/app/api/contact/route.ts`) run inside Next.js.
- Standard commands live in `package.json` `scripts` and `README.md` ("Run Locally").
  Lint: `npm run lint`. Build: `npm run build`. Dev server: `npm run dev` (port 3000).

### Non-obvious gotchas
- **`.env` is gitignored and required.** Copy it from the example before running anything:
  `cp .env.example .env` (sets `DATABASE_URL="file:./dev.db"`). The update script creates it
  automatically if missing.
- **Database path mismatch when seeding.** `prisma.config.ts` loads `.env` via `dotenv` and
  resolves `DATABASE_URL` to `./dev.db` (repo root), so `prisma migrate` writes to
  `./dev.db`. But `prisma/seed.ts` (and `src/lib/db.ts`) fall back to `file:./prisma/dev.db`
  when `DATABASE_URL` is not in the process env, and `npm run prisma:seed` (`tsx prisma/seed.ts`)
  does **not** auto-load `.env`. Always seed with the var set explicitly:
  `DATABASE_URL="file:./dev.db" npm run prisma:seed`
  (Plain `npm run dev`/`next` works fine because Next.js auto-loads `.env`.)
- **First-time DB setup** (not in the update script because it is stateful):
  `npm run prisma:migrate -- --name init` then
  `DATABASE_URL="file:./dev.db" npm run prisma:seed`.
  Seed data lives in `src/lib/content.ts`.
- Hello-world / core flow: open `/contact`, submit the inquiry form; it POSTs to
  `/api/contact` and persists a `ContactInquiry` row in `dev.db`.
