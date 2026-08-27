import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const workerPrompt = await readFile(
  new URL("../../prompts/worker-system.md", import.meta.url),
  "utf8",
);
const programPrompt = await readFile(
  new URL("../../prompts/teamlead-program.md", import.meta.url),
  "utf8",
);

const compactWorkerPrompt = workerPrompt.replace(/\s+/g, " ");
const compactProgramPrompt = programPrompt.replace(/\s+/g, " ");
const startAndFinishSection = workerPrompt.match(
  /## Start and finish the assignment\n([\s\S]*?)(?=\n## )/,
);

assert.ok(
  startAndFinishSection,
  "the Worker prompt must retain its start-and-finish section",
);
const compactStartAndFinishSection = startAndFinishSection[1].replace(/\s+/g, " ");

test("an addressed engine assignment is the Worker's go signal", () => {
  assert.match(
    compactWorkerPrompt,
    /engine assignment addressed to your Worker handle.{0,100}(?:is|counts as).{0,40}(?:the )?go/i,
  );
  assert.match(
    compactWorkerPrompt,
    /begin (?:the assignment|work) immediately.{0,100}(?:same turn|tool calls)/i,
  );
});

test("an addressed Worker assignment outranks and bounds cursor work", () => {
  assert.match(
    compactStartAndFinishSection,
    /engine assignment addressed to your Worker handle is the go and your complete scope; it outranks `docs\/active-work\.md`/i,
  );
  assert.match(
    compactStartAndFinishSection,
    /read that cursor only when the assignment names a slice or explicitly says to continue it/i,
  );
  assert.match(
    compactStartAndFinishSection,
    /an ad-hoc brief without a slice means do exactly that brief and nothing else, even when the cursor shows unclaimed items/i,
  );
  assert.match(
    compactStartAndFinishSection,
    /report completion to `@teamlead`/i,
  );
});

test("a Worker starts an addressed assignment from either room delivery route", () => {
  assert.match(
    compactStartAndFinishSection,
    /assignment addressed to your (?:Worker )?handle (?:is|counts as) (?:the )?go whether it arrives in the JOIN payload or as a later room message from `@teamlead`/i,
  );
  assert.match(
    compactStartAndFinishSection,
    /cursor rule.{0,100}(?:which|what) documents to read.{0,100}never.{0,40}whether to (?:start|begin)/i,
  );
});

test("the Worker's first response is work, not a readiness acknowledgement", () => {
  assert.match(
    compactWorkerPrompt,
    /first (?:room )?(?:reply|response).{0,100}(?:after|contain|report).{0,120}(?:work|evidence|result|blocker)/i,
  );
  assert.match(
    compactWorkerPrompt,
    /do not.{0,80}(?:acknowledge|acknowledgement).{0,100}(?:ready|standing by|wait)/i,
  );
});

test("a Worker adapts commands to its available runtime instead of proposing denied host execution", () => {
  assert.match(
    compactWorkerPrompt,
    /known to be auto-denied.{0,100}do not send.{0,40}ROOM-PROPOSAL/i,
  );
  assert.match(
    compactWorkerPrompt,
    /host execution is unavailable.{0,160}do not.{0,120}teamlead permission/i,
  );
  assert.match(
    compactWorkerPrompt,
    /adapt.{0,120}sandbox.{0,120}(?:required|necessary).{0,40}(?:flag|option)/i,
  );
});

test("a Program Teamlead rules Worker and Specialist decision requests", () => {
  assert.match(
    compactProgramPrompt,
    /answer.{0,80}(?:Worker|worker).{0,40}(?:Specialist|specialist).{0,80}ROOM-DECISION.{0,80}(?:yourself|directly)/i,
  );
});

test("a Program Teamlead escalates decisions only across the four operator boundaries", () => {
  const boundarySentence = compactProgramPrompt.match(
    /Escalate a decision only when[^.]+\./,
  );
  assert.ok(boundarySentence, "the Program prompt must define decision escalation");
  assert.equal(
    boundarySentence[0],
    "Escalate a decision only when its answer would change scope, spend money, touch production, or contradict the program's Guardrails — those are the operator boundaries.",
  );
  assert.doesNotMatch(
    compactProgramPrompt,
    /(?:inconclusive|decision only).{0,200}raise it to the operator/i,
  );
});
