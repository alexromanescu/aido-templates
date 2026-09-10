import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

const ROOT = new URL("../../", import.meta.url).pathname;
const SECTIONS_DIR = join(ROOT, "managed-sections");

// Budgets are deliberate ceilings, not targets. Raising one is a policy change:
// justify it in the commit and in CLAUDE.md's "Budgets" section.
const CLAUDE_MD_DEFAULT_TOTAL_BODY_WORDS = 800;
const SINGLE_SECTION_BODY_WORDS = 700;

function parseSection(filename, text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  assert.ok(m, `${filename}: missing frontmatter`);
  const fm = Object.fromEntries(
    m[1].split("\n").filter(Boolean).map((line) => {
      const i = line.indexOf(":");
      return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
    }),
  );
  const body = m[2];
  const words = body.split(/\s+/).filter(Boolean).length;
  return { filename, fm, body, words };
}

async function loadSections() {
  const files = (await readdir(SECTIONS_DIR)).filter((f) => f.endsWith(".md")).sort();
  return Promise.all(files.map(async (f) => parseSection(f, await readFile(join(SECTIONS_DIR, f), "utf8"))));
}

async function walkMarkdown(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "node_modules" || entry.name === "tests") continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walkMarkdown(path, out);
    else if (entry.name.endsWith(".md")) out.push(path);
  }
  return out;
}

test("every managed section declares section/stack/version and matches its filename", async () => {
  for (const s of await loadSections()) {
    assert.match(s.fm.version ?? "", /^\d+$/, `${s.filename}: version`);
    assert.equal(`${s.fm.section}-${s.fm.stack}.md`, s.filename, `${s.filename}: section/stack must match filename`);
  }
});

test("always-loaded CLAUDE.md guidance stays within the word budget", async () => {
  const sections = await loadSections();
  const claudeDefault = sections.filter((s) => (s.fm.target ?? "CLAUDE.md") === "CLAUDE.md" && s.fm.stack === "default");
  const total = claudeDefault.reduce((n, s) => n + s.words, 0);
  const detail = claudeDefault.map((s) => `${s.fm.section}=${s.words}`).join(", ");
  assert.ok(
    total <= CLAUDE_MD_DEFAULT_TOTAL_BODY_WORDS,
    `CLAUDE.md default blocks total ${total} body words (${detail}); budget ${CLAUDE_MD_DEFAULT_TOTAL_BODY_WORDS}`,
  );
  for (const s of sections) {
    assert.ok(s.words <= SINGLE_SECTION_BODY_WORDS, `${s.filename}: ${s.words} body words; budget ${SINGLE_SECTION_BODY_WORDS}`);
  }
});

test("every docs/process pointer resolves to an existing process-* section", async () => {
  const sections = await loadSections();
  const processTargets = new Set(sections.map((s) => s.fm.target).filter((t) => t?.startsWith("docs/process/")));
  const files = [
    ...(await walkMarkdown(join(ROOT, "managed-sections"))),
    ...(await walkMarkdown(join(ROOT, "skills"))),
    ...(await walkMarkdown(join(ROOT, "prompts"))),
    ...(await walkMarkdown(join(ROOT, "rooms"))),
    ...(await readdir(ROOT)).filter((f) => f.endsWith("-default.md")).map((f) => join(ROOT, f)),
  ];
  const dangling = [];
  for (const file of files) {
    const text = await readFile(file, "utf8");
    for (const m of text.matchAll(/docs\/process\/[a-z-]+\.md/g)) {
      if (!processTargets.has(m[0])) dangling.push(`${file.slice(ROOT.length)} -> ${m[0]}`);
    }
  }
  assert.deepEqual(dangling, [], `dangling process-doc pointers:\n${dangling.join("\n")}`);
});

test("the governance catalog and skills/ agree exactly", async () => {
  const catalog = JSON.parse(await readFile(join(ROOT, "agent-governance", "catalog.json"), "utf8"));
  const onDisk = new Set((await readdir(join(ROOT, "skills"), { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name));
  const owners = new Map();
  for (const cap of catalog.capabilities) {
    for (const r of cap.realizations) {
      if (r.provenance?.type !== "templates") continue;
      const folder = r.provenance.path.replace(/^skills\//, "");
      assert.equal(r.nativeId, folder, `${r.id}: nativeId must equal its source folder`);
      assert.ok(onDisk.has(folder), `${r.id}: source skills/${folder} is missing`);
      const fm = (await readFile(join(ROOT, "skills", folder, "SKILL.md"), "utf8")).split("---")[1] ?? "";
      assert.match(fm, new RegExp(`^name: ${folder}$`, "m"), `skills/${folder}/SKILL.md frontmatter name must be ${folder}`);
      owners.set(folder, (owners.get(folder) ?? new Set()).add(cap.id));
    }
  }
  assert.deepEqual([...owners.keys()].sort(), [...onDisk].sort(), "every skills/ folder is catalogued and every catalogued source exists");
  for (const [folder, caps] of owners) assert.equal(caps.size, 1, `skills/${folder} is owned by more than one capability: ${[...caps]}`);
  const ids = new Set(catalog.capabilities.map((c) => c.id));
  const rids = new Set(catalog.capabilities.flatMap((c) => c.realizations.map((r) => r.id)));
  for (const profile of catalog.profiles) {
    for (const req of profile.requirements) {
      assert.ok(ids.has(req.capabilityId) && rids.has(req.realizationId), `${profile.id}: dangling requirement ${req.realizationId}`);
    }
  }
});

test("no guidance names a skill folder that no longer exists", async () => {
  // Every skill folder that has ever been distributed from this repo, so a
  // retired name cannot linger in a block, scaffold, skill, prompt, or the
  // authoring guide. Append when retiring a skill; never remove.
  const EVER_DISTRIBUTED = [
    "debugging", "frontend-tests", "program-prep", "residuals-review", "structural-tests",
    "test-design", "test-hardening", "testing-by-simulation", "verify",
  ];
  const existing = new Set((await readdir(join(ROOT, "skills"), { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name));
  const retired = EVER_DISTRIBUTED.filter((n) => !existing.has(n));
  assert.ok(retired.length > 0, "the retired list is empty; the test would be vacuous");
  const files = [
    ...(await walkMarkdown(join(ROOT, "managed-sections"))),
    ...(await walkMarkdown(join(ROOT, "skills"))),
    ...(await walkMarkdown(join(ROOT, "prompts"))),
    ...(await walkMarkdown(join(ROOT, "rooms"))),
    ...(await readdir(ROOT)).filter((f) => f.endsWith("-default.md")).map((f) => join(ROOT, f)),
    join(ROOT, "CLAUDE.md"),
    join(ROOT, "agent-governance", "catalog.json"),
  ];
  const hits = [];
  for (const file of files) {
    // This repo consumes its own blocks; those are updated by sync, not here.
    const text = (await readFile(file, "utf8")).replace(/<!-- managed:[a-z0-9-]+ v=\d+ -->[\s\S]*?<!-- \/managed:[a-z0-9-]+ -->/g, "");
    for (const name of retired) {
      if (new RegExp(`(?<![A-Za-z0-9_-])${name}(?![A-Za-z0-9_-])`).test(text)) hits.push(`${file.slice(ROOT.length)} names ${name}`);
    }
  }
  assert.deepEqual(hits, []);
});
