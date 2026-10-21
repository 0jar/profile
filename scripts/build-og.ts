import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";
import { site, siteHost } from "../src/data/site.ts";

const font = (file: string) =>
  `data:font/woff2;base64,${readFileSync(file).toString("base64")}`;
const lexendBold = font("public/fonts/Lexend-Bold.woff2");
const lexendReg = font("public/fonts/Lexend-Regular.woff2");
const beBold = font("public/fonts/BeVietnamPro-Bold.woff2");
const beReg = font("public/fonts/BeVietnamPro-Regular.woff2");
const avatar = `data:image/png;base64,${readFileSync("public/favicon-128.png").toString("base64")}`;
const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character] ?? character);

const cards = [
  { lang: "en", name: site.displayName, line: "International economics - Hanoi, Vietnam" },
  { lang: "vi", name: site.displayName, line: "Kinh tế quốc tế - Hà Nội, Việt Nam" }
];

const html = (name: string, line: string) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
  @font-face { font-family: "L"; src: url(${lexendBold}) format("woff2"); font-weight: 700; }
  @font-face { font-family: "L"; src: url(${lexendReg}) format("woff2"); font-weight: 400; }
  @font-face { font-family: "BV"; src: url(${beBold}) format("woff2"); font-weight: 700; }
  @font-face { font-family: "BV"; src: url(${beReg}) format("woff2"); font-weight: 400; }
  html, body {
    margin: 0;
    width: 1200px;
    height: 630px;
    background-color: #1A0F2E;
    background-image:
      radial-gradient(1.5px 1.5px at 8% 18%, #ffffff 80%, transparent),
      radial-gradient(1px 1px at 24% 72%, #ffffff 70%, transparent),
      radial-gradient(1.5px 1.5px at 62% 16%, #ffffff 85%, transparent),
      radial-gradient(1px 1px at 78% 36%, #ffffff 75%, transparent),
      radial-gradient(1.5px 1.5px at 88% 76%, #ffffff 80%, transparent),
      radial-gradient(1px 1px at 44% 84%, #ffffff 70%, transparent);
    background-size: 320px 260px;
  }
  body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 88px;
    box-sizing: border-box;
  }
  .card {
    background: #2A1F45;
    border: 2px solid #4A3F6F;
    border-radius: 20px;
    padding: 56px 64px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .top {
    display: flex;
    align-items: center;
    gap: 24px;
  }
  .top img { width: 88px; height: 88px; border-radius: 14px; flex-shrink: 0; }
  h1 { font: 700 96px/1.1 "L", "BV", sans-serif; color: #F2F2F2; margin: 0; }
  .handle { font: 700 38px/1.35 "L", "BV", sans-serif; color: #54D4FF; margin: 0; }
  p { font: 400 38px/1.35 "BV", "L", sans-serif; color: #BFB9C6; margin: 0; }
  .stripe {
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    height: 15px;
    background: linear-gradient(to bottom, #D60270 0 5px, #9B4F96 5px 10px, #0038A8 10px 15px);
  }
</style></head><body>
  <div class="card">
    <div class="top">
      <img src="${avatar}" alt="" />
      <h1>${escapeHtml(name)}</h1>
    </div>
    <p class="handle">@${escapeHtml(site.monogram)} - ${escapeHtml(siteHost)}</p>
    <p>${escapeHtml(line)}</p>
  </div>
  <div class="stripe"></div>
</body></html>`;

const browser = await chromium.launch();
for (const c of cards) {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.setContent(html(c.name, c.line));
  await page.evaluate(() => document.fonts.ready);
  mkdirSync("public", { recursive: true });
  writeFileSync(`public/og-${c.lang}.png`, await page.screenshot({ type: "png" }));
  await page.close();
  console.log(`public/og-${c.lang}.png written`);
}
await browser.close();
