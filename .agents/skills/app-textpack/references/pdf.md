# Source as PDF

Needed for the mode Quellentreue (learners open the source in a new tab). Not required for the first mode.

- Script: `node .agents/skills/app-textpack/scripts/source-pdf.mjs --url <fixed revision> --out sources/<language>/<id>.pdf
  --title <title> --licence <name> --licence-url <url> --authors-url <url> --retrieved <date> [--selector <css>]`
  (needs `playwright`; set `PLAYWRIGHT_CHROMIUM_PATH` to an installed Chromium if the expected version is missing).
- Use the fixed revision URL, `--selector` for the article body (Klexikon and Wikipedia: `#mw-content-text`).
- The script puts a notice on top: source, retrieval date, licence, authors, "saved unchanged", and writes a tagged
  PDF. Without that notice a CC BY-SA copy is not allowed.
- Check the result: `pdfinfo` (Tagged: yes, page count), `pdftotext -l 1` (notice and text readable). Keep it small:
  prefer short pages; for long articles save only the relevant section (the excerpt must be found in it).
- Set `source.pdf` in the pack to the published path once the mode uses it.
- If the source answers 403/429: stop, report. Do not retry in a loop or change the request to get through.
