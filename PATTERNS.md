# Patterns

Named, reusable ways of solving the same job. Create a pattern once. Stay consistent to it everywhere that job appears.

`DESIGN.md` is tokens, type, space, and components.
`CONSISTENCY.md` is house rules the system cannot encode (casing, no section subtitles, one name per object).
This file is interaction and layout recipes: card anatomy, empty states, filter bars, nav models, primary-action placement.

If it can live as a Storybook / system component, put it there and link from here. Do not invent a cousin pattern for the same job on the next screen. Exceptions go in `DECISIONS.md` with a reason.

## Pattern log

| Pattern | Job it solves | Do (structure / behavior) | Don't | Where it applies |
|---------|---------------|---------------------------|-------|------------------|
| Plan day route | Turn scattered saves into one walkable day | Plan day chip → numbered stops + walk minutes + dashed map route; fill AM/Mid/PM; Timeline sheet for detail | Chatbot itinerary essay; booking CTA clutter | Location page (`/place/:cityId`) |
| | | | | |

## How to add

1. Same job appears on a second screen.
2. Name the pattern. Write do / don't.
3. Reuse it. Do not restyle the same job from scratch.
4. If two patterns fight for one job, pick one and migrate.

## Test

Open three screens that share a job. If structure or behavior differs with no decision recorded, pick the pattern and align. If a component could force it, move it into the system and keep a one-line pointer here.
