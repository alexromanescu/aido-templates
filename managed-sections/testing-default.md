---
section: testing
stack: default
version: 15
target: CLAUDE.md
order: 70
---
## Testing & Verification

### Principle

**Every feature, every fix, every change ships with an automated test that proves it works** — no exceptions, however small. Verification is the agent's job end-to-end, never the user's: a feature whose only check is "a human clicks around and looks" is incomplete. If something can't be tested automatically, the design is wrong — restructure until it can. Aim for guarantees, not coverage metrics: every risk area reachable by a test, every failure mode exercised by one.

### Design for testability

Upstream of writing tests: shape the code so a test can drive the user workflow end-to-end with no human in the loop. Before a feature ships, confirm:

- Inputs are constructable in-process (no manual clicks, no human-only state).
- Outputs are observable from code (return value, persisted row, emitted event, rendered DOM).
- The user surface is reachable by a script (E2E driver, API client, simulator).

If any answer is "no," redesign first. Common fixes: inject ports for clock / fs / network / randomness; expose state via API, not only rendered UI; split a side-effecting workflow into a pure decision + a thin effect call; add debug hooks tests can drive.

### Fixing a bug

Bugs live in `docs/roadmap.md` → `## Bugs` as `BUG-NNN: <title>` (the aido UI prefills the next `NNN`).

1. Reproduce and trace the real root cause first — don't test against a guess.
2. Write `tests/bugs/bug-NNN-<slug>.test.ts` reproducing the user-visible symptom, not the patch's code path. Its header docstring is the bug's permanent record (symptom / root cause / fix).
3. Run it — confirm it fails **for the documented root cause**, not a typo/import/fixture error. If the failure doesn't match the report, stop and investigate before patching.
4. Fix the bug.
5. Run it — confirm it passes, then run the full suite for regressions.
6. Delete the `## Bugs` row in the same commit that lands the fix.

Assert on observable behavior at the natural level of abstraction, not the patch's internal shape (spying on a specific call breaks on refactor; pin to what the caller sees).

### Choosing the right test layer

- **Unit / integration:** a function or service in isolation. Default for pure logic.
- **Simulation:** drives the real subject with deterministic event ordering — concurrency, races, merges, dual-authority lifecycles. Use the `testing-by-simulation` skill.
- **Component render test** (in-process DOM, e.g. Testing Library + jsdom): one UI component mounted in isolation — rendering, effects, interaction, error/empty/loading. Fast tier; mandatory for any interactive frontend. Use the `frontend-tests` skill.
- **End-to-end** (browser / device / CLI): the real user surface. Reserve for DOM/focus/visual/routing and one smoke test per major journey.
- **Structural** (regex / AST over source): architectural invariants no behavioral test can prove. Use the `structural-tests` skill.

### Test discipline

- **No `skip`** without strong motivation and a referenced roadmap entry; CI fails on bare skips.
- **A flaky test is a real bug** — fix it; never blanket-retry.
- **Delete tests that stopped earning their keep** — removed features, untriggerable assertions, duplicate coverage.
- **A failing test is never left silently.** If your change caused it, fix it before claiming done. If it's pre-existing and unrelated, record it (`## Bugs`) and flag it — but don't expand the current task to chase it.

Fixture & mock conventions live in `docs/tests.md`.

### Verification

**A change is done only when an automated test drives the user workflow end-to-end and passes** — the agent runs the workflow, not the user. Type-check passing, "no console errors", "the page loads", or "the unit tests pass" are **not** verification. Run the workflow test on the real surface (Playwright/CLI driver/simulator), check adjacent features for regressions, then declare done.

**Subagent gate:** automated verification runs after all subagent tasks pass and before any merge claim. Subagents can't run persistent dev servers — the dispatching parent does. Give implementation subagents specific test scenarios, not "verify it works".

### Reference

See `docs/tests.md` for the test inventory, commands, and conventions.
