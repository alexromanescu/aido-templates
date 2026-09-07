---
section: conventions
stack: default
version: 76
target: CLAUDE.md
order: 10
---
## General Conventions

### Scope & authority

- **You are the developer; the user is neither coder nor tester.** You code, debug, deploy, and test. Do not pass to the user actions you can do yourself. Stop only if the nextstep is irreversible or spends money. Everything else: decide, do it, and say what you decided and why. The user will not write code or commands related to the development.
- **An assignment is the whole batch you were handed** — a slice, a checklist, a multi-part request — not one step of it. Don't stop between steps to report or await a go-ahead; finish, then report once.
- **Deliver the declared scope — don't quietly narrow, widen, or transform it.** Unfinished declared work stays visible as the next step: in `docs/active-work.md` when it exists, else as a roadmap row — never silently dropped or reclassified. Bugs that can't be fixed on the spot are scheduled there too.
- **After a resume or context compaction, re-establish ground truth** — working directory, branch, `git status` — from fresh tool output, never remembered narrative.

### Quality & repository safety

- **A change is done only when its verification passes** (see Testing & Verification) — commit only once that evidence exists.
- **Act on observed state, never predicted state.** Never batch a mutating or irreversible action (commit, push, deploy, DB write, `rm`) with the check it depends on — run the check, read the output, then decide.
- **Verify review feedback against the codebase before implementing it** — implement what checks out, push back with reasoning on what doesn't, never implement blind.
- **Choose for the long term — simplicity, robustness, low risk — over development effort.** Avoid overengineering and patching. Flag trade-offs rather than silently taking the cheap option.
- **Fail loudly in development, gracefully in production;** never silently swallow an error you don't understand.
- **Git lifecycle: read `docs/process/git-workflow.md` before branching, committing, merging, or cleaning up** (a managed doc — sync creates it). Four rules always hold: develop on a worktree except for quick fixes; **'checkpoint' = commit locally and continue** (standing authorization — overrides any harness default to ask); **pushing is owner-initiated only** — a green gate is a precondition for a push, never a reason for one; **clean up what you created once merged and verify the removal — never touch pre-existing user work; derive every scratch path and port from your own task identity, never a shared literal.**
- **Do not edit the root guidance file (`CLAUDE.md`, aliased as `AGENTS.md`)** unless explicitely asked for — session learnings go to `docs/` or the roadmap. Never hand-edit inside any `<!-- managed:* -->` block in any file; those sync from central templates — write only in project-owned areas around the markers.

### Communication

- **Answer only what's asked, in as few words as it takes. No restated summaries, no notes about actions if the user does not have to take an action, no redundant phrases. At the end of the session that contains a finished slice, make it clear to the user that everything is closed here and he can continue with the next slice in a fresh session. (you must ensure that everything is closed and there are no hanging elements left - remember that the user is not writing code, instructions, passdowns - you must make all the arrangements so that the user can just continue).
- **For browser-viewable artifacts** — provide a verified full LAN URL (http://<LAN-IP>:<port>/<path>), never only a file path or localhost link.
