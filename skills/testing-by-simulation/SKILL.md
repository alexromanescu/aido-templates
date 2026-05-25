---
name: testing-by-simulation
description: Use when writing or extending an automated test for state-transition bugs, race conditions, concurrent algorithms (CRDTs, OT, three-way merges, block-level diffs, LCS), cache invalidation lifecycles, dual-authority lifecycle hooks, or any code where event ordering matters and end-to-end tests can't reliably control sub-second timing. Also use when graduating a bug fix to a permanent regression test and the underlying defect depends on event ordering or concurrent mutation. Drives the real subject in-process with a controlled clock; asserts at every transition rather than only at the end.
---

# Testing by simulation

A pattern for testing state-transition bugs, race conditions, and
concurrent algorithms where end-to-end tests are structurally
inadequate.

## When to use simulation

Default to **simulation** when the code under test is:

- A state machine or reducer with discrete transitions
- A merge algorithm (three-way merge, block-level diff, LCS, CRDT, OT)
- A cache invalidation / snapshot lifecycle
- Code where two systems write to the same state (server + client,
  two users, two reducers, two caches)
- A race condition — by definition, the bug depends on ordering, and
  e2e tests can't reliably control ordering at sub-second resolution
- A lifecycle hook that interacts with shared state

Reach for **e2e** only for:

- DOM / browser concerns: focus, contenteditable, drag-and-drop, CSS,
  keyboard chords, accessibility, visual regression
- Routing and history API
- Cross-browser smoke tests
- One "seam test" per major user journey

Aim for ~90% simulation, ~10% e2e on state-shaped surfaces.

## Pattern

1. **Construct the real subject in-process.** Real reducer, real
   queue, real CRDT doc. No mocks of the thing being tested.
2. **Drive events in your chosen order.** No `setTimeout`, no `await
   delay()`. Use a controlled clock or explicit step calls.
3. **Advance time deterministically.** A test clock you call
   `clock.advance(50)` on. No reliance on wall-clock.
4. **Assert at every step.** After each event, verify state. Catch
   the bug at the exact transition that introduces it.

## Anti-patterns

- **Mocking the subject.** If you mock the reducer, you're testing
  the mock, not the reducer.
- **Real timers in simulation tests.** `setTimeout(0)` is enough to
  introduce non-determinism. Use a fake clock.
- **One mega-test.** Each interleaving deserves its own `it()`. Many
  small tests > one long sequence.
- **Asserting at the end only.** Assert at every transition. The
  intermediate state is where the bug usually lives.

## Canonical pattern (skeleton)

```ts
import { describe, it, expect } from "vitest";
import { TestClock } from "...";
import { realSubjectUnderTest } from "...";

describe("Subject under deterministic interleaving", () => {
  it("when A happens before B, state is X", () => {
    const clock = new TestClock();
    const subject = realSubjectUnderTest({ clock });

    subject.handleEventA();
    clock.advance(50);
    subject.handleEventB();

    expect(subject.state).toEqual({ /* ... */ });
  });

  it("when B happens before A, state is Y", () => {
    // Same setup, different order. The race that broke production.
    const clock = new TestClock();
    const subject = realSubjectUnderTest({ clock });

    subject.handleEventB();
    clock.advance(50);
    subject.handleEventA();

    expect(subject.state).toEqual({ /* ... */ });
  });
});
```

## When to graduate from a fix to a simulation

Apply this checklist when a bug fix lands. Two or more = simulation
deserved:

- The bug depends on event ordering ("if A before B, fine; B
  before A, broken").
- The bug involves concurrent mutations to shared state.
- The bug only reproduces sometimes (timing-flaky in e2e).
- Two systems write the same state.
- The fix relies on a subtle invariant you'd want to pin
  permanently.
- You can construct the subject in-process without DB / network
  / browser.
