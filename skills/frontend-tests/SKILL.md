---
name: frontend-tests
description: Use when adding or modifying a UI component (a render test must ship in the same change), backfilling render tests for an existing frontend, standing up a render-test harness where there is none, or deciding between a render test, a pure unit test, and an end-to-end test. Covers when to reach for each layer, harness requirements (in-process DOM such as jsdom/happy-dom plus a render/interaction library like Testing Library — framework-agnostic), the two-tier run convention (fast vs full), and the risk-prioritised backfill strategy.
---

# Frontend render tests

**If this project has an interactive frontend, every UI component
ships a render test.** A render test mounts the real component in an
in-process DOM, drives it the way a user would, and asserts what the
user would see — rendering, effects, lifecycle, interaction, and the
error / empty / loading states. It is the only automated check that
exercises a real component's render path without a browser.

A render test fills the missing middle layer between a pure-logic
unit test (a framework-free function, no DOM) and an end-to-end test
(a whole user journey in a real browser). An in-process DOM test runs
in milliseconds, so it belongs in the fast tier and comprehensive
coverage stays cheap. If this project has no interactive frontend,
this skill is inert — there is nothing to render-test.

## When to reach for one

Reach for a **render test** when the subject is one component and the
risk is in how it renders: effects firing and cleaning up,
conditional branches (`error` / `empty` / `loading` / populated),
event handlers, prop-driven output, focus and ARIA state.

Reach for something else when:

- **The logic is framework-free.** Extract it to a pure function and
  unit-test it directly. A render test written only to reach buried
  logic is testing the wrong layer — pull the logic out.
- **The concern spans a whole journey,** several routes, or real
  browser behavior (true layout, navigation history, cross-tab) —
  that is an **end-to-end** test. Keep E2E to one smoke test per
  major journey; don't spend slow E2E on what a render test covers
  in-process.
- **The concern is a state machine or interleaving** — use the
  `testing-by-simulation` skill.

## Harness requirements

A render-test harness is two parts: an **in-process DOM environment**
and a **render/interaction library** for the project's UI framework.
Both are the project's choice — jsdom or happy-dom for the DOM;
Testing Library (its React / Vue / Svelte / Angular bindings) or the
framework's own test utilities for render and interaction. Pick what
fits the stack; the discipline below is framework-agnostic.

**Hard constraint — the harness must not slow or re-environment the
project's existing fast suite.** A DOM environment is heavier than a
plain Node test, so making it global would tax every pure-logic test.
Scope it instead:

- Per-file opt-in — an environment pragma / docblock at the top of
  each render-test file; or
- A separate test-runner project / config that owns the DOM
  environment and globs only the render tests.

Either way, pure unit tests keep running in a plain environment at
their current speed. Which of the two to use is a per-project call
against the test runner.

## The two-tier run convention

Render tests join the **fast tier** — run on every change alongside
unit, integration, simulation, and structural tests, all in-process,
all seconds or less. The **full tier** adds end-to-end tests and runs
at milestones and before release. A render test that is deliberately
slow (heavy fixture, large component tree) is the exception: move it
to the full tier rather than letting it erode the fast tier's budget.

## Keeping up

The project rule — every feature, every fix ships a test — applies
unchanged to the frontend. A new or changed component ships its
render test in the same commit. A UI bug ships a render test that
reproduces the user-visible symptom, fails, then passes once fixed. A
UI change with no render test is incomplete, the same as any other
untested change.

## Backfilling an existing project

Standing the harness up where there is none: add it scoped as above,
then backfill render tests for the components that already exist.

- **Comprehensive is the target** — every component — when that
  coverage stays inside the fast tier's runtime budget. Fast DOM
  tests are cheap, so it usually does.
- **Risk-prioritised when it would not.** Cover the components with
  effects, subscriptions / sockets, timers, or complex state first —
  that is where render bugs hide — then work down to the simple
  presentational ones.
- A render suite genuinely too slow for the fast tier moves to the
  full tier as a deliberately-slow subset; it is never dropped.
  Dropping coverage to save time is the one outcome this guidance
  forbids.
