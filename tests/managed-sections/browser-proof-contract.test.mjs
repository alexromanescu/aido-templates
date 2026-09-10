import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const testsTemplate = await readFile(
  new URL("../../managed-sections/tests-default.md", import.meta.url),
  "utf8",
);

const browser = testsTemplate.replace(/\s+/g, " ");

test("required browser proof retains reproducible provenance and exercises real breakpoints", () => {
  assert.match(browser, /exact (?:executable )?script[^.]{0,80}(?:report|output)/i);
  assert.match(browser, /(?:fake|intercepted)[^.]{0,100}(?:boundar|network|data)/i);
  assert.match(browser, /genuine|actual|real/);
  assert.match(browser, /breakpoint/i);
  assert.match(browser, /(?:forcing|forced)[^.]{0,100}desktop media query[^.]{0,100}phone[^.]{0,100}(?:cannot|does not|doesn't)[^.]{0,100}mobile acceptance/i);
});
