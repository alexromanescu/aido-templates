---
section: testing
stack: default
version: 13
target: CLAUDE.md
order: 70
---
## Testing & Verification

### Principle

**Every feature, every fix, every change ships with an automated test that proves it works.** No exceptions, no matter how small the feature. If a feature can't be tested automatically, the design is wrong — restructure until it can. The user is not the verifier; verification is the agent's job, end-to-end, in code.

Ensure guarantees, not coverage metrics. Every risk area must be reachable by automated tests; every failure mode must have an exercising test.

### Design for testability

This is upstream of writing tests. The code must be shaped so an automated test can drive the user workflow end-to-end with no human in the loop. Before any feature ships, check:

- Inputs are constructable in-process (no manual clicks, no human-only state).
- Outputs are observable from code (return value, persisted row, emitted event, rendered DOM).
- The user surface is reachable by a script (E2E driver, API client, simulator).

If any answer is "no," redesign before implementing. Common fixes: inject ports for clock / fs / network / randomness; expose state via API, not only via rendered UI; split side-effecting workflows into a pure decision + a thin effect call; add debug hooks tests can use to force specific paths.

**A feature whose only verification is "the human clicks around and looks" is incomplete.**

### For fixing a bug

Bugs tracked in `docs/roadmap.md` → `## Bugs` use the `BUG-NNN: <title>` convention (the aido UI prefills the next free `NNN`).

1. Reproduce and trace the root cause first. Don't write the test against a guessed cause — find the actual one (read the code, add traces, run the failing path) so the test pins the real defect.
2. Write a test at `tests/bugs/bug-NNN-<slug>.test.ts` that reproduces the user-visible symptom — not the code path of the patch. The test file's header docstring is the bug's permanent record (symptom / root cause / fix).
3. Run it — confirm it fails **for the documented root cause**, not for a typo, missing import, wrong fixture, or unrelated error. If the failure mode doesn't match the report, stop and investigate before patching — you're about to fix the wrong thing.
4. Fix the bug.
5. Run it — confirm it passes, and run the full suite to confirm no regression.
6. Delete the row from `## Bugs` in the same commit that lands the fix.

Assert on observable behavior at the natural level of abstraction, not on the patch's internal shape. A test that spies on a specific function call (`expect(internalHelper).toHaveBeenCalled()`) breaks when the fix is refactored. Pin to what the caller sees: rejected promise, emitted event, persisted row, rendered string.

**Never ask the user to test. You test.** If you can't, the design is wrong — fix the design first.

### Choosing the right test layer

- **Unit / integration:** behavior of a function or service in isolation. Default for pure logic.
- **Simulation:** drives the real subject with deterministic event ordering. Use for concurrency bugs, races, merge algorithms, dual-authority lifecycle hooks. See `docs/testing/testing-by-simulation.md` (when present).
- **Component render test** (in-process DOM — e.g. Testing Library + jsdom): one UI component mounted in isolation — its rendering, effects, lifecycle, interaction, and error/empty/loading states. Fast; runs in the fast tier. Mandatory for any project with an interactive frontend. See `docs/testing/frontend-tests.md` (when present).
- **End-to-end** (browser / device / CLI): the actual user surface. Reserve for DOM/focus/visual/routing concerns and one smoke test per major journey — don't spend slow E2E on what a render test covers in-process.
- **Structural** (regex / AST over source): enforce architectural invariants no behavioral test can prove. See `docs/testing/structural-tests.md` (when present).

### Test discipline

- **No `skip` without strong motivation and a roadmap entry referenced in the comment.** CI should fail on bare skips.
- **A flaky test is a real bug.** Track and fix; never blanket-retry.
- **Delete tests that stopped earning their keep** — removed features, untriggerable assertions, duplicate coverage. Test deletion is part of feature work.
- **Non related test fails due to pre-existing conditions** still need to be investigated; tests must always be clean regardless on who's done what. When you see a problem, you pick it up and slove it.
Fixture & mock conventions live in `docs/tests.md`.

### Verification

**A feature is not done until an automated test drives the user workflow end-to-end and passes.** The agent runs the workflow, not the user.

NOT verification: type-check passes, "no console errors", "the page loads", "the unit tests pass".

Verification: run the automated workflow test on the real user surface (browser via Playwright/equivalent, CLI driver, simulator), check regressions on adjacent features, then declare done.

### Subagent verification gate

Subagent-driven development: automated verification runs **after** all subagent tasks pass and **before** any merge claim. Subagents can't run persistent dev servers — the parent (dispatching) agent does. Give implementation subagents specific automated-test scenarios, not "verify it works".

### Reference

See `docs/tests.md` for the test inventory, commands, and project conventions.
