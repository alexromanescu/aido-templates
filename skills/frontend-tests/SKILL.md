---
name: frontend-tests
description: Use when choosing or adding tests for interactive UI behavior, setting up a component-render harness, or explicitly backfilling frontend coverage. Use real browser tests for layout and other browser-specific behavior.
---

# Frontend Tests

Exercise changed interactive behavior through the nearest stable render boundary. Existing parent-level coverage counts when it directly drives and observes the changed child behavior. Add or extend tests where coverage is missing; do not add tests that only pin cosmetic wording or duplicate existing assertions.

## Choose the boundary

- **Render/component tests:** conditional rendering, events, effects, cleanup, focus intent, and accessible state. Mount the real component, drive user actions, and assert observable results. Mock dependencies rather than the component under test.
- **Unit tests:** framework-independent logic. Test it directly when a render boundary adds no relevant evidence.
- **Browser tests:** real layout, navigation, browser focus behavior, cross-tab interaction, and journeys requiring actual browser composition. Use the smallest scenario that proves the risk; do not impose a fixed maximum number of E2E tests.
- **Simulation:** controlled event ordering or state transitions. Use `testing-by-simulation` when that is the source of risk; retain UI coverage if wiring is also changing.

## Harness setup

Use the project's framework and test runner. A DOM environment and render library should be scoped to component tests through per-file opt-in or a separate runner project. Do not put unrelated pure-logic tests in a heavier environment.

Test browser-specific behavior in a browser rather than assuming a simulated DOM proves it. Keep fixtures isolated from live data. Record the project's commands and required gates in its test docs.

## Existing projects

If a harness is needed for the assigned behavior, add the smallest suitable setup and cover that behavior. Broader backfilling requires an assignment that includes it; prioritize complex state, effects, subscriptions, and user-critical paths. Test runtime alone does not authorize expanding coverage to every component.

For a UI bug, demonstrate that its regression test fails for the reported symptom before the fix and passes afterwards. If verification exposes an unrelated coverage gap, record it without turning the current change into a frontend-wide campaign.
