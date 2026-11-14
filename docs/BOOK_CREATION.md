# Creating and revising a book together

The five questions start a conversation. They are followed by a numbered story plan, editable words and illustration ideas, a visual preview, and a finished book. The parent can enter or return to any stage using ordinary language. Do not restart the questionnaire for a revision.

## 1. The five questions

Ask these together when the user says “I want a new book.” Accept short answers and reuse anything already given.

1. **Who is it for?** Age, language, and any change from our default: English, read aloud together, age four.
2. **What happens?** Main idea, characters, places, and any real details or exact phrases to include.
3. **How should it feel?** Funny, comforting, adventurous, sleepy, or another mood; anything to avoid.
4. **How should it look?** Watercolor, paper collage, gouache/pencil, or another illustration style. Reuse the family's established appearance and any available photo reference; ask about appearance only when something is missing or the user wants a change.
5. **How should the book move?** Use the selected dimensional page flip by default; ask whether the user wants a quieter treatment or another specific effect. These affect only opening, page turns, and the ending. The current reader implements `flip` with an instant reduced-motion path; do not promise another effect is implemented until it is.

Use defaults for omitted optional choices: eight story pages plus front and back covers, English, age four, and a warm, reassuring tone. Eight pages is a starting suggestion, not a fixed limit. Include a recommended length and the reason in the next deliverable instead of adding a sixth mandatory question. If the user says to choose or go ahead, use reasonable defaults without another confirmation. No games or in-story interactions.

## 2. Show a numbered story plan

The first creative deliverable is a complete, readable storyboard. Recommend a page count and explain the pacing in one sentence. Offer a shorter or longer option when that would help. Use the book-plan template in `templates/BOOK_PLAN.md` and save the working plan at `docs/books/<book-id>/PLAN.md` so later chats can continue it.

Show the front and back covers separately. Number story pages **1 through N**, matching the printed numbers in the reader. For every page include:

- The exact draft words, usually 20–40 words and one clear moment per page.
- A short illustration description: who is present, what they are doing, the setting, and essential visual details.
- A stable scene ID and the image status: proposed, existing, needs revision, or ready.

Recommend where an important moment belongs: for example, “Put the first successful float on page 6, after bubbles and kicking.” Explain where a page turn creates anticipation or where a crowded page would benefit from splitting. Honor page placements the parent explicitly requests and adapt the rest of the sequence around them.

When the user is planning or reviewing, present this plan and invite edits before generating the full set of illustrations. “Generate it,” “looks good, make the pictures,” or an earlier instruction to complete the book authorizes moving on. Do not ask for the same decision again. A request to create the entire book autonomously can include the plan and completed work together.

## 3. Revise the words and pacing

Accept feedback by page number, a quoted phrase, a scene description, or an overall direction. Examples:

- “Make page 3 less scary.”
- “Give the Spaceship two pages.”
- “Put the dance party on page 5.”
- “Split page 4 into two quieter moments.”
- “Combine pages 2 and 3.”
- “Make the whole book shorter and funnier.”

Translate suggestions into a concrete updated plan. Revise the full text when necessary to make the story read naturally; do not merely append notes. For a targeted edit, show the revised page and any neighboring transition that changed. For structural changes, show the new numbered sequence and a compact old-to-new page mapping.

Keep stable scene IDs when scenes move, even though printed page numbers change. In a batch of feedback, interpret all page numbers against the version the user reviewed, then renumber once. Do not let an early insertion accidentally redirect a later edit to the wrong scene. Ask one focused question only when the intended page or scene is genuinely ambiguous.

Keep a short revision log in the plan: what changed, which scenes were affected, and whether an image now needs updating. Reuse all unaffected work.

## 4. Establish the visual direction

Read `STORY_GUIDE.md` for character details, family facts, and tone. Define recurring clothing, palette, framing, and style. Use the supplied family photo as a private visual reference when available. Keep the raw photo out of the public repository and published assets. If the reference is unavailable in a later chat, use the written character notes; request the photo again only when an image task needs it.

For a new or uncertain style, start with a representative illustration or cover and show it alongside its proposed text. When a previous instruction already authorizes full illustration generation, proceed without introducing a new approval step. Use the established visual direction as the reference for the remaining pages.

Preserve character identity across scenes and art styles. Save the exact prompts and reference roles alongside the book. Never silently substitute unrelated stock art or claim an unavailable image tool worked. Prefer individual high-resolution illustrations for final books; the initial prototypes use extracted atlas panels.

## 5. Build a reading preview

Generate the remaining illustrations and assemble the book. Provide a numbered overview of text and images plus a reader preview so the parent can check both details and the rhythm of page turns. A preview is a concrete rendered result, not just a promise to build it.

Track the current stage in the plan: story planning, text revision, visual direction, illustration generation, reading preview, or published. Keep drafts local while the user is still reviewing. The current site has no private draft channel: changing `shared/books.js` and pushing `main` changes the public library through Pages. Only publish a content revision when the user's current or standing instructions cover that publication. For a requested end-to-end update with publication already authorized, finish the preview/checks and publish without asking again.

## 6. Make targeted illustration or page revisions

Typical requests and how to handle them:

| Request | What to do |
|---|---|
| “Keep page 4's words, but change the picture.” | Preserve the exact words; revise that illustration and its alt text. |
| “Make Miri look more like the photo.” | Apply the family reference to the requested scene; if it is a book-wide request, update all affected scenes for consistency. |
| “Use the first version of this picture.” | Restore the selected version from the retained local revision or Git history. |
| “Move this page earlier.” | Move the complete text/image scene together, renumber, and check neighboring transitions. |
| “Add a scene after page 5.” | Give it a new stable scene ID, draft text and image direction, then renumber the following pages. |
| “The ending feels rushed.” | Propose a revised final sequence and page count, then apply the chosen direction. |

Show the revised image or scene beside its text. Keep unaffected words, images, and style intact. Retain the previous image in local revision storage or Git history until the replacement has been reviewed; only the selected image belongs in the final published asset set. Do not force a new story outline or full image regeneration for a one-page correction.

## 7. Check and publish

Check the current plan against the actual reader: scene order, printed page numbers, text/image pairing, spelling, cover, ending, and image descriptions. Then run the checks appropriate to the change in `DESIGN_GUIDE.md`. Publish within the user's requested scope and verify the deployed book URL. Report the changed pages and the live link, or clearly identify a remaining dependency.

## Implementation notes

- Add or update the object in `shared/books.js` with a unique stable book slug. Fields: `id`, `title`, `short`, `category`, `color`, `ink`, `accent`, `style`, `motion`, `description`, `created`, `pages`. Each page contains `text` and `alt`.
- Keep stable scene IDs in the working plan and map them to the current reader page numbers and asset filenames. The current reader uses array order; it does not yet use scene IDs at runtime.
- Save `shared/assets/<book-id>-0.webp` for the cover and `<book-id>-1.webp` through `<book-id>-N.webp` for story pages. For a reorder, remap the image files together with the text; stage files in temporary storage first to avoid overwriting another scene's image.
- Human page 1 is array index 0 and deep-link `page=0`; the cover uses `page=-1` and the ending uses `page=N`. Always use human page numbers in conversation.
- The shelf and `stories.html` enumerate shared book data automatically. Add `description` (back-cover blurb) and `created` (YYYY-MM, actual creation month) for each new book. The back cover shuffles up to two other saved books; it never generates new stories at runtime. The design comparison gallery has been removed. Maintain the old Paper Parade route as a redirect to the root.
- After changing page count/order, check page indicators, direct links, ending, and saved progress. The current reader stores an array index, so an old saved position may point at a different scene after a reorder. For structural revisions, preserve the scene position with a migration or deliberately reset the affected book's progress without clearing favorites or other books.
- Update the working plan and `STORY_GUIDE.md` in the same change as the book. The plan is the editorial record; the published text is in `shared/books.js`. Check that their words and scene order agree before publishing.

## Start anywhere

“I want a new book” starts the five questions. “Let's work on the swimming book” starts with its current numbered pages. “Change the picture on page 6” starts with that specific scene. “Just suggest changes” produces suggestions without modifying the published book. Follow the user's requested stage; do not make them repeat the whole workflow.
