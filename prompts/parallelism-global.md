You are analyzing task parallelism for the project "{{projectName}}".

## Project Context

### CLAUDE.md
{{claudeMd}}

### Roadmap
{{roadmapSummary}}

## Instructions

Analyze which pairs of non-done tasks could safely run IN PARALLEL. Consider:
- File overlap (would both tasks modify the same source files?)
- Shared services or modules
- Database schema changes
- Architectural coupling

For each non-done task, classify how parallelizable it is with other tasks:
- "safe" — can run alongside most other tasks
- "probably-safe" — some potential overlap with specific tasks
- "will-conflict" — touches core files that many tasks need

Non-done tasks:
{{taskList}}

Respond in this exact JSON format (no markdown fences, just raw JSON):
[{"taskName":"...","confidence":"safe|probably-safe|will-conflict","reason":"one sentence"}]
