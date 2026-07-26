---
section: testing
stack: default
version: 20
target: CLAUDE.md
order: 70
---
## Testing & Verification

- **Every feature, fix, or change ships with an automated test that proves it works.** Verification is the agent's job end-to-end, never the user's. If something can't be tested automatically, restructure so it can where reasonable — otherwise record why in the roadmap row.
- **A change is done only when an automated test drives the user workflow on the real surface and passes** — the real component, endpoint, or entry point, at the tier that fits the change (`docs/tests.md`); not necessarily E2E. Type-check green, "no console errors", "the page loads", or "the unit tests pass" are **not** verification by themselves.
- **A new test must be seen to fail.** Write it before the change, or verify it fails with the change reverted — a test that has never failed proves nothing.
- **A failing test is never left silently.** Caused by your change → fix it before claiming done. Pre-existing and unrelated → file it as a bug and flag it. A flaky test is a real bug — fix, never blanket-retry. No `skip` without a referenced roadmap entry.
- **Don't take a subagent's word for it:** before any done or merge claim, run the automated verification yourself.
- **When you fix a bug**, read `docs/process/bugs.md` **before writing the test** and follow the regression-test procedure (reproduce → fail for the right reason → fix → pass → roadmap row lifecycle).
- **When you choose a test layer or write component / structural / simulation tests**, load the matching skill: `frontend-tests`, `structural-tests`, `testing-by-simulation`.
- Commands, test inventory, isolation, design-for-testability, and fixture conventions: `docs/tests.md`.
