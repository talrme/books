# Settings

The bookshelf header has a visible Settings button at every screen size. The grouped native dialog saves preferences in this browser.

| Setting | Default | Behavior |
|---|---|---|
| Book view | Bookshelf | Compact list uses small covers and titles in space-saving rows |
| Book order | Newest first | Also offers oldest first, title A–Z and custom; dragging selects custom |
| Page turns | Gentle | Instant removes page opening/turn animations; device reduced motion always wins |

Reset order affects only the arrangement. Reset reading settings affects page motion. Saved reading positions survive both resets.

Preferences extend `miri-books-shelf-v1`; reading progress remains in its separate existing key. Old preferences receive defaults for missing fields.

## Design references

Reviewed the user's Websites For Fun directory: Paths to Peace (start view and still-motion choices), Timer (less motion), Miri’s Mix & Match (grouped controls remembered on the device), Workout (separate preference resets), and How to Help (local settings and reordering). Retained the books site's Paper Parade colors and uneven cover treatment.

See phone-reader-verification.json for checked behavior and browser limits.

Favorites have been removed across all devices. Ignore legacy favorites/start-view fields without losing reading progress, custom order, or reading preferences.

The shelf has no drag icons or Continue reading links. Ignore legacy showContinue preferences. Covers support mouse drag, touch hold-and-drag, and keyboard reordering.

Book view is saved in `miri-books-shelf-v1` as `view: "covers" | "list"`, defaulting to covers for older preferences. Settings offers Bookshelf and Compact list. The list shows small dimensional covers, titles, page counts, and creation month/year; the whole row opens or reorders the book. Mouse drag, touch hold-and-drag and keyboard arrows work in both views. Sorting and both resets preserve the chosen view; synchronize view changes across tabs. Use `shared/book-stack.svg` beside the site title instead of the flower, including on narrow phones.

Settings uses inline illustrated choice cards instead of select dropdowns: two Book view tiles, a 2×2 Book order grid, and two Page turns choices. Use labeled native radio inputs styled as cards (no visible radio circles), semantic fieldset legends, checked highlights/checkmarks, and neutral visible keyboard focus. Preserve standard radio arrow-key interaction, immediate local saving, cross-tab synchronization, existing resets and all preference keys. Keep the close button sticky and targets at least 44px tall. The grouped layout and quiet selected treatment draw from Paths to Peace’s settings panel.
