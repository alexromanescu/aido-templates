---
section: process-git-workflow
stack: default
version: 6
target: docs/process/git-workflow.md
order: 10
---
# Git Workflow

1. **Check the working context.** Inspect the directory, branch, status, and worktree metadata. Stay in an existing isolated worktree; never nest one.
2. **Isolate substantial work** in a worktree at `<main-project-root>/.worktrees/<task-id>/`, never beside the project or in a temporary folder. Quick low-risk fixes and launcher-owned isolation are the exceptions; a configured working directory alone is not isolation. Resolve the main checkout from worktree metadata, confirm `.worktrees/` is Git-ignored, and derive the directory, branch, scratch paths, and ports from your own task identity.
3. **Protect existing work.** Never reset, overwrite, stage, or clean pre-existing modifications or untracked files without explicit authorization. Commit only assignment-owned changes.
4. **Checkpoint locally.** Commit coherent changes after relevant verification passes and continue working; a checkpoint is an authorized local commit.
5. **Finish locally.** After verification and any required review, merge to the default branch unless the assignment or launcher owns a different merge process. Confirm the resulting status and graph, and verify conflict resolutions.
6. **Push only on an owner request.** The request holds for its agreed scope across follow-up turns; passing checks never authorizes a push. Use the project's declared shipping command when one exists.
7. **Clean up before reporting completion.** After merging, remove your own worktree with `git worktree remove` (launcher-owned worktrees follow the launcher's lifecycle), delete the merged scratch branch, and run the project's post-merge procedure when one exists. Inventory everything the session created (processes, worktrees, branches, temp and scratch locations, fixtures left by tests) and verify each is gone; file a leak you did not cause instead of ignoring it. Never force-remove uncommitted or unmerged work or touch another session's resources. If your worktree must remain for unfinished work or review, record its path, branch, reason, and next cleanup action in the project's handoff record.
