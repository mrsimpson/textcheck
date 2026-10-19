// Checks that a text pack begins with the introduction of its source: the first excerpt sentence must stand at the
// beginning of the article in the source PDF (after the licence notice and at most a caption or two), and the pack must
// hold every excerpt sentence of the PDF. Usage: node check-lead.mjs [pack.json ...] (default: every pack).
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const walk = (dir) =>
  readdirSync(dir).flatMap((name) =>
    statSync(join(dir, name)).isDirectory() ? walk(join(dir, name)) : name.endsWith(".json") ? [join(dir, name)] : [],
  );
const packs = process.argv.length > 2 ? process.argv.slice(2) : walk("src/data/packs");
const squeeze = (text) =>
  text
    .replace(/\[\w+\]/g, "")
    .replace(/-\s+/g, "")
    .replace(/\s+/g, " ")
    .trim();
let bad = 0;
for (const file of packs) {
  const pack = JSON.parse(readFileSync(file, "utf8"));
  const text = squeeze(execFileSync("pdftotext", [join("public", pack.source.pdf), "-"], { encoding: "utf8" }));
  const body = text.slice(text.indexOf("unverändert") + 12);
  const first = squeeze(pack.excerpt[0].text);
  const at = body.indexOf(first.slice(0, 60));
  const missing = pack.excerpt.filter((entry) => !body.includes(squeeze(entry.text).slice(0, 60))).length;
  const note =
    at < 0
      ? "first sentence not in the PDF"
      : at > 700
        ? `first sentence ${at} characters into the article (not the introduction)`
        : "";
  if (note || missing > 0) bad++;
  console.log(
    `${pack.id}: start at ${at}${note ? ` !! ${note}` : ""}${missing > 0 ? ` !! ${missing} excerpt sentences not found` : ""}`,
  );
}
if (bad > 0) process.exit(1);
