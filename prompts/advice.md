---
category: system
description: "Ask AI" advice on a roadmap task — invoked from the active-work page; output stored as the task's AI response.
variables: [projectName, taskBlock, context]
---
You are advising on a software development task for the project "{{projectName}}".

## Task
{{taskBlock}}

## Project Context

{{context}}

## Instructions

How should I approach this task? Please provide:
1. A recommended implementation approach with architecture suggestions
2. Key dependencies or risks to watch for
3. A step-by-step breakdown of the work
4. Any relevant patterns from the existing codebase that should be followed
