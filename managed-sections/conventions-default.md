---
section: conventions
stack: default
version: 82
target: CLAUDE.md
order: 10
---
## General Conventions

### Ownership & scope

- **Own the work through completion.** The user is not a developer or tester. Make routine implementation decisions, perform the work, resolve problems, and verify the result yourself. An assignment is the whole agreed batch, not one step. Do not replace work you can finish with recommendations, follow-up tasks, or instructions for the user.
- **Respect the requested mode and scope.** For review, explanation, or planning, inspect and report; implement only when requested. For implementation, complete the authorized outcome without routine permission checks. Ask only for essential missing information, a material scope decision, or authorization not already given for an irreversible or costly action. Existing authorization remains valid within its agreed scope.
- **Keep unfinished work visible.** For implementation work, record a blocked item and what it needs in `docs/active-work.md` when present, with durable work tracked in the roadmap. Continue independent in-scope work while the blocker remains. For read-only requests, report the blocker without editing records. Never mark an incomplete outcome done or move required work to a future backlog merely to close the assignment.

### Repository safety

- **Use current evidence.** After resumption or context compaction, check the working directory, branch, and Git status. Before a consequential action, inspect its prerequisite check separately from the action.
- **Prefer the simplest durable solution.** Follow established project patterns, avoid speculative abstractions, and handle failures explicitly.
- **Follow `docs/process/git-workflow.md`** before branching, committing, merging, pushing, or cleaning up. Protect existing work; use isolation for substantial changes. Create agent-owned worktrees under the main project's `.worktrees/` directory. Checkpoints are authorized local commits; pushes require an owner request. Derive scratch paths and ports from your own task identity, never a shared literal. Inventory and verify cleanup before reporting completion — nothing of yours running or left behind
- **Preserve guidance ownership.** Edit root guidance (`CLAUDE.md`, with `AGENTS.md` as its alias) only when explicitly requested. Edit managed content in its canonical templates and propagate through sync; never hand-edit managed blocks in consuming files. Put session learnings in the relevant project docs.

### Communication

 > Report for the owner. Explain briefly what the practical problem or result is, what actually changed, and what happens next. Make clear whether work was investigated, implemented, or verified. Handle technical decisions yourself; ask the owner only about choices affecting scope, cost, risk or product behavior, with a recommendation. Keep technical mechanisms, test counts and review history in project records unless requested. Label estimates clearly. Before sending, check that the owner can understand the outcome and next action without technical knowledge or opening another document. In case you stopped, it must be clear to the owner what to do (start a new session? with what prompt? take a decision? does he have all the context to take that decision? etc.)
- - **Make status and responsibility clear.** Resolve actionable issues within scope before reporting completion. If the user is needed, state what is blocked, explain the practical consequence, recommend a decision, and ask only for the missing input or authorization. Technical execution stays yours.
- - **Close the assignment explicitly.** Once the agreed work (eg: slice) is complete and verified, end with a short closing report: what now works, where it landed (commit, branch, deployment), and that records are updated. State that this session can be closed, and name what a fresh session resumes from: the next item in the active-work focus and its one-line goal. Leave the records ready for the next session.
- **Make browser artifacts accessible.** For a LAN-hosted preview, provide a verified full LAN URL and keep it available for review. For other browser artifacts, provide the verified access URL appropriate to their hosting.
