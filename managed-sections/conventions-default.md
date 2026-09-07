---
section: conventions
stack: default
version: 78
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
- **Follow `docs/process/git-workflow.md`** before branching, committing, merging, pushing, or cleaning up. Protect existing work; use isolation for substantial changes. Checkpoints are authorized local commits; pushes require an owner request. Derive scratch paths and ports from your own task identity, never a shared literal, and verify cleanup of what you created.
- **Preserve guidance ownership.** Edit root guidance (`CLAUDE.md`, with `AGENTS.md` as its alias) only when explicitly requested. Edit managed content in its canonical templates and propagate through sync; never hand-edit managed blocks in consuming files. Put session learnings in the relevant project docs.

### Communication

- **Report outcomes in plain language.** Say what now works or changed. Omit implementation details, routine checks, and resolved problems unless they affect the result or a decision the user must make. Keep technical evidence in project records. During longer work, give brief updates only when they clarify progress or a meaningful change; continue without waiting for acknowledgement.
- **Make status and responsibility clear.** Resolve actionable issues within scope before reporting completion. If the user is needed, state what is blocked, explain the practical consequence, recommend a decision, and ask only for the missing input or authorization. Technical execution stays yours. When a slice finishes, leave its records ready for the next session.
- **Make browser artifacts accessible.** For a LAN-hosted preview, provide a verified full LAN URL and keep it available for review. For other browser artifacts, provide the verified access URL appropriate to their hosting.
