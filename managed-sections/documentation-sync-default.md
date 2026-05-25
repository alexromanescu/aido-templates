---
section: documentation-sync
stack: default
version: 9
target: CLAUDE.md
order: 30
---
## Documentation Sync

**When you change code that a document describes, update the document in the same commit.** Stale docs are worse than no docs — they actively mislead.

### Standard documents

aido-managed projects maintain a conventional set of docs under `docs/`. Update any that exist and that your change affects:

| File | Covers | Update when... |
|------|--------|----------------|
| `docs/architecture.md` | System structure, modules, data flow, adapters | Architectural or structural changes, new modules |
| `docs/frontend.md` | Components, routing, layouts, UI patterns, styling tokens | Any frontend structural change |
| `docs/api-reference.md` | Backend API, procedures, data shapes, auth, error codes | Any API, entity field, or auth change |
| `docs/tests.md` | Test inventory, running commands, testing conventions | Tests added/removed/changed, testing strategy changes |
| `docs/seeding.md` | Seed script, data scenarios, reset procedure | New entities, tables, or relationships |
| `docs/help.md` | Help system content and architecture | Help content or help infrastructure changes |
| `docs/devops.md` | Dev setup, topology, infrastructure, ops commands (human reference) | Setup changes, new ops commands, infra changes |
| `docs/deploy.md` | Claude-executable deploy procedure read by the an agent that can deploy the app on a pre-agreed pre-production area | Deploy steps change, new pre/post-deploy checks |
| `docs/roadmap.md` | What's built, what's planned, active phases | Any feature completed, started, or reorganized |

Missing files are skipped. Projects may add their own docs (e.g. `security.md`, `meta/reflections.md`, `product/prd.md`) in the non-managed area of CLAUDE.md (outside any `<!-- managed:* -->` block).

### Subdirectories

When a topic has multiple standalone deep-dive docs (topic-specific docs separate from the topic's entry-point doc), group them under `docs/<topic>/`; the entry-point stays at top level. (E.g., a hypothetical `docs/operations.md` entry-point with multiple `docs/operations/<runbook>.md` deep-dives below it.)
