---
section: user-orchestration
version: 1
targets: [claude]
---

## Agent Orchestration

- Under ultracode or whenever you coordinate agents, run agent teams through workflows and keep your own context lean: agents write detailed reports to files; you read their summaries and decide between phases.
- Opus builds. Fable reviews architecture where it matters. Codex Astra gives second-opinion reviews: launch `codex exec -m gpt-6-astra -s read-only -o <report> "<prompt>" < /dev/null` yourself in the background (never from a subagent; without `< /dev/null` it waits on stdin forever) and check that its log grows. Codex builds only as the fallback when the Claude budget runs low.
