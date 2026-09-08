---
section: process-git-workflow
stack: default
version: 5
target: docs/process/git-workflow.md
order: 10
---
# Git Workflow

1. **Check the working context.** Inspect the working directory, branch, status, and Git worktree metadata. Stay in an existing isolated worktree; do not create a nested one.
2. **Isolate substantial work.** Use a worktree except for quick low-risk fixes or isolation already owned by the launcher. A configured working directory alone does not establish isolation.
3. **Protect existing work.** Never reset, overwrite, stage, or clean pre-existing modifications or untracked files without explicit authorization. Commit only assignment-owned changes.
4. **Keep worktrees together.** Create agent-owned worktrees only at `<main-project-root>/.worktrees/<task-id>/`, never beside the project or in an arbitrary temporary folder. Resolve the main checkout from Git worktree metadata, not the current directory. Ensure its `.worktrees/` directory is Git-ignored before creation. Use a unique task/session identity for the directory, branch, scratch paths, and ports; track what you create. Existing worktrees stay where they are, and launcher-owned worktrees follow the launcher's location and lifecycle.
5. **Checkpoint locally.** A checkpoint is an authorized local commit followed by continued work. Commit coherent changes after relevant verification passes.
6. **Finish locally.** After verification and required review, merge to the default branch unless the assignment or launcher owns a different merge process. Confirm the resulting status and graph; verify integration changes such as conflict resolutions.
7. **Push only on an owner request.** The request remains valid for its agreed scope across follow-up turns. Passing checks does not authorize a push. Use the project's declared shipping command when one exists.
8. **Clean up before reporting completion.** After merging, leave the worktree and remove it with `git worktree remove`, then delete your merged scratch branch. Before reporting completion, inventory what the session touched — processes, worktrees, branches, temp locations, scratch directories — and verify each is gone: stop your processes and remove what your runs produced, including fixtures a test left behind; file a leak you did not cause instead of ignoring it. Complete the project's post-merge procedure when one exists. State the verified evidence in the closing report. Never force removal of uncommitted or unmerged work or clean another session's resources. If your worktree must remain for unfinished work or review, record its path, branch, reason, and next cleanup action in the project's handoff record; retaining it is not a substitute for finishing work you can do now.
