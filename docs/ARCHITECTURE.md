# BCE Architecture — living reference

**Last verified:** 2026-11-17 · **Verified by:** agent (live endpoints, wrangler, Cloudflare dashboard API, browser pass)
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
| R2 | `bce-media` — enabled 2026-11-15, `MEDIA` binding in both Workers | same bucket (deliberate; staged uploads preview before promote) |

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
                               └────▶ R2 bce-media        (uploads, variants)

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

- Staging and production share one D1, so a staging deploy cannot safely test schema changes.
- The staging host is public; only writes are blocked.
- `.env` still holds a Global API Key; a scoped CI token is the recommended replacement.
- D1 now mirrors the bundle: 41 published documents, one per slug, with `homepage`, `about` and `quality` stored under the admin's canonical slug `home` (the seed previously wrote `about:about` / `quality:quality`, which created a second document per singleton). `scripts/content-entry.ts` and the admin defaults must stay aligned on `home`. A later `npm run content:seed` overwrites live rows, so treat it as a deliberate reset; the retired `capabilities:home` row was deleted (backup taken before the change).

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
| 2026-11-17 | Promoted `staging` to production (36 commits, P0 included) and re-seeded live D1 so stored documents match the deployed bundle: singleton pages now keep the admin's canonical slug `home` (`about:home`, `quality:home`) instead of the seed's `about:about` / `quality:quality`, which had been creating a duplicate document per type; deleted the retired `capabilities:home` row after taking a backup | `scripts/content-entry.ts`, `src/admin/adminSchemas.ts`, `seed/content.json`, `seed/seed.sql`, `public/content-seed.json`, `docs/ARCHITECTURE.md` | Pages deployment `84057d1` and Worker version `04db129a` live; production serves `index-DumAG7Qn.js` (same bundle as staging), `/?privacy` and `/?terms` render, profile PDF 200 (8.8 MB) and the old path 301s; D1 documents = 41 rows over 9 types, bootstrap v31 includes `about`, `homepage` and `quality`; browser pass over 8 KM + 7 EN pages (home, resources, projects, blog, quality, about, coverage, recruitment, privacy, terms) reported 0 console errors and 0 broken images; resources show the 8.4 MB profile plus request cards, projects/blog show the sample label, recruitment lists the one open Sales & Quotations Engineer role |
| 2026-11-17 | Replaced the full-bleed photo quote band above the footer with Olympic's `fullwidth-copy` treatment: an off-white band, mono kicker, one centred statement whose words fade in with scroll, and **Contact us** + **Request a quotation** actions. The old background photo is no longer rendered; the quote remains editable in the admin console | `src/QuoteCta.tsx`, `src/index.css`, `src/homepage.ts`, `src/admin/adminSchemas.ts`, `src/admin/ContentPreview.tsx`, `src/i18n.ts` | `tsc` + `npm run build` clean; EN statement 47 words, KM statement 15 chunks; `--p` moves 0 → 1 and word opacity .16 → 1; buttons resolve to `/?contact` and `/?quote&service=piling` on a business page; no console errors (dev API 502 only) |
| 2026-11-17 | Added the Coverage detail page (`/?coverage`), the homepage map's information as a page of its own: cover, key figures (14 locations, 30+ years, 128 projects, 53 machines), an explorable province map with chips and a live detail card, the four zones, a 14-province register, the 11 mobilisation-ready provinces and the fleet. It reads the homepage map's shared data (`src/Coverage.tsx`) so the two cannot disagree, and is linked from the header (More, About, Quality), footer, sitemap and the Quality engineering button. Quality's Equipment & fleet photo now sits left (`reverse`). Fixed the inner-page loader gate so `?coverage` skips the homepage intro | `src/CoveragePage.tsx`, `src/Coverage.tsx`, `src/homepage.ts`, `src/main.tsx`, `src/SiteHeader.tsx`, `src/QualityPage.tsx`, `src/admin/adminSchemas.ts`, `src/i18n.ts`, `src/index.css`, `index.html`, `scripts/export-content.mjs`, `seed/*`, `public/sitemap.xml`, `AGENTS.md` | `npm run typecheck` + `npm run build` clean; `/?coverage` renders 14 pins / 25 provinces / 4 zones / 14 register cards / 11 ready provinces; province selection updates the card; EN and KM labels render; no page console errors |
| 2026-11-17 | P0 credibility pass: replaced the 3.6 KB placeholder company-profile PDF with an 8.4 MB web edition (old path 301s), added Privacy policy and Terms of use pages with footer links and form consent, labelled sample portfolio and journal records, replaced the journal's reference-site covers with BCE photography and removed unverified claims, removed placeholder partner logos and invented per-province equipment/counts, closed vacancies past their deadline (with one example Sales & Quotations Engineer role left open to 31 December 2026), and turned resource cards without a file into "request this document" | `src/LegalPage.tsx`, `src/contentFlags.ts`, `src/resourcesData.ts`, `src/ResourcesPage.tsx`, `src/homepage.ts`, `src/projects.ts`, `src/blogData.ts`, `src/BlogPage.tsx`, `src/ProjectPage.tsx`, `src/ProjectsPage.tsx`, `src/RecruitmentPage.tsx`, `src/Coverage.tsx`, `src/CoveragePage.tsx`, `src/quality.ts`, `src/Footer.tsx`, `src/contentStore.ts`, `src/main.tsx`, `src/index.css`, `src/i18n.ts`, `public/assets/BCE_Corporate_Profile_2026_web.pdf`, `public/_redirects`, `scripts/export-content.mjs`, `seed/*`, `public/sitemap.xml`, `docs/ARCHITECTURE.md` | `npm run typecheck` + `npm run build` clean; `/?resources` shows the 8.4 MB profile plus 7 request cards, `/?privacy` and `/?terms` render with legal footer links, `/?recruitment` lists 0 rows and the empty state, `/?projects` shows the sample note and detail tag, homepage partners render 17 wordmarks and 0 placeholder images, `/?coverage` shows 14 / 30+ / 128 / 53; no page console errors (dev API 502 only because the local Worker was not running) |
| 2026-11-16 | Quality page order is Calibration → HSE → Equipment & fleet → Engineering, so the HSE sequence and the full fleet inventory both sit above "People behind every project". On-page index and admin section cards follow the same order | `src/QualityPage.tsx`, `src/admin/adminSchemas.ts`, `AGENTS.md` | `tsc` + `npm run build` clean; offsets calibration 6025 → HSE 6900 → fleet 11265 → engineering 12416 → documents 13327; 8 fleet rows; no console errors |
| 2026-11-16 | Quality page order is Engineering → HSE → Equipment & fleet: the HSE sticky sequence keeps its ink ground and now sits above the fleet, while the fleet panel moved onto the light ground and lists the full inventory (batching plants, mixer trucks, pump trucks, wheel loaders, piling rigs, crane trucks, tower cranes, lifts — laboratory equipment excluded). Fleet and engineering copy moved from the retired `capabilities` document into `quality.ts`, so one admin document now owns the page; the D1 `capabilities` row is orphaned | `src/QualityPage.tsx`, `src/quality.ts`, `src/capabilities.ts` (deleted), `src/StickyValues.tsx`, `src/index.css`, `src/admin/adminSchemas.ts`, `src/admin/AdminApp.tsx`, `scripts/content-entry.ts`, `src/i18n.ts`, `seed/*`, `AGENTS.md` | `tsc` + `npm run build` clean; order offsets calibration 6025 → engineering 6831 → HSE 7901 → fleet 12266 → documents 13327; eight fleet rows render, fleet background transparent; no console errors |
| 2026-11-16 | Quality page order is now Engineering → Equipment & fleet → HSE; the HSE sticky sequence moved onto the ink ground and sits flush with the fleet band, so the two read as one dark block. `StickyValues` takes a `dark` flag; the band gets `.ol-dk--flush` | `src/QualityPage.tsx`, `src/StickyValues.tsx`, `src/index.css` | `tsc` + `npm run build` clean; section offsets engineering 6831 → fleet 7873 → HSE 9056; HSE background `rgb(17,17,17)`, copy `rgba(255,255,255,.68)`; band bottom equals HSE top at 1440 and 390 px; no console errors |
| 2026-11-16 | Merged the Technical Capabilities page into Quality & HSE (`/?quality`), which is now "Quality, capability & HSE". Removed the duplicated quality-assurance, laboratory and materials panels; kept fleet and engineering as the "Capacity" document. `/?capabilities` rewrites to `/?quality` and maps its old anchors (`#mix-designs` → `#grades`, `#materials-certificates` → `#raw-materials`, `#quality-assurance` → `#laboratory`). Footer, nav, sitemap and the Businesses "Explore more" button updated | `src/QualityPage.tsx`, `src/CapabilitiesPage.tsx` (deleted), `src/capabilities.ts`, `src/quality.ts`, `src/main.tsx`, `src/SiteHeader.tsx`, `src/homepage.ts`, `src/BusinessesPage.tsx`, `src/usePageSetup.ts`, `src/admin/adminSchemas.ts`, `src/i18n.ts`, `scripts/content-entry.ts`, `scripts/export-content.mjs`, `seed/*`, `public/sitemap.xml`, `AGENTS.md` | `npm run build` clean; `/?capabilities` and its anchors land on the mapped sections (3250 / 4510 / 1273 px); Khmer labels render; no console errors |
| 2026-11-15 | Enabled R2 on the BCE account; created bucket `bce-media` (Standard, free tier) and uncommented the `MEDIA` binding in both Workers, so admin uploads and `/api/media/<key>` reads work | `wrangler.toml`, `docs/CLOUDFLARE.md`, `AGENTS.md` | `wrangler r2 bucket list` shows `bce-media`; both deploys log `env.MEDIA (bce-media)`; `/api/health` → `"r2":"bound"` on prod and staging; a test object uploaded with `--remote` served 200 through both hosts, then deleted |
| 2026-11-14 | Split Pages into two projects; moved `staging.bce-construction.com` to `bce-construction-staging` so the branded staging host serves staging code (it previously CNAME'd to production). CI and `deploy:staging` target the staging project | `.github/workflows/deploy.yml`, `package.json`, `docs/CLOUDFLARE.md`, `AGENTS.md` | staging serves `index-DWR1_jSx.js` with new careers copy; prod still serves `index-KIyKaZoX.js`; staging API reports `staging`, bootstrap mode `staging`; domain status `active` |
| 2026-11-14 | Split staging and production Workers; added `bce-api-staging` + `bce-sessions-staging`; staging made read-only (`READ_ONLY`); inverted Wrangler default to staging; CI is env-aware and migrates only on `main`; local dev admin bypass restricted to localhost | `wrangler.toml`, `worker/src/index.ts`, `worker/src/auth.ts`, `worker/src/types.ts`, `.github/workflows/deploy.yml`, `package.json`, `docs/CLOUDFLARE.md`, `AGENTS.md` | `/api/health` per host, bootstrap `x-content-mode`, 403 read-only probes, 401 staging admin, 302 prod Access |
