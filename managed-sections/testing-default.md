---
section: testing
stack: default
version: 16
target: CLAUDE.md
order: 70
---
## Testing & Verification

- **Every feature, fix, or change ships with an automated test that proves it works — no exceptions, however small.** Verification is the agent's job end-to-end, never the user's. If something can't be tested automatically, the design is wrong — restructure until it can.
- **A change is done only when an automated test drives the user workflow on the real surface and passes.** Type-check green, "no console errors", "the page loads", or "the unit tests pass" are **not** verification by themselves.
- **A failing test is never left silently.** Caused by your change → fix it before claiming done. Pre-existing and unrelated → file it as a bug and flag it. A flaky test is a real bug — fix, never blanket-retry. No `skip` without a referenced roadmap entry.
- **Subagent gate:** run the automated verification yourself after all subagent tasks pass and before any merge claim — give subagents specific test scenarios, not "verify it works".
- **When you fix a bug**, read `docs/process/bugs.md` **before writing the test** — the regression-test procedure (reproduce → fail for the right reason → fix → pass → roadmap row lifecycle) is mandatory.
- **When you choose a test layer or write component / structural / simulation tests**, load the matching skill: `frontend-tests`, `structural-tests`, `testing-by-simulation`.
- Commands, test inventory, isolation, design-for-testability, and fixture conventions: `docs/tests.md`.
