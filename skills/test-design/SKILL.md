---
name: test-design
description: Use when choosing which layer a test belongs to, adding tests for interactive UI behavior, setting up a component-render harness, or writing a test for state transitions, race conditions, concurrent mutation, cache lifecycles, or any behavior where event ordering matters and end-to-end tests cannot control timing. Also use when graduating a bug fix into a permanent regression test. Not for prose-only changes or for structural source scans (use `structural-tests`).
---

# Test Design

Test the changed behavior at the lowest layer that faithfully proves it, through the nearest stable public boundary. Existing coverage counts when it directly drives and observes the changed behavior; extend it before adding a parallel test. Do not add tests that pin cosmetic wording or duplicate assertions.

## Choose the boundary

- **Unit:** framework-independent logic. Test it directly when a render or process boundary adds no evidence.
- **Integration:** real composition across storage, service, or external boundaries, when the risk is in the wiring rather than in one module.
- **Render / component:** conditional rendering, events, effects, cleanup, focus intent, accessible state. Mount the real component, drive user actions, assert observable results. Mock dependencies, not the component under test.
- **Simulation:** anything where ordering is the risk (see below). Keep UI coverage if wiring is also changing.
- **Browser (end-to-end):** real layout, navigation, browser focus, cross-tab interaction, and journeys that need actual browser composition. Use the smallest scenario that proves the risk; a simulated DOM does not prove browser-specific behavior.
- **Structural source scans** ("every X must also Y" invariants) are a separate discipline; see `structural-tests` where installed.

## Render harness

Use the project's framework and runner. Scope the DOM environment and render library to component tests through per-file opt-in or a separate runner project so pure-logic tests stay light. Keep fixtures isolated from live data. Record commands and required gates in the project's test docs. If the assigned behavior needs a harness that does not exist, add the smallest suitable setup and cover that behavior; broader backfilling needs an assignment that includes it.

## Simulation for ordering-dependent behavior

Default to an in-process simulation when the subject is a state machine or reducer, a merge or diff algorithm (three-way merge, CRDT, OT, LCS), a cache or snapshot lifecycle, two writers sharing state, a race condition, or a lifecycle hook touching shared state.

1. **Construct the real subject in-process.** Real reducer, real queue, real document. Never mock the thing under test.
2. **Drive events in your chosen order** with explicit calls. No `setTimeout`, no `await delay()`.
3. **Advance time deterministically** with an injected test clock (`clock.advance(50)`); never rely on wall-clock.
4. **Assert after every step.** The bug usually lives in an intermediate state.

Give each interleaving its own test case; many small cases beat one long sequence. Put ordering combinations in the simulation matrix and keep end-to-end to the few scenarios that prove concrete runtime risk.

```ts
it("when B happens before A, state is Y", () => {
  const clock = new TestClock();
  const subject = realSubjectUnderTest({ clock });
  subject.handleEventB();
  clock.advance(50);
  subject.handleEventA();
  expect(subject.state).toEqual({ /* ... */ });
});
```

Translate the pattern to the project's language and runner. When a bug fix lands and two or more of these hold, the fix deserves a simulation test: the bug depends on event ordering; it involves concurrent mutation of shared state; it reproduces only sometimes; two systems write the same state; the fix relies on an invariant worth pinning; the subject can be built in-process without database, network, or browser.

## Regression tests

Two checks beyond the project's regression rule: the pre-fix failure must come from the defect, not from an import, fixture, or syntax error; and if the only reachable boundary is too shallow to reproduce the real pattern, say so rather than writing a test that passes by construction. If verification exposes an unrelated coverage gap, record it without turning the change into a test-wide campaign.
