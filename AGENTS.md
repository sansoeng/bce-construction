# AGENTS.md — Developer & AI Agent Context Guide

This repository contains the official, high-performance bilingual corporate web application for **Battambang Construction and Engineering Co., Ltd. (BCE)** (ក្រុមហ៊ុន បាត់ដំបង ខនស្ត្រាក់សិន អេន អេនជីនារីង ខូអិលធីឌី).

---

## 1. Project Context & Corporate Profile

- **Official Domain**: [https://bce-construction.com/](https://bce-construction.com/) (Also [https://www.bce-construction.com/](https://www.bce-construction.com/))
- **Cloudflare Pages Fallback**: [https://bce-construction.pages.dev/](https://bce-construction.pages.dev/)
- **Company Name (English)**: Battambang Construction and Engineering Co., Ltd. (BCE)
- **Company Name (Khmer)**: ក្រុមហ៊ុន បាត់ដំបង ខនស្ត្រាក់សិន អេន អេនជីនារីង ខូអិលធីឌី
- **Heritage**: Established in 1995 under Hong Huot Ly Co., Ltd. Restructured in 2015 and officially incorporated as BCE in 2020. 30+ years of operational excellence.
- **Leadership**: Ms. Loeung Chan (Chairwoman)
- **Headquarters**: Ang Village, Sangkat O’Char, Battambang City, Battambang Province, Kingdom of Cambodia.
- **Operating Hours**: Monday – Sunday, 6:30 AM – 5:30 PM (24/7 Site Pouring dispatch upon schedule).
- **Hotlines**: `012 932 700` / `017 222 205` / `012 867 475` / `070 867 475`
- **Email**: `bcebtb999@gmail.com`
- **Primary Telegram**: `@thendLP` ([https://t.me/thendLP](https://t.me/thendLP)) — *Always preserve this handle for direct chat/quote buttons.*

---

## 2. Technology Stack & Architecture

- **Framework**: React 19 (`react`, `react-dom`)
- **Build Tooling**: Vite 8 (`vite`, `@vitejs/plugin-react`)
- **Styling**: Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/vite`)
- **TypeScript**: TypeScript 5.7
- **Motion & Scrolling**: Lenis (`lenis`) smooth scrolling, custom split-reveal text animations, fluid cursor physics
- **Bilingual System**: English and Khmer (ខ្មែរ) dictionary in `src/i18n.ts`
- **Typography**: Self-hosted Aeonik font family in `public/fonts/`

---

## 3. Directory Structure

```
BCE/
├── src/
│   ├── main.tsx                 # React entrypoint & routing controller
│   ├── App.tsx                  # Homepage component & section orchestration
│   ├── AboutPage.tsx            # Corporate heritage (founded 1995, Ms. Loeung Chan)
│   ├── AboutValues.tsx          # Interactive core values & principles
│   ├── BusinessesPage.tsx       # 4 Core operating divisions (hub)
│   ├── BusinessDetailPage.tsx   # One detail page per core business (?business=<slug>)
│   ├── businessDetails.ts       # Copy, figures, solutions and photos for the five detail pages
│   ├── CapabilitiesPage.tsx     # Fleet specs (4 plants, 41 mixers, 8 pumps, 7 rigs)
│   ├── QualityPage.tsx          # In-house lab, DYE-2000 compression testing, ACI 211.1
│   ├── ProjectsPage.tsx         # 30-project portfolio database with category filtering
│   ├── ProjectPage.tsx          # Single project detail view & lightbox gallery
│   ├── Coverage.tsx             # Interactive Cambodia SVG map covering 14 provinces
│   ├── cambodiaMap.ts           # Province paths and coordinates
│   ├── QuotePage.tsx            # Concrete volume estimator with Telegram dispatch
│   ├── i18n.ts                  # Bilingual translation dictionary (EN / KH)
│   └── index.css                # Tailwind CSS v4 entrypoint
├── public/
│   ├── fonts/                   # Aeonik webfonts (Regular, Medium, Bold, Mono)
│   ├── Image/ & assets/         # Photography and graphic assets
│   └── favicon.svg              # Official BCE crest monogram
├── .figma/make/site.json        # SEO title, description, and OpenGraph metadata
├── .github/workflows/deploy.yml # Auto CI/CD deploy on push to main
├── vite.config.ts               # Vite configuration
└── package.json                 # Scripts: dev, build, preview, deploy
```

---

## 4. Commands & Workflow

```bash
# Start local development server with hot-reload
npm run dev

# Build production bundle to dist/
npm run build

# Preview production build locally on port 8000
npm run preview

# Deploy manually to Cloudflare Pages
npm run deploy
```

- **One place for every URL**: open `docs/quick-links.html` in a browser (production, www, Pages fallback, staging, admin, local dev, Cloudflare and GitHub dashboards). It is a local helper page and is never deployed.

---

## 5. Deployment & CI/CD

- **Hosting Platform**: Cloudflare Pages (`bce-construction`)
- **Custom Domains**: `bce-construction.com`, `www.bce-construction.com`, `admin.bce-construction.com`
- **Automated CI/CD**: Pushing to the `main` branch on GitHub triggers `.github/workflows/deploy.yml`, which applies D1 migrations, deploys the Worker API, builds the site and publishes Pages.

---

## 6. Admin & Cloudflare Platform

- **Admin console**: https://admin.bce-construction.com/ (Cloudflare Access, one-time PIN).
- **Admin UI**: shadcn/ui components in `src/components/ui`, configured by `components.json`. The admin runs on the **Base (Uber)** design system ported from the Figma Community file `❖ Base Gallery (Community)`: tokens and `base-*` classes live in `src/admin/base.css`, the legacy `.adm-*` chrome is re-skinned in `src/admin/base-overrides.css`, and the extra Base component families (Tag, Banner, Tile, Pagination, Progress, Stepper, FileDrop, …) live in `src/components/base` and are re-exported from `src/admin/ui.tsx`. Everything is scoped to `.bce-admin` so public pages are unaffected. Add shadcn primitives with `npx shadcn@latest add <name>`, then restyle them to Base. Full reference: `docs/BASE-DESIGN-SYSTEM.md`.
- **Worker API**: `wrangler.toml` → `bce-api`, routes `/api/*` on the site hosts and the admin host.
- **D1**: `bce-content` stores `documents`, `leads`, `media`, `settings`, `audit_log`, `rate_limits`, `meta`.
- **KV**: `bce-sessions` caches Access certificates and short-lived values.
- **R2**: `bce-media` stores uploads. Requires a one-time dashboard enable; the binding stays commented until then.
- **Turnstile**: protects the quote form (`src/turnstile.tsx`, `POST /api/leads`).
- **Workers AI**: optional EN↔KM translation in the admin (`POST /api/admin/ai/translate`).
- **Cron**: daily 03:17 UTC housekeeping.
- **Content bridge**: `src/contentStore.ts` fetches `/api/content/bootstrap` after first paint, updates the bundled arrays in place and remounts the page. The static TypeScript content remains the offline fallback.
- **Staging first**: admin saves write `stage_data`/`stage_km` and `staging_version`; `staging.bce-construction.com` reads staged content, production reads published content. Publish from the Dashboard or Promote on a document.
- **Bilingual**: every content editor has English and ខ្មែរ tabs. Khmer lives in the same document as an overlay; empty Khmer fields fall back to English.
- **Seed snapshot**: `npm run content:export` regenerates `seed/content.json`, `seed/seed.sql`, `public/content-seed.json` and `public/sitemap.xml`. Never run `content:seed` on every deploy — it overwrites live rows.
- **Full setup, free-tier limits, security model and troubleshooting**: `docs/CLOUDFLARE.md`.
