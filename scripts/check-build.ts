import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { PDFDocument } from "pdf-lib";
import { calcCVHash, walk } from "./lib.ts";
import { cspHeader, themeHash } from "./security.ts";
import { shippedLocales, site } from "../src/data/site.ts";

const errors: string[] = [];
const fail = (msg: string) => errors.push(msg);
const email = site.email;
const jsBudget = 40 * 1024;
const vercel = JSON.parse(readFileSync("vercel.json", "utf8"));
const vercelCsp = vercel.headers
  ?.find((entry: { source?: string }) => entry.source === "/(.*)")
  ?.headers?.find((header: { key?: string }) => header.key === "Content-Security-Policy")?.value;

if (vercelCsp !== cspHeader) fail("vercel.json: CSP differs from the shared security policy");

if (!existsSync("dist")) fail("dist/ is missing, run astro build first");
else {
  if (existsSync("dist/en")) fail("dist/en/ must not exist");
  for (const f of walk("dist").filter((p) => p.endsWith(".html"))) {
    const html = readFileSync(f, "utf8");
    if (/\sstyle=/.test(html)) fail(`${f}: inline style attribute`);
    for (const m of html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g)) {
      const h = createHash("sha256").update(m[1] ?? "").digest("base64");
      if (h !== themeHash) fail(`${f}: inline script with unexpected hash ${h}`);
    }
    const mailtos = new Set([...html.matchAll(/mailto:([^"?\s<&]+)/g)].map((m) => m[1]));
    const copies = [...html.matchAll(/data-copy-email="([^"]+)"/g)].map((m) => m[1]);
    if ([...mailtos].some((m) => m !== email) || copies.some((c) => c !== email)) fail(`${f}: email mismatch`);
    const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    if (ld && JSON.parse(ld[1] ?? "{}").email !== `mailto:${email}`) fail(`${f}: JSON-LD email mismatch`);
  }
  for (const f of ["dist/index.html", "dist/vi/index.html"]) {
    const html = readFileSync(f, "utf8");
    if (!html.includes(`mailto:${email}`)) fail(`${f}: no mailto link`);
    if (!html.includes(`data-copy-email="${email}"`)) fail(`${f}: no copy button`);
    if (!html.includes(`"email":"mailto:${email}"`)) fail(`${f}: no JSON-LD email`);
  }
  for (const lang of shippedLocales) {
    const p = `public/og-${lang}.png`;
    if (!existsSync(p)) {
      fail(`${p} is missing`);
      continue;
    }
    const png = readFileSync(p);
    if (png.readUInt32BE(16) !== 1200 || png.readUInt32BE(20) !== 630) fail(`${p}: not 1200x630`);
  }
  for (const file of ["dist/index.html", "dist/vi/index.html"]) {
    const html = readFileSync(file, "utf8");
    let total = 0;
    for (const m of html.matchAll(/<script[^>]*\bsrc="([^"]+)"/g)) {
      total += gzipSync(readFileSync(`dist${m[1]}`)).length;
    }
    console.log(`${file}: ${total} bytes gzipped JS`);
    if (total > jsBudget) fail(`${file}: JS ${total} B exceeds ${jsBudget} B`);
  }
}

if (!existsSync("public/cv/cv-hashes.json")) fail("public/cv/cv-hashes.json is missing, run pnpm run build:pdf");
else {
  const manifest = JSON.parse(readFileSync("public/cv/cv-hashes.json", "utf8"));
  if (manifest.sourceHash !== calcCVHash()) fail("CV PDFs are stale, run pnpm run build:pdf");
  for (const lang of shippedLocales) {
    for (const [suffix, min, max] of [["", 1, 2], ["-ats", 1, 1]] as const) {
      const p = `public/cv/${site.pdfBaseName}-${lang}${suffix}.pdf`;
      if (!existsSync(p)) {
        fail(`${p} is missing`);
        continue;
      }
      const bytes = readFileSync(p);
      if (manifest.files?.[p.replace("public/", "")] !== createHash("sha256").update(bytes).digest("hex")) fail(`${p}: hash differs from manifest`);
      const pages = (await PDFDocument.load(bytes)).getPageCount();
      if (pages < min || pages > max) fail(`${p}: ${pages} page(s), expected ${min} to ${max}`);
    }
  }
}

if (errors.length) {
  console.error(errors.map((e) => `  ${e}`).join("\n"));
  console.error(`check-build: ${errors.length} problem(s)`);
  process.exit(1);
}
console.log("check-build: OK");
