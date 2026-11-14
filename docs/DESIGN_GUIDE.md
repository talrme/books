# Paper Parade design and reader guide

## Selected direction

Paper Parade is the only site design. Use a compact header with the bookshelf name and Settings. Let the book covers occupy the shelf. Default to creation date newest first, breaking ties by later-added books first, while honoring browser-local sort preferences. Preserve each book’s frame color when sorting. Keep the playful uneven borders and slight rotations, with embossed-looking hinges, page blocks, and shadows that make the books feel dimensional. Do not restore marketing headings, subtitles, duplicate card titles, the ten-design gallery, or other themes.

## Reader

Use nearly the entire browser viewport. Portrait stacks a single illustration above its text; landscape places them side by side. These are two parts of one story page. Keep the illustration uncropped with `object-fit: contain`. Adapt dynamically to rotation without changing the current page. Do not require orientation lock.

A book opens to a large front cover, with no additional “Open the book” button. A cover click always opens the cover. There are no resume links or drag icons. Advance from the cover using the right side, arrow, keyboard, or swipe.

The final screen is a dimensional back cover with the same uneven border, embossed hinge, and page-edge shadows as the front cover. Show a large “The End,” a small reused cover illustration, and two actions with playful illustrated icons: Read Again and Bookshelf. Add a tiny “Created Month Year” note beneath the image. No blurb or recommendations.

Show a printed page number on every story page and a current-page counter. Cover/back cover have labels rather than story numbers. Place F before page 1 and B after the final page, linking to the front and back covers, with meaningful accessible labels and current-page states. Numbered navigation is optional on narrow screens; arrow buttons remain at least 44 pixels. Cover previous and back-cover next are disabled.

## Navigation and motion

Tap/click anywhere on the left or right half of the reading area for previous/next. Ignore interactive child controls and deliberate text selections. Pointer/touch swipes, keyboard arrows, Escape, page buttons, deep links, and browser back must work. A swipe followed by a synthetic click must turn only one page.

Keep the reading surface stationary. On portrait phones up to 600 px wide, turn a full-width leaf from the left edge for next or right edge for previous, revealing the decoded destination underneath. On other layouts, turn only a half-width sheet around the book’s center: right to left for next, left to right for previous, in 240 ms. Clip the overlay to the book bounds, without perspective enlargement or travel beyond its edges. Covers use a gentle 160 ms opacity change in place. Navigation updates immediately; cancel the previous animation on every new turn rather than blocking input. Rapid repeated keyboard arrows must advance by the number of presses, up to the boundary. Cancel motion on close/open and respect `prefers-reduced-motion` with instant transitions. No automatic turns, looping animations, or surprise sound.

## State and paths

`miri-books-v1` contains `{ progress: { [bookId]: pageIndex } }`. Cover is -1, story pages are 0..N-1, back cover is N. Opening the front cover does not erase prior progress. Preserve other books' positions when making structural revisions. Handle corrupt/blocked storage.

The root URL is the bookshelf. The previous Paper Parade route redirects to it while preserving hash parameters. Assets are relative to the root. Use an asset revision query when replacing art so returning readers receive the update. Keep the raw family reference photo outside the public repository.

## Verification

Check 320×568, 390×844, 844×390, 768×1024, 834×1194, 1024×768, 1194×834, and 1440×1000. Test all books from cover through back cover at every size. Check long titles, all printed numbers, text not overlapping controls/numbers, image loading, horizontal overflow, back-cover content fitting short displays, and actions remaining usable.

Verify reload, cover opening, orientation changes, side taps, touch swipe without double turns, keyboard arrows, direct page navigation, replay, return to shelf, cover navigation, and browser back. Check normal and reduced motion, including rapid keyboard presses and taps and closing mid-animation. Confirm all story words match their editorial plans.

Headless Chrome with touch emulation provides automated coverage. A physical iPad/Safari check remains a device-specific follow-up. Publish only after relevant checks pass and verify the live root and books before reporting deployment.

## Site-wide fullscreen

Fullscreen targets the document root and is available from the bookshelf, reader, and Settings wherever supported (including standard/WebKit paths). It persists through opening/finishing books, replay, returning to the bookshelf, choosing another book, Settings and internal home navigation. Never leave fullscreen automatically on book close or end. Only explicit exit or the browser's own fullscreen exit ends it. Keep an accessible X Exit fullscreen control visible (a quiet 44-pixel icon button on phones): fixed at the bookshelf’s top right even while scrolling, in the reader header during turns, and in the native Settings dialog header. Exit preserves the current view/book/page. Escape exits fullscreen before it can close a book. Unsupported browsers omit all fullscreen controls; denied requests recover gracefully. Do not automatically request fullscreen on reload, since browsers require user action.

## Bookshelf order and settings

Default to newest first; offer oldest first, title A–Z, and custom order in a compact Settings dialog. Save these preferences in `miri-books-shelf-v1` as `{mode, order: [bookId], motion, view}`, separate from reading progress. Drag any cover with a mouse. On touch, hold the cover for 350 ms before dragging; a quick swipe scrolls normally and a tap opens the book. Arrow keys on a focused cover reorder accessibly. Do not add drag icons or handles. Moving a book switches to custom order; switching automatic modes preserves the custom arrangement. Reset order clears only the saved arrangement and returns to newest first. Custom order filters unknown/duplicate IDs and places newly added books before the retained arrangement. Cancel with Escape; canceled drags never save. Suppress the post-drag click so dragging never opens a book. Support edge auto-scroll, denied/corrupt storage, cross-tab preferences, and reduced motion. Story review remains in its published newest-first order.

## Reading preferences

Keep the Settings button visibly labeled on phone, iPad, and desktop. Group shelf controls and reading controls in one accessible dialog with a sticky heading/close button and scrollable content on short screens. Every cover opens on the front cover. Do not add Continue reading links or a preference for them. Page motion defaults to system-aware gentle turns, with an instant option. Always let OS reduced motion override animations. Reset order preserves reading preferences; Reset reading settings restores motion while preserving custom order and progress. New fields default safely for older saved preferences and synchronize across tabs.

## Page-turn continuity

Keep the old page visible while the destination illustration decodes. On portrait phones, the entire old leaf turns away and reveals the destination without a stationary half. On other layouts during a forward turn, hold the old left half steady while the old right half folds left; reverse this for previous. The back face uses the destination half and must match the real destination exactly at landing. Remove the stationary and turning overlays together without tint/opacity changes or a second content swap. Never lock navigation while decoding or animating: canceled/deferred transitions must not reappear after a later turn, resize, close, or motion preference change. Verify start/end frames in both directions, cold/slow images, rapid turns, and instant/reduced-motion reading.

Favorites have been removed across all devices. Ignore legacy favorites/start-view fields without losing reading progress, custom order, or reading preferences.

The shelf has no drag icons or Continue reading links. Ignore legacy showContinue preferences. Covers support mouse drag, touch hold-and-drag, and keyboard reordering.

Book view is saved in `miri-books-shelf-v1` as `view: "covers" | "list"`, defaulting to covers for older preferences. Settings offers Bookshelf and Compact list. The list shows small dimensional covers, titles, page counts, and creation month/year; the whole row opens or reorders the book. Mouse drag, touch hold-and-drag and keyboard arrows work in both views. Sorting and both resets preserve the chosen view; synchronize view changes across tabs. Use `shared/book-stack.svg` beside the site title instead of the flower, including on narrow phones.

## Sharing

Keep a subtle connected-dots Share control at the bottom right in normal browsing/reading, hidden throughout site fullscreen. Use the icon style from Workout's Save / Share button. From the shelf share the clean root URL; from any cover, story page, or back cover share `#book=<id>` without page number or browser-local settings so recipients start at that book's front cover. Provide an accessible native dialog with a readonly link, Copy link, and native Share where available. Preserve view/page on close, keep modal keyboard events from navigating the underlying reader, handle canceled native sharing quietly, and retain selectable-link fallback for denied clipboard access. Keep sharing separate from page-turn overlays and reserve footer space so it cannot cover navigation.
