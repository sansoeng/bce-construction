# AGENTS.md — Developer & AI Agent Context Guide

This repository contains the official, high-performance bilingual corporate landing page for **Battambang Construction and Engineering Co., Ltd. (BCE)**.

---

## 1. Project Context & Corporate Profile

- **Company Name (English)**: Battambang Construction and Engineering Co., Ltd. (BCE)
- **Company Name (Khmer)**: ក្រុមហ៊ុន បាត់ដំបង ខនស្ត្រាក់សិន អេន អេនជីនារីង ខូអិលធីឌី
- **Taglines**: 
  - *"Building Excellence. Delivering Confidence."*
  - *"Quality Concrete. Trusted Construction."*
- **Heritage**: Established in 1995 under Hong Huot Ly Co., Ltd. Restructured in 2015 and officially incorporated as BCE in 2020. Over 30 years of operational experience.
- **Leadership**: Ms. Loeung Chan (Chairwoman)
- **Headquarters**: Ang Village, Sangkat O’Char, Battambang City, Battambang Province, Kingdom of Cambodia.
- **Operating Hours**: Monday – Sunday, 6:30 AM – 5:30 PM (24/7 Site Pouring upon schedule).
- **Hotlines**: `012 932 700` / `017 222 205` / `012 867 475` / `070 867 475`
- **Email**: `bcebtb999@gmail.com`
- **Primary Telegram**: `@thendLP` ([https://t.me/thendLP](https://t.me/thendLP)) — *Always preserve this handle for direct chat/quote buttons.*
- **Audience**: Private developers, government ministries (MOWRAM, MPWT, MOI, MRD, MLMUPC), industrial contractors, and residential builders across Cambodia.

---

## 2. Key Production & Fleet Capacity

| Asset / Metric | Quantity & Specification |
|---|---|
| **Batching Plants** | 4 computerized automated units • 70 m³/hr per plant capacity |
| **Mixer Trucks** | 41 heavy units • 7 to 10 m³ capacity • GPS real-time tracking |
| **Pump Trucks** | 8 heavy-duty units with extended boom reaches |
| **Piling Drivers** | 7 heavy hydraulic piling rigs for deep foundations |
| **Cranes & Lifts** | 6 telescopic crane trucks • 8 tower cranes • 5 construction hoists |
| **Quality Laboratory** | In-house certified lab with DYE-2000 compressive testing machine |
| **Operational Reach** | 14 provinces (13 provinces + Phnom Penh Capital) |
| **Completed Projects** | 128+ major projects delivered |
| **Client Base** | 1,564 clients served |

---

## 3. Technology Stack & Design System

- **Frontend**: Standalone HTML5, Tailwind CSS (via CDN), Lucide Icons (via CDN), and Vanilla JavaScript. Zero build-step dependencies required to run or edit.
- **Color Palette**:
  - `bce-blue`: `#0C3260` (Primary Industrial Blue)
  - `bce-navy`: `#071D3A` (Deep Navy)
  - `bce-navyDark`: `#041022` (Background Header/Footer)
  - `bce-gold`: `#E5A823` (Brand Accent Yellow / Safety Gold)
  - `bce-slate`: `#1E293B` (Text and Card Slate)
- **Typography**:
  - English: `Inter` (Google Fonts)
  - Khmer: `Kantumruy Pro` (Google Fonts)
  - HTML attribute `data-lang="en"` or `data-lang="kh"` switches typography line-height and font weighting smoothly.

---

## 4. File Map & Directory Structure

```
BCE_project/
├── index.html                   # Master single-page template with all sections and data-i18n hooks
├── assets/
│   ├── css/
│   │   └── styles.css           # Blueprint grids, glassmorphism, pulse animations, scrollbars
│   ├── js/
│   │   └── main.js              # Bilingual translation dictionaries, 30-project database, calculator
│   └── images/
│       ├── bce_emblem.png       # Official BCE circular crest
│       ├── bce_logo_full.png    # Full official brand logo
│       ├── hero_batching_plant.jpg
│       ├── chairwoman.jpg
│       ├── machinery_fleet.jpg
│       ├── cambodia_coverage.jpg
│       ├── laboratory_qa.jpg
│       ├── hse_safety.jpg
│       └── project_page_14.jpg ... project_page_35.jpg (30 project photo plates)
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions CI/CD to Cloudflare Pages
├── .gitignore                   # Excludes large PDF & temp screenshots from git
├── .pagesignore                 # Prevents Cloudflare Pages 25MB file upload rejection
├── AGENTS.md                    # This developer & AI guide
└── Company_Profile_2026.pdf     # 55-page source PDF document
```

---

## 5. How Key Features Work

### A. Bilingual Toggle System
- Elements requiring translation have attribute `data-i18n="key_name"`.
- Dictionary resides in `assets/js/main.js` under `translations.en` and `translations.kh`.
- `setLanguage('en')` or `setLanguage('kh')` updates textContent dynamically and re-renders project cards without page reload.
- Always add keys to **both** `en` and `kh` dictionaries when creating new elements.

### B. Project Portfolio & Modal System
- All 30 projects from the PDF are structured in `projectsData` in `assets/js/main.js`.
- Categories supported: `all`, `buildings`, `infrastructure`, `industrial`, `piling`.
- Calling `renderProjects(category)` filters and redraws the cards.
- Clicking any project triggers `openProjectModal(id)` which displays client name, location, timeline, and scope, with a direct inquiry button prefilled for Telegram `@thendLP`.

### C. Ready-Mix Concrete Volume Calculator
- Function `calculateConcrete()` in `assets/js/main.js`.
- Formulas:
  - Net Volume = `Length × Width × Thickness` (or Height)
  - Recommended Order = `Net Volume × 1.05` (+5% safety buffer for pumping residue and uneven subgrades).
- Generates a prefilled Telegram message link directly to `@thendLP` with the structure dimensions and target concrete grade (15–45 MPa, ACI 211.1).

---

## 6. Deployment & Hosting (Cloudflare Pages)

- **Production URL**: [https://bce-construction.pages.dev/](https://bce-construction.pages.dev/)
- **Hosting Platform**: Cloudflare Pages
- **Project Name**: `bce-construction`
- **Cloudflare Account ID**: `3b3ba25f928fb3ff9013a1ca6781699a`
- **Account Email**: `sansoeng16@gmail.com`

### Manual Deployment via CLI
```bash
# Ensure PATH has node and wrangler
export PATH="$HOME/.local/bin:$HOME/.local/node-v20.18.0-darwin-arm64/bin:$PATH"

# Deploy to Cloudflare Pages
npx wrangler pages deploy . --project-name bce-construction --commit-dirty=true
```

### Automated CI/CD via GitHub Actions
`.github/workflows/deploy.yml` will automatically deploy whenever code is pushed to `main`.
Requirements in GitHub Repo Settings (`Settings > Secrets and variables > Actions`):
- `CLOUDFLARE_API_TOKEN`: User's Cloudflare API token with `Pages:Edit` permission.
- `CLOUDFLARE_ACCOUNT_ID`: `3b3ba25f928fb3ff9013a1ca6781699a`.

---

## 7. Git & GitHub Configuration

- **Remote URL**: `git@github.com:sansoeng/bce-construction.git`
- **Default Branch**: `main`
- **Active SSH Key**: `~/.ssh/id_ed25519` (Authorized for GitHub user `sansoeng`)

### Pushing Changes
```bash
git add .
git commit -m "Update feature or content"
git push -u origin main
```

---

## 8. Rules & Critical Constraints for Future Agents

1. **Do NOT upload raw `Company_Profile_2026.pdf` to Cloudflare Pages**: Cloudflare Pages has a strict **25 MiB single-file limit**. The PDF is 30.2 MiB. It is ignored via `.pagesignore` and `.gitignore`.
2. **Preserve Telegram Routing**: All quote buttons and quick action links must point to `@thendLP` (`https://t.me/thendLP`).
3. **Bilingual Consistency**: Whenever adding UI elements or sections, provide corresponding Khmer text in `translations.kh`.
4. **Image Assets**: Keep image assets lightweight in `assets/images/`. High-res cropped plates from the PDF are already optimized for fast Web CDN delivery.
