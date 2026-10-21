import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";
import AxeBuilder from "@axe-core/playwright";
import { chromium, type Browser } from "playwright";
import { playwrightConfig } from "../playwright.config.ts";
import { mountDist } from "../scripts/build-pdf.ts";
import { site } from "../src/data/site.ts";

const { cspHeader, routes } = playwrightConfig;
const origin = "http://localhost:4399";
let browser: Browser;

describe("Accessibility, CSP, canonicals, and locale identity", () => {
  before(async () => {
    browser = await chromium.launch();
  });

  after(async () => {
    if (browser) await browser.close();
  });

  test("zero axe violations and zero CSP console errors", async () => {
    for (const mode of [
      { name: "light", colorScheme: "light" as const, csp: cspHeader },
      { name: "dark", colorScheme: "dark" as const, csp: cspHeader },
      { name: "no-js dark", colorScheme: "dark" as const, csp: "default-src 'self'; script-src 'none'; style-src 'self'; img-src 'self' data:; font-src 'self'" }
    ]) {
      const context = await browser.newContext({ colorScheme: mode.colorScheme });
      const page = await context.newPage();
      const cspErrors: string[] = [];

      await mountDist(page, { "content-security-policy": mode.csp });

      page.on("console", (msg) => {
        if (msg.type() === "error" && /Content Security Policy/i.test(msg.text())) {
          cspErrors.push(msg.text());
        }
      });

      for (const path of routes) {
        await page.goto(origin + path, { waitUntil: "networkidle" });
        const results = await new AxeBuilder({ page }).analyze();
        assert.equal(
          results.violations.length,
          0,
          `Axe violations on ${path} (${mode.name}): ${JSON.stringify(results.violations, null, 2)}`
        );
      }

      if (mode.name !== "no-js dark") {
        assert.equal(cspErrors.length, 0, `CSP console errors (${mode.name}): ${cspErrors.join("; ")}`);
      }
      await context.close();
    }
  });

  test("locale headings, links on ATS CV, 404 on /en/", async () => {
    const page = await browser.newPage();
    await mountDist(page);

    await page.goto(`${origin}/`, { waitUntil: "networkidle" });
    assert.equal(await page.locator("h1").textContent(), site.displayName);
    assert.equal(await page.title(), site.displayName);

    await page.goto(`${origin}/vi/`, { waitUntil: "networkidle" });
    assert.equal(await page.locator("h1").textContent(), site.displayName);
    assert.equal(await page.title(), site.displayName);

    await page.goto(`${origin}/cv/ats/`, { waitUntil: "networkidle" });
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), `${site.url}/cv/`);

    await page.goto(`${origin}/vi/cv/ats/`, { waitUntil: "networkidle" });
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), `${site.url}/vi/cv/`);

    const enRes = await page.goto(`${origin}/en/`);
    assert.equal(enRes?.status(), 404);

    await page.close();
  });
});
