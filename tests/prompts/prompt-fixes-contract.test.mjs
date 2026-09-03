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
const teamleadPrompt = await readFile(
  new URL("../../prompts/teamlead-core.md", import.meta.url),
  "utf8",
);

const compactWorkerPrompt = workerPrompt.replace(/\s+/g, " ");
const compactProgramPrompt = programPrompt.replace(/\s+/g, " ");
const compactTeamleadPrompt = teamleadPrompt.replace(/\s+/g, " ");
const startAndFinishSection = workerPrompt.match(
  /## Start and finish the assignment\n([\s\S]*?)(?=\n## )/,
);
const reportingSection = workerPrompt.match(
  /## Reporting\n([\s\S]*?)(?=\n## |$)/,
);

assert.ok(
  startAndFinishSection,
  "the Worker prompt must retain its start-and-finish section",
);
const compactStartAndFinishSection = startAndFinishSection[1].replace(/\s+/g, " ");

assert.ok(
  reportingSection,
  "the Worker prompt must retain its Reporting section",
);
const compactReportingSection = reportingSection[1].replace(/\s+/g, " ");

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

test("Worker reporting guidance names its recipient and both assignment routes", () => {
  assert.match(
    compactReportingSection,
    /Address every report to `@teamlead` — never `@user`\./,
  );
  assert.match(
    compactReportingSection,
    /engine labels it "Addressed to you by @teamlead".{0,80}JOIN payload.{0,160}later assignment arrives as a `@teamlead` room message/i,
  );
  assert.match(
    compactReportingSection,
    /`@user` is never your reporting recipient/i,
  );
});

test("Worker reporting guidance removes the false user-delivery premise", () => {
  assert.doesNotMatch(workerPrompt, /from user\b/i);
  assert.doesNotMatch(workerPrompt, /delivery mechanism/i);
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

test("a Program checkpoint replacement supersedes the work it replaces", () => {
  assert.match(
    compactProgramPrompt,
    /checkpoint.{0,160}fix-task.{0,160}replac(?:es|ing).{0,120}(?:held|failed).{0,120}`aido\.strikeSlice\(\{ workItemId: "<old>", outcome: "superseded", by: "<fix-task id>" \}\)`/i,
  );
  assert.match(
    compactProgramPrompt,
    /(?:re-point|re-points|repoint|repoints).{0,80}dependents.{0,100}completion gates.{0,120}automatically/i,
  );
  assert.match(
    compactProgramPrompt,
    /no.{0,80}(?:hand edit|manual edit).{0,100}(?:operator escalation|escalat)/i,
  );
  assert.match(
    compactProgramPrompt,
    /`aido\.strikeSlice\(\{ workItemId, outcome: "deferred", note \}\)`/i,
  );
  assert.doesNotMatch(compactProgramPrompt, /\bsliceId\b/);
});

test("a Teamlead checks live worker status before reporting a stall", () => {
  assert.match(
    teamleadPrompt,
    /before declaring or reporting[^\n]{0,80}(?:worker|@handle)[^\n]{0,40}stall(?:ed|ing)[^\n]{0,120}`aido\.workerStatus\(\{ handle \}\)`/i,
  );
  assert.match(
    compactTeamleadPrompt,
    /judge only.{0,120}commit age.{0,120}dirty-file count.{0,120}process liveness.{0,120}last-turn state/i,
  );
  assert.match(
    compactTeamleadPrompt,
    /do not poll/i,
  );
  assert.match(
    compactTeamleadPrompt,
    /`workerStatus` does not (?:make|provide|return).{0,40}(?:automatic|automated) stall verdict/i,
  );
});

// 2026-09-03 — slice-cost drift check (aido Phase 26) and Worker architecture rule.
const driftSection = programPrompt.match(
  /\*\*Handle a slice-cost drift check with one question and one ruling\.\*\*([\s\S]*?)(?=\n\n\*\*|\n## |$)/,
);
test("the Program teamlead handles a slice-cost drift check with one question and one ruling", () => {
  assert.ok(driftSection, "the Program prompt must carry the drift-check paragraph");
  const compact = driftSection[1].replace(/\s+/g, " ");
  assert.match(compact, /aido\.workerStatus\(\{ handle \}\)/);
  assert.match(compact, /commitSubjects/);
  assert.match(compact, /which named rows are fixed and verified, what are you doing now, and is that work inside the named rows/i);
  assert.match(compact, /never read or summarize the transcript/i);
  assert.match(compact, /rule exactly one of: \*\*continue\*\*; or \*\*stop\*\*/i);
  assert.match(compact, /keep the verified fixes, revert the rest, run the gate, and report for merge/i);
  assert.match(compact, /never forward it to the operator/i);
  assert.match(compact, /later whole-multiple trigger \(3x, 4x, \.\.\.\) earns the same one question and one fresh ruling; do not repeat a ruling without a new trigger/i);
});

const architectureSection = workerPrompt.match(
  /## Architecture decisions\n([\s\S]*?)(?=\n## |$)/,
);
test("the Worker treats architecture as a proposal to the teamlead, never a decision", () => {
  assert.ok(architectureSection, "the Worker prompt must carry the Architecture decisions section");
  const compact = architectureSection[1].replace(/\s+/g, " ");
  assert.match(compact, /Architecture, a new subsystem, and a new abstraction are proposals to the teamlead, never Worker decisions/);
  assert.match(compact, /`ROOM-DECISION` to `@teamlead`/);
  assert.match(compact, /wait for its ruling before building it/i);
  assert.match(compact, /Do not expand the assigned scope while deciding locally/);
});

// 2026-09-03 — the checkpoint specialist may fix S-sized findings inside the reviewed diff (BUG-907 companion).
test("the checkpoint specialist may fix S-sized findings inside the reviewed diff and owes a brief per fix-task", () => {
  assert.doesNotMatch(compactProgramPrompt, /does \*\*not\*\* fix code|does not fix code|never fixes code/i);
  assert.match(compactProgramPrompt, /The specialist may fix a finding itself only when the fix is S-sized, red-first, and inside the diff it reviewed, re-running the gate afterwards\./);
  assert.match(compactProgramPrompt, /Everything larger is filed as a fix-task\./);
  assert.match(compactProgramPrompt, /When it changed production code it says so in its decision-log entry\./);
  assert.match(compactProgramPrompt, /<!-- aido:brief \{"version":1,"briefRef":"<briefRef>"\} -->/);
  assert.match(compactProgramPrompt, /aido refuses to dispatch a fix-task whose block is missing \(BUG-907\)/);
  for (const sentence of [
    "Run the completion review once.",
    "Batch all fix-tasks it files into one follow-up work item.",
    "Run a second completion review only when that follow-up changed production code.",
    "Milestone reviews remain optional and are dispatched only when you time them.",
  ]) assert.ok(compactProgramPrompt.includes(sentence), `one-checkpoint rule sentence retained: ${sentence}`);
});
