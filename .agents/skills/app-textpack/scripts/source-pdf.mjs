// Saves the source of a text pack as a tagged PDF with a licence notice on top.
// Usage: node source-pdf.mjs --url <fixed-revision url> --out sources/de/<id>.pdf --title <title>
//   --licence "CC BY-SA 4.0" --licence-url <url> --authors-url <url> --retrieved <YYYY-MM-DD>
//   [--selector "#mw-content-text"] [--lang de]
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((pairs, value, index, all) => {
    if (value.startsWith("--")) pairs.push([value.slice(2), all[index + 1]]);
    return pairs;
  }, []),
);
const required = ["url", "out", "title", "licence", "licence-url", "authors-url", "retrieved"];
const missing = required.filter((key) => !args[key]);
if (missing.length > 0) {
  console.error(`Missing: ${missing.map((key) => `--${key}`).join(", ")}`);
  process.exit(2);
}
const selector = args.selector ?? "body";
const lang = args.lang ?? "de";

// PLAYWRIGHT_CHROMIUM_PATH: use an installed Chromium when the version Playwright expects is missing.
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH;
const browser = await chromium.launch(executablePath ? { executablePath } : {});
try {
  const page = await browser.newPage();
  const response = await page.goto(args.url, { waitUntil: "load" });
  if (!response || !response.ok()) {
    throw new Error(`Source answered ${response ? response.status() : "nothing"}; not saved.`);
  }
  const found = await page.evaluate(
    ({ selector, notice, lang }) => {
      const content = document.querySelector(selector);
      if (!content) return false;
      document.documentElement.lang = lang;
      const cover = document.createElement("section");
      cover.style.cssText = "border:2px solid #000;padding:12px;margin:0 0 16px;font:14px/1.5 sans-serif;";
      cover.innerHTML = notice;
      const keep = content.cloneNode(true);
      for (const element of keep.querySelectorAll("script,style,.noprint,.mw-editsection,#toc")) {
        element.remove();
      }
      document.body.replaceChildren(cover, keep);
      return true;
    },
    {
      selector,
      lang,
      notice:
        `<h1 style="font-size:18px;margin:0 0 8px">${args.title}</h1>` +
        `<p>Source: <a href="${args.url}">${args.url}</a>, retrieved ${args.retrieved}. ` +
        `Licence: <a href="${args["licence-url"]}">${args.licence}</a>. ` +
        `Authors: <a href="${args["authors-url"]}">${args["authors-url"]}</a>. ` +
        `Saved unchanged (layout of the site left out).</p>`,
    },
  );
  if (!found) throw new Error(`Selector ${selector} not found; not saved.`);
  mkdirSync(dirname(args.out), { recursive: true });
  await page.pdf({
    path: args.out,
    format: "A4",
    tagged: true,
    outline: true,
    printBackground: false,
    margin: { top: "15mm", bottom: "15mm", left: "15mm", right: "15mm" },
  });
  console.log(`Saved ${args.out}`);
} finally {
  await browser.close();
}
