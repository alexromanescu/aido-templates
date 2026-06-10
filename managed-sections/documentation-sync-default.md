---
section: documentation-sync
stack: default
version: 10
target: CLAUDE.md
order: 30
---
## Documentation Sync

**When you change code that a document describes, update the document in the same commit.** Stale docs are worse than no docs — they actively mislead.

- **Before committing**, check your change against the standard-docs table in `docs/process/doc-sync.md` (architecture, frontend, api-reference, tests, seeding, help, devops, deploy, roadmap) and update every doc the change affects.
- **Generated doc sections** (`<!-- generated:NAME -->` sentinels) are exempt from manual sync: when their parity test fails, run the printed `gen:<name>` command instead of editing by hand.
