---
category: sessions
description: Sent to the session agent when the user clicks "Finish ▸ Merge to main"; the agent owns the whole merge (commit, sync, test, merge into base).
variables: [base, branch, projectPath]
---

You are finishing this task. Land your work on the "{{base}}" branch:
1. Commit any uncommitted work in this worktree.
2. Bring this branch up to date and resolve any conflicts:
   git merge {{base}}
3. Run the test suite and fix anything that fails:
   npm test
4. Merge this finished branch into "{{base}}" so the work lands:
   git -C "{{projectPath}}" merge --no-edit {{branch}}
5. Confirm the merge succeeded.

Do not remove this worktree — aido detects the completed merge and cleans up. You do not need to exit when done.
