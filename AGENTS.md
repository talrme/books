# Miri’s Little World — project instructions

This is a family storybook library for a four-year-old. Read `README.md` and the relevant file in `docs/` before changing content or behavior.

## When the user asks for a new book

Follow `docs/BOOK_CREATION.md`. Ask the five agreed questions together, reusing details already provided. Do not ask questions whose answers are already in the request. Wait for the answers to genuinely missing creative choices before generating the new book. Ordinary requested edits to existing stories do not require repeating the questionnaire.

Default to a numbered storyboard with exact draft words, an illustration idea per page, and a recommended page count. Follow the user’s requested stage: story planning, text revision, visual direction, illustration generation, reading preview, or publication. Keep a working plan and revision log under `docs/books/<book-id>/PLAN.md` using `docs/templates/BOOK_PLAN.md`. A request for full autonomous creation can authorize moving through these stages without repeated confirmations.

For revisions, accept page numbers, quoted text, scene descriptions, and overall suggestions. Preserve stable scene IDs in the plan as pages move. Interpret a batch of page-number feedback against the version the user reviewed, then renumber once and show the mapping. Update text and images together when moving a scene. Regenerate only affected illustrations. Preserve the previous version in local revisions or Git history. A request for suggestions alone does not authorize changing the published book.

## Product rules

- Reading, opening a book, turning pages, finishing, returning to the shelf, and favorites are the only child-facing interactions.
- No games, puzzles, hotspots, branching choices, collectible rewards, auto-advancing pages, or surprise sounds.
- Use the written family appearance notes and the supplied photo when available for future illustrations. Do not commit or publish the raw family reference photo. The initial published pictures predate that reference.
- Preserve exact family names: Miri, Avi, Mama, Abba, Ayla, Asher. Abba means her dad; Rainbow Baby is Miri’s affectionate name for Avi. Do not infer a pregnancy-loss history.
- Optimize for iPad while supporting portrait/landscape phones and desktop. Show one story page at a time, never squeeze two story pages onto a phone. Never require orientation lock.
- Keep the site static and GitHub Pages compatible. No runtime AI requests, API keys, accounts, external fonts, analytics, or new dependencies without a concrete user need.
- Treat the ten numbered folders as design experiments. Maintain shared content and reader behavior until the user chooses a design. Do not silently remove the gallery or other experiments.
- Keep favorites and reading progress in the versioned browser-storage key already used by the app. Protect against denied storage and corrupt values.
- Honor reduced motion, keyboard navigation, meaningful image descriptions, and visible focus. Keep essential controls at least 44 CSS pixels.
- Follow the user’s existing authorization for publishing. If a repository is connected and deployment is requested, finish the book and relevant checks, then publish within that scope. Do not invent a new approval ceremony.

## Verification

For a story change, confirm each image matches its page and all names are spelled correctly. For reader/layout changes, check every story at phone portrait and landscape and iPad portrait and landscape. Validate favorites persistence, resume, next/previous, ending, replay, and return to shelf when changing those features. Read `docs/DESIGN_GUIDE.md` for the full checklist. Do not claim a live URL until it is deployed and verified.
