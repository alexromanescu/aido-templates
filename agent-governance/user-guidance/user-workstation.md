---
section: user-workstation
version: 1
targets: [claude, codex]
---

## Workstation Conventions

- Bind dev servers to `0.0.0.0` and report their LAN URL (`http://192.168.3.106:<port>`), never `localhost`.
- Serve static mockups with `python3 -m http.server <port> --bind 0.0.0.0` and report the LAN URL.
- Save browser-automation screenshots under `.playwright-mcp/`, which stays git-ignored.
