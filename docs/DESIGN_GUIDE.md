# Paper Parade design and reader guide

## Selected direction

Paper Parade is the only site design. Use a compact header with the bookshelf name and all/favorites tabs. Let the book covers occupy the shelf. Default to creation date newest first, breaking ties by later-added books first, while honoring browser-local sort preferences. Preserve each book’s frame color when sorting. Keep the playful uneven borders and slight rotations, with embossed-looking hinges, page blocks, and shadows that make the books feel dimensional. Do not restore marketing headings, subtitles, duplicate card titles, the ten-design gallery, or other themes.

## Reader

Use nearly the entire browser viewport. Portrait stacks a single illustration above its text; landscape places them side by side. These are two parts of one story page. Keep the illustration uncropped with `object-fit: contain`. Adapt dynamically to rotation without changing the current page. Do not require orientation lock.

A book opens to a large front cover, with no additional “Open the book” button. A cover click always opens the cover; the shelf's separate continue link can resume an unfinished book. Advance from the cover using the right side, arrow, keyboard, or swipe.

The final screen is a dimensional back cover with the same uneven border, embossed hinge, and page-edge shadows as the front cover. Show a large “The End,” a small reused cover illustration, and two actions with playful illustrated icons: Read Again and Bookshelf. Add a tiny “Created Month Year” note beneath the image. No blurb or recommendations.

Show a printed page number on every story page and a current-page counter. Cover/back cover have labels rather than story numbers. Place a C before page 1 to return to the front cover, with a meaningful accessible label and current-page state. Numbered navigation is optional on narrow screens; arrow buttons remain at least 44 pixels. Cover previous and back-cover next are disabled.

## Navigation and motion

Tap/click anywhere on the left or right half of the reading area for previous/next. Ignore interactive child controls and deliberate text selections. Pointer/touch swipes, keyboard arrows, Escape, page buttons, deep links, and browser back must work. A swipe followed by a synthetic click must turn only one page.

Keep the reading surface stationary. Turn only a half-width sheet around the book’s center: right to left for next, left to right for previous, in 240 ms. Clip the overlay to the book bounds, without perspective enlargement, whole-surface rotation, or travel beyond its edges. Covers use a gentle 160 ms opacity change in place. Navigation updates immediately; cancel the previous animation on every new turn rather than blocking input. Rapid repeated keyboard arrows must advance by the number of presses, up to the boundary. Cancel motion on close/open and respect `prefers-reduced-motion` with instant transitions. No automatic turns, looping animations, or surprise sound.

## State and paths

`miri-books-v1` contains `{ favorites: [bookId], progress: { [bookId]: pageIndex } }`. Cover is -1, story pages are 0..N-1, back cover is N. Opening the front cover does not erase prior progress. Continue links appear only for valid story positions, not completed books. Preserve favorites and other books' positions when making structural revisions. Handle corrupt/blocked storage.

The root URL is the bookshelf. The previous Paper Parade route redirects to it while preserving hash parameters. Assets are relative to the root. Use an asset revision query when replacing art so returning readers receive the update. Keep the raw family reference photo outside the public repository.

## Verification

Check 320×568, 390×844, 844×390, 768×1024, 834×1194, 1024×768, 1194×834, and 1440×1000. Test all books from cover through back cover at every size. Check long titles, all printed numbers, text not overlapping controls/numbers, image loading, horizontal overflow, back-cover content fitting short displays, and actions remaining usable.

Verify favorites/empty state/reload, separate cover and resume behavior, orientation changes, side taps, touch swipe without double turns, keyboard arrows, direct page navigation, replay, return to shelf, cover navigation, and browser back. Check normal and reduced motion, including rapid keyboard presses and taps and closing mid-animation. Confirm all story words match their editorial plans.

Headless Chrome with touch emulation provides automated coverage. A physical iPad/Safari check remains a device-specific follow-up. Publish only after relevant checks pass and verify the live root and books before reporting deployment.

## Fullscreen reading

Show a Fullscreen button in the reader only when the browser exposes usable standard or WebKit fullscreen support. No simulated fullscreen fallback is needed for unsupported phones. Enter only on an explicit click. Keep a large, labeled X Exit fullscreen control visible in the top-right header on every page and during turns. Exit preserves the current book/page. Escape exits fullscreen before it can close the book; returning to the bookshelf exits fullscreen. Listen for native fullscreen changes, honor safe areas, handle rejected requests gracefully, and preserve all existing reading controls. Test actual browser fullscreen, unsupported/denied paths, page turns, external exit, and layout on phone/iPad/desktop sizes.

## Bookshelf order and settings

Default to newest first; offer oldest first, title A–Z, and custom order in a compact Settings dialog. Save these preferences in `miri-books-shelf-v1` as `{mode, order: [bookId]}`, separate from favorites/progress. Mouse users may drag a cover or its grip; touch users drag the grip so ordinary cover scrolling stays native. Arrow keys on a focused grip reorder accessibly. Moving a book switches to custom order; switching automatic modes preserves the custom arrangement. Reset order clears only shelf preferences and returns to newest first. Custom order filters unknown/duplicate IDs and places newly added books before the retained arrangement. Reordering in Favorites moves those books within the full order and preserves hidden books’ relative order. Cancel with Escape; canceled drags never save. Suppress the post-drag click so dragging never opens a book. Support edge auto-scroll, denied/corrupt storage, cross-tab preferences, and reduced motion. Story review remains in its published newest-first order.
