---
section: seeding
stack: default
version: 1
target: CLAUDE.md
---
## Seeding

If the project has a seed script or dummy-data generator, it must stay synchronized with the schema.

### Principle

**When you add a new entity, table, relationship, or user-facing workflow, update the seed script in the same commit.** The seed must always represent the current schema end-to-end, so a fresh `seed → app start → use the app` cycle exercises every feature.

### Rules

- **Idempotent.** Safe to re-run without duplicating data.
- **Use service-layer APIs, not direct DB inserts.** This proves the app is fully operable without the GUI and catches broken service methods.
- **Seed failure is a blocker.** If the seed fails to run cleanly, that's a bug — fix it before merging.
- **Include realistic fixtures.** Representative data for every scenario. Empty lists and empty tables hide real bugs.

### Reference

See `docs/seeding.md` for the project's seed commands, data scenarios, and reset procedure.
