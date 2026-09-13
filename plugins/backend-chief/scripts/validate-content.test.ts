import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { validateContent } from "./validate-content.ts";

async function sample(run: (root: string) => Promise<void>) {
  const root = await mkdtemp(path.join(os.tmpdir(), "backend-chief-content-"));
  try {
    await mkdir(path.join(root, "skills/backend-chief"), { recursive: true });
    await writeFile(path.join(root, "skills/backend-chief/SKILL.md"),
      "---\nname: backend-chief\ndescription: example\n---\n\n# Entry\n");
    await run(root);
  } finally { await rm(root, { recursive: true, force: true }); }
}

test("valid entrypoint passes", () => sample(async (root) => {
  assert.deepEqual(await validateContent(root), []);
}));
test("broken reference is reported", () => sample(async (root) => {
  await writeFile(path.join(root, "README.md"), "[missing](missing.md)");
  assert.ok((await validateContent(root)).some((item) => item.includes("missing link")));
}));
test("out-of-plugin reference is rejected", () => sample(async (root) => {
  await writeFile(path.join(root, "README.md"), "[outside](../outside.md)");
  assert.ok((await validateContent(root)).some((item) => item.includes("escapes plugin")));
}));
test("orphan skill cannot silently ship", () => sample(async (root) => {
  await mkdir(path.join(root, "skills/orphan"));
  await writeFile(path.join(root, "skills/orphan/SKILL.md"), "---\nname: orphan\ndescription: example\n---\n");
  assert.ok((await validateContent(root)).some((item) => item.includes("unreachable")));
}));
test("frontmatter omission is reported", () => sample(async (root) => {
  await writeFile(path.join(root, "skills/backend-chief/SKILL.md"), "---\nname: backend-chief\n---\n");
  assert.ok((await validateContent(root)).some((item) => item.includes("missing description")));
}));
