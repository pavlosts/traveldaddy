# Agent context

Root file for coding/design agents. Keep this lean. Point at the other files. Do not dump tokens, research notes, or feature scope here.

If a tool auto-reads `CLAUDE.md` or another root file, put one line there: read `AGENTS.md` first.

## Stack and commands

- Stack: Vite + React + TypeScript + shadcn + Leaflet + MapLibre (`web/`).
- How to run: `cd web` then `npm run dev`. Prototype at `/`. Concept review at `/review`.
- Folder conventions: root markdown is agent source of truth; `INDEX.md` maps the studio kit; `CLIENT.md` maps **selected** client materials; `knowledge-base/` is the studio HTML portal; `client-portal/` is the curated client portal (professional default; brand when kit exists).

## Files to read

| When | File | Job |
|------|------|-----|
| Orient | `INDEX.md` | Markdown map of the kit. Points at portal homepage. |
| Client materials | `CLIENT.md` / `client-portal/index.html` | Only user-selected client materials; professional portal. |
| Always | `ENCOUNTER.md` | Felt scene. Generate from this before tokens. |
| Always | `DESIGN.md` | Boundaries and reasons. Tokens after the encounter still tastes right. |
| Always | `VOICE.md` | Tone. Who it sounds like. |
| Always | `CONSISTENCY.md` | House rules the design system cannot encode (no section subtitles, casing, one name per object). |
| Always | `PATTERNS.md` | Named interaction/layout recipes. Create once; stay consistent. |
| Always | `DECISIONS.md` | Settled choices. Append only. Do not reopen quietly. |
| Before designing | `PROBLEM.md` | Pain, outcome, alternatives, community. |
| Before designing | `EVIDENCE.md` | Assumptions and what backs them. Cheap tests before big bets. |
| Before visual refs | `MOODBOARD.md` / `moodboard/index.html` / `knowledge-base/moodboard.html` | Craft-first reference board (type, color, layout, …). Multi-category cards. Portal page links to the live board. |
| When empathy artifacts exist | `empathize-with-user/` · `knowledge-base/6p-stories.html` | Users, journey, letter, grids. **6P stories always get a portal page** when Locked + comic exist (design-helper JO15). |
| Before build | `HANDOFF.md` | Behavior, logic, states, edges, viewports. |
| Before claiming done | `REVIEW.md` | Yes/no gate. |
| Human browse | `knowledge-base/index.html` | Visual knowledge portal homepage. Keep in sync with root markdown. |
| Ongoing | `CASE_STUDY.md` | Studio-only log of what happened. One per project/app. Gitignored. Not in the portal. |

## Rules the hex cannot infer

- Do not invent components that already exist. Check `DESIGN.md`, `PATTERNS.md`, and the live system first.
- Do not ship happy-path-only. Empty, loading, error, and blocked live in `HANDOFF.md`.
- Do not invent users, quotes, or validation. Leave `PROBLEM.md` and `EVIDENCE.md` blank rather than fake them. Leave `empathize-with-user/USERS.md` blank until real research fills it.
- Do not expand scope. If it is not asked, it is out of scope until written down.
- If output looks generic, a constraint is missing. Add a sentence to the right file. Do not just re-prompt.
- Never use em dashes in copy, UI text, captions, docs, or commits.
- One `CASE_STUDY.md` per project or app folder. Studio-only and gitignored. Do not commit it, link it from client-facing docs, or use alternate names (`case-study.md`, `CASE-STUDY.md`).
- Moodboards: craft categories only (typography, color, layout, roundness, atmosphere, imagery). Cards may sit in multiple categories. No section subtitles, no thumb badges, no product-fit buckets. Follow `MOODBOARD.md`.
