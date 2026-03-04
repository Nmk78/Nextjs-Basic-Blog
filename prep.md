# Presentation Prep — Next.js Starter Template

## One-liner
Production-ready Next.js starter with auth (credentials + OAuth + passkeys), API keys, RBAC, MongoDB/Prisma, and full test coverage.

---

## Agenda (suggested ~15–20 min)

| # | Section | Time | Notes |
|---|--------|------|--------|
| 1 | Intro & why this template | 2 min | Problem: bootstrapping auth + DB + tests is slow |
| 2 | Tech stack & architecture | 3 min | Next 14, TypeScript, Bun, MongoDB, Auth.js, Tailwind/shadcn |
| 3 | Features walkthrough | 6 min | Auth, API keys, roles, dashboard, blog |
| 4 | Live demo | 5 min | Sign-in → dashboard → API keys → blog (optional) |
| 5 | Testing & CI/CD | 2 min | Vitest, Playwright, GitHub Actions |
| 6 | Q&A / next steps | 2 min | Clone, env, deploy |

---

## Talking points

### 1. Intro
- **Problem**: New Next.js apps need auth, DB, roles, API keys, and tests—each takes time to wire correctly.
- **Solution**: This template gives you a single repo with all of that configured and tested.

### 2. Tech stack
- **Next.js 14** — App Router, server components, API routes.
- **TypeScript** — Strict mode.
- **Bun** — Fast install/run (can swap to npm/yarn).
- **MongoDB + Prisma** — Schema, migrations, type-safe DB access.
- **Auth.js (next-auth)** — Session, JWT, multiple providers.
- **Tailwind + shadcn/ui** — Stone theme, accessible components.

### 3. Features (what to mention)
- **Auth**
  - Credentials (email/password, bcrypt).
  - Google & GitHub OAuth.
  - WebAuthn/passkeys (simplewebauthn).
  - Rate limiting on login attempts.
- **API keys**
  - Generate keys, hashed storage, prefix-only display, optional expiry, last-used tracking.
- **Roles**
  - User vs admin; permission checks in middleware/layouts.
- **Dashboard**
  - Protected routes, settings, API key management.
- **Blog**
  - Public list + post by slug; dashboard CRUD for posts (create/edit).

### 4. Demo flow (minimal)
1. Open app → landing.
2. **Sign in** (credentials or Google if configured).
3. **Dashboard** — show protected content.
4. **Settings → API keys** — create key, show prefix + “never show full key again”.
5. (Optional) **Blog** — public page + one post; optionally show dashboard blog list.

### 5. Testing & CI
- **Unit**: Vitest + React Testing Library (`bun run test`, `bun run test:coverage`).
- **E2E**: Playwright (`bun run test:e2e`, `bun run test:e2e:ui`).
- **CI**: GitHub Actions workflow in repo (lint, typecheck, tests).

### 6. Getting started (for audience)
- Clone → `bun install` → copy `.env.example` to `.env.local`.
- Set `DATABASE_URL`, `AUTH_SECRET`, optional OAuth IDs/secrets.
- `bun run db:generate` → `bun run db:push` → optional `bun run db:seed`.
- `bun run dev` → http://localhost:3000.

---

## Demo checklist (before presenting)

- [ ] `.env` / `.env.local` has valid `DATABASE_URL` and `AUTH_SECRET`.
- [ ] DB is up; run `bun run db:push` (and `db:seed` if you use seed data).
- [ ] OAuth (Google/GitHub) configured if you plan to demo social login.
- [ ] Browser: clear cookies or use incognito for clean sign-in flow.
- [ ] Optional: run `bun run build` once to avoid first-build delay during demo.

---

## Likely Q&A

| Question | Short answer |
|----------|--------------|
| Can we use PostgreSQL instead of MongoDB? | Yes—swap Prisma provider and connection string; adapt schema (e.g. relations) as needed. |
| Is this suitable for production? | Yes—auth, hashed API keys, rate limiting, and tests are in place; add your own security review and hardening. |
| How do we add more OAuth providers? | Add provider in `src/lib/auth.ts` and corresponding env vars (e.g. `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET`). |
| How are API keys validated? | Stored hashed; compare hash on API requests; update last-used and enforce expiry in your API route. |
| Can we use npm/pnpm instead of Bun? | Yes—replace `bun` with `npm`/`pnpm` in commands; lockfile will differ. |

---

## Slides / deck (optional)

If you use slides, one slide per section works well:
1. Title + one-liner.
2. Tech stack (icons or short list).
3. Features (bullets: Auth, API keys, RBAC, Dashboard, Blog).
4. Architecture or folder structure (e.g. `src/app`, `features`, `lib`).
5. Testing & CI (Vitest, Playwright, GitHub Actions).
6. Getting started (clone, env, db, dev).
7. Thank you / Q&A / repo link.

---

## Repo link
(Add your repo URL here, e.g. `https://github.com/your-org/Nextjs-Starter-Template`)
