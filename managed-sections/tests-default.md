---
section: tests
stack: default
version: 7
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

When a new testing pattern appears repeatedly (property-based, snapshot-replay, contract), promote it to a skill (`~/.claude/skills/<topic>/SKILL.md`, or via aido's skill management when available). The skill description should follow the "Use when ..." form so it activates on the right trigger. Reference the new skill from the Test tiers table above.

Canonical pattern skills (project-independent, auto-activated by description):

- `testing-by-simulation` — when to choose simulation over E2E.
- `structural-tests` — when to add a regex/AST-over-source test.
- `frontend-tests` — when and how to render-test UI components.
