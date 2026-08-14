---
name: verify
description: Use when confirming an aido UI or server change at the real running-app surface by building the app, booting it with fake spawners and a temporary database, and driving desktop/mobile flows or tRPC diagnostics.
---

# Verifying aido changes in the running app

The server serves the BUILT client — run `npm run build` first or the browser
gets a stale bundle while tsx serves fresh server code (classic trap:
server-side tRPC procedure works via curl, client never calls it).

## Boot

From the aido repository root, run the boot script bundled with this skill
(resolve the path from where this skill is installed):

```text
bash <this-skill>/scripts/boot-aido-verification.sh
```

The script mirrors `tests/helpers/boot-server.ts`: it creates one
task-specific disposable root (`/tmp/aido-verify.*`), installs its cleanup
trap before anything else, reserves a currently free loopback port, points
`HOME` / XDG config / `TMPDIR` / DB / projects / templates / ops / MCP roots
at the disposable root, materializes the committed templates as a local
fixture repository, runs migrations, and boots the server with
`AIDO_E2E_FAKE_SPAWNERS=1` on `127.0.0.1` only. Readiness is attributed to
the exact child it launched (log line + `/health` carrying its boot id), so
a port-reservation race fails instead of passing against a stranger.

On success it prints the root and URL:

```text
aido verification server ready
  root: /tmp/aido-verify.XXXXXXXXXX
  url:  http://127.0.0.1:<port>
```

The script stays in the foreground as the cleanup owner — leave it running
and drive the URL from another terminal. Do not detach it, background it, or
reassign its cleanup state. When done, Ctrl-C the owner, then confirm the
root is gone (`ls /tmp/aido-verify.*` finds nothing of yours).

`AIDO_E2E_FAKE_SPAWNERS=1` swaps `claude --print` spawners for in-process
fakes (`src/composition/fake-spawners.ts`) — engagements/rooms work with no
subprocesses or worktrees. The fake teamlead's production-shaped MCP config is
created mode `0600` under the disposable MCP root only for its loopback
launch handshake, then removed on success or failure. `AIDO_BIND_HOST` keeps
the otherwise unauthenticated verification server off every non-loopback
interface.

All implicit state belongs to the disposable root. Do not weaken the script's
isolation or point the running server at a live checkout merely to simplify a
fixture; copy committed inputs into the disposable root instead.

## Seed a project (engagement form needs one)

In the driving terminal, set `AIDO_VERIFY_ROOT` to the exact root printed by
the boot owner. Create `$AIDO_VERIFY_ROOT/projects/<name>/` with `CLAUDE.md` plus
`docs/agent-card.md` (frontmatter:
`handle`/`displayName`/`defaultMode`/`allowsSpawn`), then `git init -b main`
and create one commit. Point the app at the disposable projects folder with:

```text
POST /trpc/settings.set {"key":"projectsFolder","value":"<AIDO_VERIFY_ROOT>/projects"}
```

## Drive

Use Playwright from the repository's Node dependencies
(`NODE_PATH=<repo>/node_modules node script.cjs`) with contexts at 1440×900 and
390×844. tRPC GET queries are curl-able (`/trpc/engagements.pausedIds`, etc.)
and help isolate client-versus-server behavior when a UI signal does not show.

Gotchas: the mobile drawer backdrop's element center sits under the `w-64`
aside — click it with `position: {x: 350, y: …}`. Engagement creation
auto-navigates to `/teamlead/:id`. Fleet interrupt is two-tap with a 3s
disarm.
