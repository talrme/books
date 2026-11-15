# Settings

The bookshelf header has a visible Settings button at every screen size. The grouped native dialog saves preferences in this browser.

| Setting | Default | Behavior |
|---|---|---|
| Book view | Bookshelf | Compact list uses small covers and titles in space-saving rows |
| Book order | Newest first | Also offers oldest first, title A–Z and custom; dragging selects custom |
| Bottom navigation | Auto | Hidden on phones/tablets and smaller windows; Show or Hide overrides the default |
| Page turns | Gentle | Instant removes page opening/turn animations; device reduced motion always wins |

Reset order affects only the arrangement. Reset reading settings restores page motion and automatic bottom navigation. Saved reading positions survive both resets.

Preferences extend `miri-books-shelf-v1`; reading progress remains in its separate existing key. Old preferences receive defaults for missing fields.

## Design references

Reviewed the user's Websites For Fun directory: Paths to Peace (start view and still-motion choices), Timer (less motion), Miri’s Mix & Match (grouped controls remembered on the device), Workout (separate preference resets), and How to Help (local settings and reordering). Retained the books site's Paper Parade colors and uneven cover treatment.

See phone-reader-verification.json for checked behavior and browser limits.

Favorites have been removed across all devices. Ignore legacy favorites/start-view fields without losing reading progress, custom order, or reading preferences.

The shelf has no drag icons or Continue reading links. Ignore legacy showContinue preferences. Covers support mouse drag, touch hold-and-drag, and keyboard reordering.

Book view is saved in `miri-books-shelf-v1` as `view: "covers" | "list"`, defaulting to covers for older preferences. Settings offers Bookshelf and Compact list. The list shows small dimensional covers, titles, page counts, and creation month/year; the whole row opens or reorders the book. Mouse drag, touch hold-and-drag and keyboard arrows work in both views. Sorting and both resets preserve the chosen view; synchronize view changes across tabs. Use `shared/book-stack.svg` beside the site title instead of the flower, including on narrow phones.

Settings uses inline illustrated choice cards instead of select dropdowns: two Book view tiles, a 2×2 Book order grid, Auto/Show/Hide Bottom navigation choices, and two Page turns choices. Use labeled native radio inputs styled as cards (no visible radio circles), semantic fieldset legends, checked highlights/checkmarks, and neutral visible keyboard focus. Preserve standard radio arrow-key interaction, immediate local saving, cross-tab synchronization, existing resets and all preference keys. Keep the close button sticky and targets at least 44px tall. The grouped layout and quiet selected treatment draw from Paths to Peace’s settings panel.

## Bottom navigation and touch fullscreen

Settings includes illustrated Auto / Show / Hide choices for Bottom navigation, saved as `navigation` in `miri-books-shelf-v1`. Auto is the default for missing/invalid legacy values: hide bottom arrows, counter and page links at widths up to 1100px or where any coarse touch pointer is available; show on larger fine-pointer desktops. Show explicitly restores arrows and page links even on phones. Hide suppresses them on every size. Printed page numbers inside story pages remain visible in every mode. Side taps, swipes, keyboard arrows and screen-reader page announcements remain available. Apply changes immediately across books and tabs, recompute Auto on screen/input changes, and reset navigation to Auto with Reset reading settings while preserving order, view and progress. When hidden, place Share inside the reader footer in normal mode; hide that footer in fullscreen to reclaim space. On coarse-pointer devices, reserve at least 84px at the reader header’s left edge in fullscreen for the browser’s native close control; keep Bookshelf reachable. Reserve left space for the fullscreen shelf brand on tablets too. Do not claim physical Safari/native-X testing from Chrome emulation.
