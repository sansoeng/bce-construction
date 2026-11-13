# BCE Admin — Base design system

The admin console runs on **Base**, the Uber design system, ported from the Figma
Community file `❖ Base Gallery (Community).fig` (Uber Move type, 158 component
sets, ~7,400 variants, 76 showcase sections).

The public marketing site is untouched: every Base token and component class is
scoped to `.bce-admin`, and the `src/components/ui/*` primitives are only
imported by the admin bundle.

---

## Where things live

| Path | Purpose |
| --- | --- |
| `src/admin/base.css` | Base tokens (palette, semantics, type scale, radii, elevation) + the `base-*` component classes |
| `src/admin/base-overrides.css` | Maps the legacy `.adm-*` chrome (shell, topbar, cards, tables, modals, login) onto Base |
| `src/components/ui/*` | shadcn/Radix primitives restyled to Base specs |
| `src/components/base/*` | New Base component families (Tag, Banner, Tile, Pagination, Progress, …) |
| `src/admin/ui.tsx` | Single import surface for admin screens; re-exports the Base library |

`AdminApp.tsx` loads the layers in order: `admin.css` → `base.css` → `base-overrides.css`.

---

## Tokens

### Palette

Every ramp is 50 → 700, taken verbatim from the kit's colour swatches.

| Ramp | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Gray | `#F6F6F6` | `#EEEEEE` | `#E2E2E2` | `#CBCBCB` | `#AFAFAF` | `#757575` | `#545454` | `#333333` |
| Blue | `#EEF3FE` | `#D4E2FC` | `#A0BFF9` | `#5B91F4` | `#276EF1` | `#1E54B7` | `#174291` | `#102C60` |
| Red | `#FDF0EF` | `#FADBD7` | `#F4AFA7` | `#EB7567` | `#D44333` | `#AE372A` | `#892C21` | `#5C1D16` |
| Orange | `#FEF3EF` | `#FBE2D6` | `#F7BFA5` | `#F19164` | `#ED6E33` | `#B45427` | `#8E421F` | `#5F2C14` |
| Yellow | `#FFFAF0` | `#FFF2D9` | `#FFE3AC` | `#FFCF70` | `#FFC043` | `#BC8B2C` | `#997328` | `#664D1B` |
| Green | `#F0F9F4` | `#DAF0E3` | `#AEDDC2` | `#73C496` | `#3AA76D` | `#368759` | `#2B6B46` | `#1C472F` |
| Purple | `#F4F1FA` | `#E3DDF2` | `#C1B5E3` | `#957FCE` | `#7356BF` | `#574191` | `#453473` | `#2E224C` |
| Brown | `#F7F3F1` | `#EBE0DB` | `#D2BBB0` | `#B18977` | `#99644C` | `#744C3A` | `#5C3C2E` | `#3D281E` |

Semantic aliases: `--base-bg`, `--base-surface` (`#E8E8E8`), `--base-surface-hover`,
`--base-surface-disabled` (`#F3F3F3`), `--base-content` (`#000`),
`--base-content-secondary` (`#545454`), `--base-content-tertiary` (`#757575`),
`--base-content-disabled` (`#A6A6A6`), `--base-border` (`#E2E2E2`),
`--base-accent` (`#276EF1`), `--base-positive` (`#0E8345`),
`--base-warning` (`#FFC043`), `--base-negative` (`#DE1135`),
`--base-focus` (`#276EF1`).

### Type scale

Uber Move is proprietary, so the kit's **sizes, line-heights and weights** are
applied to the self-hosted Aeonik faces (`--font-sans`).

| Role | Size / line | Weight |
| --- | --- | --- |
| Display Large | 96 / 112 | 700 |
| Display Medium | 52 / 64 | 700 |
| Display Small | 44 / 52 | 700 |
| Heading Large | 32 / 40 | 700 |
| Heading Medium | 28 / 36 | 700 |
| Heading Small | 24 / 32 | 700 |
| Label Large / Medium / Small / XSmall | 18/24 · 16/20 · 14/16 · 12/16 | 500 |
| Paragraph Large / Medium / Small / XSmall | 18/28 · 16/24 · 14/20 · 12/20 | 400 |

Utilities: `.base-display-*`, `.base-heading-*`, `.base-label-*`,
`.base-paragraph-*`, `.base-mono`.

### Radii, elevation, layout

- Radii: `--base-radius-xs` 4 · `sm`/`md` 8 · `lg` 12 · `xl` 16 · `pill` 9999.
- Shadows: `--base-shadow-1` `0 1 2` · `-2` `0 4 16` · `-3` `0 16 48`.
- Controls: 36 px (small) · 48 px (medium) · 56 px (large).
- Gutter: 16 px.

---

## Components

### Primitives (`src/components/ui`)

| Base family | Implementation | Notes |
| --- | --- | --- |
| Button | `button.tsx` | Rect / Pill, S/M/L, Primary/Secondary/Tertiary/Negative, icon + loading |
| Tag | `badge.tsx` | Display/Selection × 8 colours × 4 sizes |
| Text field / Text area / Select / Search | `input.tsx`, `textarea.tsx`, `select.tsx`, `.base-search` | `#E8E8E8` fill, 3 px blue focus inset |
| Check / Radio / Switch | `checkbox.tsx`, `radio-group.tsx`, `switch.tsx` | 24 px controls, 48 × 28 switch |
| Tabs | `tabs.tsx` | Boxed + 3 px underline variants |
| Breadcrumbs | `breadcrumb.tsx` | 14/20, chevrons |
| Pagination | `pagination.tsx` + `PaginationBar` | Numbered with overflow |
| Menu | `dropdown-menu.tsx`, `context-menu.tsx`, `command.tsx` | 12 px panel, 44 px rows |
| Banner / Alert | `alert.tsx` | High / Low × 4 styles |
| Dialog / Sheet | `dialog.tsx`, `sheet.tsx`, `alert-dialog.tsx` | 12 px, shadow-3 |
| Tooltip | `tooltip.tsx` | `#282828`, 8 px, 14/16 |
| Snackbar | `sonner.tsx` + `Snackbar` | `#282828`, 12 px, shadow-3 |
| Progress | `progress.tsx` + `ProgressBar/Circle/Steps` | 4/8/12 px bars, rings, step list |
| Avatar | `avatar.tsx` | 24 → 96 px |
| Tile / Card | `card.tsx` + `Tile` | 12 px hairline surface |
| Table | `table.tsx` + `.base-table` | Grey 50 header, 16 px cells |
| Skeleton / Separator / Slider / Scroll area | `skeleton.tsx`, `separator.tsx`, `slider.tsx`, `scroll-area.tsx` | Base greys and 8 px radii |

### Base library (`src/components/base`, re-exported from `src/admin/ui.tsx`)

`Tag`, `NotificationBadge`, `Banner`, `SystemBanner`, `MessageCard`,
`EmptyState`, `Snackbar`, `Spacer`, `Tile`, `ListItem`, `SectionHeading`,
`ProgressBar`, `ProgressCircle`, `ProgressSteps`, `SegmentedControl`,
`StarRating`, `Stepper`, `FileDrop`, `PaginationBar`, `PageControl`,
`PasswordField`, `TimePicker`, `ButtonDock`.

```tsx
import { Banner, EmptyState, PaginationBar, Tag, Tile } from "./ui";

<Tag color="green" size="sm">Published</Tag>
<Banner style="negative" title="Publish failed">Check the worker logs.</Banner>
<Tile title="Concrete mix guide" meta="Updated 12 Nov">…</Tile>
<PaginationBar page={1} pageCount={9} onPageChange={setPage} />
```

---

## Extending

1. Add tokens in `src/admin/base.css` under `.bce-admin` — never hard-code hexes in components.
2. Prefer a `base-*` class or a `src/components/base` component over one-off utility soup.
3. Keep new primitives in `src/components/ui` while they are shadcn/Radix wrappers.
4. Re-export anything screens should use from `src/admin/ui.tsx`.
5. Verify with `npm run typecheck` and `npm run build`; the admin is a lazy chunk so it does not affect public-page CSS.
