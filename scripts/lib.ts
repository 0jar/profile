import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

export function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const cvSources = [
  "src/content/bio",
  "src/content/timeline",
  "src/content/projects",
  "src/content/languages",
  "src/page-templates/CvPage.astro",
  "src/styles/print.css",
  "src/data/site.ts"
];

export function calcCVHash(): string {
  const hash = createHash("sha256");
  const files = cvSources.flatMap((p) => (statSync(p).isDirectory() ? walk(p) : [p])).sort();
  for (const f of files) {
    hash.update(f);
    hash.update(readFileSync(f));
  }
  return hash.digest("hex");
}
