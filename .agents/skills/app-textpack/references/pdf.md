# Source as PDF

Needed for the mode Quellentreue (learners see the PDF next to the Variante: embedded on a wide screen, a link to a new tab
elsewhere). Required for every pack: the tests fail without the file.

- Script: `node .agents/skills/app-textpack/scripts/source-pdf.mjs --url <fixed revision> --out public/quellen/<language>/<id>.pdf
  --title <title> --licence <name> --licence-url <url> --authors-url <url> --retrieved <date> [--selector <css>]`
  (needs `playwright`; set `PLAYWRIGHT_CHROMIUM_PATH` to an installed Chromium if the expected version is missing).
- Use the fixed revision URL, `--selector` for the article body (Klexikon and Wikipedia: `#mw-content-text`).
- The script puts a notice on top: source, retrieval date, licence, authors, "saved unchanged", and writes a tagged
  PDF. Without that notice a CC BY-SA copy is not allowed.
- Check the result: `pdfinfo` (Tagged: yes, page count), `pdftotext -l 1` (notice and text readable). Keep it small:
  prefer short pages; for long articles save only the relevant section (the excerpt must be found in it).
- Set `source.pdf` in the pack to `quellen/<language>/<id>.pdf` (path from the site root); the build copies `public/` to
  the site root. The test checks that the file exists.
- Check that every excerpt sentence is in the PDF: `pdftotext` it and search (a footnote mark like `[2]` inside a
  sentence is fine).
- If the source answers 403/429: stop, report. Do not retry in a loop or change the request to get through.
