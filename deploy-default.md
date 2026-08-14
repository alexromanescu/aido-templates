---
target: docs/deploy.md
description: Deploy procedure (used by the in-app Deploy button).
variables: []
init: false
---
# Deploy <project name>

Target: <where this deploys to — server, container, app store, etc.>

> **For the deploying agent:** Run each step in order. If a step fails, STOP —
> don't run dependent later steps, preserve the observable state (logs,
> partial outputs), and report the exact failed command/check and its result.

## Steps

1. **Step name.**
   `command to run`
   What to check on success. What to do on failure.

2. **Another step.**
   `command to run`

<!-- Tips:
  - Be explicit about working directory (cd ...).
  - Use STOP/report on every step that can fail destructively.
  - For services that need to be restarted at the end, schedule the restart
    so it survives this session (e.g. the systemd-run pattern) — see this
    project's docs/devops.md. -->
