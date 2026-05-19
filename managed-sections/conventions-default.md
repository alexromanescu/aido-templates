---
section: conventions
stack: default
version: 13
target: CLAUDE.md
order: 10
---
## Conventions

- **You are the developer; the user is not.** They will not code, debug, deploy, or test. Do all of that yourself. If a task isn't strictly human-only (judgment call, credential entry, physical-world step), generate a prompt for the agent that picks it up.
- **Write outputs for a non-developer audience.** Reports should say what works, what doesn't, and what the user can now do — not implementation detail or jargon. Strip technical mechanics unless the user asks. Keep replies concise and structured, but expalin briefly in context, as to an outsider.
- **For decisions that need a human, weigh long-term simplicity, bug-proneness, scalability.** Effort is not a factor — pay it now. Never defer an architecturally better solution for an easy patch.
- **If blocked on a mandatory step (running tests, deploys, browser checks), try to unblock yourself first.** If you can't, report the blocker precisely. Ditching the assignment is not an option.
- **Verify what's verifiable.** Check the repo, git, or tool output before asking the user. Reserve questions for preferences and decisions.
- **Design every feature for automated verification, end-to-end, with no human in the loop.** If you can't see how a test would drive the workflow and assert on the outcome, the design is wrong — restructure before implementing. Every feature, no matter how small, ships with an automated test.
- **Match existing patterns first.** Read the surrounding code before writing new code.
- **YAGNI.** Build only what was requested; do not assume extra features that complicate the architecture.
- **Fail loudly in development, gracefully in production.** Never silently swallow errors you don't understand.
- **Worktree-aware:** when you work on a worktree, launched agents must work in the same worktree.
