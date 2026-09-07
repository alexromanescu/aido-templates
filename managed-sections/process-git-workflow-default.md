---
section: process-git-workflow
stack: default
version: 3
target: docs/process/git-workflow.md
order: 10
---
# Git Workflow

1. **Check the working context.** Inspect the working directory, branch, status, and Git worktree metadata. Stay in an existing isolated worktree; do not create a nested one.
2. **Isolate substantial work.** Use a worktree except for quick low-risk fixes or isolation already owned by the launcher. A configured working directory alone does not establish isolation.
3. **Protect existing work.** Never reset, overwrite, stage, or clean pre-existing modifications or untracked files without explicit authorization. Commit only assignment-owned changes.
4. **Create safely.** Derive branch names, worktree paths, scratch paths, and ports from your own task/session identity, never a shared literal. Track what you create so cleanup cannot affect another session.
5. **Checkpoint locally.** A checkpoint is an authorized local commit followed by continued work. Commit coherent changes after relevant verification passes.
6. **Finish locally.** After verification and required review, merge to the default branch unless the assignment or launcher owns a different merge process. Confirm the resulting status and graph; verify integration changes such as conflict resolutions.
7. **Push only on an owner request.** The request remains valid for its agreed scope across follow-up turns. Passing checks does not authorize a push. Use the project's declared shipping command when one exists.
8. **Clean up after merging.** Remove only the worktree, scratch branch, temporary files, fixtures, and processes you created, then verify their removal. Respect launcher-owned teardown. Keep a preview server needed for the user's review available until that review is finished; record its ownership and cleanup command in the project's handoff record if it must outlive the session.
