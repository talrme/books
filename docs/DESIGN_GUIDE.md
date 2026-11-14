# Reader and library design guide

## Scope

A calm reading experience, with interesting motion around the book rather than activities inside it. Keep the three stories independent of the ten site treatments. One reader engine drives all ten, with different visual framing.

## Layout

Landscape: one illustration on the left and its text on the right. Portrait: the same illustration above the text. These are two parts of **one story page**, not two separate story pages. Fit the reader within dynamic viewport height; preserve the current page through rotation. Use contain for illustrations so the original composition is visible. Allow shelves and the gallery to scroll naturally. Do not lock orientation.

Test 320×568, 390×844, 844×390, 768×1024, 834×1194, 1024×768, 1194×834, and 1440×1000. Include the cover and ending; text must not overlap the printed page number or controls. Check longer titles and longest page text.

## Motion

- Swimming: gentle blurred fade out, expanding circle reveal in.
- Avi: slight paper rotation and vertical drift.
- Blue bike: directional perspective rotation.
- Opening: a short lift into the reader. Ending: a brief one-shot burst around the cover, then stillness.
- No looping animations while reading, no auto turns, no sound.
- Respect `prefers-reduced-motion`; animations should become instant and decorative ending bursts hidden.

## Navigation and accessibility

Arrow buttons, pointer/touch swipes, keyboard left/right arrows, Escape to shelf, page indicators, deep links and browser back. A cover, eight story pages, and an ending. The reader is the focused region when opened; hidden library controls must not remain in the tab order. Previous is disabled on the cover; next is disabled at the end. After closing, focus returns to a usable library opener. Use meaningful alt text per illustration. Keep navigation and favorite controls large enough for fingers. Indicators are supplementary smaller targets with an equivalent accessible arrow control.

## Browser state

`miri-books-v1`: `{ favorites: [bookId], progress: { [bookId]: pageIndex } }`. Cover = -1; story = 0 to N-1; ending = N. Only resume an in-progress story; completed books reopen at the cover. Browser storage is optional: blocked/corrupt data must not break the app. The ten staging routes share this key on the same origin. `miri-design-shortlist` holds shortlisted concept IDs separately. No backend or device sync.

## Hosting

Plain HTML/CSS/JavaScript, locally bundled images, no build process. Publish the site root to GitHub Pages. Never hardcode `/shared/` or `/assets/`, because a project Pages site uses a repository prefix. Preserve `.nojekyll`. Every numbered folder is a full working design route, sharing sibling assets; keep the tree together.

## Verification checklist

- All ten library routes render; all images load.
- Every book can be read from cover through ending; previous, replay, and shelf return work.
- Favorite toggle, empty favorites, filter, reload persistence, and sharing state across variants work.
- Reading position persists on reload and when returning from the shelf; resizing keeps the page.
- Touch/pointer swipes and keyboard arrows change pages once.
- Page links and browser back do not leave hidden/duplicate readers.
- No horizontal overflow on phone or iPad. Reader text remains inside its panel.
- Reduced-motion path is instant. Normal animations finish and rapid taps/close do not corrupt state.
- Gallery filters, shortlist persistence, and story-draft review page work.

The initial automated browser run uses installed headless Chrome, including touch-emulated iPad/phone viewports. Physical iPad Safari testing remains a final device check after hosting.
