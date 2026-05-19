---
section: help
stack: default
version: 3
target: CLAUDE.md
order: 50
---
## Help System Sync

If the project has an in-app help system (contextual help, empty states, guided tours), every user-facing change must update the help content in the same commit. **A user-facing feature is not complete until its help reflects it** — missing or stale help is a regression.

### Checklist

Before declaring a feature complete:

- **Form fields?** Update contextual help (info text, placeholders, learn-more).
- **Empty list or collection?** Update empty-state content.
- **New user workflow?** Consider a tour chapter or step.
- **New UI elements / events your tour system needs?** Wire the hooks/events your system requires.
- **Page/route renamed or removed?** Update the route references everywhere they appear (tours, deep-links, breadcrumbs, copy).
- **Field semantics changed?** Update info text, placeholders, learn-more.

### Reference

See `docs/help.md` for the project's help architecture, content schemas, and tone guidelines.
