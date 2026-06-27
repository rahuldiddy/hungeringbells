# Hungering Bells — Creator Collaboration Website

A premium, responsive single-page landing site / media kit for the **Hungering Bells**
creator brand (Kallu Keerthi). Built to help cafes, restaurants, lifestyle, travel and
product brands enquire for collaborations and promotions.

Pure **HTML + CSS + JavaScript** — no build step, no dependencies. Open and edit freely.

## Structure

```
.
├── index.html          # All page markup (sections in order)
├── css/styles.css      # All styling. Brand palette lives in :root at the top.
├── js/script.js        # Nav, scroll-spy, reveals, and the enquiry form handler
├── assets/
│   └── hungering-bells-logo.png   # Brand logo (header, hero, about, CTA, footer)
└── .claude/launch.json # Local preview config (python http.server on :4173)
```

## View it locally

Any static server works. For example:

```bash
python3 -m http.server 4173
# then open http://localhost:4173
```

## Sections

Header · Hero · Marquee · About · Collaboration Services · Why Collaborate ·
Gallery Preview · Enquiry Form · Contact CTA · Footer

## Easy edits

- **Colors** — change the CSS variables under `:root` in `css/styles.css`
  (`--teal-500`, `--gold-500`, `--ink-900`, `--cream-50`, …). The whole site retunes.
- **Text / links** — edit directly in `index.html`. Instagram and YouTube URLs are
  already wired everywhere.
- **Gallery** — the cards use gradient placeholders (`.g-1`…`.g-8` in the CSS).
  Replace with real images later by adding `<img>` inside each `.gallery-card`
  or setting a `background-image`.
- **Stats** — follower/post counts are plain text in the hero, about and why sections.

## Connecting the enquiry form (later)

The form is frontend-only right now and logs the submission to the console.
All wiring happens in **one place**: the `deliverEnquiry()` function in
`js/script.js`. It already contains ready-to-use stubs for:

- **Option A** — your own backend / API endpoint
- **Option B** — Google Sheets (Apps Script web app)
- **Option C** — Email via Formspree / Getform
- **Option D** — pre-filled WhatsApp message

Pick one, fill in the URL/number, and remove the demo block above it. Nothing else
in the form needs to change — fields are collected automatically into a structured
payload.

## To do in later revisions

- Add real Instagram posts / reels to the gallery
- Add pricing / package details
- Wire the enquiry form to a real destination (see above)
- Add real photos to the hero / about backgrounds if desired
