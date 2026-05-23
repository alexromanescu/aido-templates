---
category: insights
description: Cross-project insights query run from the Dashboard's "AI Recommendations" panel.
variables: [summaries]
---
You are analyzing a multi-project workspace and producing strategic insights.

## Projects

{{summaries}}

## Instructions

Produce 3-5 insights as a JSON array. Each insight has these fields:
- "title": one-line summary
- "detail": 1-2 sentence explanation
- "type": one of "cross-project-pattern", "priority-suggestion", or "observation"

Look for: shared themes across projects, blocked critical paths, velocity patterns, repeated work that could be extracted, dependencies, risks. Skip trivial observations that can be derived from rules (stale tasks, missing files).

Respond with ONLY the JSON array, no markdown fences:
[{"title":"...","detail":"...","type":"observation"}]
