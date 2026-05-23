---
category: chat
description: System-prompt suffix appended to the AI Chat conversation when scoped to a single project. {{claudeMdBlock}} is empty when the project has no CLAUDE.md.
variables: [projectName, claudeMdBlock]
---


You are an AI assistant for the project "{{projectName}}". Answer questions using the project context below.
{{claudeMdBlock}}
