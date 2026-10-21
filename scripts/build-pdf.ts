import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";
import { PDFDocument } from "pdf-lib";
import { chromium, type Page } from "playwright";
import { calcCVHash } from "./lib.ts";
import { shippedLocales, site } from "../src/data/site.ts";

const origin = "http://localhost:4399";
const mime: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf"
};

export async function mountDist(page: Page, extraHeaders: Record<string, string> = {}) {
  await page.route(`${origin}/**`, async (route) => {
    const url = new URL(route.request().url());
    let rel = decodeURIComponent(url.pathname);
    let diskPath = join("dist", rel);
    if (existsSync(diskPath) && statSync(diskPath).isDirectory()) {
      diskPath = join(diskPath, "index.html");
    }
    if (!existsSync(diskPath) || statSync(diskPath).isDirectory()) {
      const fallback = rel.startsWith("/vi/") ? "dist/vi/404/index.html" : "dist/404.html";
      await route.fulfill({
        status: 404,
        headers: { "content-type": "text/html; charset=utf-8", ...extraHeaders },
        body: existsSync(fallback) ? readFileSync(fallback) : "Not found"
      });
      return;
    }
    const ext = extname(diskPath);
    await route.fulfill({
      status: 200,
      headers: { "content-type": mime[ext] ?? "application/octet-stream", ...extraHeaders },
      body: readFileSync(diskPath)
    });
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const pages = shippedLocales.flatMap((lang) => [
    { url: `${lang === "en" ? "" : `/${lang}`}/cv/`, out: `${site.pdfBaseName}-${lang}.pdf`, max: 2 },
    { url: `${lang === "en" ? "" : `/${lang}`}/cv/ats/`, out: `${site.pdfBaseName}-${lang}-ats.pdf`, max: 1 }
  ]);

  mkdirSync("public/cv", { recursive: true });
  const browser = await chromium.launch();
  const files: Record<string, string> = {};
  for (const p of pages) {
    const page = await browser.newPage();
    await mountDist(page);
    await page.goto(origin + p.url, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: false,
      margin: { top: "14mm", bottom: "14mm", left: "16mm", right: "16mm" }
    });
    const count = (await PDFDocument.load(pdf)).getPageCount();
    if (count > p.max) throw new Error(`${p.out}: ${count} pages, limit ${p.max}`);
    writeFileSync(`public/cv/${p.out}`, pdf);
    files[`cv/${p.out}`] = createHash("sha256")
      .update(readFileSync(`public/cv/${p.out}`))
      .digest("hex");
    console.log(`${p.out}: ${count} page(s)`);
    await page.close();
  }
  await browser.close();
  writeFileSync(
    "public/cv/cv-hashes.json",
    JSON.stringify({ sourceHash: calcCVHash(), files }, null, 2) + "\n"
  );
}
