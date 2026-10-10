# Journey (hackathon short)

Person: Maya (see USERS.md). Full lifecycle HTML skipped for hackathon.

## Happy path (FS01)

1. Opens Travel Daddy (or lands on demo) with a trip in mind, e.g. Lisbon.
2. Adds saves: paste links and/or upload/share mock clips (real API may be mocked).
3. Confirms or corrects place tags if needed.
4. Opens the **place digest** for Lisbon: sections easy to scan (e.g. Eat, See, Stay/tips) pulled from her saves.
5. Acts: picks 2–3 things for a day, optionally opens original clip or maps link.
6. Done when she can plan without reopening Instagram/TikTok saves.

## Out of scope (FS02)

- Full Instagram/TikTok OAuth if platforms block hackathon access (mock ingest OK)
- Booking, payments, flights, hotels checkout
- Social feed, follows, creator profiles
- Multi-traveler collaboration
- Offline mode perfection
- Full Product Strategy / roadmap ceremony

## Viewports (FS06)

- Mobile-first (primary): phone digest + add saves
- Desktop nice-to-have for reading the digest; not required for demo win

## Constraints (FS09)

- Hackathon timebox
- Unknown/restricted social APIs → prefer paste-link or fixture data
- Extraction from video is hard → use captions, titles, on-screen text, or manual tags for demo

## Unhappy paths (FS11) — top 3

1. **Save has no clear place** → ask user to pick a place or park in "Unsorted."
2. **Duplicate / same tip twice** → merge or show once with multi-source.
3. **Ingest fails / bad link** → clear error + retry; keep digest of what already worked.

## Crucial flow (one)

Save → place → digest → pick what to do. Attachment moment: first time the digest feels smarter than the save pile.

## Location page (text-light IA)

Goal: interactive and scannable. Almost no paragraphs. Media and taps do the talking.

### Save types (critical)
| Type | What it is | Where it lives |
|------|------------|----------------|
| **Pinned spot** | Reel about a specific venue / pin-able place (cafe, beach, museum) | **One pin + one card** on the map; in Eat/See/Do/Stay lenses |
| **Place tip** | Generic advice about the city/area (transit, scams, best month, packing) | **Tips shelf** only. **No map pin.** |
| **Unsorted** | Location known as this place, but not yet Spot vs Tip (or missing venue) | **Unsorted tray** with explicit **Sort** action → Spot (pick pin) or Tip |

Rule: each saved reel is either one map pin/card **or** one Tips-shelf card. Never both. Never a vague pin in the city center for generic tips.

### Always on the page
1. **Place hero** — place name + **strong location image** (city/landmark photo, not a mosaic of their saves). Tiny meta: pin count · tip count.
2. **Map playground** — pins = pinned spots only. Tap pin ↔ focus matching spot card. Main “orient me” control.
3. **Lens chips** — Eat · See · Do · Stay (only if they have pins). Filters map + spot deck together.
4. **Spot cards** — still from that reel + **max 1 short line** + source badge. Drag onto day strip.
5. **Tips shelf** — separate section below or as a side tab: generic place tips as compact cards (same card chrome, **no pin icon**). Can drag useful tips onto day strip too (e.g. “buy metro card”).
6. **Day strip** — Morning / Afternoon / Evening. Drag only. No writing an itinerary.
7. **Unsorted tray** — count + open. Each item: preview + **Sort**: “Pin on map” (pick/adjust location + lens) or “Add to Tips.”

### Card actions (keep ≤4)
- Add to day (or drag)
- Open original Reel/Short
- **Open in Maps** (spots only): jump to Apple/Google Maps for that venue’s address/pin. Tips have no venue, so no Maps button on tip cards.
- Hide for this trip

### Interaction that earns interest
- Pin ↔ card sync
- Cluster pins when dense; expand on zoom/tap
- Soft snap when a card lands on the day strip
- Optional: same venue → stack two reels on one pin (still one place, multiple clips)

### Hard no on this page
- AI trip essay / long summary blocks
- Infinite vertical feed that recreates Instagram
- Fake pins for generic tips
- Booking checkout walls
- More than ~8 words as the default card caption

### Directory → location
Directory = location cover image + name + counts (spots / tips). Tap → this page. No blurbs.

**v1 demo data:** `fixtures/demo-data.json` — Athens, Lisbon, Tokyo.

### What else (still useful, keep light)
- **Cluster + zoom** on busy maps
- **Day strip persistence** (at least for the demo session)
- **Empty states**: no pins yet, only tips, unsorted waiting
- **Sort affordance** always obvious when unsorted > 0
- **Open original** so trust stays with the reel
- Optional later: share day strip, multi-day tabs, neighborhood chips
