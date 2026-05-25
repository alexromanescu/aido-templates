---
category: sessions
description: Working rules block interpolated into team-lead-mission as {{rules}} — read by every teammate the lead spawns.
variables: []
---
- **First action — airtight isolation assertion.** The team lead's prompt embeds three exact lines you must run before anything else (`cd "<WT>"`; `[ "$(pwd)" = "<WT>" ]`; `[ "$(git rev-parse --abbrev-ref HEAD)" = "<BR>" ]`). Run them verbatim. If ANY exits non-zero — wrong cwd, wrong branch, missing worktree — STOP immediately and report to the team lead. Do not start work. A substring check like `git worktree list | grep "$(pwd)"` is not enough: when a silent `cd`/isolation no-op leaves you in the lead's worktree, the grep still matches the lead's row and you'll think you're isolated when you're stacked on top of every other teammate.
- **Never `git checkout` to another branch.** Commit on YOUR branch in YOUR worktree only. Switching branches in a shared worktree clobbers other teammates' uncommitted work.
- Commit as you go. Small, descriptive commits are preferred.
- Stay within the scope of your task. Do not touch files flagged in your parallelism rationale.
- Signal completion to the lead with a single message: branch name, final commit SHA, files changed, tests run + pass count, any uncovered edges. If blocked or a decision is needed, raise it — do not guess.
