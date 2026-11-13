# BCE Cloudflare Platform

The site now has a small, free-tier content platform on Cloudflare:

- **Cloudflare Pages** serves the React/Vite site.
- **Cloudflare Worker `bce-api`** serves `/api/*` (public content + admin API).
- **Cloudflare D1 `bce-content`** stores content, leads, media metadata, settings and audit rows.
- **Cloudflare KV `bce-sessions`** caches Access certificates and short-lived values.
- **Cloudflare R2 `bce-media`** stores uploads (one dashboard step still needed).
- **Cloudflare Access** protects `admin.bce-construction.com` and `/api/admin/*`.
- **Cloudflare Turnstile** protects the public quote form.
- **Cloudflare Web Analytics** is already auto-installed on the `bce-construction.com` zone.
- **Cloudflare Workers AI** provides optional EN↔KM translation in the admin.
- **Cron Trigger** runs daily housekeeping at 03:17 UTC.

## BCE Operations console

Open **https://admin.bce-construction.com/**. The console uses the public site's Aeonik/mono design system: black navigation, warm off-white canvas, hairline rules and pill actions.

### Admin component library

The admin is built on **shadcn/ui**. Components live in `src/components/ui`, configured by `components.json`, with the palette mapped to the BCE tokens under `.bce-admin` in `src/admin/admin.css`. Add another component with:

```bash
npx shadcn@latest add <component>
```

The current console uses Button, Card, Input, Textarea, Label, Select, Switch, Checkbox, RadioGroup, Badge, Table, Tabs, ToggleGroup, Dialog, AlertDialog, DropdownMenu, Sheet, Breadcrumb, Command, Popover, Tooltip, Avatar, Skeleton, Progress, Separator, Collapsible, HoverCard, ContextMenu, Pagination, ScrollArea, Sonner and Chart.

1. Cloudflare Access asks for an email address.
2. Enter an address on the allowlist (`sansoeng16@gmail.com` by default).
3. Cloudflare emails a one-time code. Sessions last 24 hours.
4. The console opens on the Dashboard.

The admin is also available at `https://bce-construction.com/?admin`, but the API deliberately returns 404 there in production; use the dedicated hostname.

### Add another admin

Two places must agree:

1. **Access policy:** Cloudflare dashboard → Zero Trust → Access → Applications → **BCE Admin Console** → Policies → **BCE Admins** → add the email.
2. **Worker allowlist:** edit `ADMIN_EMAILS` in `wrangler.toml`, then `npx wrangler deploy`.

The Access application **BCE Admin API** (`bce-construction.com/api/admin`) has the same policy for defence in depth.

### What the admin manages

| Section | Contents |
| --- | --- |
| Projects | Portfolio records, galleries, figures, equipment, technical details |
| Journal | Article copy, sections, takeaways, author |
| Careers | Vacancies and requirements |
| Resources | Downloadable documents |
| Business pages | The five business detail pages |
| Home services | The five service cards used across the site |
| Custom pages | Optional JSON-backed landing pages |
| Leads | Quote requests with status, internal notes, CSV export |
| Media | Uploads, alt text, copy URL, delete |
| Settings | Company details, hotline numbers, SEO defaults, feature flags |
| Audit | Every admin write with the Access identity |

### Staging-first workflow

Admin saves never touch production directly.

- Every content save writes a staged copy (`stage_data`, `stage_km`) and bumps `staging_version`.
- **staging.bce-construction.com** reads the staged copy.
- **bce-construction.com** keeps the published copy until you publish.
- **Publish** on the Dashboard pushes every staged change to production; **Promote** on a document pushes just that one.
- Deletions, ordering and Settings follow the same rule: staged first, then published.
- Publishing copies the staged data to the live columns, clears the stage fields and bumps `content_version`.

Contact details and SEO defaults saved in Settings are applied to the public site at runtime (hotlines, address, email, Telegram, meta description).

### English & Khmer content

The content editor has **English** and **ខ្មែរ** tabs. The Khmer tab mirrors the text fields (images, slugs, enums and numbers are shared), so both languages live in the same document. Empty Khmer fields fall back to English at render time. The public site merges the Khmer overlay when the language is Khmer; the static UI dictionary in `src/i18n.ts` still handles navigation and interface copy.

## Provisioned resources

| Resource | Name / ID |
| --- | --- |
| Pages project | `bce-construction` |
| Worker | `bce-api` (`https://bce-api.sansoeng16.workers.dev`) |
| D1 database | `bce-content` · `22b54a9a-08cd-4e52-af8d-46845713e806` |
| KV namespace | `bce-sessions` · `55940bab43aa4c45a489a75fed1e10bc` |
| R2 bucket | `bce-media` (create after enabling R2) |
| Access team domain | `bce-construction.cloudflareaccess.com` |
| Access app (admin console) | `admin.bce-construction.com` · AUD `b1102189ed791313011c4460d8ce7aac4f6cbaad079d8377fd67e060e6954b5d` |
| Access app (admin API) | `bce-construction.com/api/admin` · AUD `4f245234c75053e39dd12ef6ea6a7e20571ff5daef900e3696dda736191e8aeb` |
| Turnstile widget | `bce-website` · public site key `0x4AAAAAAF-VzpfgSQaEPDl7` |
| Web Analytics | Auto-installed on the `bce-construction.com` zone |

Worker routes:

- `bce-construction.com/api/*`
- `www.bce-construction.com/api/*`
- `staging.bce-construction.com/api/*`
- `admin.bce-construction.com/api/*`

## Free-tier design

| Service | Free allowance | How BCE stays inside it |
| --- | --- | --- |
| Workers | 100,000 requests/day, 10 ms CPU | Small JSON responses; D1/R2 I/O does not count as CPU |
| D1 | 500 MB/database, 5 GB/account, 100k rows written/day | One compact `documents` table; batched writes |
| KV | 100k reads/day, 1,000 writes/day, 1 GB | Only Access certificate cache and short-lived values |
| R2 | 10 GB storage, 1M Class A + 10M Class B/month | Browser resizes and converts images to WebP before upload |
| Pages | Unlimited requests/bandwidth; 500 builds/month | One build per push |
| Access | 50 users | Small allowlist |
| Turnstile | Free | Quote form only |
| Workers AI | Free daily neuron allowance | Short translation snippets only |
| Cron | 5 triggers/account | One daily housekeeping trigger |
| Web Analytics | Free | Automatic |

### Work offloaded to the browser

- Image resize and WebP conversion before upload (`src/admin/mediaUtils.ts`).
- Lead CSV export.
- Validation and parsing of bundled-content imports.
- JSON formatting and validation in the editor.
- Search/filter state in the admin.

The Worker only receives the final compact file or JSON and performs authentication, validation, D1 writes, R2 writes and cache invalidation.

## Enable R2 (one dashboard step)

R2 must be enabled once per account in the dashboard. The API cannot do it.

1. Cloudflare dashboard → **Storage & databases → R2** → **Enable R2**. Accept the terms (the free tier does not require a payment method for 10 GB, but the dashboard may ask to add billing details).
2. Create a bucket named **`bce-media`**.
3. Uncomment the R2 block in `wrangler.toml`:

   ```toml
   [[r2_buckets]]
   binding = "MEDIA"
   bucket_name = "bce-media"
   ```

4. Deploy: `npx wrangler deploy`.
5. Reload **Admin → Media**. Uploads now work.

Until then, the whole admin works and Media shows a clear “R2 is not enabled” banner. Media endpoints return HTTP 503.

## Email notifications (optional)

Cloudflare Email Routing is free and can create `admin@bce-construction.com`.

1. Dashboard → the `bce-construction.com` zone → **Email → Email Routing**.
2. Add a destination address and verify it.
3. Create a custom address such as `admin@bce-construction.com` forwarding to the destination.

Sending email from the Worker needs an `send_email` binding and a verified destination. It is intentionally not enabled by default; the built-in Telegram path is simpler:

## Telegram notifications (optional)

1. Create a bot with @BotFather and copy the token.
2. Send a message to the bot, then read `https://api.telegram.org/bot<token>/getUpdates` to find the chat ID.
3. Store both as Worker secrets:

   ```bash
   npx wrangler secret put TELEGRAM_BOT_TOKEN
   npx wrangler secret put TELEGRAM_CHAT_ID
   ```

New leads then send a short Telegram message via `ctx.waitUntil`, after the HTTP response.

## Local development

```bash
# Terminal 1 — Worker API on http://localhost:8787
npm run db:migrate:local
npm run content:seed:local
npm run worker:dev

# Terminal 2 — site on http://localhost:8443
npm run dev
```

Open `http://localhost:8443/?admin`. Local development uses `DEV_ADMIN_EMAIL` from `.dev.vars` and bypasses Access. Never set `DEV_ADMIN_EMAIL` in production.

Regenerate the bundled seed and sitemap after changing the TypeScript content:

```bash
npm run content:export
```

This writes `seed/content.json`, `seed/seed.sql`, `public/content-seed.json` and `public/sitemap.xml`.

## Deployment

Push to `main` (or run the workflow manually). `.github/workflows/deploy.yml`:

1. installs dependencies,
2. applies D1 migrations,
3. deploys the Worker,
4. exports the content snapshot,
5. builds the site,
6. deploys Pages.

Manual deploy:

```bash
npm run db:migrate
npx wrangler deploy
npm run content:export
npm run build
npx wrangler pages deploy dist --project-name bce-construction --branch=main --commit-dirty=true
```

**Do not run `content:seed` on every deploy.** It overwrites live rows. The Dashboard's **Stage bundled content** button is the intentional reset path and stays on staging until you publish.

To deploy the staging branch explicitly:

```bash
npm run deploy:staging
```

## Security model

- `admin.bce-construction.com` is fully behind Cloudflare Access.
- The Worker verifies the `Cf-Access-Jwt-Assertion` signature against the Access JWKS, checks `iss`, `aud` and expiry, then checks the email against `ADMIN_EMAILS`.
- The admin API returns 404 on public hostnames in production.
- Quote submissions require a Turnstile token, use a honeypot field and are rate-limited per hashed IP (8/hour) in D1.
- Raw IPs are never stored; only a truncated SHA-256 hash.
- Uploads are restricted to JPEG, PNG, WebP, AVIF, GIF and PDF, max 25 MB, with random keys.
- All admin writes are audited for 180 days.
- `.env` contains a **Global API Key** with full account access. Create a scoped API token for CI and rotate/remove the global key. Never commit `.env` or `.dev.vars`.

## API quick reference

Public:

- `GET /api/health`
- `GET /api/content/bootstrap`
- `GET /api/content/:type`
- `GET /api/content/:type/:slug`
- `GET /api/settings`
- `GET /api/media/:key`
- `POST /api/leads`

Admin (Access required):

- `GET /api/admin/me`
- `GET /api/admin/overview`
- `GET|POST /api/admin/content/:type`
- `GET|PATCH|PUT|DELETE /api/admin/content/:type/:slug`
- `POST /api/admin/content/:type/:slug/duplicate`
- `POST /api/admin/content/:type/:slug/promote`
- `POST /api/admin/publish-staging`
- `POST /api/admin/content/reorder`
- `GET /api/admin/leads`, `GET|PATCH|DELETE /api/admin/leads/:id`
- `GET|POST /api/admin/media`, `PATCH|DELETE /api/admin/media/:key`
- `GET|PUT /api/admin/settings`
- `GET /api/admin/audit`
- `POST /api/admin/import`
- `POST /api/admin/revalidate`
- `POST /api/admin/ai/translate`

## Services intentionally not used

These are not on the free plan, so the platform avoids them: Cloudflare Images, Stream, Queues, Vectorize, Workers Paid CPU limits, Logpush, and paid D1/R2 overages. Image resizing is done in the browser and files live in R2 instead; long-running work is chunked in the browser instead of a Queue.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Admin redirects to Access forever | Confirm the email is in both the Access policy and `ADMIN_EMAILS`; redeploy after editing. |
| `401` from `/api/admin/me` on the admin host | The Access app must cover `admin.bce-construction.com`; check Zero Trust → Access → Applications. |
| `invalid_audience` after recreating Access apps | Copy the new app AUD tags into `ACCESS_AUD` in `wrangler.toml` and redeploy. |
| Media upload returns 503 | Enable R2 and add the binding, then redeploy. |
| Public site shows old content | Check **Publish** on the Dashboard, then **Clear cache**; the bootstrap cache also expires in 60 seconds. |
| Staging host redirects to `staging.bce-construction.pages.dev` | Remove the legacy Page Rule for `staging.bce-construction.com/*` in the zone. |
| Quote form says “security check failed” | Check the Turnstile site key/secret and that the hostname is listed on the widget. |
| Worker deploy fails on R2 | The bucket does not exist yet; keep the binding commented out until R2 is enabled. |
| `wrangler pages deploy` goes to staging | Pass `--branch=main` explicitly. |
