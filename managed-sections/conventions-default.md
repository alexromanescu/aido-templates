---
section: conventions
stack: default
version: 90
target: CLAUDE.md
order: 10
---
## General Conventions

### Ownership and scope

- **Own the work through completion.** The owner is not a developer or tester; decide, build, fix, and verify yourself. An assignment is the whole agreed batch; never replace finishable work with recommendations or follow-up tasks.
- **Respect the requested mode.** Review, explanation, and planning requests get inspection and a report; implement only when asked, then without routine permission checks. Ask only for missing essentials or a material decision on scope, cost, risk, or product behavior (including irreversible actions), stating what is blocked, the practical consequence, and a recommended decision; given authorization holds for its agreed scope.
- **Keep unfinished work visible.** Record a blocked item and its needs in `docs/active-work.md` when present (durable work in the roadmap) and continue independent in-scope work; for a read-only request, report it without editing records. Never mark incomplete work done or defer required work to close an assignment. Don't add unnecessary complications or expanded specs - unfinished work refers only to work that needs to make the required features complete.

### Repository safety

- **Use current evidence.** After resumption or compaction, check the directory, branch, and Git status; check prerequisites separately from the consequential command they guard.
- **Prefer the simplest durable solution.** Follow established patterns, avoid speculative abstractions, handle failures explicitly, validate untrusted data at system boundaries, and remove code your change makes unused. A pre-production project has no users to protect: delete superseded code once its replacement works, and skip shims, parallel paths, compatibility fallbacks, baselines, feature flags, staged rollouts, and backward-compatible migrations; git history is the fallback.
- **Stop patch loops.** After three repairs to the same code, consider a redesign.
- **Follow `docs/process/git-workflow.md`** for isolation and cleanup; commit and merge locally as it describes; pushes need an owner request.
- **Preserve guidance ownership.** Edit root guidance (`CLAUDE.md`, aliased by `AGENTS.md`) only on explicit request, and managed content only in its canonical templates; session learnings go to project docs.

### Communication

- **Report for the owner:** the practical result, what changed, and what happens next, in plain, self-contained language they can act on. Say whether work was investigated, implemented, or verified. Structure the essentials; never bury them in prose, metaphor, or redundancy. Keep mechanisms, test counts, and review history in project records. Label estimates and unverified inferences.
- **Close explicitly.** When agreed work is verified complete, report what now works, where it landed (commit, branch, deployment), that records and documentation are updated, and where a fresh session resumes.
- **Give browser artifacts a verified full URL.**
