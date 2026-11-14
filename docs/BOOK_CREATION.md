# New-book workflow

## The five questions

Ask these together when the user says “I want a new book.” Accept short answers and reuse anything already given.

1. **Who is it for?** Age, language, and any change from our default: English, read aloud together, age four.
2. **What happens?** Main idea, characters, places, and any real details or exact phrases to include.
3. **How should it feel?** Funny, comforting, adventurous, sleepy, or another mood; anything to avoid.
4. **How should it look?** Watercolor, paper collage, gouache/pencil, or another illustration style. Ask for appearance details only if the user wants something specific; never imply an invented illustration is a faithful portrait.
5. **How should the book move?** Choose a watery ripple, paper flutter, classic page turn, or a quiet fade. These affect only opening, page turns, and the ending.

Use defaults for omitted optional choices: eight story pages plus cover and ending, English, age four, a warm and reassuring tone. If the user explicitly says to choose or go ahead, use those defaults without another confirmation. No games or in-story interactions.

## Create

1. Read `STORY_GUIDE.md` for family facts and tone. Draft the complete page text, usually 20–40 words per page and one clear moment per page. Preserve explicit user story details.
2. Define the characters, recurring clothes, visual style, and palette. Use a consistent character reference when generating separate illustrations. Keep all image prompts with the book.
3. Generate the cover and one illustration per story page using an available image tool. Never silently substitute unrelated stock art or claim an unavailable tool worked. Prefer individual high-resolution images for final books; the initial prototypes use extracted atlas panels.
4. Add a new object to `shared/books.js`, using a unique stable slug. Fields: `id`, `title`, `short`, `category`, `color`, `ink`, `accent`, `style`, `motion`, `end`, `endSub`, `pages`. Each page contains `text` and `alt`.
5. Save optimized local images to `shared/assets/<id>-0.webp` for the cover and `<id>-1.webp` through `<id>-N.webp` for story pages. The reader derives image paths using this naming convention. Supported `motion` values: `ripple`, `flutter`, and `turn`; add an accessible fade only if requested.
6. The shelf and story-review page enumerate the shared data automatically. The comparison gallery’s three quick links refer to the original three books; leave those intact or update them if the user asks.
7. Check text/image pairing, names, counts, and no missing assets. Run appropriate reader checks. Update `STORY_GUIDE.md` with the new book and retain the original drafts unless asked to replace them.
8. Provide a preview and publish according to the user’s instructions and existing repository setup. Report the verified URL, or clearly identify the remaining deployment dependency.

## Existing-book edits

Ask only about ambiguities that affect the requested change. Reuse the existing style and family details. Keep image references stable when editing text. Regenerate only illustrations that need changing, retaining the original assets until the revision is checked.
