---
section: testing
stack: node
version: 4
target: CLAUDE.md
---
## Testing & Verification

### Principle

Ensure guarantees, not coverage metrics. Every risk area must be reachable by automated tests. Every failure mode must have an exercising test. Coverage numbers that don't prove a behavior don't count.

- **design for testability**; ensure the code is written so every risk area is reachable by automated tests, then writing tests that exercise every failure mode; have a code writing strategy so that everything is testable without (or with absolute minimum) human intervention
- pay extreme attention to designing good tests; ensure they capture everything; if not, redesign them until you are certain they capture everything autonomously

### After fixing a bug

1. Write a test that reproduces the user-visible symptom — not the code path of the patch
2. Run it — confirm it fails
3. Fix the bug
4. Run it — confirm it passes

The reproduction test must assert on observable behavior at the natural level of abstraction for the bug, not on the patch's internal shape. A test that spies on a specific function call (`expect(internalHelper).toHaveBeenCalled()`) breaks when the fix is refactored, even when behavior is preserved. Pin the test to the input/output the user or caller sees: the rejected promise, the emitted event, the persisted row, the rendered string.

"Natural level of abstraction" means: if the bug lives in a regex, test the regex; if it lives in a workflow, test the workflow. The rule isn't "always test through the UI" — it's "test what's observable about the unit under test, not how it's implemented inside it." Implementation-detail asserts (`expect(spy).toHaveBeenCalledWith(...)`, internal call sequences, private-method invocations) survive only as long as the implementation does.

No exceptions. Do not ask the user to test. You test.

### Choosing the right test layer

- **Unit / integration**: behavior of a function or service in isolation. Default for pure logic — Vitest in this stack.
- **Simulation**: drives the real subject (state machine, queue, reducer, CRDT) with deterministic event ordering. Use when ordering or concurrent mutation determines correctness — concurrency bugs, races, merge algorithms, dual-authority lifecycle hooks. If simulation applies, you write a simulation test. Vitest with a fake clock works well here. See `docs/testing/testing-by-simulation.md` (when present).
- **End-to-end** (browser): the actual user surface — Playwright in this stack. Reserve for DOM/focus/visual/routing concerns and one smoke test per major user journey.
- **Structural** (regex / AST over source): enforce architectural invariants no behavioral test can prove ("every X must Y"). See `docs/testing/structural-tests.md` (when present).

### Test discipline

- **No `skip` without a roadmap entry referenced in the comment.** Skipped tests rot. CI should fail on bare skips.
- **No `as any` in fixture or mock construction.** Type fixtures against the live schema; type mocks via the real interface (`Pick<RealType, "method">` or equivalent). Schema changes must surface as type errors, not silent fixture drift.
- **A flaky test is a real bug.** Track and fix; never blanket-retry. The intermittent failure IS the bug.
- **Run only what's relevant.** Iterating on a feature shouldn't trigger the full suite. Per-edit feedback should be seconds.

**Tests have a cost. Delete tests that have stopped earning their keep.**

- If a test no longer corresponds to a documented requirement or a real failure mode, delete it.
- If a test couldn't fail (no plausible mutation of the code under test breaks it), delete it.
- If a feature has been removed, find and delete its tests in the same change.
- If two tests cover the same path and the stronger one is downstream, delete the weaker.
- Test maintenance is part of feature work, not a "we'll do a sweep later" item.

### Verification

**A feature is not done until you have performed the actual user workflow end-to-end in a real browser and confirmed it works.**

These are NOT verification:

- `tsc --noEmit` passes
- "No console errors"
- "The page loads"
- "The unit tests pass"

Verification means: **do what the user would do, every step of the chain.** Start the app (`npm run dev` or the project's equivalent), open it in a real browser (use Playwright MCP if available), perform the workflow, check regressions on features touching the same files, then declare the feature complete.

### Running tests

- Unit/integration: `npm run test` (or the project's Vitest/Jest command)
- E2E: `npx playwright test` (or the project's E2E command)
- **Run only what's relevant.** Iterating on a dialog doesn't need backend integration tests. Refactoring a service doesn't need Playwright.

### Subagent verification gate

When using subagent-driven development, browser verification comes **AFTER** all subagent tasks pass and **BEFORE** any merge or completion claim. Subagents cannot run persistent dev servers — the controller handles verification. When dispatching implementation subagents, give them **specific user-workflow test steps** (e.g., "click Edit, type 'TEST', wait for draft-saved indicator, navigate away, return, verify recovery banner"), not "verify it works".

### Reference

See `docs/tests.md` for the test inventory, running commands, and project-specific testing conventions.
