---
target: docs/tests.md
description: Project test inventory + structural section managed by aido.
variables: [name]
init: true
---
# {{name}} — Tests

This document is the project-specific entrypoint for testing. The managed
block below carries project-agnostic discipline (tier semantics, design for
testability, fixture conventions) and is synced by aido — never edit inside
its markers. Everything below the block is project-owned: fill in the real
runners, commands, CI gates, isolation setup, and inventory there.

<!-- managed:tests -->
<!-- /managed:tests -->

## Runners & commands

| Tier | Runner |
|------|--------|
| Unit | <runner> |
| Integration | <runner> |
| Simulation | <runner> |
| Render / component | <runner> |
| E2E | <runner> |
| Structural | <runner> |
| CI gates | <CI> |

```
<command for all tests>                # full suite
<command for one package>              # filter to a package
<command for one file>                 # filter to a file
<command for E2E>                      # E2E suite
```

Prerequisites: `<test DB created/migrated, docker compose up, etc.>`

CI gates that block merge: typecheck, lint, unit + integration + simulation + structural, E2E smoke, `<project-specific gates>`.

## Test isolation

`<How tests avoid clobbering dev data: separate test DB, separate filesystem root, truncation in beforeEach, fresh-image-per-suite, etc.>`

## Test inventory

<List the test files and what they cover, or — preferred at scale — adopt the
generated inventory section standard from docs/process/doc-sync.md: a
`gen:test-inventory` script emitting a sentinel-delimited table, guarded by a
parity test, exempt from manual sync.>
