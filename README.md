# Miri’s Little World

Ten working static website designs, sharing three original illustrated storybooks for reading together around age four. Open `index.html` to compare the designs. Open `stories.html` to review the story drafts.

## Website

Repository: https://github.com/talrme/books

GitHub Pages: https://talrme.github.io/books/

Each numbered design folder is a separate staging URL under that address.

## Preview

Double-click `index.html`, or serve this folder for consistent browser storage:

```sh
python3 -m http.server 8080
```

Visit http://localhost:8080. On an iPad on the same Wi-Fi, use your computer’s local network address and port 8080. No packages, build step, API key, login, or AI connection is needed. An internet connection is not needed after downloading the site.

## Publish to GitHub Pages

Copy the **contents of this folder**, including `.nojekyll`, into your repository root. In the repository’s Settings → Pages, choose deployment from your publishing branch and `/(root)`. The root URL opens the comparison gallery; each numbered folder is a separate working staging URL. All assets and links use relative paths, including on project Pages URLs.

Keep `shared/`, the ten numbered folders, and `previews/` together. The ten designs share the reader, story data, and illustrations; they are separate routes in one deployable static site. No other personal website has been changed.

## What works

- All three books in every design: a cover, eight illustrated story pages, and an ending.
- Book favorites and favorites filtering, saved per browser and origin.
- Resume the last story page. State is shared across the ten staging designs on the same origin.
- Click/tap arrows, swipe left/right, or use keyboard arrows. Escape returns to the shelf.
- Browser back, direct book/page links, page indicators, read again, and return to shelf.
- One story page at a time: illustration and text side by side in landscape; stacked in portrait. Layout changes preserve your place.
- Distinct ripple, paper flutter, and dimensional turn transitions; opening and ending animation; reduced-motion support.
- A persistent design shortlist in the comparison gallery.

There are no games, hotspots, narration, sounds, live story generation, analytics, accounts, or backend. Favorites and progress do not sync between devices. Private browsing, cleared site data, a different hostname, and `file://` storage behavior can affect persistence. No service worker is installed; the site does not promise offline caching from a hosted URL.

## The ten designs

| Folder | Design | Main difference |
|---|---|---|
| `01-little-library/` | The Little Library | Warm paper, big book covers, classic shelf |
| `02-moonbeam/` | Moonbeam | Midnight sky, arched covers, dim bedtime reader |
| `03-paper-parade/` | Paper Parade | Bold type, wonky colored paper, playful energy |
| `04-rainbow-room/` | The Rainbow Room | Pastel story tiles, rounded shapes, friendly room |
| `05-reading-nook/` | The Reading Nook | Walnut shelf, clothbound-style books, warm light |
| `06-story-cinema/` | Story Cinema | Large illustrated feature, small poster collection |
| `07-sunday-stories/` | Sunday Stories | Numbered editorial journal, horizontal story rows |
| `08-little-atlas/` | Little Atlas | Offset field-guide cards along a story trail |
| `09-cloud-nine/` | Cloud Nine | One floating featured story, carousel and thumbnails |
| `10-pocket-stories/` | Pocket Stories | Compact app-style list with simple tabs |

## Edit or create books with Codex

Open this folder as your Codex project. Say “I want a new book.” `AGENTS.md` routes Codex to the five-question brief and creation workflow in `docs/BOOK_CREATION.md`.

- `shared/books.js`: story text, image descriptions, colors, illustration style, page-turn style.
- `shared/concepts.js`: ten design definitions.
- `shared/app.js`: library, favorites, reader, gestures, progress, and animation logic.
- `shared/styles.css`: responsive reader and all ten visual treatments.
- `shared/assets/`: 27 optimized WebP images, three covers and 24 story illustrations.
- `docs/STORY_GUIDE.md`: characters, family details, tone, and story summaries.
- `docs/DESIGN_GUIDE.md`: layout, motion, accessibility, storage, and verification requirements.
- `docs/art-prompts.json`: exact prompts used with the built-in image-generation tool.
- `docs/verification.json`: automated browser verification results.

The illustrations are invented storybook interpretations, not portraits based on family photographs. Current assets are screen-oriented first-draft illustrations, approximately 414 × 414 pixels each; larger individual illustrations can be generated after choosing a direction.
