import { existsSync, readFileSync, readdirSync } from "node:fs";
import matter from "gray-matter";
import { shippedLocales } from "../src/data/site.ts";
import { geoNodes } from "../src/data/geography.ts";
import { ui } from "../src/i18n/ui.ts";

const errors: string[] = [];
const fail = (msg: string) => errors.push(msg);
const allowlist = new Set([
  "Jarema", "Vanh", "Arkady", "DAiTech", "IELTS Academic", "Overall Band 8.0",
  "Tartu", "Aarhus", "Estonia", "Codeberg", "GitHub", "GitLab", "English",
  "Tiếng Việt", "CV", "Lab", "Astro", "Next.js", "Source", "Live", "MB Bank", "Pronouns.page"
]);
const [base, ...others] = shippedLocales;

const baseKeys = Object.keys(ui[base]).sort();
for (const lang of others) {
  const keys = Object.keys(ui[lang]).sort();
  for (const k of baseKeys) if (!keys.includes(k)) fail(`ui: "${lang}" is missing key ${k}`);
  for (const k of keys) if (!baseKeys.includes(k)) fail(`ui: "${lang}" has extra key ${k}`);
  for (const k of keys as (keyof (typeof ui)[typeof base])[]) {
    const v = ui[lang][k];
    if (v === ui[base][k] && !allowlist.has(v)) fail(`ui: "${lang}.${k}" is identical to English`);
  }
}

for (const col of ["bio", "timeline", "projects", "geography", "faq"]) {
  const names = (lang: string) => readdirSync(`src/content/${col}/${lang}`).sort();
  for (const lang of others) {
    const a = names(base).join();
    const b = names(lang).join();
    if (a !== b) fail(`${col}: file lists differ between ${base} and ${lang}`);
    for (const f of names(base)) {
      const pa = `src/content/${col}/${base}/${f}`;
      const pb = `src/content/${col}/${lang}/${f}`;
      if (!existsSync(pb)) continue;
      const da = matter(readFileSync(pa, "utf8"));
      const db = matter(readFileSync(pb, "utf8"));
      const ka = Object.keys(da.data).sort().join();
      const kb = Object.keys(db.data).sort().join();
      if (ka !== kb) fail(`${pb}: frontmatter keys differ from ${pa}`);
      if (!db.content.trim()) fail(`${pb}: empty body`);
      for (const [key, val] of Object.entries(db.data)) {
        if (typeof val === "string" && val === da.data[key] && /[A-Za-z]{4,}/.test(val) && !allowlist.has(val) && !/^\d{4}-|^https?:|^[a-z]+$/.test(val)) {
          fail(`${pb}: "${key}" is identical to English`);
        }
      }
    }
  }
}

for (const lang of shippedLocales) {
  for (const node of geoNodes) {
    const p = `src/content/geography/${lang}/${node.nodeId}.md`;
    if (!existsSync(p) || !matter(readFileSync(p, "utf8")).content.trim()) fail(`geography: missing or empty ${p}`);
  }
}

const codes = (lang: string) =>
  [...readFileSync(`src/content/languages/${lang}.yaml`, "utf8").matchAll(/code:\s*"(\w+)"/g)].map((m) => m[1]).join();
for (const lang of others) if (codes(lang) !== codes(base)) fail(`languages: codes differ between ${base} and ${lang}`);

if (errors.length) {
  console.error(errors.map((e) => `  ${e}`).join("\n"));
  console.error(`check-i18n: ${errors.length} problem(s)`);
  process.exit(1);
}
console.log("check-i18n: OK");
