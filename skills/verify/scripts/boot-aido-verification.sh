#!/usr/bin/env bash
# Boot a disposable aido verification server (mirrors tests/helpers/boot-server.ts).
# Run from the aido repository root. Stays in the foreground as the cleanup
# owner; stop with Ctrl-C. Creates one task-specific root under
# /tmp/aido-verify.* and removes exactly that root on exit.
(
set -Eeuo pipefail
umask 077

AIDO_VERIFY_ROOT=""
AIDO_VERIFY_PID=""
AIDO_VERIFY_CHILD_ACTIVE=0
aido_verify_cleanup() {
  local status=$?
  local cleanup_failed=0
  trap - EXIT INT TERM
  if test "${AIDO_VERIFY_CHILD_ACTIVE:-0}" = 1 \
    && [[ "${AIDO_VERIFY_PID:-}" =~ ^[0-9]+$ ]]; then
    kill "$AIDO_VERIFY_PID" 2>/dev/null || true
    wait "$AIDO_VERIFY_PID" 2>/dev/null || true
    AIDO_VERIFY_CHILD_ACTIVE=0
  fi
  if [[ "${AIDO_VERIFY_ROOT:-}" == /tmp/aido-verify.* ]] \
    && [[ -d "$AIDO_VERIFY_ROOT" ]] \
    && [[ ! -L "$AIDO_VERIFY_ROOT" ]] \
    && [[ -f "$AIDO_VERIFY_ROOT/.aido-verify-root" ]] \
    && grep --fixed-strings --quiet 'aido-verification-root-v1' \
      "$AIDO_VERIFY_ROOT/.aido-verify-root"; then
    if ! rm -rf -- "$AIDO_VERIFY_ROOT"; then
      echo "Failed to remove verification root: $AIDO_VERIFY_ROOT" >&2
      cleanup_failed=1
    fi
  elif test -n "${AIDO_VERIFY_ROOT:-}"; then
    echo "Refusing cleanup of unverified path: $AIDO_VERIFY_ROOT" >&2
    cleanup_failed=1
  fi
  if test "$status" = 0 && test "$cleanup_failed" != 0; then status=1; fi
  exit "$status"
}
trap aido_verify_cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

# Capture the committed source before replacing HOME, then allocate the exact
# immutable cleanup root. The EXIT trap is already active if mktemp fails.
AIDO_VERIFY_TEMPLATE_SOURCE="${AIDO_TEMPLATES_ROOT:-${HOME:?}/Work/Projects/aido-templates}"
readonly AIDO_VERIFY_TEMPLATE_SOURCE
AIDO_VERIFY_ROOT="$(mktemp -d /tmp/aido-verify.XXXXXXXXXX)"
case "$AIDO_VERIFY_ROOT" in
  /tmp/aido-verify.*) ;;
  *) echo "Unexpected verification root: $AIDO_VERIFY_ROOT" >&2; exit 1 ;;
esac
test -d "$AIDO_VERIFY_ROOT" && test ! -L "$AIDO_VERIFY_ROOT"
readonly AIDO_VERIFY_ROOT
printf '%s\n' 'aido-verification-root-v1' >"$AIDO_VERIFY_ROOT/.aido-verify-root"

AIDO_VERIFY_PORT="$(
  ./node_modules/.bin/tsx -e '
    import { createServer } from "node:net";
    const server = createServer();
    server.unref();
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") process.exit(1);
      process.stdout.write(String(address.port));
      server.close();
    });
  '
)"
case "$AIDO_VERIFY_PORT" in
  ""|*[!0-9]*) echo "Could not reserve a local verification port" >&2; exit 1 ;;
esac

mkdir -p \
  "$AIDO_VERIFY_ROOT/home/.config" \
  "$AIDO_VERIFY_ROOT/home/.claude" \
  "$AIDO_VERIFY_ROOT/projects" \
  "$AIDO_VERIFY_ROOT/templates" \
  "$AIDO_VERIFY_ROOT/ops" \
  "$AIDO_VERIFY_ROOT/mcp-config" \
  "$AIDO_VERIFY_ROOT/tmp"

# From this point onward every setup command, git invocation, migration, and
# server resolver runs under the disposable identity and roots.
export HOME="$AIDO_VERIFY_ROOT/home"
export XDG_CONFIG_HOME="$AIDO_VERIFY_ROOT/home/.config"
export TMPDIR="$AIDO_VERIFY_ROOT/tmp"
export GIT_CONFIG_NOSYSTEM=1
export GIT_CONFIG_GLOBAL=/dev/null
export AIDO_DB_PATH="$AIDO_VERIFY_ROOT/verify.db"
export AIDO_PROJECTS_PATH="$AIDO_VERIFY_ROOT/aido-projects.json"
export AIDO_TEMPLATES_ROOT="$AIDO_VERIFY_ROOT/templates"
export AIDO_OPS_ROOT="$AIDO_VERIFY_ROOT/ops"
export AIDO_MCP_CONFIG_ROOT="$AIDO_VERIFY_ROOT/mcp-config"
export AIDO_BIND_HOST=127.0.0.1
export AIDO_BOOT_ID="aido-verify-${AIDO_VERIFY_ROOT##*/}-$$"
export AIDEV_LEGACY_DB=/nonexistent/aidev.db
export KNOWBS_LEGACY_DB=/nonexistent/knowbs.sqlite
export AIDEV_LEGACY_PROJECTS_JSON=/nonexistent/aidev-projects.json
export AIDEV_LEGACY_USER_DIR=/nonexistent/aidev-user-dir
export KNOWBS_LEGACY_MARKERS_DIR=/nonexistent/markers
printf '%s\n' '{"version":1,"projects":{},"aiInsightsCache":{}}' \
  >"$AIDO_VERIFY_ROOT/aido-projects.json"

# Materialize committed templates into a disposable local repository. The
# running server never receives the live templates checkout as a writable
# root, even when verification exercises the templates editor.
if ! git -C "$AIDO_VERIFY_TEMPLATE_SOURCE" rev-parse --is-inside-work-tree \
  >/dev/null 2>&1; then
  echo "Template source is not a git worktree: $AIDO_VERIFY_TEMPLATE_SOURCE" >&2
  exit 1
fi
git -C "$AIDO_VERIFY_TEMPLATE_SOURCE" archive --format=tar \
  --output="$AIDO_VERIFY_ROOT/templates.tar" HEAD
tar -xf "$AIDO_VERIFY_ROOT/templates.tar" -C "$AIDO_VERIFY_ROOT/templates"
rm -f -- "$AIDO_VERIFY_ROOT/templates.tar"
git -C "$AIDO_VERIFY_ROOT/templates" init -q -b main
git -C "$AIDO_VERIFY_ROOT/templates" config user.email verify@localhost
git -C "$AIDO_VERIFY_ROOT/templates" config user.name "aido verify"
git -C "$AIDO_VERIFY_ROOT/templates" config commit.gpgsign false
git -C "$AIDO_VERIFY_ROOT/templates" add .
git -C "$AIDO_VERIFY_ROOT/templates" commit -q -m "verification fixture"

HOME="$AIDO_VERIFY_ROOT/home" \
  XDG_CONFIG_HOME="$AIDO_VERIFY_ROOT/home/.config" \
  TMPDIR="$AIDO_VERIFY_ROOT/tmp" \
  AIDO_DB_PATH="$AIDO_VERIFY_ROOT/verify.db" \
  AIDO_PROJECTS_PATH="$AIDO_VERIFY_ROOT/aido-projects.json" \
  AIDO_TEMPLATES_ROOT="$AIDO_VERIFY_ROOT/templates" \
  AIDO_OPS_ROOT="$AIDO_VERIFY_ROOT/ops" \
  AIDO_MCP_CONFIG_ROOT="$AIDO_VERIFY_ROOT/mcp-config" \
  AIDEV_LEGACY_DB=/nonexistent/aidev.db \
  KNOWBS_LEGACY_DB=/nonexistent/knowbs.sqlite \
  AIDEV_LEGACY_PROJECTS_JSON=/nonexistent/aidev-projects.json \
  AIDEV_LEGACY_USER_DIR=/nonexistent/aidev-user-dir \
  KNOWBS_LEGACY_MARKERS_DIR=/nonexistent/markers \
  ./node_modules/.bin/tsx src/platform/db/migrate.ts
HOME="$AIDO_VERIFY_ROOT/home" \
  XDG_CONFIG_HOME="$AIDO_VERIFY_ROOT/home/.config" \
  TMPDIR="$AIDO_VERIFY_ROOT/tmp" \
  PORT="$AIDO_VERIFY_PORT" \
  AIDO_BIND_HOST=127.0.0.1 \
  AIDO_DB_PATH="$AIDO_VERIFY_ROOT/verify.db" \
  AIDO_PROJECTS_PATH="$AIDO_VERIFY_ROOT/aido-projects.json" \
  AIDO_TEMPLATES_ROOT="$AIDO_VERIFY_ROOT/templates" \
  AIDO_OPS_ROOT="$AIDO_VERIFY_ROOT/ops" \
  AIDO_MCP_CONFIG_ROOT="$AIDO_VERIFY_ROOT/mcp-config" \
  AIDO_E2E_FAKE_SPAWNERS=1 \
  AIDEV_LEGACY_DB=/nonexistent/aidev.db \
  KNOWBS_LEGACY_DB=/nonexistent/knowbs.sqlite \
  AIDEV_LEGACY_PROJECTS_JSON=/nonexistent/aidev-projects.json \
  AIDEV_LEGACY_USER_DIR=/nonexistent/aidev-user-dir \
  KNOWBS_LEGACY_MARKERS_DIR=/nonexistent/markers \
  ./node_modules/.bin/tsx src/composition/main.ts \
  >"$AIDO_VERIFY_ROOT/server.log" 2>&1 &
AIDO_VERIFY_PID=$!
readonly AIDO_VERIFY_PID
AIDO_VERIFY_CHILD_ACTIVE=1

AIDO_VERIFY_READY=0
AIDO_VERIFY_TIMEOUT_SECONDS=30
AIDO_VERIFY_DEADLINE=$((SECONDS + AIDO_VERIFY_TIMEOUT_SECONDS))
while ((SECONDS < AIDO_VERIFY_DEADLINE)); do
  if ! kill -0 "$AIDO_VERIFY_PID" 2>/dev/null; then
    wait "$AIDO_VERIFY_PID" 2>/dev/null || true
    AIDO_VERIFY_CHILD_ACTIVE=0
    echo "aido verification server exited before readiness" >&2
    test ! -f "$AIDO_VERIFY_ROOT/server.log" || cat "$AIDO_VERIFY_ROOT/server.log" >&2
    exit 1
  fi

  AIDO_VERIFY_LOG_READY=0
  AIDO_VERIFY_HEALTH_READY=0
  if grep --fixed-strings --quiet \
    "Server running on http://127.0.0.1:${AIDO_VERIFY_PORT}" \
    "$AIDO_VERIFY_ROOT/server.log"; then
    AIDO_VERIFY_LOG_READY=1
  fi
  rm -f -- "$AIDO_VERIFY_ROOT/health.headers" "$AIDO_VERIFY_ROOT/health.json"
  curl --fail --silent --max-time 1 \
    --dump-header "$AIDO_VERIFY_ROOT/health.headers" \
    --output "$AIDO_VERIFY_ROOT/health.json" \
    "http://127.0.0.1:${AIDO_VERIFY_PORT}/health" 2>/dev/null || true
  AIDO_VERIFY_HEALTH="$(
    test ! -f "$AIDO_VERIFY_ROOT/health.json" \
      || cat "$AIDO_VERIFY_ROOT/health.json"
  )"
  if test "$AIDO_VERIFY_HEALTH" = '{"ok":true}' \
    && grep --ignore-case --fixed-strings --quiet \
      "x-aido-boot-id: ${AIDO_BOOT_ID}" \
      "$AIDO_VERIFY_ROOT/health.headers"; then
    AIDO_VERIFY_HEALTH_READY=1
  fi
  if test "$AIDO_VERIFY_LOG_READY" = 1 \
    && test "$AIDO_VERIFY_HEALTH_READY" = 1 \
    && kill -0 "$AIDO_VERIFY_PID" 2>/dev/null; then
    AIDO_VERIFY_READY=1
    break
  fi
  sleep 0.25
done
if test "$AIDO_VERIFY_READY" != 1; then
  echo "aido verification server did not become ready within 30 seconds" >&2
  cat "$AIDO_VERIFY_ROOT/server.log" >&2
  exit 1
fi

printf 'aido verification server ready\n  root: %s\n  url:  %s\n' \
  "$AIDO_VERIFY_ROOT" "http://127.0.0.1:${AIDO_VERIFY_PORT}"
printf 'Drive it from another terminal; stop this foreground owner with Ctrl-C.\n'
AIDO_VERIFY_WAIT_STATUS=0
wait "$AIDO_VERIFY_PID" || AIDO_VERIFY_WAIT_STATUS=$?
AIDO_VERIFY_CHILD_ACTIVE=0
exit "$AIDO_VERIFY_WAIT_STATUS"
)
