# Miri’s books — Paper Parade

A small family bookshelf with three illustrated books for reading together around age four. Paper Parade is the selected design, with uneven colorful borders, dimensional book bindings, and a compact header.

**Website:** https://talrme.github.io/books/

**Story review:** https://talrme.github.io/books/stories.html

## Reading

Open a large front cover, then tap the right side to turn it. Tap the left side to go back. Swipes, keyboard arrows, numbered navigation, and arrow buttons also work. Escape returns to the shelf. The reader fills the window and adapts to portrait or landscape without showing two story pages at once.

Books finish on a back cover with a short description, their creation month and year, up to two randomly ordered other books, and read-again/bookshelf buttons. All three books were created in November 2026. Recommendations use the existing library; no AI requests occur while reading.

Favorites and reading progress are saved in this browser. Tapping a cover starts at the cover; an unfinished book also has a separate “Continue at page…” link. State does not sync between devices. Blocked storage does not prevent reading. Reduced-motion settings make turns instant.

The 27 individual illustrations use the parent-supplied family reference, including Miri’s light braids and her missing two upper front teeth. The raw family photo is not committed or published. Images are screen-oriented 1254-pixel square illustrations, optimized to WebP.

## Run or publish

Open `index.html`, or serve this folder:

```sh
python3 -m http.server 8080
```

Visit http://localhost:8080. There are no packages, build steps, accounts, external fonts, runtime AI calls, or API keys. Publish this directory to GitHub Pages from the publishing branch's root; retain `.nojekyll` and relative asset paths. The old `03-paper-parade/` URL redirects to the root, preserving book links. The other design experiments and comparison gallery were removed after the parent selected Paper Parade. Git history retains prior versions.

## Create and revise with Codex

Open this project and say “I want a new book.” Follow the [five questions and editing workflow](docs/BOOK_CREATION.md): numbered storyboard, text/pacing edits, visual direction, illustrations, reading preview, revisions, and publication. Start at any stage for an existing book.

Current plans: [Swimming](docs/books/swim/PLAN.md), [Avi](docs/books/avi/PLAN.md), and [Blue bike adventure](docs/books/adventure/PLAN.md). New books use the [book-plan template](docs/templates/BOOK_PLAN.md).

Examples: “Give the Spaceship two pages,” “Move the dance party to page 5,” or “Keep page 4’s words, but change the illustration.” Suggestions alone do not change the public book.

- `shared/books.js`: story words, image descriptions, back-cover descriptions, creation dates, and book colors.
- `shared/library.js`: bookshelf, reader, favorites, progress, side taps, swipes, flips, and related books.
- `shared/library.css`: Paper Parade shelf and responsive reader.
- `shared/assets/`: one cover and eight illustrations per book.
- `docs/STORY_GUIDE.md`: family and illustration notes.
- `docs/DESIGN_GUIDE.md`: reader behavior and verification requirements.
- `docs/art-prompts-family.json`: exact built-in image generation prompts for the current art.
- `docs/verification.json`: most recent browser verification report.

The site has no narration, sound, games, hotspots, analytics, backend, or service worker. Hosted URLs do not promise offline caching. Use the story-review page for reviewing the words and pictures together.

## Icon

`shared/book-stack.svg` is the simple three-book icon, using Paper Parade’s blue, pink, and yellow. `shared/favicon.svg`, `shared/icon-192.png`, and `shared/apple-touch-icon.png` provide browser and home-screen versions. All Websites links to the 192-pixel icon.
