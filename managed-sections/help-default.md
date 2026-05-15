---
section: help
stack: default
version: 1
target: CLAUDE.md
---
## Help System Sync

If the project has an in-app help system (contextual help, empty states, guided tours), every user-facing change must update the corresponding help content **in the same commit**.

### Checklist

Before declaring a feature complete, check:

1. **Does it have form fields?** → Update contextual help (field info text, smart placeholders, learn-more)
2. **Does it have a list or collection that can be empty?** → Update empty-state content
3. **Does it introduce a new user workflow?** → Consider a tour chapter or chapter step
4. **Does it add UI elements that tours reference?** → Add `data-help` attributes (or equivalent hooks)
5. **Does it emit events tours could wait for?** → Add event names to relevant chapter config
6. **Does it rename or remove a page/route?** → Update `page`/route references everywhere
7. **Does it change field semantics?** → Update info text, placeholders, and learn-more content

### Rule

**A user-facing feature is not complete until its help content reflects it.** Missing or stale help is a regression — users will trust it less than no help at all.

### Reference

See `docs/help.md` for the project's help architecture, content schemas, and tone guidelines.
