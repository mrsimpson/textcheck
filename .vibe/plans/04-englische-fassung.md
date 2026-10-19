---
# Read by the hooks, the review, the evals. Schema: @lernapps/tooling/guidance/plan-front-matter.v1.schema.json
# Archetype as in the app's first plan; set it when you start. Never changes.
archetype: interactive
# Current phase. Allowed values: explore, plan, code, commit. Change the value line below, never this comment.
phase: commit
# prePushFailures: failed pre-push runs of this increment, written by the hook. Never change it.
prePushFailures: 0
---

# Increment: Englische Fassung der App

<!--
For you, the assistant. One increment of a published app: new competencies, chapters, pages, rounds, questions, or
a correction.
- Path: .vibe/plans/<NN>-<short name>.md, NN = highest + 1. Highest = current; never change earlier plans.
  App with only `.vibe/plan.md`: that is plan 01; start this as 02 (the update in Code moves it).
- Read every skill and page named here in full, from its file (`.agents/skills/`, curl). Never a summarising fetch tool.
- The first version's decisions stand: archetype, content method, content guide
  `.agents/skills/app-content/SKILL.md`. Change the guide only for a new pattern, figure type or source rule; say
  so at the checkpoints.
- One phase at a time, tasks in order. Done → tick `[x]` at once, move it to "Completed". New task → add it.
- Checkpoint task: stop, ask, wait for the creator's answer.
- Work on the branch `increment/<NN>-<short name>` until the yes to publish; push only that branch. A failing check:
  tell the creator, do not push.
- Plan in the creator's language. Keep headings and front matter keys. Delete a comment once its part is filled.
-->

*Gestartet am 18.10.2026. Explore, Plan, Code, Commit.*

Nummer 04: Der Plan hieß zuerst 03; `main` bekam inzwischen einen eigenen Plan 03 („weitere Texte“, fünf weitere deutsche Texte je Stufe). Beim Zusammenführen wurde dieser Plan zu 04.

## Goal

Lernende im deutschen Schulsystem können die App auf Englisch üben: dieselben Klassenstufen und Modi, Texte und Oberfläche auf Englisch, je Stufe zwei Artikel.

## Key decisions

- Nur die Sprache ändert sich, nicht das Schulsystem: gleiche Stufen (3–4, 5–6, 7–8, 9–10, 11–13), gleiche Modi, gleiche Fehlerklassen. (Ersteller)
- Die Texte (Pakete) sind englisch, nicht übersetzt: je Stufe zwei englische Artikel, also zehn. Die deutschen Pakete bleiben unverändert. (Ersteller: „auch die Texte auf Englisch“; „nur jeweils zwei Artikel pro Stufe“)
- Sprachwahl: der globale Sprachumschalter im Kopf der Seite (wie in den anderen Apps), nicht ein Auswahlfeld neben Altersstufe und Modus. Voreinstellung ist die Browsersprache. (Ersteller)
- Ablage nach Leitfaden: `src/data/packs/en/<von>-<bis>/<id>.json`, Quell-PDFs in `public/quellen/en/`, Meldungen in `src/messages/en.json`. (guess)

## Notes

**Lehrplan.** Unverändert wie im ersten Plan (KMK-Bildungsstandards Deutsch, Lesen); die englischen Texte üben dieselben Kompetenzen wie die deutschen. Neue Kompetenzen: keine; die Liste auf der Startseite gibt es in beiden Sprachen.

**Quellen.** Für Klasse 3 bis 8 die Simple English Wikipedia, für Klasse 9 bis 13 die englische Wikipedia, jeweils CC BY-SA 4.0 (im Seitenfuß der abgerufenen Seiten gelesen), feste Fassung (Revision) je Text. Die Seiten wurden einzeln abgerufen, weil Wikimedia pro IP-Adresse drosselt (Antwort 429); die PDFs entstanden aus den gespeicherten Seiten, ohne Bilder.

| Stufe | Text 1 (Revision) | Text 2 (Revision) |
|---|---|---|
| 3–4 | Giraffe (10993061) | Hedgehog (10620091) |
| 5–6 | Bat (10868160) | Volcano (10961960) |
| 7–8 | Hibernation (10379006) | Photosynthesis (10903963) |
| 9–10 | Printing press (1379445153) | Great Fire of London (1376270657) |
| 11–13 | Hyperinflation in the Weimar Republic (1376495680) | Black Death (1377102371) |

Die Themen sind der Vorschlag des Erstellers, den er mit „Passt“ bestätigt hat: das bisherige Thema der Stufe, soweit die englische Quelle es hergibt (Igel, Fledermäuse, Winterschlaf, Buchdruck, Hyperinflation), dazu ein neues, das zum Alter passt (Giraffe, Vulkan, Photosynthese, Großer Brand von London, Schwarzer Tod). Hinweis: Die Themen Giraffe, Vulkan, Photosynthese, Brand von London und Schwarzer Tod sind meine Wahl (guess); der Ersteller hat sie mit „Passt“ nur als Vorschlag gesehen, die einzelnen Namen nicht.

**Didaktik und Umfang.** Eingeführt: eine Sprache, kein neues Muster. Gleiche Runde, gleiche Auswertung, gleiche Modi. Raus: weitere Sprachen, weitere Texte, ein Wechsel der Sprache anhand der Browsersprache (der Rahmen der App lädt auf der Startseite kein Skript; der Umschalter besteht aus Links).

**Grenzen.** Die englischen Rechtschreib- und Zeichensetzungsfehler sind konstruiert wie die deutschen, nicht aus Lernerdaten. Die Fehlerklassen tragen jetzt `en` in `languages`; keine Quelle belegt sie für das Englische, die Anpassung ist unsere eigene.

## Explore

<!-- All content questions belong here; Plan maps them onto the app. Ask; write no code. Max 2 questions per message,
one topic each. Skip what earlier answers or the app tell. Never tick a question you assumed. -->

### Tasks

- [x] Set `archetype` as in the app's first plan in `.vibe/plans/`.
- [x] Skills are in `.agents/skills/`. Only if missing: `npx skills add lernapps/tooling#exp/compact-guidance`.
- [x] Load the content guide `.agents/skills/app-content/SKILL.md` and skill `lernapps-content-growth`; read the
      plans in `.vibe/plans/` (what the app teaches, how content is made, what is open).
- [x] Interview, as in the first plan: one topic per question, the creator's words under "Answers"; no answer →
      ask once more, then "(guess)", shown at the checkpoint. Topics: which competencies, chapters or rounds, for
      which school years; hurdles and examples; amount; anything of look and feel or terms that changes.
- [x] Research: the guide's curriculum and sources; skill `lernapps-content-research` for the rest. Under "Notes":
      curriculum orientation (Lehrplan cited where used), new competencies by chapter as Ich-kann-Sätze, verified
      sources.
- [x] Under "Notes": the didactic approach per competency and the scope (in, out, data range).
- [x] **Checkpoint:** research. Show in plain words: curriculum orientation, new competencies by chapter, didactic
      approach, scope, sources and how checked, what is unchecked. Stop and wait. Changes → change, ask again.
- [x] Set `phase: plan`: change the value line (`grep '^phase:'` prints `phase: plan`).

### Answers

- „I18n: English. Da die Altersstufen in Jahren, nur jeweils zwei Artikel pro Stufe“
- „Plan 02 unangetastet. Plan 03: wir sind ja dennoch für das deutsche Schulsystem unterwegs, nur eben in English ⇒ nur andere Sprache, gleiche Stufen. Und eben auch den Tannen auf Englisch.“
- „Wir haben in anderen Apps einen globalen Language Switcher, der default auf der Browsersprache steht. Keine Select-Box bei der Auswahl.“
- „Passt. Leg los, bis der Review-per die englischen Artikel zeigt und alles wie in Deutsch funktioniert. Dann merge“ (Antwort auf den Vorschlag: bisheriges Thema je Stufe plus ein neues; Sprachumschalter statt Auswahlfeld). Ich lese das als Bestätigung von Plan und Inhaltsmethode und als Auftrag, nach der Vorschau zu mergen.

### Completed

## Plan

<!-- Confirmable in one read. After the confirmation: work on your own (creator turns to the end: max 3). -->

### Tasks

- [x] Write the Code tasks: one slice per competency (skill `lernapps-content-growth`), in the guide's order; each
      ends in a commit.
- [x] Write "Content method": the guide's patterns, figures, components per slice; anything new, with why the
      guide's patterns do not fit.
- [x] Show the creator, short: goal, new competencies by chapter, slices; in plain words what learners see and do,
      and what is new. Max 2 questions.
- [x] Each new component or interactive exercise: show a sketch (static SVG or image, or the steps). Words alone are
      not enough.
- [x] **Checkpoint:** confirm the plan and the content method. Stop and wait for an explicit yes. Changes → change,
      ask again.
- [x] Set `phase: code`: change the value line (`grep '^phase:'` prints `phase: code`).

### Content method

- Alle drei Muster des Leitfadens bleiben (Markieren mit Original, Quelle als PDF, Original erkennen); kein neues Muster, keine Figur, keine neue Komponente.
- Sprache: `src/app.yaml` hat alle Texte als `{de, en}`; `src/messages/en.json` ergänzt die Meldungen (ein Test vergleicht die Schlüssel und Platzhalter). Die Seiten gibt es je Sprache (Deutsch im Wurzelverzeichnis, Englisch unter `/en/`), den Umschalter liefert der Rahmen der App.
- Der Kern erfährt die Sprache durch die Aktion `language`, die `App.vue` sendet (Entscheidung `dec-language-as-input` in den arc42-Kapiteln); dieselbe Runde (Seed, Route) wird dann mit einem Paket der Sprache gebaut.
- Pakete: `src/data/packs/en/<von>-<bis>/<id>.json` nach dem Skill `app-textpack` (Abschnitt „English packs“ in `error-patterns.md` neu), Quell-PDFs in `public/quellen/en/`. Zwei Pakete je Stufe; der Seed wählt eins.

### Completed

## Code

<!--
- Load skill lernapps-app, the archetype's skill and the content guide before content.
- Commit after each slice; the hooks check. Pre-commit fails → read node_modules/.cache/lernapps/pre-commit.log.
- Fix from the message; never bypass a hook. Undecidable → choose, mark "(guess)", go on.
- Creator asks for a change → first say your reading in one sentence; never narrow it silently.
-->

### Tasks

- [x] `git switch -c increment/<NN>-<short name>` from `main`. Commit this plan on it.
- [x] `npx --yes github:lernapps/tooling#exp/compact-guidance update`, then `npm install`. It replaces the `lernapps-*` skills: reread
      the ones you use. Commit the update alone; fix its check findings before content.
- [x] Sprache: Kern (Aktion `language`), Oberfläche, `en.json`, `app.yaml` zweisprachig, Fehlerklassen für `en`, Tests; Commit.
- [x] Pakete Klasse 3–4: Giraffe, Hedgehog; Klasse 5–6: Bat, Volcano; Quell-PDFs; Commits.
- [x] Pakete Klasse 7–8: Hibernation, Photosynthesis; Klasse 9–10: Printing press, Great Fire of London; Quell-PDFs; Commits.
- [x] Pakete Klasse 11–13: Hyperinflation in the Weimar Republic, Black Death; Quell-PDFs; Commits.
- [x] Browser-Test der englischen Seite (`e2e/english.e2e.ts`); ein Durchlauf (Playthrough) auf Englisch ist nicht möglich, weil die Tests nur die deutsche Seite spielen und die Seite die Sprache zurückstellen würde. Die Kerntests decken die Aktion `language` ab.
- [x] Der Eintrag im Katalog (`.vibe/listing-entry.yaml`) ändert sich nicht: Er ist deutsch, die Themen bleiben (Entscheidung: nicht ändern; (guess)).
- [x] The content guide describes the app as it is now: competencies, chapters, patterns, procedure for the next
      increment (`app-content-matches`). `grep -c "FILL IN" .agents/skills/app-content/SKILL.md` prints 0.
- [x] `npx lernapps check` passes.
- [x] Every box of Explore, Plan and Code ticked.
- [x] Set `phase: commit`: change the value line (`grep '^phase:'` prints `phase: commit`).

### Completed

## Commit

<!--
- Push to `main` = publish (workflow `Pages`, job `deploy`). A pull request to `main` runs the same checks without
  publishing.
-->

### Tasks

- [ ] Push the branch; open a pull request to `main`. Pre-push runs the heavy checks; fix failures. See the pull
      request's checks to green. GitHub step fails or refused → skill `lernapps-github`.
- [ ] **Checkpoint:** publish. Show what the increment adds and the preview link from the comment "Vorschau der
      App"; ask whether it may go online. Wait for the yes.
- [ ] Merge the pull request into `main` (no pull request: merge the branch, push `main`). Watch the `Pages` run of
      that commit. Fails → read the failed step, fix, push.
- [ ] Open the address the job `deploy` printed ("published at ...", run summary); confirm the new content. Never
      a derived address; follow redirects.
- [ ] App listed and the entry changes (topics, school years, summary) → load skill `lernapps-listing`, write the
      changed entry. Else skip the next task.
- [ ] **Checkpoint:** list. Ask before opening the pull request to the catalog; wait for the yes.
- [ ] Fill the retrospective.
- [ ] Commit this plan on `main` and push it. A push of only `.vibe/` publishes nothing.
- [ ] Catalog pull request opened → see it to "bestanden" as the skill says.
- [ ] Plan changed since its last push → commit on `main`, push again.

### Completed

## Retrospective

<!-- At the end of Commit. Facts, short, no names. Read by review and evals. -->

### Phases reached

<!-- Last phase completed, checkpoints passed. E.g. "commit; confirmed, published". -->

### Failed checks

<!-- Each failed check: rule id, count. E.g. "`no-request-before-click`: 2". Not the pre-push count. -->

### Creator turns after the plan

<!-- Number of creator messages after the confirmation, topic of each. Target: max 3. -->

### Where I had to guess

<!-- Each gap in plan, skills, content guide, messages or answers, and your choice. "None" if none. -->
