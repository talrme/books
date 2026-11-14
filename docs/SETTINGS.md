# Settings

The bookshelf header has a visible Settings button at every screen size. The grouped native dialog saves preferences in this browser.

| Setting | Default | Behavior |
|---|---|---|
| Book order | Newest first | Also offers oldest first, title A–Z and custom; dragging selects custom |
| Continue reading links | Shown | Hide shelf resume links while keeping reading progress stored |
| Page turns | Gentle | Instant removes page opening/turn animations; device reduced motion always wins |

Reset order affects only the arrangement. Reset reading settings affects continue-link visibility and page motion. Saved reading positions survive both resets.

Preferences extend `miri-books-shelf-v1`; reading progress remains in its separate existing key. Old preferences receive defaults for missing fields.

## Design references

Reviewed the user's Websites For Fun directory: Paths to Peace (start view and still-motion choices), Timer (less motion), Miri’s Mix & Match (grouped controls remembered on the device), Workout (separate preference resets), and How to Help (local settings and reordering). Retained the books site's Paper Parade colors and uneven cover treatment.

See phone-reader-verification.json for checked behavior and browser limits.

Favorites have been removed across all devices. Ignore legacy favorites/start-view fields without losing reading progress, custom order, or reading preferences.
