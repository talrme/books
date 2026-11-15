# Miri’s Little World — project instructions

This is a family storybook library for a four-year-old. Read `README.md` and the relevant file in `docs/` before changing content or behavior.

## When the user asks for a new book

Follow `docs/BOOK_CREATION.md`. Ask the five agreed questions together, reusing details already provided. Do not ask questions whose answers are already in the request. Wait for the answers to genuinely missing creative choices before generating the new book. Ordinary requested edits to existing stories do not require repeating the questionnaire.

Default to a numbered storyboard with exact draft words, an illustration idea per page, and a recommended page count. Follow the user’s requested stage: story planning, text revision, visual direction, illustration generation, reading preview, or publication. Keep a working plan and revision log under `docs/books/<book-id>/PLAN.md` using `docs/templates/BOOK_PLAN.md`. A request for full autonomous creation can authorize moving through these stages without repeated confirmations.

For revisions, accept page numbers, quoted text, scene descriptions, and overall suggestions. Preserve stable scene IDs in the plan as pages move. Interpret a batch of page-number feedback against the version the user reviewed, then renumber once and show the mapping. Update text and images together when moving a scene. Regenerate only affected illustrations. Preserve the previous version in local revisions or Git history. A request for suggestions alone does not authorize changing the published book.

## Product rules

- Reading, opening a book, turning pages, returning to the shelf are the child-facing interactions.
- No games, puzzles, hotspots, branching choices, collectible rewards, auto-advancing pages, or surprise sounds.
- The durable private family photo is at `~/Documents/Codex/family-references/miri-avi-family.png`; read its adjacent README for identities and updated appearance notes. Use it whenever Abba, Mama, Miri, or Avi is named in illustration work. Keep this original outside public assets, Git history, and deliverable archives.
- Use the written family appearance notes and the supplied photo when available for future illustrations. Do not commit or publish the raw family reference photo. The current illustrations use that reference. Miri has light braids and both upper front teeth missing; show the gap in her smile.
- Preserve exact family names: Miri, Avi, Mama, Abba, Ayla, Asher. Abba means her dad; Rainbow Baby is Miri’s affectionate name for Avi. Do not infer a pregnancy-loss history.
- Open books on a large front cover without an extra “Open the book” button. Use short 240 ms interruptible turns: a full-width leaf on portrait phones (up to 600 px wide), and the right half folding left across the center on wider layouts; previous reverses this. Clip the turn to the book bounds and keep the reading surface stationary. Support side taps, swipes, and arrows. Every rapid navigation input must count immediately. Include F before page 1 and B after the last page in the page navigation, linking to the front and back covers. The final screen is a dimensional back cover with large “The End,” a small reused cover illustration, a tiny creation month/year beneath the illustration, and playful Read Again and Bookshelf actions.
- Optimize for iPad while supporting portrait/landscape phones and desktop. Show one story page at a time, never squeeze two story pages onto a phone. Never require orientation lock.
- Keep the site static and GitHub Pages compatible. No runtime AI requests, API keys, accounts, external fonts, analytics, or new dependencies without a concrete user need.
- Paper Parade is the selected design. Keep its compact shelf, playful uneven borders, and dimensional spines/page edges. The design gallery and other experiments have been removed at the user’s request. Keep the old Paper Parade URL redirect working.
- Keep reading progress in the versioned browser-storage key already used by the app. Protect against denied storage and corrupt values.
- Honor reduced motion, keyboard navigation, meaningful image descriptions, and visible focus. Keep essential controls at least 44 CSS pixels.
- Follow the user’s existing authorization for publishing. If a repository is connected and deployment is requested, finish the book and relevant checks, then publish within that scope. Do not invent a new approval ceremony.

## Verification

For a story change, confirm each image matches its page and all names are spelled correctly. For reader/layout changes, check every story at phone portrait and landscape and iPad portrait and landscape. Validate cover opening, next/previous, ending, replay, and return to shelf when changing those features. Read `docs/DESIGN_GUIDE.md` for the full checklist. Do not claim a live URL until it is deployed and verified.

## Site-wide fullscreen

Fullscreen targets the document root and is available from the bookshelf, reader, and Settings wherever supported (including standard/WebKit paths). It persists through opening/finishing books, replay, returning to the bookshelf, choosing another book, Settings and internal home navigation. Never leave fullscreen automatically on book close or end. Only explicit exit or the browser's own fullscreen exit ends it. Keep an accessible X Exit fullscreen control visible (a quiet 44-pixel icon button on phones): fixed at the bookshelf’s top right even while scrolling, in the reader header during turns, and in the native Settings dialog header. Exit preserves the current view/book/page. Escape exits fullscreen before it can close a book. Unsupported browsers omit all fullscreen controls; denied requests recover gracefully. Do not automatically request fullscreen on reload, since browsers require user action.

## Bookshelf order and settings

Default to newest first; offer oldest first, title A–Z, and custom order in a compact Settings dialog. Save these preferences in `miri-books-shelf-v1` as `{mode, order: [bookId], motion, view, navigation}`, separate from reading progress. Drag any cover with a mouse. On touch, hold the cover for 350 ms before dragging; a quick swipe scrolls normally and a tap opens the book. Arrow keys on a focused cover reorder accessibly. Do not add drag icons or handles. Moving a book switches to custom order; switching automatic modes preserves the custom arrangement. Reset order clears only the saved arrangement and returns to newest first. Custom order filters unknown/duplicate IDs and places newly added books before the retained arrangement. Cancel with Escape; canceled drags never save. Suppress the post-drag click so dragging never opens a book. Support edge auto-scroll, denied/corrupt storage, cross-tab preferences, and reduced motion. Story review remains in its published newest-first order.

## Reading preferences

Keep the Settings button visibly labeled on phone, iPad, and desktop. Group shelf controls and reading controls in one accessible dialog with a sticky heading/close button and scrollable content on short screens. Every cover opens on the front cover. Do not add Continue reading links or a preference for them. Page motion defaults to system-aware gentle turns, with an instant option. Always let OS reduced motion override animations. Reset order preserves reading preferences; Reset reading settings restores motion while preserving custom order and progress. New fields default safely for older saved preferences and synchronize across tabs.

## Page-turn continuity

Keep the old page visible while the destination illustration decodes. On portrait phones, the entire old leaf turns away and reveals the destination without a stationary half. On other layouts during a forward turn, hold the old left half steady while the old right half folds left; reverse this for previous. The back face uses the destination half and must match the real destination exactly at landing. Remove the stationary and turning overlays together without tint/opacity changes or a second content swap. Never lock navigation while decoding or animating: canceled/deferred transitions must not reappear after a later turn, resize, close, or motion preference change. Verify start/end frames in both directions, cold/slow images, rapid turns, and instant/reduced-motion reading.

Favorites have been removed across all devices. Ignore legacy favorites/start-view fields without losing reading progress, custom order, or reading preferences.

The shelf has no drag icons or Continue reading links. Ignore legacy showContinue preferences. Covers support mouse drag, touch hold-and-drag, and keyboard reordering.

Book view is saved in `miri-books-shelf-v1` as `view: "covers" | "list"`, defaulting to covers for older preferences. Settings offers Bookshelf and Compact list. The list shows small dimensional covers, titles, page counts, and creation month/year; the whole row opens or reorders the book. Mouse drag, touch hold-and-drag and keyboard arrows work in both views. Sorting and both resets preserve the chosen view; synchronize view changes across tabs. Use `shared/book-stack.svg` beside the site title instead of the flower, including on narrow phones.

## Sharing

Keep a subtle connected-dots Share control in normal browsing/reading, hidden throughout site fullscreen. On phones it belongs in normal flow: after all books at the bottom of the shelf, and inside the reader footer beside navigation; never float it over phone content. On desktop it stays at the bottom right. Use the icon style from Workout's Save / Share button. From the shelf share the clean root URL; from any cover, story page, or back cover share `#book=<id>` without page number or browser-local settings so recipients start at that book's front cover. Provide an accessible native dialog with a readonly link, Copy link, and native Share where available. Preserve view/page on close, keep modal keyboard events from navigating the underlying reader, handle canceled native sharing quietly, and retain selectable-link fallback for denied clipboard access. Keep sharing separate from page-turn overlays and reserve footer space so it cannot cover navigation.

Suppress native tap highlighting on the document and reader surface as well as controls, so phone page taps never flash a blue overlay. Keep keyboard focus indicators and intentional text selection available.

Do not automatically focus the fullscreen button on initial load or fullscreen state changes. Touch browsing should show no focus ring; keyboard focus on fullscreen uses a quiet neutral outline, never the red accent ring.

Settings uses inline illustrated choice cards instead of select dropdowns: two Book view tiles, a 2×2 Book order grid, Auto/Show/Hide Bottom navigation choices, and two Page turns choices. Use labeled native radio inputs styled as cards (no visible radio circles), semantic fieldset legends, checked highlights/checkmarks, and neutral visible keyboard focus. Preserve standard radio arrow-key interaction, immediate local saving, cross-tab synchronization, existing resets and all preference keys. Keep the close button sticky and targets at least 44px tall. The grouped layout and quiet selected treatment draw from Paths to Peace’s settings panel.

## Bottom navigation and touch fullscreen

Settings includes illustrated Auto / Show / Hide choices for Bottom navigation, saved as `navigation` in `miri-books-shelf-v1`. Auto is the default for missing/invalid legacy values: hide bottom arrows, counter and page links at widths up to 1100px or where any coarse touch pointer is available; show on larger fine-pointer desktops. Show explicitly restores arrows and page links even on phones. Hide suppresses them on every size. Printed page numbers inside story pages remain visible in every mode. Side taps, swipes, keyboard arrows and screen-reader page announcements remain available. Apply changes immediately across books and tabs, recompute Auto on screen/input changes, and reset navigation to Auto with Reset reading settings while preserving order, view and progress. When hidden, place Share inside the reader footer in normal mode; hide that footer in fullscreen to reclaim space. On coarse-pointer devices, reserve at least 84px at the reader header’s left edge in fullscreen for the browser’s native close control; keep Bookshelf reachable. Reserve left space for the fullscreen shelf brand on tablets too. Do not claim physical Safari/native-X testing from Chrome emulation.
