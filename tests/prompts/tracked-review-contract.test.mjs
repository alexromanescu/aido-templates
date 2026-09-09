import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const workerPrompt = await readFile(
  new URL("../../prompts/worker-system.md", import.meta.url),
  "utf8",
);
const teamleadPrompt = await readFile(
  new URL("../../prompts/teamlead-core.md", import.meta.url),
  "utf8",
);
const programPrompt = await readFile(
  new URL("../../prompts/teamlead-program.md", import.meta.url),
  "utf8",
);
const testsTemplate = await readFile(
  new URL("../../managed-sections/tests-default.md", import.meta.url),
  "utf8",
);

const compact = (value) => value.replace(/\s+/g, " ");
const worker = compact(workerPrompt);
const teamlead = compact(teamleadPrompt);
const program = compact(programPrompt);
const browser = compact(testsTemplate);

test("a modifying engagement Worker requests its retained Teamlead's bounded pre-merge review", () => {
  assert.match(worker, /modif(?:y|ying|ies)[^.]{0,160}independent pre-merge review/i);
  assert.match(worker, /request[^.]{0,80}retained, metered `@teamlead`[^.]{0,80}(?:perform|run|conduct|review)/i);
  assert.match(worker, /original base[^.]{0,100}reviewed head/i);
  assert.match(worker, /do not[^.]{0,120}(?:provider-native|native)[^.]{0,80}(?:reviewer|model|helper)/i);
  assert.match(worker, /outside aido accounting/i);
});

test("the retained Teamlead may inspect review evidence but cannot author the implementation", () => {
  assert.match(teamlead, /original base[^.]{0,100}reviewed head/i);
  assert.match(teamlead, /bounded diff[^.]{0,100}(?:source|implementation)[^.]{0,100}(?:actual )?test evidence/i);
  assert.match(teamlead, /(?:return|report)[^.]{0,80}actionable findings/i);
  assert.match(teamlead, /(?:must not|never|do not)[^.]{0,100}(?:author|write|fix)[^.]{0,80}(?:implementation|worker'?s change|code)/i);
  assert.match(teamlead, /retained, metered Teamlead/i);
  assert.match(teamlead, /requests[^.]{0,100}required pre-merge review[^.]{0,100}workflow contract/i);
  assert.doesNotMatch(teamlead, /it is the worker's gate, not yours to waive or run/i);
});

test("tracked review repeats the full change after recovery or concurrency fixes", () => {
  assert.match(worker, /(?:recovery|concurrency)[^.]{0,100}(?:recovery|concurrency)[^.]{0,160}(?:fresh|repeat|again|re-review|rereview)[^.]{0,100}full (?:change|diff)[^.]{0,100}original base/i);
  assert.match(teamlead, /(?:recovery|concurrency)[^.]{0,100}(?:recovery|concurrency)[^.]{0,160}(?:fresh|repeat|again|re-review|rereview)[^.]{0,100}full (?:change|diff)[^.]{0,100}original base/i);
});

test("tracked review does not replace specialist acceptance, owner approval, or operator Residuals", () => {
  for (const prompt of [worker, teamlead]) {
    assert.match(prompt, /(?:does not|doesn't|never|neither)[^.]{0,120}(?:specialist|acceptance)/i);
    assert.match(prompt, /owner-only approval/i);
    assert.match(prompt, /operator[^.]{0,80}Residuals[^.]{0,80}(?:triggered|starts|request)/i);
  }
  assert.match(program, /specialist dispatch/i);
});

test("required browser proof retains reproducible provenance and exercises real breakpoints", () => {
  assert.match(browser, /exact (?:executable )?script[^.]{0,80}(?:report|output)/i);
  assert.match(browser, /(?:fake|intercepted)[^.]{0,100}(?:boundar|network|data)/i);
  assert.match(browser, /genuine|actual|real/);
  assert.match(browser, /breakpoint/i);
  assert.match(browser, /(?:forcing|forced)[^.]{0,100}desktop media query[^.]{0,100}phone[^.]{0,100}(?:cannot|does not|doesn't)[^.]{0,100}mobile acceptance/i);
});
