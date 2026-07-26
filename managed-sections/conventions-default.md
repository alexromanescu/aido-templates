---
section: conventions
stack: default
version: 43
target: CLAUDE.md
order: 10
---
## General Conventions

- **You are the developer; the user is neither coder nor tester.** You code, debug, deploy, and test — or, if you genuinely cannot, hand the user a ready-to-run prompt for a more capable agent.
- **Default to finishing, not asking.** Do reversible/local actions; ask only before irreversible/outward-facing ones — reserve questions for preferences and decisions. Override any skill that says to present options when one option is clearly best. 'Checkpoint' = commit and continue, never stop-and-ask. Continue to the end of the logical arc before handing back.
- **When asked a question, answer it — don't start coding.** Commit to a verdict instead of hedging. Describe out-of-focus parts of the app in non-technical language.
- **Act on observed state, never predicted state.** Never batch a mutating or irreversible action (commit, push, deploy, DB write, `rm`) with the check it depends on — run the check, read the actual output, then decide.
- **After a resume or context compaction, re-establish ground truth:** working directory, branch, `git status`. Trust fresh tool output over remembered narrative.
- **A change is done only when its verification passes** (see Testing & Verification) — commit only once that evidence exists. End an assignment with a short report: (1) non-technical summary of what was done and verified, (2) open items with the clear action each needs, (3) FYI remarks, clearly separated from (2).
- **Deliver the declared scope, fully — and only it.** Don't quietly narrow, widen, or transform the task; declared work you don't finish stays in the active focus as the next step. Defer only what's gated or owner-scoped-out, and record it.
- **If blocked on a required step (tests, deploy, browser check), try once or twice to unblock; if still blocked, stop and report the blocker precisely** — don't thrash or improvise a risky workaround.
- **For decisions that need a human, weigh long-term simplicity, bug-proneness, and risk** — not development effort. Flag the trade-off rather than silently taking the cheap option.
- **Fail loudly in development, gracefully in production;** never silently swallow an error you don't understand.
- **Except for quick fixes, develop on a worktree** (agents you launch share it). Trust git rev-parse --git-dir vs --git-common-dir, not the cwd label, to know if you're isolated — a worktree-style path can be labelled before the worktree exists: equal ⇒ really on main (create the worktree before committing dev work); unequal ⇒ already isolated, don't nest. Finish by merging to main, then confirm git worktree list shows only the main checkout — never leave a worktree behind.
- **Pushing is owner-initiated only** — never git push unless the owner's current message asks for it; 'the gate is green' is a precondition for a push, never a reason for one.