---
target: docs/deploy.md
description: Deploy procedure (used by the in-app Deploy button).
variables: []
init: false
---
# Deploy <project name>

Target: <where this deploys to — server, container, app store, etc.>

> **Note for Claude:** Run each step in order. If any step fails, STOP
> immediately and report what went wrong. Do not skip ahead.

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
    so it survives this session — see ~/Apps/aido/docs/deploy.md for the
    systemd-run pattern if you're deploying a systemd-managed service. -->
