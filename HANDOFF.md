# Handoff

Hackathon short. Expand when building for real.

## Product behavior

- Ingest: accept save links (or fixtures) from Instagram/TikTok-style sources.
- Organize: group by **location** (primary).
- Surfaces: **directory of places** → **location page** (digest).
- Location page (text-light): location hero image; map pins = venue-specific saves only (1 reel = 1 pin/card); Eat/See/Do/Stay lenses; spot cards; separate **Tips shelf** for generic place advice (no pin); day strip; **Plan day** builds a proximity + type itinerary (timeline + route on map); unsorted tray with Sort → Spot or Tip. Details in `empathize-with-user/JOURNEY.md`.
- Allow open original source when useful.

## Prototype routes (`web/`)

- `/` Cinema Map directory (working).
- `/place/:cityId` location digest (working).
- `/review` overall concept comparisons.
- `/review/motion` Cinema Map motion recipe mocks (Round 2: photo stack, story carousel, fan stack, flying posters, coverflow, card swap).

## Viewports

- Mobile-first; desktop optional.

## States to ship in demo

- Empty: no saves yet → prompt to add first links.
- Loading: "Building your digest…"
- Partial: some items unsorted / missing place.
- Error: bad link / extract failed.
- Happy: place digest with scannable sections.

## Edges

- No place detected
- Duplicates
- Non-travel save mixed in (soft filter or user tag)
