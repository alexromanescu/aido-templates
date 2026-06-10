---
target: docs/tests.md
description: Project test inventory + structural section managed by aido.
variables: [name]
init: true
---
# {{name}} — Tests

This document is the project-specific entrypoint for testing. The
sections inside the managed block below — Test tiers, Running tests,
Test isolation, Design for testability, Fixture & mock conventions,
Maintaining the test inventory, Adding a new testing pattern — are
project-agnostic discipline managed by aido. Customize the **content**
within each section, but keep the **headings** so agents and
contributors can find each topic without searching.

The Test inventory section below the managed block is fully
project-specific.

<!-- managed:tests -->
<!-- /managed:tests -->

## Test inventory

<List the test files and what they cover, or — preferred at scale — adopt the
generated inventory section standard from docs/process/doc-sync.md: a
`gen:test-inventory` script emitting a sentinel-delimited table, guarded by a
parity test, exempt from manual sync.>
