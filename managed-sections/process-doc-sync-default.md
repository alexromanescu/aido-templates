---
section: process-doc-sync
stack: default
version: 6
target: docs/process/doc-sync.md
order: 10
---
# Documentation-Sync Process

Before committing, keep affected documentation accurate and complete for the behavior it covers. Document new capabilities, changed requirements, and limitations even when no existing sentence becomes false. An internal refactor needs no prose edit if the documented behavior, structure, and operating instructions remain unchanged.

## Find affected docs

| File | Check for changes or omissions in... |
|---|---|
| `docs/architecture.md` | System structure, boundaries, or data flow |
| `docs/frontend.md` | UI structure, routing, or shared patterns |
| `docs/api-reference.md` | API contracts, data shapes, auth, or errors |
| `docs/tests.md` | Test commands, required gates, isolation, or strategy |
| `docs/seeding.md` | Seed commands or required data scenarios |
| `docs/help.md` | Help content conventions or infrastructure |
| `docs/devops.md` | Development setup, infrastructure, or operations |
| `docs/deploy.md` | Deployment procedure or checks |
| `docs/roadmap.md` | Work status; follow `docs/process/roadmap.md` |

Use relevant existing project docs and subsystem entry points. Create a document only when the change needs durable instructions and no existing doc is a suitable home; a missing file in this table alone is not a reason to create it.

## Generated inventories

Generator-owned regions use these sentinels:

```
<!-- generated:NAME -->
...generator output...
<!-- /generated:NAME -->
```

Regenerate affected regions with the documented command rather than editing them by hand. Include a committed parity check in the project's required verification so drift fails the check and reports the regeneration command. Merely printing a warning does not satisfy this requirement.

Use generated inventories when a repeated list can be derived reliably from code and manual maintenance is causing drift. A `gen:<name>` package script is the Node convention; other stacks use their own command system. Do not build a generator solely because a project reaches an arbitrary module count.

## Current subsystem knowledge

For sustained subsystem work, use its existing entry-point doc to explain supported behavior, boundaries, important interactions, and code locations. Keep current facts there and decisions/history in the program log or roadmap. Create a dedicated map only when existing docs cannot provide a clear entry point.

## Routes and organization

Keep project-specific activity routes in an existing documentation index or, when root-guidance edits are explicitly authorized, its project-owned routing table. Shared managed sections already route common activities; do not repeat them.

For example:

| When you... | Read first | Update when done |
|---|---|---|
| Change export formats | `docs/exports.md` | Export contract and supported formats |

Keep entry-point docs concise. Group detailed material under a topic directory, such as `docs/testing/` linked from `docs/tests.md`. Process docs live under `docs/process/`.
