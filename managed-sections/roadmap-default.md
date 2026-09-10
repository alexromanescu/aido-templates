---
section: roadmap
stack: default
version: 21
target: CLAUDE.md
order: 30
---
## Shared Work Tracking

- `docs/roadmap.md` is the durable backlog and completion record. Read `docs/process/roadmap.md` before editing it; the app parses its format.
- `docs/active-work.md`, when present, records the current focus and next action. Read it at session start and refresh it when advancing that work, following its guidance block. The assignment determines scope; the cursor does not authorize unrelated work.
- **Keep documentation true in the same commit**, in-app help and seed data included: correct whatever your change makes inaccurate or incomplete (new behavior, requirements, limitations) in the docs the project has, following `docs/help.md` or `docs/seeding.md` when present. Regenerate `<!-- generated:NAME -->` regions with their documented command; never hand-edit them. Create a new doc only when durable instructions have no existing home.
