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
- **Keep documentation true in the same commit.** Correct any doc your change makes inaccurate or incomplete, including new behavior, requirements, and limitations, across the docs the project has (architecture, API, tests, seeding, help, devops, deploy). Regenerate `<!-- generated:NAME -->` regions with their documented command; never hand-edit them. Create a new doc only when durable instructions have no existing home.
- **In-app help and seed data count as documentation.** When changed behavior or schema makes them inaccurate, update them in the same commit, following `docs/help.md` or `docs/seeding.md` when present.
