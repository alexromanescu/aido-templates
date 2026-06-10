---
section: process-help-sync
stack: default
version: 1
target: docs/process/help-sync.md
order: 10
---
# Help-Sync Checklist

For projects with an in-app help system: **a user-facing feature is not complete until its help reflects it** — missing or stale help is a regression. Run this checklist before declaring any user-facing change complete; update the help content in the same commit as the change.

## Checklist

- **Form fields?** Update contextual help (info text, placeholders, learn-more).
- **Empty list or collection?** Update empty-state content.
- **New user workflow?** Consider a tour chapter or step.
- **New UI elements / events your tour system needs?** Wire the hooks/events your system requires.
- **Page/route renamed or removed?** Update the route references everywhere they appear (tours, deep-links, breadcrumbs, copy).
- **Field semantics changed?** Update info text, placeholders, learn-more.

## Reference

See `docs/help.md` for the project's help architecture, content schemas, and tone guidelines.
