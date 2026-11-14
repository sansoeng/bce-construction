# BCE Architecture — living reference

**Last verified:** 2026-11-14 · **Verified by:** agent (live endpoints, wrangler, Cloudflare dashboard API)
**Audience:** humans and AI agents working in this repo.

> This file is a snapshot of how the system is wired **today**, plus the decisions behind it.
> Read it before touching infrastructure. Update it in the same commit whenever the
> architecture changes (see [Updating this file](#updating-this-file)).
> Secrets never belong here — names only.

---

## 1. Snapshot

| Piece | Production | Staging |
| --- | --- | --- |
| Public site | https://bce-construction.com (also `www`) | https://staging.bce-construction.com |
| Admin | https://admin.bce-construction.com (Cloudflare Access) | staging host + `?admin` (UI loads, API is read-only and needs Access — use the production admin) |
| Pages project | `bce-construction` · **Production** environment · branch `main` | `bce-construction-staging` · **Production** environment · production branch `staging` |
| Worker | `bce-api` | `bce-api-staging` |
| Worker route | `bce-construction.com/api/*` · `www.bce-construction.com/api/*` · `admin.bce-construction.com/api/*` | `staging.bce-construction.com/api/*` |
| Worker secret store | production | staging (separate) |
| KV | `bce-sessions` | `bce-sessions-staging` |
| D1 | `bce-content` (`22b54a9a-08cd-4e52-af8d-46845713e806`) | **same database** (deliberate) |
| Content view | published rows (`data`, `km`) | pending rows (`stage_data`, `stage_km`) |
| Writes | allowed (Access JWT + allowlist) | `READ_ONLY=true` → admin and lead writes return 403 |
| Cron | `17 3 * * *` housekeeping | none |
| R2 | `bce-media` — **not enabled**, binding commented | same (shared bucket if enabled) |

Also provisioned: Cloudflare Access apps for the admin console and `bce-construction.com/api/admin`,
Turnstile widget `bce-website` (public site key only; secret is a Worker secret), Workers AI
binding `AI` on both Workers, Web Analytics on the zone, Pages fallbacks
`https://bce-construction.pages.dev` and `https://bce-construction-staging.pages.dev`.

Other environments: local dev (`vite` on 8443 + `wrangler dev` on 8787, local SQLite)
and ephemeral Pages preview URLs (`<hash>.<project>.pages.dev`) for other branches.
Neither is a managed environment.

## 2. Environment matrix (runtime)

| Behaviour | Production | Staging |
| --- | --- | --- |
| `ENVIRONMENT` | `production` | `staging` |
| API deploy | `wrangler deploy --env production` | `wrangler deploy` (bare) |
| Deploy script | `npm run deploy` | `npm run deploy:staging` |
| Pages target | project `bce-construction`, branch `main` | project `bce-construction-staging`, branch `staging` |
| CI branch | `main` | `staging` |
| D1 migrations | applied by CI on `main` | never applied |
| CORS origins | prod origins + local + staging | staging origins + local (allows prod list too — harmless) |
| Admin API host guard | 404 on non-admin hosts | not applied; auth still required |
| Leads (`POST /api/leads`) | Turnstile + rate limit | refused (403) |
| Telegram lead alerts | optional secrets | none |

**Wrangler layout is inverted on purpose:** the top-level config is **staging**
(`name = "bce-api-staging"`); `[env.production]` is `bce-api`. A forgotten `--env` therefore
publishes staging, never production. Bindings, vars, routes and triggers are not inherited, so
`[env.production]` redeclares everything it needs.

## 3. Request flow

```
Public visitor (production)
  bce-construction.com  ──Pages──▶ static React bundle
        └─ /api/* ──route──▶ bce-api ──▶ D1 bce-content   (published rows only)
                               └────▶ KV bce-sessions     (Access certs)
                               └────▶ R2 bce-media        (when enabled)

Public visitor (staging)
  staging.bce-construction.com ──Pages (bce-construction-staging)──▶ static React bundle
        └─ /api/* ──route──▶ bce-api-staging ──▶ D1 bce-content   (stage_* overlay)
                                   └────▶ KV bce-sessions-staging

Editor
  admin.bce-construction.com ──Access──▶ admin UI
        └─ /api/admin/* ──route──▶ bce-api ──▶ D1 writes stage_data / stage_km, bumps staging_version
                                             └─▶ Telegram/Workers AI (optional)
```

The frontend uses `src/contentStore.ts`: it renders the bundled TypeScript content first, then
fetches `/api/content/bootstrap` and remounts. The bundled content is the offline fallback, so
the site never blanks if the API is down.

## 4. Content lifecycle

1. Editor saves in the admin → row gets `stage_data` / `stage_km`, `stage_status`, audit entry,
   `staging_version` increments; bootstrap caches for staging are invalidated.
2. `staging.bce-construction.com` reads that pending overlay immediately (bootstrap cache ≤60 s,
   or use **Clear cache**).
3. Production is untouched and keeps serving published rows.
4. **Publish** (Dashboard) or **Promote** (document) copies stage → published and bumps
   `content_version`; production updates within the cache window.
5. Staging cannot publish: its Worker returns `403 read_only` for every admin write.

## 5. Invariants (do not break these)

- A bare `wrangler deploy` must only ever target staging. Production always uses `--env production`.
- Staging must stay read-only while D1 is shared. Turning off `READ_ONLY` without a separate
  database re-opens the risk of staging writes hitting live content.
- D1 migrations run from `main` only. Never run `wrangler d1 migrations apply` without
  `--env production`.
- `DEV_ADMIN_EMAIL` is local-only; the bypass is gated to `localhost` / `127.0.0.1` in
  `worker/src/auth.ts`. Never set it in deployed vars.
- One host route belongs to exactly one Worker. Cutover order when moving a route:
  release it on the old Worker first, then claim it on the new one.
- A Pages custom domain serves exactly one project's production deployment. Keep
  `staging.bce-construction.com` on `bce-construction-staging`; attaching it to
  `bce-construction` silently serves production code on the staging URL.
- Bindings, vars, routes and triggers are not inherited by `[env.production]` — mirror any
  new binding in both blocks (and update the R2 docs if applicable).
- Secrets are per environment: `wrangler secret put X` (staging) vs `--env production`.
- Public content must keep rendering from the bundled fallback if the API fails.

## 6. Decisions

| ID | Decision | Why | Revisit when |
| --- | --- | --- | --- |
| ADR-001 | Two Pages projects: `bce-construction` (prod) and `bce-construction-staging` | Pages custom domains always serve a project's production deployment, so a single project cannot put the staging branch on `staging.bce-construction.com` | Pages adds per-branch custom domains, or staging needs isolated build env vars |
| ADR-002 | Shared `bce-content` D1, staging read-only | Pending `stage_*` edits must be previewable on the staging site; a separate DB breaks Stage → Preview → Publish | You need to test destructive migrations, or staging must own independent data → add `bce-content-staging` + cross-DB publish |
| ADR-003 | Inverted Wrangler config (default = staging) | Makes the dangerous command the deliberate one; CI and agents forget flags | Wrangler changes env defaults, or tooling assumes top-level = production |
| ADR-004 | Migrations only from `main` | Staging shares the schema production is serving | A separate staging DB exists |
| ADR-005 | Staging site is public, admin writes blocked | Preview needs no Access app; writes are the real risk | Stakeholders need a private preview → add an Access app on the staging host |

## 7. Command cheat-sheet

```bash
# Inspect (read-only, safe)
npx wrangler deployments list                 # staging Worker
npx wrangler deployments list --env production
npx wrangler d1 list
npx wrangler kv namespace list
npx wrangler pages project list
npx wrangler pages deployment list --project-name=bce-construction
npx wrangler pages deployment list --project-name=bce-construction-staging

# Deploy
npm run worker:deploy            # production Worker
npm run worker:deploy:staging    # staging Worker
npm run deploy                   # prod: export + build + migrate + worker + Pages main
npm run deploy:staging           # staging: export + build + worker + Pages staging
npm run db:migrate               # production D1 only

# Local
npm run dev                      # vite site
npm run worker:dev               # Worker on :8787, local D1, READ_ONLY=false
```

## 8. Verification recipe

```bash
# 1. Both Workers answer with the right environment
curl -s https://bce-construction.com/api/health
curl -s https://staging.bce-construction.com/api/health

# 2. Content modes differ
curl -sI https://bce-construction.com/api/content/bootstrap | grep -i x-content-mode
curl -sI https://staging.bce-construction.com/api/content/bootstrap | grep -i x-content-mode

# 3. Staging is read-only (expect 403 read_only)
curl -s -X POST https://staging.bce-construction.com/api/leads \
  -H 'content-type: application/json' -d '{"name":"probe"}'

# 4. Staging admin requires Access (expect 401, not a bypass)
curl -s https://staging.bce-construction.com/api/admin/me

# 5. Production admin still hands off to Access (expect 302)
curl -s -o /dev/null -w '%{http_code}\n' -X POST https://bce-construction.com/api/admin/revalidate \
  -H 'content-type: application/json' -d '{}'

# 6. Staging serves the staging build, production serves main (asset hashes differ)
curl -s https://staging.bce-construction.com/ | grep -o '/assets/index-[^"]*\.js' | head -1
curl -s https://bce-construction.com/ | grep -o '/assets/index-[^"]*\.js' | head -1
```

## 9. Known gaps

- R2 is not enabled; media endpoints return 503 until the bucket exists and both bindings are uncommented.
- Staging and production share one D1, so a staging deploy cannot safely test schema changes.
- The staging host is public; only writes are blocked.
- `.env` still holds a Global API Key; a scoped CI token is the recommended replacement.

## 10. Updating this file

When architecture changes, in the same commit:

1. Update [Snapshot](#1-snapshot) / [Environment matrix](#2-environment-matrix-runtime) values.
2. Add or revise an [ADR](#6-decisions) if a real trade-off was made.
3. Append a row to the changelog below (newest first).
4. Re-run [Verification](#8-verification-recipe) and bump **Last verified**.
5. Keep `docs/CLOUDFLARE.md` (deep setup/troubleshooting) and `AGENTS.md` (agent rules) consistent.
6. Never paste secret values; use variable names only.

## 11. Changelog

| Date | Change | Files | Verified |
| --- | --- | --- | --- |
| 2026-11-14 | Split Pages into two projects; moved `staging.bce-construction.com` to `bce-construction-staging` so the branded staging host serves staging code (it previously CNAME'd to production). CI and `deploy:staging` target the staging project | `.github/workflows/deploy.yml`, `package.json`, `docs/CLOUDFLARE.md`, `AGENTS.md` | staging serves `index-DWR1_jSx.js` with new careers copy; prod still serves `index-KIyKaZoX.js`; staging API reports `staging`, bootstrap mode `staging`; domain status `active` |
| 2026-11-14 | Split staging and production Workers; added `bce-api-staging` + `bce-sessions-staging`; staging made read-only (`READ_ONLY`); inverted Wrangler default to staging; CI is env-aware and migrates only on `main`; local dev admin bypass restricted to localhost | `wrangler.toml`, `worker/src/index.ts`, `worker/src/auth.ts`, `worker/src/types.ts`, `.github/workflows/deploy.yml`, `package.json`, `docs/CLOUDFLARE.md`, `AGENTS.md` | `/api/health` per host, bootstrap `x-content-mode`, 403 read-only probes, 401 staging admin, 302 prod Access |
