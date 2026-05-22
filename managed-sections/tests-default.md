---
section: tests
stack: default
version: 6
target: docs/tests.md
order: 10
---
## Test tiers

| Tier | Runner | When to run | Duration |
|------|--------|-------------|----------|
| Unit | <runner> | During development, every change | Seconds |
| Integration | <runner> | When changing DB / storage / external code | Seconds–minutes |
| Simulation | <runner> | When changing concurrency / state machines / merge logic | Sub-second per test typical |
| Render / component | <runner> | Every change (fast tier) | Seconds |
| E2E | <runner> | At milestones, before release | Minutes |
| Structural | <runner> | Every test run (cheap; runs as part of unit) | Sub-second |
| CI gates | <CI> | Every PR + push | ~N min |

CI gates that block merge: typecheck, lint, unit + integration + simulation + structural, E2E smoke (one happy path per major journey), `<project-specific gates>`.

## Running tests

```
<command for all tests>                # full suite
<command for one package>              # filter to a package
<command for one file>                 # filter to a file
<command for E2E>                      # E2E suite
```

Prerequisites: `<test DB created/migrated, docker compose up, etc.>`

## Test isolation

`<How tests avoid clobbering dev data: separate test DB, separate filesystem root, truncation in beforeEach, fresh-image-per-suite, etc. Document it explicitly — tests sharing state with dev produce silent corruption.>`

## Fixture & mock conventions

- Fixtures are typed against the live schema. No `as any` in fixture construction.
- Mocks are typed via the real interface (`Pick<RealType, "method">` or equivalent).
- Builder functions over inline objects for repeated fixture shapes.
- No conditional skip logic (`if (process.env.X) it.skip`) — hides silently. Use explicit feature flags.

## Adding a new testing pattern

When a new testing pattern appears repeatedly (property-based, snapshot-replay, contract), promote it to its own doc:

1. Create `docs/testing/<topic>.md`.
2. Lead with: when to use, when not to use, the canonical pattern.
3. Reference at least one canonical example test file in this codebase.
4. Reference the new doc from the Test tiers table above.

If the pattern should be an agent default, propose the addition to the `testing-default` managed-section template in the `aido-templates` repository — local edits to the upstream-managed Testing section in CLAUDE.md drift on sync.

Canonical pattern docs (when scaffolded into this project):

- `docs/testing/testing-by-simulation.md` — when to choose simulation over E2E.
- `docs/testing/structural-tests.md` — when to add a regex/AST-over-source test.
- `docs/testing/frontend-tests.md` — when and how to render-test UI components.
