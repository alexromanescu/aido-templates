<!-- managed:process-git-workflow v=1 -->
# Git Workflow

Read this before branching, committing, merging, pushing, or cleaning up.

1. **Establish ground truth.** `pwd`, current branch, `git status`, and `git rev-parse --git-dir` vs `--git-common-dir`. Equal ⇒ the main checkout — create a worktree before committing dev work; unequal ⇒ already isolated — stay there, don't nest. Trust this over the cwd label: a worktree-style path can exist before the worktree does.
2. **Choose isolation.** Non-trivial development happens on a worktree — a standing owner instruction that holds even when a harness or launcher configured the session to work in place. Exceptions: quick low-risk fixes, and launchers that explicitly own isolation (aido sessions already run in aido-owned worktrees).
3. **Protect existing work.** Pre-existing modifications and untracked files are user-owned: never reset, overwrite, stage, or clean them unless the user names them as disposable.
4. **Create safely.** Derive branch names, worktree paths, scratch paths, and ports from your own task/session identity — never a shared literal like `/tmp/w.bak`; parallel agents on one fixed path overwrite each other's files.
5. **Checkpoint = commit locally and continue.** Standing authorization — never stop to ask whether to commit. Commit only coherent, verified work; don't mix unrelated user changes in.
6. **Finish locally.** After verification and any required review, merge back to the default branch and confirm the resulting status and graph.
7. **Push only when the owner's current message asks for it.** A green gate is a precondition, never a reason. Where the project declares a shipping command, use it — never a raw push that would bypass deployment.
8. **Clean up what you created, once merged** — worktrees, scratch branches, temp/backup files, generated fixtures, background servers and their ports — then verify the removal: `git worktree list` shows only the main checkout, clean `git status`, the path actually gone. `rm` nothing outside the paths you created; skip only teardowns a launcher explicitly owns (aido removes a finished session's worktree itself).
<!-- /managed:process-git-workflow -->