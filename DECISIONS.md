# Decisions

Append only. Do not reopen quietly.

## 2026-10-10

- Product name: **Travel Daddy**.
- Primary organize axis: **location / place**.
- Primary output: **easy digest page** of saved short-form travel info (not a second infinite feed).
- Hackathon mode: design-helper short track; mock ingest OK if APIs block.
- Moodboard scaffold skipped for speed (not a brand-site-only project).
- Location page is text-light and interactive: map+pins, lens chips, spot cards, day strip. No long AI summaries on the page.
- Hero uses a **location image**, not a mosaic of user saves.
- Model: each venue-specific reel = one map pin + one spot card. **Generic place tips** live in a separate Tips shelf (no pin).
- Unsorted items must be sortable into Spot (pin) or Tip.
- Map UX: pin clusters when dense; same venue can stack multiple reels on one pin.
- Spot cards can open the venue in Apple/Google Maps; tip cards cannot (no venue).
- Directory card: location photo + name + spot/tip counts.
- Empty states required: no pins, tips-only, unsorted waiting.
- v1 prototype screens: **directory of cities** + **one location page**.
- Demo fixtures: Athens, Lisbon, Tokyo in `fixtures/demo-data.json` (dummy reel links; mock only).
- Overall UI direction review lives in `web/` (Vite + React + shadcn). Not product yet.
- Option F (Terrain Glass) explores immersive 3D diorama map + glass overlays for Travel Daddy objects.
- Option G (Stack Deck) explores stacked cards for places (directory) and spots (location).
- **Main UI direction: Cinema Map.** Directory: film-strip city picker over a dark illustrated 3D globe. Location: flat dark minimal Esri map (Terrain Glass stage language) with pins, docked spot card, tips chip, day strip. Other mock options remain as comparisons only.
- Working prototype ships in `web/` at `/` (directory) and `/place/:cityId` (location). Concept gallery stays at `/review`.
- Location **Plan day**: greedy proximity chain with lens pacing (see/do → eat → see/do → eat). Shows numbered stops, walk-minute timeline, dashed route on the map, and fills AM/Mid/PM. Manual day strip still works. Stay spots are optional bookends only.
- Location **Plan day**: greedy proximity chain with lens mix (see/do ↔ eat); stay is optional bookend only. Shows numbered stops, walk minutes, timeline sheet, and dashed route on the map. Fills AM/Mid/PM from first / middle / last stop.
