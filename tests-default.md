---
target: docs/tests.md
description: Project test inventory + structural section managed by aidev.
variables: [name]
init: true
---
# {{name}} — Tests

This document is the project-specific entrypoint for testing. The
sections inside the managed block below — Test tiers, Running tests,
Test isolation, Fixture & mock conventions, Adding a new testing
pattern — are project-agnostic discipline managed by aidev. Customize
the **content** within each section, but keep the **headings** so
agents and contributors can find each topic without searching.

The Test inventory section below the managed block is fully
project-specific.

<!-- managed:tests v=2 -->
## Test tiers

| Tier | Runner | When to run | Duration |
|------|--------|-------------|----------|
| Unit | <runner> | During development, every change | Seconds |
| Integration | <runner> | When changing DB / storage / external code | Seconds–minutes |
| Simulation | <runner> | When changing concurrency / state machines / merge logic | Fast (sub-second per test typical) |
| E2E | <runner> | At milestones, before release | Minutes |
| Structural | <runner> | Every test run (cheap; runs as part of unit) | Sub-second |
| CI gates | <CI> | Every PR + push | ~N min |

CI gates that block merge:

- Typecheck
- Lint
- Unit + Integration + Simulation + Structural suites
- E2E smoke (one happy path per major journey)
- `<project-specific gates>`

## Running tests

```
<command for all tests>                # full suite
<command for one package>              # filter to a package
<command for one file>                 # filter to a file
<command for E2E>                      # E2E suite
```

Prerequisites: `<test DB created/migrated, docker compose up, etc.>`

## Test isolation

`<How tests avoid clobbering dev data: separate test DB, separate
filesystem root, truncation in beforeEach, fresh-image-per-suite, etc.
This is critical — document it explicitly. Tests sharing state with
dev produce silent corruption.>`

## Fixture & mock conventions

- Fixtures are typed against the live schema. No `as any` in fixture
  construction. A schema change must produce a type error in fixture
  builders, not silent fixture drift.
- Mocks are typed via the real interface (`Pick<RealType, "method">`
  or equivalent). Adding a new method to the real type doesn't lie
  about what the mock supports.
- Builder functions over inline objects for repeated fixture shapes.
  One source of truth per entity.
- No conditional skip logic (`if (process.env.X) it.skip`) — those
  hide silently. Use explicit feature flags with assertions.

## Adding a new testing pattern

When you find yourself describing a new testing pattern multiple times
(e.g., property-based testing, snapshot-replay testing, contract
testing), promote the description to its own doc:

1. Create `docs/testing/<topic>.md`.
2. Lead with: when to use, when not to use, the canonical pattern.
3. Reference at least one canonical example test file in this codebase.
4. Reference the new doc from the Test tiers table above.
5. If the pattern is one agents must default to under specific
   conditions, surface it in CLAUDE.md Testing's "Choosing the right
   test layer" — but that section is upstream-managed by aidev. Local
   edits drift on Sync. The right path is to propose the addition to
   the upstream `testing-default` managed-section template; once it
   lands and a Sync runs, every project gets it.

Canonical pattern docs (referenced if scaffolded into this project):

- `docs/testing/testing-by-simulation.md` — when to choose simulation
  over E2E for state-transition / concurrency bugs.
- `docs/testing/structural-tests.md` — when to add a regex/AST-over-
  source test that enforces an "every X must Y" invariant.
<!-- /managed:tests -->

## Test inventory

<List the test files and what they cover. Update as tests are added/removed.>
