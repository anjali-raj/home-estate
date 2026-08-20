# EstateFinder

A real-estate listing search platform — the kind of consumer property portal you'd
find at Property Finder, Zillow, or Rightmove — built to demonstrate production-grade
frontend architecture: server-rendered SEO pages, URL-as-state faceted search, and
per-user persistence.

> **Demo data.** ~220 listings are generated deterministically with Faker and served
> through real Next.js route handlers that filter, sort and paginate server-side — so the
> app behaves like it's talking to a real API (latency, pagination, facets and all).

## Highlights

| Area | What it shows |
| --- | --- |
| **Faceted search** | Keyword, city, purpose, type, price range, beds/baths, furnishing — all **URL-synced** via `nuqs`, so every search is shareable, bookmarkable and back-button-correct. |
| **SEO** | Listing detail pages are **statically generated** (`generateStaticParams`) with per-page `generateMetadata` (title, description, Open Graph). 220 pages pre-rendered at build. |
| **Data layer** | A pure, testable query module (`listings-repo`) behind versioned route handlers. TanStack Query on the client with `keepPreviousData` for flicker-free pagination. |
| **Favourites** | Persisted per signed-in user, with a live count badge and a dedicated page that resolves ids through a batch endpoint. |
| **Saved searches** | Save the active filter set and re-run it later; deduped by query string. |
| **Auth** | Lightweight mock session (localStorage) namespacing per-user data. Structured for a clean swap to NextAuth. |
| **Polish** | Dark mode (system-driven), responsive layout, accessible controls (labels, `aria-current`, focus-visible rings), skeletons, empty and error states. |

## Tech stack

- **Next.js (App Router)** + **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** with CSS-variable design tokens for theming
- **TanStack Query** — client-side fetching/caching
- **nuqs** — type-safe URL search-param state
- **Zod** — a single schema validates both the seed data and the API query params
- **Vitest** — unit tests for the query/format logic

## Architecture decisions

- **URL is the single source of truth for search.** Filters live in the query string, not
  React state, so a search is a shareable link and SSR sees the exact same state the user
  does. `nuqs` keeps this type-safe and strips defaults from the URL.
- **The "API" is real route handlers, not client-side array filtering.** All
  filter/sort/paginate logic lives server-side in `listings-repo` and is exercised over
  HTTP. Swapping the JSON for a database means changing one module — nothing in the UI.
- **One Zod schema, two jobs.** `listingSchema` validates the generated seed data at load
  time (fail loud on bad data) and `searchParamsSchema` coerces + validates incoming query
  params. Types are inferred, never hand-maintained.
- **Detail pages are SSG for SEO + TTFB;** search is a dynamic client experience. Different
  rendering strategies for different needs, on purpose.
- **Facets are computed against the full dataset,** so the filter sidebar counts stay
  stable as you narrow a search.

## Getting started

```bash
pnpm install
pnpm data:generate   # (re)generate src/data/listings.json — deterministic seed
pnpm dev             # http://localhost:3000
```

## Scripts

| Script | Purpose |
| --- | --- |
| `pnpm dev` | Dev server |
| `pnpm build` / `pnpm start` | Production build / serve |
| `pnpm lint` | ESLint (Next core-web-vitals) |
| `pnpm test` | Vitest unit tests |
| `pnpm data:generate` | Regenerate the mock dataset |

## Project structure

```
src/
  app/
    page.tsx                 # search page (hero + <SearchExperience/>)
    listings/[id]/page.tsx   # SSG detail page + generateMetadata
    favourites/              # saved listings
    saved-searches/          # saved filter sets
    api/listings/            # route handlers: list, [id], batch
  components/                # cards, filters, gallery, pagination, header…
  hooks/                     # useListings, useListingFilters, favourites, saved searches
  lib/
    types.ts                 # Zod schemas + shared types
    listings-repo.ts         # pure query layer (filter/sort/paginate/facets)
    format.ts                # currency / area / date formatting
scripts/generate-listings.ts # Faker seed generator
test/                        # Vitest
```

## Possible next steps

- Map + list split view (MapLibre — no billing) synced to the result set
- Real backend (Postgres + Drizzle) behind the same route-handler contract
- NextAuth swap-in for the mock auth
- Playwright E2E for the search → favourite → saved-search flows
