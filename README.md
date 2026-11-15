# Miri’s books — Paper Parade

A small family bookshelf with five illustrated books for reading together around age four. Paper Parade is the selected design, with uneven colorful borders, dimensional book bindings, and a compact header.

**Website:** https://talrme.github.io/books/

**Story review:** https://talrme.github.io/books/stories.html

## Reading

Open a large front cover, then tap the right side to turn it. Tap the left side to go back. Swipes, keyboard arrows, numbered navigation, and arrow buttons also work. Escape exits fullscreen first, or returns to the shelf in normal reading. The reader fills the window and adapts to portrait or landscape without showing two story pages at once.

On supported browsers, choose **Fullscreen** from the bookshelf, reader, or Settings. It stays on as you finish books, return to the shelf, and open another story. An **× Exit fullscreen** button stays available (a compact 44-pixel corner control on phones), including while scrolling the shelf or turning pages. Only the exit control or browser exit ends fullscreen; your current view and place stay intact. Unsupported browsers omit the control.

Books start newest first. Open **Settings** beside the bookshelf name to choose newest first, oldest first, title (A–Z), or custom order. Drag a cover with a mouse, or hold then drag a cover on a touch screen, to arrange books; moving a book selects custom order. Keyboard users can focus a cover and use arrow keys. There are no drag icons. Preferences are saved in this browser. **Reset order** returns to newest first without affecting reading progress. New books appear ahead of your saved custom arrangement.

Settings also lets you choose **Gentle page turn** or **Instant — no animation**. Device reduced-motion preferences always take priority. Reading settings and book order have separate resets; neither erases saved reading positions.

Books finish on a dimensional back cover with a large “The End,” a small reused cover illustration, a tiny creation month/year beneath the image, and playful Read Again and Bookshelf actions. Portrait phones turn a full-width leaf from its outer edge; other layouts turn the right half-page left across the center (240 ms). Previous reverses the direction. Both stay clipped to the book bounds. Covers fade in place; rapid navigation immediately interrupts the animation. On wider layouts the old stationary half stays visible until the leaf lands, and the next illustration is decoded before reveal to avoid flicker. F before the page numbers returns to the front cover; B after the final number opens the back cover.

Reading progress is saved in this browser. Tapping a cover always starts at the cover. State does not sync between devices. Blocked storage does not prevent reading. Reduced-motion settings make turns instant.

The 57 individual illustrations use the parent-supplied family reference, including Miri’s light braids and her missing two upper front teeth. The raw family photo is not committed or published. Images are screen-oriented 1254-pixel square illustrations, optimized to WebP.

## Run or publish

Open `index.html`, or serve this folder:

```sh
python3 -m http.server 8080
```

Visit http://localhost:8080. There are no packages, build steps, accounts, external fonts, runtime AI calls, or API keys. Publish this directory to GitHub Pages from the publishing branch's root; retain `.nojekyll` and relative asset paths. The old `03-paper-parade/` URL redirects to the root, preserving book links. The other design experiments and comparison gallery were removed after the parent selected Paper Parade. Git history retains prior versions.

## Create and revise with Codex

Open this project and say “I want a new book.” Follow the [five questions and editing workflow](docs/BOOK_CREATION.md): numbered storyboard, text/pacing edits, visual direction, illustrations, reading preview, revisions, and publication. Start at any stage for an existing book.

The private family appearance reference is kept outside this public repository at `~/Documents/Codex/family-references/miri-avi-family.png`; its adjacent README identifies everyone and records current appearance notes. Future illustration work should use it. The original photo is excluded from site assets and download archives.

Current plans: [Swimming](docs/books/swim/PLAN.md), [Avi](docs/books/avi/PLAN.md), and [Blue bike adventure](docs/books/adventure/PLAN.md), and [Rainbow Baby Sings!](docs/books/rainbow-song/PLAN.md). New books use the [book-plan template](docs/templates/BOOK_PLAN.md).

Examples: “Give the Spaceship two pages,” “Move the dance party to page 5,” or “Keep page 4’s words, but change the illustration.” Suggestions alone do not change the public book.

- `shared/books.js`: story words, image descriptions, editorial descriptions, creation dates, and book colors.
- `shared/library.js`: bookshelf, reader, progress, side taps, swipes, and responsive page turns.
- `shared/library.css`: Paper Parade shelf and responsive reader.
- `shared/assets/`: one cover plus eight or twelve story illustrations per book.
- `docs/STORY_GUIDE.md`: family and illustration notes.
- `docs/DESIGN_GUIDE.md`: reader behavior and verification requirements.
- `docs/art-prompts-family.json`: exact built-in image generation prompts for the current art.
- `docs/verification.json`: most recent browser verification report.

The site has no narration, sound, games, hotspots, analytics, backend, or service worker. Hosted URLs do not promise offline caching. Use the story-review page for reviewing the words and pictures together.

## Icon

`shared/book-stack.svg` is the simple three-book icon, using Paper Parade’s blue, pink, and yellow. `shared/favicon.svg`, `shared/icon-192-v2.png`, and `shared/apple-touch-icon-v2.png` provide browser and home-screen versions. All Websites links to the 192-pixel icon.

Favorites have been removed across all devices. Ignore legacy favorites/start-view fields without losing reading progress, custom order, or reading preferences.

The shelf has no drag icons or Continue reading links. Ignore legacy showContinue preferences. Covers support mouse drag, touch hold-and-drag, and keyboard reordering.

Book view is saved in `miri-books-shelf-v1` as `view: "covers" | "list"`, defaulting to covers for older preferences. Settings offers Bookshelf and Compact list. The list shows small dimensional covers, titles, page counts, and creation month/year; the whole row opens or reorders the book. Mouse drag, touch hold-and-drag and keyboard arrows work in both views. Sorting and both resets preserve the chosen view; synchronize view changes across tabs. Use `shared/book-stack.svg` beside the site title instead of the flower, including on narrow phones.

Use the subtle Share button to share the bookshelf, or the exact book currently open. On phones it sits at the bottom after the books, or in the reader footer; on desktop it stays in the bottom right. Book links start on the front cover. The panel offers Copy link and the device’s Share option where supported; sharing is hidden in fullscreen. Its connected-dots icon follows the existing Workout site.

Settings offers illustrated, directly tappable cards for book view, book order, and page turns, with selected choices shown in soft purple. There are no dropdown pickers; changes save immediately in this browser.

Newest book: [Six Sleeps Until Cousin Hugs](https://talrme.github.io/books/#book=six-sleeps), sixteen story pages of dreamy watercolor for Thanksgiving cousin adventures. Its approved words, scene IDs and revision record are in [the book plan](docs/books/six-sleeps/PLAN.md).

Bottom arrows, page links and the counter default to hidden on phones/iPads and smaller windows, leaving the printed numbers on each page. **Settings → Bottom navigation → Auto / Show / Hide** controls this per browser. Auto shows the controls on larger desktop screens. Taps, swipes and keyboard arrows still turn pages in every mode. Touch fullscreen shifts Bookshelf to the right to leave room for the browser’s native close control.

PNG icons are rendered from one complete `book-stack.svg` at the target size, with an opaque cream background. Current home-screen and directory references use fresh v2 filenames to avoid cached malformed icons; the original PNG filenames also contain corrected copies.
