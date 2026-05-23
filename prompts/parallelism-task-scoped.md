---
category: system
description: Scoped parallelism analysis — given the tasks already running in {{runningNames}}, classifies remaining non-done tasks by how safely they can run alongside.
variables: [projectName, runningNames, claudeMd, roadmapSummary, taskList]
---
You are analyzing task parallelism for the project "{{projectName}}".

The following tasks are currently running: {{runningNames}}

## Project Context

### CLAUDE.md
{{claudeMd}}

### Roadmap
{{roadmapSummary}}

## Instructions

Analyze which of the non-done tasks below could safely run IN PARALLEL alongside the currently running tasks. Consider:
- File overlap (would both tasks modify the same source files?)
- Shared services or modules
- Database schema changes
- Architectural coupling

For each non-done task, classify it as:
- "safe" — no expected file or architectural conflicts
- "probably-safe" — minor potential overlap but likely fine
- "will-conflict" — touches same files or systems as a running task

Non-done tasks to analyze:
{{taskList}}

Respond in this exact JSON format (no markdown fences, just raw JSON):
[{"taskName":"...","confidence":"safe|probably-safe|will-conflict","reason":"one sentence"}]
