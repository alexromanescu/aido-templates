---
section: tests
stack: default
version: 12
target: docs/tests.md
order: 10
---
## Test tiers

Standard tiers and what each is for. The project's actual runners, commands, CI gates, and isolation setup are documented **below this managed block**, in the project-owned part of this doc — never inside it.

- **Unit** — pure logic and narrow contracts; seconds, runs on every change.
- **Integration** — real composition across internal boundaries (DB / storage / external-facing seams).
- **Simulation** — deterministic state/event ordering against the real subject, in-process with a controlled clock (concurrency, state machines, merge logic).
- **Render / component** — visible UI behavior through a stable render boundary; fast tier, every UI change.
- **E2E** — the smallest browser/runtime seam for behavior lower layers can't faithfully prove; milestone + release gates, CI smoke (one happy path per major journey).
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

## Test documentation

`docs/tests.md` is the entry point — commands, layer selection, isolation, conventions — kept concise. Deep material lives under `docs/testing/` (one file per topic), linked from here. Large inventories are generated (`gen:test-inventory` + parity test per `docs/process/doc-sync.md`), never hand-maintained.
