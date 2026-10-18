---
name: app-content
description: Use for any content work in this app - researching, writing, extending, correcting or reviewing its competencies, chapters, pages, rounds, questions, exercises, figures, terms or sources. This app's own content decisions; they take precedence over the generic lernapps content skills. Load it before you change any content.
---

# Content guide of this app

Textcheck trains careful reading. Learners compare a text (the "Variante") with a source excerpt (the "Original") and
mark the words that do not match or do not hold. The texts are text packs; a seed decides in every round which slots of
a pack are corrupted and with which variant. Code, ids and file names are English; everything learners read is in the
language of its pack (version 1: German only).

## Curriculum

- No Land or Schulform: the creator named none. Orientation is the KMK Bildungsstandards Deutsch, read in full:
  - Primarbereich, i.d.F. vom 23.06.2022, section 4.3 Lesen (pp. 16-17) and "Orthografisch schreiben" (pp. 14-15).
  - Erster und Mittlerer Schulabschluss, i.d.F. vom 23.06.2022, section 4.3 Lesen (pp. 29-31) and 4.4.
  - Allgemeine Hochschulreife, Beschluss vom 18.10.2012, section 2.3 Lesen.
- Grades 3 to 13, in packs for two adjacent school years each: 3-4, 5-6, 7-8, 9-10 and 11-13 (Oberstufe, decided by the creator).
- Version 1 ships one text for each of the grades 3-4, 5-6, 7-8, 9-10 and 11-13, a route each (`klasse-3-4` ...).
  A route ending in `-quelle` plays the same level in the mode `source` (all five levels have one). The ceiling for each error class (`fromGrade` in
  `src/data/error-classes.json`) is a setting of the creator and the assistant, not a finding of a source.
- The plan `.vibe/plans/01-sorgfaeltig-lesen.md` holds the research: sources, competencies, didactics.

## Competencies

Four chapters, one per stage of the school years; version 1 builds chapter 2.

1. Grades 3-4: Ich kann falsch geschriebene Wörter in einem kurzen Text finden und markieren. Ich kann Zahlen, Namen
   und Wörter finden, die vom Original abweichen. Ich kann ein Wort markieren, das im Satz keinen Sinn ergibt.
2. Grades 5-6 (route `klasse-5-6`, pack `src/data/packs/de/5-6/*.json`): Ich kann Stellen markieren, an denen die
   Variante dem Original widerspricht. Ich kann Sätze finden, die sich im selben Text widersprechen. Ich kann eine
   falsche Zeit-, Orts- oder Mengenangabe mit dem Original abgleichen.
3. Grades 7-10: Ich kann eine Meinung von einer Tatsache unterscheiden und die Meinung markieren. Ich kann eine
   Folgerung erkennen, die der Text nicht trägt. Ich kann unbelegte Behauptungen und Verallgemeinerungen markieren.
4. Grades 11-13: Ich kann wertende, emotionalisierende oder einseitige Formulierungen erkennen und benennen. Ich kann
   Ursache und Wirkung vertauscht oder fehlerhafte Schlüsse erkennen. Ich kann die Qualität von Textinformationen mit
   meinem Fachwissen und der Quelle prüfen.

`src/app.yaml` lists the competencies of the stages that exist. Add a competency there when its route exists.

## Content structure

- A **round** is built by the core from (seed, route): the route names the school years (`src/data/levels.json`), the
  seed picks one pack of the matching grades and, within the level's limits, which slots are corrupted and with
  which variant. Same seed and route give the same round.
- A **text pack** (`src/data/packs/<language>/<from>-<to>/<id>.json`, schema `src/data/textpack.v1.schema.json`):
  - `excerpt`: verbatim sentences of the source, unchanged.
  - `rendition`: the Variante, in own words, sentence by sentence, each sentence with `evidence.quote` from the excerpt.
    A sentence holds plain strings and `{ "slot": id }` parts.
  - `slots`: per slot the `correct` wording and one or more `variants`. Each variant has `errorClass`, `basis`
    (`text`, `comparison`, `prior_knowledge`), `conspicuousness` (1-3), `explanation`, optional `tolerance`
    (neighbouring words in the same sentence that may be marked without penalty; only for slots of three words or
    more) and `evidence` for `comparison` variants.
  - At least 6 slots and 3 error classes; the level's `errors` per round plus three in reserve.
- A **level** (`src/data/levels.json`): `route`, `grades`, allowed `classes` and `bases`, `errors` per round,
  `announceClasses` (whether the goal line names the error classes in the round).
- The learner sees: the goal line, the Original and the Variante (side by side; on a phone a switch), the marked words,
  then the result grouped by error class (found, missed, wrongly marked, within tolerance) with the explanation.
- Length of a pack: the excerpt has 6 to 10 sentences. Guide values per grade pair are fixed after the pilot.

## Terminology

- Original (the source excerpt, always correct) and Variante (the text learners check). Never "Zusammenfassung": the
  Variante (called "Fassung" until the creator chose "Variante" after the first test) is a faithful rendition of the excerpt, not a shortened summary.
- "Fehler" for what is wrong in the Variante; "markieren" for the learner's action; "Stelle" is an internal word
  and never shown to learners. Learners see "Variante" only for the whole text they check; the wrong versions of a
  slot are `variants` in code and data and never shown by that word.
- Learners are addressed with "du". Plain language: short sentences, active voice, no jargon.
- The result never shames: "Übersehen" and "Fälschlich markiert" describe, they do not judge.
- Status words on the page "Wie diese Übung begründet ist": "belegt" (a source we read names it) and "abgeleitet"
  (our own inference).
- Names of the error classes live in `src/messages/de.json` under `errorClass.<id>`; the German names are those of the
  plan (section Fehlerklassen).

## Exercise patterns

- **Mark deviations in a rendition against a known original** (the only pattern).
  - Competency: compare a text with its source and judge what holds.
  - Form: a custom component (the archetype `interactive` allows it); words are options of one listbox.
  - Fixed: the excerpt, the rendition's correct wording, the slots and their variants, the level.
  - Varies per use: which slots are corrupted, which variant, the pack.
  - Success check: a hit is any marked word inside the corrupted slot; other marked words count as wrongly marked
    unless they lie within `tolerance` words of the slot in the same sentence. The check does not judge why a word was
    marked and gives no partial credit.
  - Example: `src/data/packs/de/5-6/` (see the pilot pack); data files `levels.json`, `error-classes.json`.
- **The same, against the source PDF** (mode `source`, route ending in `-quelle`).
  - Competency: Ich kann einen Text mit seiner Quelle vergleichen und Stellen finden, die von der Quelle abweichen.
  - Form: the same round as the mode `mark`; the Original panel is replaced by the PDF of the source: a link that opens
    it in a new tab and, on a wide screen with a mouse, the PDF embedded beside the Variante (a frame of the same
    site; on phones and tablets the link only).
  - Fixed and varying: as in the mode `mark`; success check the same.
  - Data: `source.pdf` of the pack, a path relative to the site root (`quellen/<language>/<id>.pdf`); the files lie in
    `public/quellen/<language>/`, the build copies them to the site root.
- **Choose the text with the errors, then mark them** (mode `choose`, route ending in `-original`).
  - Competency: Ich kann zwei Texte vergleichen und erkennen, welcher Fehler hat.
  - Form: two texts, A and B: the Original (the verbatim excerpt) and the Variante with the errors of the round. Which
    one is which stays hidden until checking. The learner picks the text with the errors and marks the words there; the
    picked text is the one that can be marked. On a phone a switch shows one text at a time.
  - Fixed: excerpt, Variante, slots, level. Varies per use: the errors (seed) and the side of the Variante (own draw
    from the seed). No errors of the family `form` (spelling, slip, real word, punctuation): they would give the
    Variante away in a comparison of two texts (the creator: too easy). So a pack needs enough slots with variants of
    the other families; the tests check it for every level.
  - Success check: the pick and the marks. A right pick counts like the mode `mark`; a wrong pick finds no error and
    its marks count as wrongly marked; the result names the Original either way.
  - Data: none of its own; keys 1 and 2 pick the text.
- Nothing is computed or drawn; no number field exists.

## Figures

- None in version 1.
- Colours and marks are fixed everywhere (text, result, legend): found = green with underline; rest of a found slot =
  green; missed = orange with dashed underline; wrongly marked = violet with strike-through; within tolerance = blue
  with dotted underline. Colour is never the only sign: the line style differs, and a visually hidden status text is
  in the DOM for screen readers.

## Sources

- Research sources are listed in the plan (Methodische Quellen) and on the app's page "Wie diese Übung begründet ist"
  (`src/app.yaml`, section `begruendung`). Verified by opening them and reading what is cited; the PISA framework was
  not obtainable and is not cited.
- A pack's source is opened and read completely before the pack is written. `source` holds title, URL, revision or
  date, licence, licence URL, author list URL and `retrieved`; `verified: true` only when every evidence quote was
  found in the opened source. The checker (`src/core/pack-check.ts`, run by `npx vp test run`) checks that quotes are verbatim
  in the excerpt, not that the excerpt matches the source: that check is yours.
- Texts under CC BY-SA need the licence and the author link next to the Original. Wikipedia and Klexikon content stays
  under its licence; the pack data is under the same licence.
- The creator's own material: none; nothing private is committed.

## Adding a chapter or round

To add a text pack (a new "round" source):

1. Choose grades (adjacent pair, e.g. 5-6) and a harmless topic that fits the age. Open and read the source; note the
   revision and the licence.
2. Follow the skill `app-textpack` (`.agents/skills/app-textpack/SKILL.md`): research, draft, error slots, checks, hand-in; classes only up to the pack's upper grade.
3. Save as `src/data/packs/<language>/<from>-<to>/<id>.json`; the id equals the file name. Make the source PDF with the
   script of the skill `app-textpack` into `public/quellen/<language>/<id>.pdf` and set `source.pdf` (the tests need it).
4. Run `npx vp test run`: the schema and the pack checks must pass. Read warnings.
5. Play it: `app/?seed=<n>#klasse-<from>-<to>` with several seeds. Add it to the log `.vibe/texts-log.md`.
6. Commit pack and log together. The core finds packs by file name; no code changes.

To add a route (a new grade pair): add its entry to `src/data/levels.json`, its route and its `-quelle` route to `src/app.yaml`, its
competencies, and at least one pack; a playthrough for the route if its rules differ.

## Rules learned from mistakes

- Never call the Variante a "Zusammenfassung": it is not shortened (the creator pointed it out).
- A pack holds only error classes whose `fromGrade` is at most the pack's upper grade; the first example mixed in
  classes from grade 7 into a pack for grades 5-6, the checker caught it.
- Tolerance only works when the slot has neighbouring words in the same sentence; an inserted sentence has none.
- In the mode `choose` no spelling errors: a misspelt word shows at once which text is the Variante.
- Do not show hints in the text after checking (a superscript "gefunden" disturbed reading): colour and line style in
  the text, the same colours with a legend below.
