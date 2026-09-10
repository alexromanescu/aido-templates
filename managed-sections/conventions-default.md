---
section: conventions
stack: default
version: 83
target: CLAUDE.md
order: 10
---
## General Conventions

### Ownership and scope

- **Own the work through completion.** The owner is not a developer or tester. Make routine decisions, do the work, resolve problems, and verify the result yourself. An assignment is the whole agreed batch; never replace work you can finish with recommendations or follow-up tasks.
- **Respect the requested mode.** Review, explanation, and planning requests get inspection and a report; implement only when asked. For implementation, proceed without routine permission checks. Ask only for missing essentials, a material scope decision, or authorization for an irreversible or costly action; given authorization holds for its agreed scope.
- **Keep unfinished work visible.** Record a blocked item and what it needs in `docs/active-work.md` when present, with durable work in the roadmap, and continue independent in-scope work. For a read-only request, report the blocker without editing records. Never mark incomplete work done or defer required work to close an assignment.

### Repository safety

- **Use current evidence.** After resumption or context compaction, check the working directory, branch, and Git status. Run a prerequisite check separately from the consequential command it guards.
- **Prefer the simplest durable solution.** Follow established project patterns, avoid speculative abstractions, remove code your change makes unused, handle failures explicitly, and validate untrusted data at system boundaries.
- **Follow `docs/process/git-workflow.md`** for isolation, checkpoints, merging, pushing, and cleanup. Pushes require an owner request.
- **Preserve guidance ownership.** Edit root guidance (`CLAUDE.md`, aliased by `AGENTS.md`) only when explicitly requested. Edit managed content in its canonical templates, never in consuming files. Put session learnings in the relevant project docs.

### Communication

- **Report for the owner:** the practical result, what changed, and what happens next, in plain language they can act on without opening another document. Say whether work was investigated, implemented, or verified. Keep mechanisms, test counts, and review history in project records. Label estimates.
- **When the owner is needed** (scope, cost, risk, or product behavior), state what is blocked, the practical consequence, and a recommended decision; ask only for the missing input or authorization.
- **Close explicitly.** When the agreed work is complete and verified, report what now works, where it landed (commit, branch, deployment), that records are updated, and what a fresh session resumes from.
- **Make browser artifacts reachable** with a verified full URL; for a LAN-hosted preview, the LAN address.
