---
section: user-workstation
version: 2
targets: [claude, codex]
---

## Workstation Conventions

- Bind dev servers to `0.0.0.0` and report their LAN URL (`http://192.168.3.106:<port>`), never `localhost`.
- Serve static mockups with `python3 -m http.server <port> --bind 0.0.0.0` and report the LAN URL.
- Save browser-automation screenshots under `.playwright-mcp/`, which stays git-ignored.
- Run the full test gate alone, never beside a reviewer or another test run in the same worktree or test database.
- Decide yourself how the app is reached (address, protocol, port) and similar technical matters; never ask the owner.
