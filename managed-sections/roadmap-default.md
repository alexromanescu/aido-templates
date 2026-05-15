---
section: roadmap
stack: default
version: 4
target: CLAUDE.md
---
## Roadmap

The project roadmap lives at `docs/roadmap.md` using the standardized aidev table format. The format reference lives at the top of `docs/roadmap.md` itself — follow it when editing the file by hand.

### Rule

**Update task statuses in `docs/roadmap.md` whenever work completes, starts, or is reorganized.** Don't let the roadmap drift from reality — an out-of-date roadmap is worse than no roadmap because it misleads.

### Editing

Use the aidev app (`/project/:name/roadmap`) for rich editing, phase management, and task status changes — or edit `docs/roadmap.md` directly and aidev will pick up the changes from disk on its next read.

### Deferred work

All items that are deferred must be recorded in the roadmap; if one follows naturally, each session must close with the prompt to start the next one. If defered items are important for a complete and good quality feature, they must be added into that phase's roadmap items, not on a distant roadmap.

### Completed work

Projects can maintain a separate `docs/roadmap-completed.md` with deliverable-level detail of shipped work, keeping `docs/roadmap.md` focused on active and planned items. When a feature is completed, move its full details to `roadmap-completed.md` and leave a one-line summary in `roadmap.md`'s `## Completed Work` table.
