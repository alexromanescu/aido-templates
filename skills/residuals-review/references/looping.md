# Continuing Audits

Use only when the user explicitly requests continued auditing. A bounded review and follow-up of its fixes use the completion rule in [../SKILL.md](../SKILL.md).

- Define the audit scope and honor any requested budget, duration, or stopping condition. Authorization to audit does not by itself authorize fixes or external actions.
- Between passes, continue independently on remaining in-scope questions. Carry concrete findings and their evidence forward; do not repeatedly re-read an unchanged target without a new question.
- Fix confirmed defects when authorized. Required work stays part of the assignment; record unrelated findings separately. Do not manufacture speculative defects to keep a loop running.
- Unless the user specified a different stopping condition, finish when a pass finds no material issues and previously required fixes have been checked. If the user asked for ongoing monitoring, wait for relevant changes before another pass.
- At an explicit limit or a genuine blocker, preserve the remaining work and state the practical result. Ask only when continuation requires a user decision or new authorization; there is no automatic five-pass permission checkpoint.

After completion, a new relevant code change may justify a fresh bounded review. It does not silently restart the continuing audit.
