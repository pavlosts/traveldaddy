# Client

Markdown map of **selected** client materials only. Keep lean. Point; do not duplicate contents.

Human visual portal: [client-portal/index.html](client-portal/index.html)  
Studio kit: [INDEX.md](INDEX.md) · [knowledge-base/index.html](knowledge-base/index.html)

## Client

- Name: Travel Daddy (hackathon; no external client)
- Branding: none yet
- Portal look: always professional. Apply client brand in `client-portal/assets/client-portal.css` when a kit exists; otherwise keep the crafted neutral default. Do not invent a brand.

## Selected materials

Add a row **only when the user chooses** that item for the portal. Do not auto-dump everything under `docs/`.

| Title | Portal page | Canonical source | Notes |
|-------|-------------|------------------|-------|
| | | | |

## Open the portal

IDE file preview often blocks clicks between local HTML files. Serve the folder and open over HTTP:

```bash
python -m http.server 5173 --directory client-portal
```

Then open http://127.0.0.1:5173/

## Rules

- Curated only: if the user did not select it, it does not appear in `CLIENT.md` or `client-portal/index.html`.
- Never mention the studio kit, `knowledge-base/`, or `CASE_STUDY.md` inside the client portal UI.
- Never show meta labels like “Selected materials” or “Curated links only” in the client portal UI.
- Studio-only `CASE_STUDY.md` stays out of the portal entirely.
- Do not invent brand colors or logos.
- Browsable links must be HTML under `client-portal/` (usually `pages/*.html`). Do not link raw `.md` or parent `../docs/` paths from the homepage.
- When the user selects an item: add a portal HTML page with a page thumbnail under `assets/thumbs/`, list it on the homepage as a **card with thumbnail**, and add one row here.
- Homepage navigation is a card grid. Each item: thumbnail of the page, title, short description. No file-path labels in the UI.
- Card `href` navigates directly to the material page (e.g. `./pages/name.html`). Do not use an in-portal iframe viewer.
