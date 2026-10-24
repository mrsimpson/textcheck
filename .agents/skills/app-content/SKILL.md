---
name: app-content
description: Use for any content work in this app - researching, writing, extending, correcting or reviewing its competencies, exercises, stages, text packs, error classes, questions, figures, terms or sources. This app's own content decisions; they take precedence over the generic lernapps content skills. Load it before you change any content.
---

# Content guide of this app

Textcheck trains careful reading in two ways, which ask for different reading. In **"Fehler im Text finden"** (kind
`text`) learners get one text and no source: they find errors that show in the text itself (spelling, punctuation, a
sentence that contradicts another). In **"Mit der Quelle vergleichen"** (kind `quelle`) they get a rendition and its
source: they find what went wrong when the source was passed on (a changed number, an added sentence, a claim made
bigger, an opinion posing as a fact). Each kind has three stages. The texts are text packs; a seed decides in every
round which slots of a pack are corrupted and with which wrong variant. Code, ids and file names are English;
everything learners read is in the language of its pack: German and English.

## Curriculum

- No Land or Schulform: the creator named none, and the stages carry no school year. Orientation for the error classes
  is the KMK Bildungsstandards Deutsch, read in full:
  - Primarbereich, i.d.F. vom 23.06.2022, section 4.3 Lesen (pp. 16-17) and "Orthografisch schreiben" (pp. 14-15).
  - Erster und Mittlerer Schulabschluss, i.d.F. vom 23.06.2022, section 4.3 Lesen (pp. 29-31) and 4.4.
  - Allgemeine Hochschulreife, Beschluss vom 18.10.2012, section 2.3 Lesen.
- The page says "ab Klasse 3 bis zum Abitur" for whom the app is. Early stages put form first (spelling, punctuation),
  late stages content (claims, conclusions, opinions); this order, the length of the texts and the number of errors per
  round are settings of the creator and the assistant, not findings of a source (the page "Wie diese Übung begründet ist"
  says so).
- Stages (`src/data/stages.json`, the only place that says what a stage holds):
  - `text`: 1 spelling rule, slip; 2 adds punctuation, real word; 3 adds contradiction. Errors per round 3, 4, 5.
  - `quelle`: 1 number/name/date/place; 2 adds factual error, added claim, connective/negation, quantity/degree;
    3 adds overgeneralization, faulty inference, opinion as fact, false authority, loaded language. Errors 3, 4, 5.
  - Stages 1 and 2 name the error classes of the round in the goal line, stage 3 does not (a hint can name them).
  - Reading tip: stage 1 all of it, stage 2 its last line, stage 3 only on request. Source: stage 1 and 2 as a sheet with
    the excerpt, stage 3 as a link to the whole article.
- English (plan `.vibe/plans/04-englische-fassung.md`): the same kinds, stages, routes and error classes; only the
  language differs. The page switches between German (root) and English (`/en/`), by the switcher of the frame.
- Research: `.vibe/plans/01-sorgfaeltig-lesen.md` (sources, didactics) and `.vibe/plans/12-lernweg.md` (the two kinds
  and three stages).

## Competencies

The competencies are in `src/app.yaml` (`competencies`), one list for the whole app, grouped here by kind:

1. Fehler im Text finden: Ich kann falsch geschriebene Wörter in einem Text finden und markieren. Ich kann falsch
   geschriebene Wörter finden, auch solche, die ein Rechtschreibprogramm nicht findet. Ich kann Sätze finden, die sich im
   selben Text widersprechen.
2. Mit der Quelle vergleichen: Ich kann einen Text mit seiner Quelle vergleichen und Zahlen, Namen, Orte und Angaben
   finden, die von der Quelle abweichen. Ich kann in einer Wiedergabe erkennen, was die Quelle nicht sagt, also
   Verallgemeinerungen, Folgerungen und Meinungen, die als Tatsachen auftreten. Ich kann wertende oder
   emotionalisierende Formulierungen erkennen.

Add a competency to `src/app.yaml` when a stage or error class that practises it exists.

## Content structure

- **Routes** (`src/app.yaml`, `src/core/stages.ts`): `start` (choice of the exercise), `text` and `quelle` (the stages of
  a kind), `text-1` to `text-3` and `quelle-1` to `quelle-3` (the rounds of a stage). The address is
  `app/?seed=<n>#<route>`: the only place the seed is taken from (without one the page works one out and writes it into the
  address), so a round can be reloaded and shared, and back and forward lead from page to page.
- **A stage** (`src/data/stages.json`): `adds` (the error classes it brings in; a stage holds its own and all earlier
  ones), `errors`, `announce`, `tip` (`full`, `short`, `none`), `material` (`none`, `sheet`, `link`), `maxWords` (the
  longest text it takes; null for the last). The stage cards, the "neu" marks, the goal line, the hints and the choice of
  errors are all derived from it; nothing about a stage is written as text in a component.
- **A text pack** (`src/data/packs/<language>/<id>.json`, schema `src/data/textpack.v1.schema.json`): no school year.
  - `excerpt`: verbatim sentences of the source, unchanged.
  - `rendition`: the text learners check, in own words, sentence by sentence, each sentence with `evidence.quote` from the
    excerpt. A sentence holds plain strings and `{ "slot": id }` parts. Reword, split, reorder: yes. Add a statement the
    excerpt does not make: never (an inserted sentence, a slot with the empty correct wording and the class
    `added_claim` or a stance class, is the only exception: it exists to be found).
  - `slots`: per slot the `correct` wording and one or more `variants`. Each variant has `errorClass`, `basis` (`text`,
    `comparison`, `prior_knowledge`), `conspicuousness` (1-3), `explanation`, optional `tolerance` (neighbouring words in
    the same sentence that may be marked without penalty; only for slots of three words or more) and `evidence`.
  - `source`: title, URL of the fixed revision, licence, authors, `retrieved`, `pdf` (the reserve copy), `verified`.
- **Which stage a text belongs to** is derived (`src/core/stages.ts`, `fits`): its length (words of the rendition) is
  not above the stage's `maxWords` and below the stage before, it has at least `errors + RESERVE` (2) slots with a class of
  the stage, and at least one with a class the stage adds. The pack check says where a pack falls short; the unit tests
  need two texts per language, kind and stage.
- **A round** is built by the core from (seed, route, language): the seed picks one fitting text and the slots to
  corrupt, at least one (aiming at two) of them with a class the stage adds. Same seed and route give the same round.
- The learner sees: the question of the exercise ("Ist das richtig geschrieben?" with the extra question of a contradiction
  on text stage 3; "Sagt die Quelle das wirklich so?"), the goal line, and the material.
  - `text`: one sheet with the text.
  - `quelle`, stages 1 and 2: the source first, with one button "Weiter zur Wiedergabe"; then the rendition with the buttons
    "Quelle ansehen", "Hinweis", "Markierungen löschen" and "Prüfen" (they stand only under the rendition). Never side by
    side: the eye must not compare them at a glance. The sheet turns with a short animation.
  - `quelle`, stage 3: the link to the whole article (the fixed revision, with the sections the text is from and the date)
    above the rendition, and a small link to the PDF as a reserve.
  - After checking: the words by status, the advice (next stage, another round with a tip for the first class missed, the
    other exercise), the errors grouped by class with the explanation, and the legend.
- A note says that the rendition deliberately words things differently (`renditionNote`, only in the comparison with a source).
- Reading settings: the small button "Schrift" in the heading line (`src/ui/Controls.vue`), a dialog "Schrift und
  Lesen": style normal, round or fixed width, weight, size, line spacing; kept on the device. The font is Recursive (SIL
  Open Font License 1.1), bundled in `src/ui/fonts/` with its licence.
- Hints (button "Hinweis", `src/core/index.ts` `hint`, `tick`): the first 15 s after the round starts (and the reading tip),
  the next 20 s after the one before. A first hint names the classes of the round where the stage hides them (stage 3 of
  both exercises); the last hint marks the sentences with an error, at the edge with the class. A hint never shows a word. Inserted sentences (no
  `evidence.quote`) are never part of a hint. A text therefore needs `evidence.quote` on every sentence that holds a slot,
  unless it is an inserted sentence. Every error found: big fireworks on a dimmed page without a hint, confetti with a
  hint and the sentence "Beim nächsten Mal klappt es vielleicht auch ohne.".
- Progress: a stage passed (all errors found, at most one right word marked) gets a tick on its card, kept on the device
  (`src/ui/progress.ts`); the learner can clear the ticks.

## Terminology

- **Fehler im Text finden** / **Mit der Quelle vergleichen** are the two exercises ("Übung"); **Stufe 1 bis 3**
  ("leicht", "mittel", "schwer") their stages. Never "Modus" or "Klasse" for them.
- **Text** (the text of the exercise without a source), **Quelle** (the excerpt of the source, always correct) and
  **Wiedergabe** (the text learners check in the comparison with a source). Never "Original", "Variante" or
  "Zusammenfassung" in anything learners read: the rendition is faithful and not shortened. In code, data and plans it is
  `rendition`, `excerpt` and `variants` (the wrong versions of a slot, never shown by that word).
- "Fehler" for what is wrong; "markieren" for the learner's action; "Stelle" is internal and never shown.
- Learners are addressed with "du". Plain language: short sentences, active voice, no jargon.
- English: "Find errors in a text", "Compare with the source", "stage", "text", "source", "rendition"; "mark", "error";
  learners are addressed with "you". Never "summary", never a shaming word. The messages are in `src/messages/en.json`,
  complete in the keys and placeholders of `de.json` (a test compares them).
- The result never shames: "Übersehen" and "Fälschlich markiert" describe, they do not judge.
- Status words on the page "Wie diese Übung begründet ist": "belegt" (a source we read names it) and "abgeleitet" (our own
  inference); each line names the exercise and stage that adds the class (a test compares them with `stages.json`).
- Names of the error classes live in `src/messages/de.json` under `errorClass.<id>`; the German names are those of
  plan 01 (section Fehlerklassen).

## Exercise patterns

- **Find errors in a text** (kind `text`, routes `text-1` to `text-3`).
  - Competency: Ich kann Fehler finden, die man am Text selbst sieht, auch ohne Vorlage.
  - Form: a custom component (the archetype `interactive` allows it); the words are options of one listbox.
  - Fixed: the rendition's correct wording, the slots and their variants, the rules of the stage.
  - Varies per use: which slots are corrupted, which variant, the text of the stage.
  - Success check: a hit is any marked word inside the corrupted slot; other marked words count as wrongly marked unless
    they lie within `tolerance` words of the slot in the same sentence. No partial credit; the check does not judge why a
    word was marked.
  - Data: `src/data/stages.json`, `src/data/packs/<language>/`, example `src/data/packs/de/igel.json`.
- **Compare with the source** (kind `quelle`, routes `quelle-1` to `quelle-3`).
  - Competency: Ich kann einen Text mit seiner Quelle vergleichen und finden, was beim Übertragen falsch geworden ist.
  - Form: the same round, with a source sheet (stages 1 and 2) or the link to the article (stage 3) and the advice "Andere
    Wörter sind noch kein Fehler".
  - Fixed and varying: as above, with the classes of the comparison.
  - Success check: the same.
  - Data: the same files; `source.url` is the fixed revision of the article, `source.pdf` its reserve copy in
    `public/quellen/<language>/<id>.pdf`.
- Nothing is computed or drawn; no number field exists.

## Figures

- None.
- Colours and marks are fixed everywhere (text, result, legend): found = green with underline; rest of a found slot =
  green; missed = orange with dashed underline; wrongly marked = violet with strike-through; within tolerance = blue
  with dotted underline. Colour is never the only sign: the line style differs, and a visually hidden status text is in
  the DOM for screen readers. The two exercises have their own colour (teal for the text, brown for the source) in
  badges and cards; the colours of the marks do not change with it.

## Sources

- Research sources are listed in plan 01 (Methodische Quellen) and on the page "Wie diese Übung begründet ist"
  (`src/app.yaml`, section `begruendung`). Verified by opening them and reading what is cited; the PISA framework was not
  obtainable and is not cited.
- A pack's source is opened and read completely before the pack is written. `source` holds title, URL (the fixed
  revision), revision, licence, licence URL, author list URL and `retrieved`; `verified: true` only when every evidence
  quote was found in the opened source. The checker (`src/core/pack-check.ts`, run by `npx vp test run`) checks that
  quotes are verbatim in the excerpt, not that the excerpt matches the source: that check is yours.
- German packs: Klexikon for short texts, Wikipedia for long ones. English packs: Simple English Wikipedia for short and
  medium texts, English Wikipedia for long ones (CC BY-SA 4.0), a fixed revision, opened and read in full.
- Texts under CC BY-SA need the licence and the author link next to the text. Wikipedia and Klexikon content stays under its
  licence; the pack data is under the same licence.
- The PDF of a source is a reserve for the day the article changes or goes away; it is made with the script of the skill
  `app-textpack` and linked small on the last stage of the comparison with a source.
- The creator's own material: none; nothing private is committed.

## Adding a chapter or round

To add a text pack:

1. Choose a topic that is harmless and fits the age of the readers and the stage you write for (short, medium or long;
   `maxWords` in `src/data/stages.json`), a language and a source. Open and read the source; note the revision and the
   licence.
2. Follow the skill `app-textpack` (`.agents/skills/app-textpack/SKILL.md`): research, draft, error slots, checks, hand-in.
3. Save as `src/data/packs/<language>/<id>.json`; the id equals the file name. Make the source PDF with the script of the
   skill into `public/quellen/<language>/<id>.pdf` and set `source.pdf` (the tests need it).
4. Run `npx vp test run`: the schema, the pack checks and the stage coverage must pass. Read warnings: they say which stage a
   text is not used in and why.
5. Play it: `app/?seed=<n>#<route>` with several seeds of the routes it fits. Add it to the log `.vibe/texts-log.md`.
6. Commit pack and log together. The core finds packs by file name; no code changes. A playthrough that pins a pack
   (`src/playthroughs/`, field `packId` and word ids) may need a check (`npx lernapps check` fails otherwise).

To add a stage or change what a stage holds: change `src/data/stages.json` (classes it adds, errors, tip, material, length
limit), the matching `stageTitle.<n>`, `stageName.<n>` messages in German and English, the routes in `src/app.yaml`
(`routes`), the line for every added class in the section `begruendung`, and run the tests: they compare routes, classes and
messages with the rules. Check which texts the stage gets (the card says how many).

To add an error class: the entry in `src/data/error-classes.json` and the schema enum, its name `errorClass.<id>`, its tip
`classTip.<id>` in both message files, the stage that adds it in `stages.json`, its line in `begruendung`, variants in the
packs.

To add a language: all learner texts of `src/app.yaml` as maps `{ de: …, en: … }`, a complete `src/messages/<language>.json`,
the language in `languages` of `src/app.yaml` and in `languages` of the error classes it suits, two texts per kind and stage
in that language, a playthrough in that language. The tests compare messages and packs per kind and stage.

## Rules learned from mistakes

- The rendition adds nothing: before a pack is handed in, read every sentence against its `evidence.quote` and cut what the
  quote does not say (plan 06).
- Never call the rendition a "Zusammenfassung" (the creator pointed it out), and never "Original" or "Variante" in what
  learners read (plan 12).
- A single reading tip is a sentence, not a list of one (plan 12). A stage never says what it holds in a written-out text:
  derive it from `stages.json` and the texts.
- The source and the rendition are never side by side, and the buttons that check stand only under the rendition (plan 12).
- Explanations of errors that belong to the exercise without a source (spelling, slip, real word, punctuation,
  contradiction) never refer to the source: learners do not see it there. Explanations of the other classes say "In der
  Quelle steht: …".
- Tolerance only works when the slot has neighbouring words in the same sentence; an inserted sentence has none.
- A text qualifies for a stage only with enough places for its classes; a text with too few places for a kind of exercise is
  skipped there, and the pack check warns.
- A playthrough pins a text by `packId` and word ids; after a pack is added or changed for the stage it is played on,
  check it.
- Every text has a heading (`title`, shown above the text) and begins with the introduction of its article
  (`check-lead.mjs`).
- Hints never say which word is wrong and never mention inserted sentences (the creator). After checking no hint stays in the
  text.
- Do not show hints in the text after checking (a superscript "gefunden" disturbed reading): colour and line style in the
  text, the same colours with a legend below.
- Watch sources of Vue `watch` that return an array from a function: they fire on every state change of the core (every
  tick); use an array of getters (plan 12: the focus jumped to the heading while the learner was in a dialog).
