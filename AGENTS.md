# Miri’s Little World — project instructions

This is a family storybook library for a four-year-old. Read `README.md` and the relevant file in `docs/` before changing content or behavior.

## When the user asks for a new book

Follow `docs/BOOK_CREATION.md`. Ask the five agreed questions together, reusing details already provided. Do not ask questions whose answers are already in the request. Wait for the answers to genuinely missing creative choices before generating the new book. Ordinary requested edits to existing stories do not require repeating the questionnaire.

## Product rules

- Reading, opening a book, turning pages, finishing, returning to the shelf, and favorites are the only child-facing interactions.
- No games, puzzles, hotspots, branching choices, collectible rewards, auto-advancing pages, or surprise sounds.
- Preserve exact family names: Miri, Avi, Mama, Abba, Ayla, Asher. Abba means her dad; Rainbow Baby is Miri’s affectionate name for Avi. Do not infer a pregnancy-loss history.
- Optimize for iPad while supporting portrait/landscape phones and desktop. Show one story page at a time, never squeeze two story pages onto a phone. Never require orientation lock.
- Keep the site static and GitHub Pages compatible. No runtime AI requests, API keys, accounts, external fonts, analytics, or new dependencies without a concrete user need.
- Treat the ten numbered folders as design experiments. Maintain shared content and reader behavior until the user chooses a design. Do not silently remove the gallery or other experiments.
- Keep favorites and reading progress in the versioned browser-storage key already used by the app. Protect against denied storage and corrupt values.
- Honor reduced motion, keyboard navigation, meaningful image descriptions, and visible focus. Keep essential controls at least 44 CSS pixels.
- Follow the user’s existing authorization for publishing. If a repository is connected and deployment is requested, finish the book and relevant checks, then publish within that scope. Do not invent a new approval ceremony.

## Verification

For a story change, confirm each image matches its page and all names are spelled correctly. For reader/layout changes, check every story at phone portrait and landscape and iPad portrait and landscape. Validate favorites persistence, resume, next/previous, ending, replay, and return to shelf when changing those features. Read `docs/DESIGN_GUIDE.md` for the full checklist. Do not claim a live URL until it is deployed and verified.
