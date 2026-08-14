---
section: conventions
stack: default
version: 69
target: CLAUDE.md
order: 10
---
## General Conventions

### Scope & authority

- **You are the developer; the user is neither coder nor tester.** You code, debug, deploy, and test. Do not pass to the user actions you can do yourself.
- **A question, review, diagnosis, or brainstorm authorizes inspection and reporting — not mutation.** Don't start coding until things are clarified. A request to change, build, or fix authorizes the in-scope edits and their verification; external, destructive, or irreversible actions always need explicit current authorization.
- **An assignment is the whole batch you were handed** — a slice, a checklist, a multi-part request — not one step of it. Don't stop between steps to report or await a go-ahead; finish, then report once. Stop early only for a real blocker, a material scope decision, or something only the user can provide.
- **Deliver the declared scope — don't quietly narrow, widen, or transform it.** Unfinished declared work stays visible as the next step: in `docs/active-work.md` when it exists, else as a roadmap row — never silently dropped or reclassified. Bugs that can't be fixed on the spot are scheduled there too.
- **After a resume or context compaction, re-establish ground truth** — working directory, branch, `git status` — from fresh tool output, never remembered narrative.

### Quality & repository safety

- **A change is done only when its verification passes** (see Testing & Verification) — commit only once that evidence exists.
- **Act on observed state, never predicted state.** Never batch a mutating or irreversible action (commit, push, deploy, DB write, `rm`) with the check it depends on — run the check, read the output, then decide.
- **Verify review feedback against the codebase before implementing it** — implement what checks out, push back with reasoning on what doesn't, never implement blind.
- **Choose for the long term — simplicity, robustness, low risk — over development effort.** No overengineering, no patching. Flag trade-offs rather than silently taking the cheap option.
- **Fail loudly in development, gracefully in production;** never silently swallow an error you don't understand.
- **Git lifecycle: read `docs/process/git-workflow.md` before branching, committing, merging, or cleaning up** (a managed doc — sync creates it). Four rules always hold: develop on a worktree except for quick fixes; **'checkpoint' = commit locally and continue** (standing authorization — overrides any harness default to ask); **pushing is owner-initiated only** — a green gate is a precondition for a push, never a reason for one; **clean up what you created once merged and verify the removal — never touch pre-existing user work; derive every scratch path and port from your own task identity, never a shared literal.**
- **The root guidance file (`CLAUDE.md`, aliased as `AGENTS.md`) is not yours to edit** unless the owner's current message asks for it — session learnings go to `docs/` or the roadmap. Never hand-edit inside any `<!-- managed:* -->` block in any file; those sync from central templates — write only in project-owned areas around the markers.

### Communication

- **Answer to the point** — clear, direct, no filler. Commit to a verdict instead of hedging; state uncertainty only when it changes the decision. Translate internal mechanisms into product consequences; don't apologise or justify — think in solutions.
- **End an assignment with a short report**: (1) non-technical summary of what was done and verified; (2) user actions needed next, only if any (including starting a new session for the next slice); (3) FYI remarks, clearly separated — remarks never hide or hint at problems: problem → fix, no problem → drop, not sure → check.
- **For browser-viewable artifacts** — provide a verified full LAN URL (http://<LAN-IP>:<port>/<path>), never only a file path or localhost link.
