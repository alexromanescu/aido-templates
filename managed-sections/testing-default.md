---
section: testing
stack: default
version: 21
target: CLAUDE.md
order: 70
---
## Testing & Verification

- **Every change ships with an automated test that drives the user workflow on the real surface and passes** — the real component, endpoint, or entry point, at the tier that fits the change (`docs/tests.md`), not necessarily E2E. A green type-check, clean console, or passing unit suite is not by itself verification. If a change can't be tested automatically, restructure so it can where reasonable — otherwise record why in the roadmap row.
- **A new test must be seen to fail:** write it before the change, or verify it fails with the change reverted.
- **A failing test is never left silently.** Caused by your change → fix before claiming done. Pre-existing and unrelated → file as a bug and flag it. Flaky = a real bug — fix, never blanket-retry. No `skip` without a referenced roadmap entry.
- **Don't take a subagent's word for it:** run the automated verification yourself before any done or merge claim.
- **When you fix a bug**, read `docs/process/bugs.md` before writing the test and follow the regression-test procedure.
- **When you choose a test layer or write component / structural / simulation tests**, load the matching skill: `frontend-tests`, `structural-tests`, `testing-by-simulation`.
- Commands, inventory, isolation, design-for-testability, fixtures: `docs/tests.md`.
