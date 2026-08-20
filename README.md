# Home Estate

A production-grade **real-estate listing search platform** for the Indian market — **buy
and rent** — in the spirit of MagicBricks, 99acres or Housing.com. It demonstrates modern
frontend architecture end to end: server-rendered SEO pages, URL-as-state faceted search,
Redux + Context state management, a swipeable image carousel, per-user favourites and saved
searches, full light/dark theming, accessibility, and a comprehensive Jest + RTL test suite.

> **Demo data.** ~220 listings across **Mumbai, Bengaluru, Delhi, Pune and Gurugram** are
> generated deterministically with Faker (INR pricing, BHK layouts, local amenities, real
> Unsplash photography) and served through real Next.js route handlers that filter, sort and
> paginate **server-side** — so the app behaves like it's talking to a real API (latency,
> pagination, facets and all). The data layer is a single module, so swapping the JSON for a
> real backend later touches nothing in the UI (see [Roadmap: backend](#roadmap-backend)).

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Available scripts](#available-scripts)
- [Project structure](#project-structure)
- [How it works](#how-it-works)
- [State management](#state-management)
- [Data & the mock API](#data--the-mock-api)
- [Testing](#testing)
- [SEO](#seo)
- [Accessibility](#accessibility)
- [Theming](#theming)
- [Deployment](#deployment)
- [Roadmap: backend](#roadmap-backend)

---

## Features

| Area | What it does |
| --- | --- |
| **Buy & rent** | Prominent **Buy / Rent / All** tabs plus a purpose filter, both driven by the same URL state. |
| **Faceted search** | Keyword, city, purpose, property type, price range, min beds/baths, furnishing — all **URL-synced**, so every search is shareable, bookmarkable and back-button-correct. |
| **Server-side query** | Filtering, sorting (newest / price / beds / area) and pagination all happen in a route handler, with stable facet counts. |
| **Card image carousel** | Every homepage card is a swipeable, scroll-snap image carousel (touch-swipe on mobile; hover arrows + dot indicators on desktop). Controls live outside the card link so they stay valid and accessible. |
| **Listing detail pages** | Statically generated per listing, with an image gallery, full specs, agent contact, breadcrumb, and structured data. |
| **Favourites** | Save any property. Redux-backed, persisted per signed-in user, with a live count badge and a dedicated page. |
| **Saved searches** | Save the active filter set and re-run it later; deduped by query string. |
| **Auth (mock)** | Lightweight localStorage session (Context API) that namespaces each user's favourites & saved searches. Structured for a clean swap to NextAuth. |
| **Theming** | Light / dark / system toggle (Context API), persisted, with a token-based palette that keeps contrast in both modes. |
| **Real photography** | Curated, load-verified Unsplash photos — interiors for flats, facades for houses, mixed galleries — assigned deterministically by property type. |
| **Responsive** | Mobile-first: header nav reflows to its own scrollable row, filters collapse behind a "Show filters" toggle below `lg` and become a sticky sidebar above it, card grid steps 1 → 2 → 3 columns. |
| **SEO** | Per-page metadata, `sitemap.xml`, `robots.txt`, canonical URLs and schema.org JSON-LD. |
| **Accessibility** | Skip link, semantic landmarks, ARIA roles/states, focus-visible rings, `prefers-reduced-motion`. |
| **Tested** | 35 tests across 7 suites — reducers, query/format logic, and component tests (Jest + React Testing Library). |

---

## Tech stack

| Concern | Choice |
| --- | --- |
| Framework | **Next.js 16** (App Router) + **React 19** |
| Language | **TypeScript** (strict) |
| Styling | **Tailwind CSS v4** with CSS-variable design tokens |
| Shared client state | **Redux Toolkit** + **react-redux** (favourites, saved searches) |
| Cross-cutting state | **React Context API** (auth session, theme) |
| Server-state / fetching | **TanStack Query** (`keepPreviousData` for flicker-free paging) |
| URL state | **nuqs** (type-safe search params) |
| Validation | **Zod** (one schema validates seed data *and* API query params) |
| Mock data | **Faker** (deterministic seed) |
| Testing | **Jest** + **React Testing Library** + user-event |
| Tooling | ESLint (`next/core-web-vitals`), pnpm |

---

## Getting started

**Prerequisites:** Node.js ≥ 20 and [pnpm](https://pnpm.io) (`npm i -g pnpm`).

```bash
# 1. Install dependencies
pnpm install

# 2. (Optional) regenerate the mock dataset — a committed copy already exists
pnpm data:generate

# 3. Start the dev server
pnpm dev
```

Open **http://localhost:3000**.

To build and run a production server:

```bash
pnpm build
pnpm start
```

---

## Available scripts

| Script | What it does |
| --- | --- |
| `pnpm dev` | Start the Next.js dev server (hot reload) |
| `pnpm build` | Production build (also type-checks and pre-renders all pages) |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint (`--max-warnings=0` in CI spirit) |
| `pnpm test` | Run the Jest + RTL suite once |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:cov` | Run tests with a coverage report |
| `pnpm data:generate` | Regenerate `src/data/listings.json` from the Faker seed |

---

## Project structure

```
home-estate/
├─ scripts/
│  └─ generate-listings.ts     # Faker seed generator (Indian market data)
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx            # root layout, metadata, providers, skip link
│  │  ├─ page.tsx              # homepage: hero + Buy/Rent tabs + search
│  │  ├─ providers.tsx         # Redux + Query + nuqs + Theme + Auth providers
│  │  ├─ globals.css           # design tokens, dark mode, a11y helpers
│  │  ├─ robots.ts             # robots.txt
│  │  ├─ sitemap.ts            # sitemap.xml (all listings + static pages)
│  │  ├─ favourites/page.tsx   # saved properties
│  │  ├─ saved-searches/page.tsx
│  │  ├─ listings/[id]/page.tsx# SSG detail page + generateMetadata + JSON-LD
│  │  └─ api/listings/         # route handlers: list · [id] · batch
│  ├─ components/              # header, cards, carousel, filters, gallery, tabs…
│  ├─ hooks/                   # useListings, useListingFilters, favourites, saved
│  ├─ store/                   # Redux Toolkit: slices, typed hooks, persistence
│  ├─ lib/
│  │  ├─ types.ts              # Zod schemas + shared types (INR, BHK, cities)
│  │  ├─ listings-repo.ts      # pure query layer (filter/sort/paginate/facets)
│  │  ├─ format.ts             # INR currency / area / date formatting
│  │  ├─ auth-context.tsx      # Context API — mock auth session
│  │  ├─ theme-context.tsx     # Context API — light/dark/system theme
│  │  └─ site.ts               # canonical site URL + name
│  └─ data/listings.json       # generated dataset (~220 listings)
└─ test/                        # Jest + RTL (utils, fixtures, unit + component)
```

---

## How it works

- **URL is the single source of truth for search.** Filters live in the query string (via
  `nuqs`), not React state, so a search is a shareable link and the server sees exactly the
  state the user does. `nuqs` keeps it type-safe and strips defaults from the URL.
- **The "API" is real route handlers**, not client-side array filtering. All
  filter/sort/paginate logic lives in `src/lib/listings-repo.ts` and is exercised over HTTP
  (`/api/listings`). This is why swapping in a real database later is a one-module change.
- **Detail pages are statically generated** (`generateStaticParams`) for SEO and TTFB;
  search is a dynamic client experience. Different rendering strategies for different needs.
- **One Zod schema, two jobs**: it validates the generated seed data at load time (fail loud
  on bad data) and coerces/validates incoming API query params.

## State management

Two tools, each where it fits:

- **Redux Toolkit** for shared, mutated-from-many-places data — **favourites** and **saved
  searches**. Pure, unit-testable reducers; Redux DevTools friendly.
- **React Context** for read-mostly ambient state — **auth session** and **theme**.
- A single `ReduxPersistence` bridge (`src/store/persistence.tsx`) syncs the Redux state to
  `localStorage`, **namespaced by the Context-provided user id**, so each signed-in user gets
  their own favourites and saved searches, and switching users re-hydrates cleanly.

## Data & the mock API

- `pnpm data:generate` runs `scripts/generate-listings.ts` with a **fixed Faker seed**, so
  the committed `src/data/listings.json` only changes when intended.
- Each listing has INR pricing (sale ≈ area × local ₹/sqft; rent ≈ 3% annual yield / 12),
  BHK layouts, Indian cities/localities, amenities, an agent, and a set of type-appropriate
  photos.
- Route handlers:
  - `GET /api/listings` — filter/sort/paginate + facets (validated with Zod)
  - `GET /api/listings/[id]` — a single listing
  - `GET /api/listings/batch?ids=…` — resolve favourite ids to listings

## Testing

```bash
pnpm test        # run once
pnpm test:cov    # with coverage
```

- **Reducer tests** — favourites & saved-searches slices (hydrate, toggle, de-dupe, remove).
- **Logic tests** — the query layer (filtering, sorting, pagination, stable facets) and INR
  formatters.
- **Component tests (RTL)** — favourite button (toggles Redux state), listing card (renders
  price/specs/link), pagination (windowing, disabled states, emitted page), purpose tabs
  (Buy/Rent selection & URL updates).
- Config: `next/jest` (SWC transform) with a jsdom environment; `server-only` is stubbed and
  a shared `renderWithProviders` wraps components in the real Redux + Context providers.

## SEO

Built in, not bolted on:

- **Server-rendered, crawlable** detail pages (one real URL per property).
- Per-page `generateMetadata`: unique title/description, **canonical**, Open Graph + Twitter.
- **`sitemap.xml`** (`app/sitemap.ts`) listing all listings + static pages, and **`robots.txt`**
  (`app/robots.ts`) that references the sitemap and disallows `/api/`.
- **schema.org JSON-LD** (`Offer` wrapping `House`/`Apartment` with price, beds, baths, floor
  size and address) on every listing.
- Semantic HTML + fast Core Web Vitals from SSG and `next/image`.

## Accessibility

- Skip-to-content link; semantic landmarks (`header`/`main`/`footer`, labelled `nav`).
- ARIA where it matters: `tablist`/`tab`/`aria-selected` (purpose tabs), `radiogroup` (theme),
  `aria-pressed` (favourite), `aria-current` (nav/pagination), `aria-expanded` (mobile filters).
- Visible `:focus-visible` rings; `prefers-reduced-motion` disables animations/transitions.
- Labelled form controls; alt text on all images; carousel controls are real buttons.

## Theming

Light / dark / system, toggled from the header (Context API) and persisted. Colors are CSS
variables defined once as tokens; dark values are applied both via the
`prefers-color-scheme` media query (system) and a `data-theme` attribute (explicit choice),
so the toggle always wins and there's no theme mismatch.

## Deployment

Deploys cleanly to **Vercel** (zero config for Next.js). The remote image host
(`images.unsplash.com`) is already whitelisted in `next.config.ts`. `pnpm build` output is a
mix of static (SSG) and dynamic (route handlers) — no server state required.

## Roadmap: backend

The app is intentionally structured so a real backend can be added without touching the UI:

- **Single data seam.** All reads go through `src/lib/listings-repo.ts` and the
  `/api/listings*` route handlers. Point the repo at a database (e.g. **PostgreSQL +
  Prisma/Drizzle**) or an external service and the components, hooks and pages stay the same.
- **Planned layout.** This repo already carries a `pnpm-workspace.yaml`, so it can grow into
  a workspace monorepo, e.g.:
  ```
  home-estate/
  ├─ apps/web/        # this Next.js app
  └─ apps/api/        # future backend (REST/GraphQL) + DB schema & migrations
  ```
- **Auth.** The mock `AuthProvider` is isolated behind a small interface — swap it for
  **NextAuth** / a real session service without changing consumers.
- **Persistence.** Favourites & saved searches currently persist to `localStorage` via the
  Redux bridge; these become API-backed per-user resources once the backend exists.
- Other candidates: real listing ingestion, image uploads/CDN, search infra (Postgres FTS or
  a search service), and Playwright E2E for the search → favourite → saved-search flows.

---

*Demo project. Listings, prices and agents are synthetic; photos are from Unsplash.*
