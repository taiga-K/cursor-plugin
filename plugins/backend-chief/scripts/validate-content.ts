import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ignored = new Set(["node_modules", ".next", ".git", "coverage", "test-results", "playwright-report"]);

async function markdownFiles(root: string): Promise<string[]> {
  const result: string[] = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const target = path.join(root, entry.name);
    if (entry.isDirectory()) result.push(...await markdownFiles(target));
    else if (entry.isFile() && entry.name.endsWith(".md")) result.push(target);
  }
  return result;
}

export async function validateContent(root: string): Promise<string[]> {
  root = path.resolve(root);
  const errors: string[] = [];
  const graph = new Map<string, Set<string>>();
  const names = new Set<string>();
  const skills: string[] = [];
  const files = await markdownFiles(root);
  for (const file of files) {
    const relative = path.relative(root, file);
    const content = await readFile(file, "utf8");
    const edges = new Set<string>();
    graph.set(file, edges);
    if (path.basename(file) === "SKILL.md") {
      skills.push(file);
      const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(content)?.[1];
      const name = frontmatter?.match(/^name:\s*(.+)$/m)?.[1]?.trim();
      const description = frontmatter?.match(/^description:\s*(.+)$/m)?.[1]?.trim();
      if (!name || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) errors.push(relative + ": invalid skill name");
      if (!description) errors.push(relative + ": missing description");
      if (name && path.basename(path.dirname(file)) !== name) errors.push(relative + ": folder/name mismatch");
      if (name && names.has(name)) errors.push(relative + ": duplicate skill name");
      if (name) names.add(name);
    }
    if (/\[TODO:|\bPLACEHOLDER\b/.test(content)) errors.push(relative + ": unfinished placeholder");
    for (const match of content.matchAll(/\[[^\]\n]*\]\(([^)\s]+)\)/g)) {
      const href = match[1].replace(/^<|>$/g, "");
      if (/^https?:\/\//.test(href) || href.startsWith("#")) continue;
      if (/^[a-zA-Z][\w+.-]*:/.test(href)) {
        errors.push(relative + ": unsupported local link " + href);
        continue;
      }
      let decoded: string;
      try { decoded = decodeURIComponent(href.split("#")[0]); }
      catch { errors.push(relative + ": invalid URL encoding " + href); continue; }
      const target = path.resolve(path.dirname(file), decoded);
      if (target !== root && !target.startsWith(root + path.sep)) {
        errors.push(relative + ": link escapes plugin " + href);
        continue;
      }
      try {
        const targetStat = await stat(target);
        if (targetStat.isFile() && target.endsWith(".md")) edges.add(target);
      } catch { errors.push(relative + ": missing link " + href); }
    }
  }
  const entry = path.join(root, "skills/backend-chief/SKILL.md");
  const reachable = new Set<string>();
  const queue = [entry];
  while (queue.length) {
    const current = queue.pop()!;
    if (reachable.has(current)) continue;
    reachable.add(current);
    for (const next of graph.get(current) ?? []) queue.push(next);
  }
  if (!graph.has(entry)) errors.push("missing backend-chief entrypoint");
  for (const skill of skills) {
    if (!reachable.has(skill)) errors.push(path.relative(root, skill) + ": unreachable from entrypoint");
  }
  return errors;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const root = process.argv[2] ?? fileURLToPath(new URL("..", import.meta.url));
  const errors = await validateContent(root);
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
  } else {
    console.log("Content validation passed: frontmatter, local links, skill reachability.");
  }
}
