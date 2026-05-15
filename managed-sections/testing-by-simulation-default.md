---
section: testing-by-simulation
stack: default
version: 1
target: docs/testing/testing-by-simulation.md
---
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

Aim for ~90% simulation, ~10% e2e on state-shaped surfaces. (This is
eligibility guidance for state-shaped code, not a project-wide KPI.
Pure request → response code with no ordering concern stays on
unit/integration.)

## Why simulations beat e2e for race conditions

End-to-end tests can't deterministically control async event order.
Real timers, real networks, real WebSocket handshakes — different in
headless, different in CI, different on the user's machine. A bug that
manifests when "the server responds too slowly" passes locally, passes
in CI, fails for the user.

Simulations **construct the exact interleaving** that triggers the
bug and assert on the result.

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
