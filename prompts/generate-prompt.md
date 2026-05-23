---
category: system
description: Generates a self-contained Claude Code session prompt for the active task — used by the "Generate prompt" button on the active-work page.
variables: [taskBlock, context]
---
Generate a detailed prompt for a Claude Code session to implement the following task.

## Task
{{taskBlock}}

## Project Context

{{context}}

## Instructions

Generate a comprehensive, self-contained prompt that a Claude Code session can use to implement this task independently. The prompt should:
1. Describe what needs to be built
2. Include all relevant context from the project (conventions, architecture, patterns)
3. Specify acceptance criteria
4. Reference specific files that will need to be created or modified
5. Be ready to paste directly into a Claude Code session
