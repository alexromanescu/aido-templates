---
section: tests
stack: default
version: 8
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

When deciding which tier a test belongs in — or writing component, structural, or simulation tests — load the matching skill: `frontend-tests`, `structural-tests`, `testing-by-simulation`.

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

## Design for testability

Upstream of writing tests: shape the code so a test can drive the user workflow end-to-end with no human in the loop. Before a feature ships, confirm:

- Inputs are constructable in-process (no manual clicks, no human-only state).
- Outputs are observable from code (return value, persisted row, emitted event, rendered DOM).
- The user surface is reachable by a script (E2E driver, API client, simulator).

If any answer is "no," redesign first. Common fixes: inject ports for clock / fs / network / randomness; expose state via API, not only rendered UI; split a side-effecting workflow into a pure decision + a thin effect call; add debug hooks tests can drive.

## Fixture & mock conventions

- Fixtures are typed against the live schema. No `as any` in fixture construction.
- Mocks are typed via the real interface (`Pick<RealType, "method">` or equivalent).
- Builder functions over inline objects for repeated fixture shapes.
- No conditional skip logic (`if (process.env.X) it.skip`) — hides silently. Use explicit feature flags.
- Assert on observable behavior at the natural level of abstraction, not the patch's internal shape — spying on a specific call breaks on refactor; pin to what the caller sees.
- Delete tests that stopped earning their keep — removed features, untriggerable assertions, duplicate coverage.

## Maintaining the test inventory

If this doc carries a hand-maintained test inventory, update it in the same commit that adds/removes/moves tests. Hand-maintained inventories decay at scale — prefer the **generated inventory section** standard (`docs/process/doc-sync.md` → Generated inventory sections): a `gen:test-inventory` script emitting a sentinel-delimited table, guarded by a parity test. Once generated, the inventory is exempt from manual sync.

## Adding a new testing pattern

When a new testing pattern appears repeatedly (property-based, snapshot-replay, contract), promote it to a skill (`~/.claude/skills/<topic>/SKILL.md`, or via aido's skill management when available). The skill description should follow the "Use when ..." form so it activates on the right trigger. Reference the new skill from the Test tiers table above.

Canonical pattern skills (project-independent, auto-activated by description):

- `testing-by-simulation` — when to choose simulation over E2E.
- `structural-tests` — when to add a regex/AST-over-source test.
- `frontend-tests` — when and how to render-test UI components.
