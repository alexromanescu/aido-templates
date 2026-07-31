---
section: tests
stack: default
version: 11
target: docs/tests.md
order: 10
---
## Test tiers

Standard tiers and when each applies. The project's actual runners, commands, CI gates, and isolation setup are documented **below this managed block**, in the project-owned part of this doc — never inside it.

- **Unit** — every change, during development; seconds.
- **Integration** — when changing DB / storage / external-facing code.
- **Simulation** — when changing concurrency, state machines, or merge logic; in-process with a controlled clock.
- **Render / component** — every UI change (fast tier).
- **E2E** — at milestones and before release; CI carries an E2E smoke gate (one happy path per major journey).
- **Structural** — regex/AST invariant scans; cheap, runs with unit on every test run.

**Document the project's test isolation** in the project-owned part below (separate test DB, separate filesystem root, truncation in beforeEach, fresh-image-per-suite, …) — tests sharing state with dev produce silent corruption.

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

A hand-maintained inventory here is updated in the same commit that adds/removes/moves tests. Prefer the **generated inventory section** standard (`docs/process/doc-sync.md`): a `gen:test-inventory` script + parity test — then it's exempt from manual sync.
