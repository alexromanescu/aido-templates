---
section: seeding
stack: default
version: 2
target: CLAUDE.md
order: 60
---
## Seeding

If the project has a seed script: **when you add or change an entity, table, relationship, or user-facing workflow, update the seed in the same commit** — a fresh `seed → start → use the app` cycle must exercise every feature, and a seed failure is a blocker, not a warning.

**Before touching the seed**, read `docs/seeding.md` — commands, data scenarios, reset procedure, and the standing rules (idempotent re-runs, service-layer APIs only — never direct DB inserts, realistic fixtures for every scenario).
