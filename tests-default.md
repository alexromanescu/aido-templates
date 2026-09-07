---
target: docs/tests.md
description: Project test entry point + managed discipline block.
variables: [name]
init: true
---
# {{name}} — Tests

This document is the project's test entry point — kept concise. The managed
block below carries project-agnostic discipline (tier semantics, design for
testability, fixture conventions) and is synced by aido — never edit inside
its markers. Everything below the block is project-owned: fill in the real
runners, commands, CI gates, isolation setup, and links to deeper test docs
there.

<!-- managed:tests -->
<!-- /managed:tests -->

## Runners & commands

| Tier | Runner |
|------|--------|
| <tier used by this project> | <runner> |

```
<command for required checks>
<command for focused tests>
```

Prerequisites: `<test DB created/migrated, docker compose up, etc.>`

CI gates that block merge: `<actual project gates; include only configured checks>`.

## Test isolation

`<How tests avoid clobbering dev data: separate test DB, separate filesystem root, truncation in beforeEach, fresh-image-per-suite, etc.>`

## Test documentation

| Topic | Where |
|---|---|
| Layer selection & discipline | managed block above + matching skill |
| <deep-dive topic, e.g. frontend harness> | `docs/testing/<topic>.md` |
| Inventory (at scale) | `docs/testing/inventory.md`, generated: `gen:test-inventory` + parity test (`docs/process/doc-sync.md`) |
