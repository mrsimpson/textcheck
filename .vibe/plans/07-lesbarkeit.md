---
# Read by the hooks, the review, the evals. Schema: @lernapps/tooling/guidance/plan-front-matter.v1.schema.json
# Keep all four keys.
# Archetype as in the app's first plan; set it when you start. Never changes.
archetype: interactive
# Current phase. Allowed values: explore, plan, code, commit. Change the value line below, never this comment.
phase: commit
# prePushFailures: failed pre-push runs of this increment, written by the hook. Never change it.
prePushFailures: 0
# failedChecks: failed rules and runs, written by lernapps check and the hooks. Never change it.
failedChecks: { checks-pass: 7 }
---

# Increment: Bessere Bedienung und einstellbare Schrift

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

*Gestartet am 19.10.2026. Explore, Plan, Code, Commit.*

## Goal

Die App beginnt mit dem Original, beide Blätter sind gleich hoch, der Tastaturhinweis stört den Text nicht mehr, und Lernende stellen Schrift, Größe und Abstand selbst ein.

## Key decisions

- Start mit dem Original (Modus mit Quelle: das Original/die Quelle zuerst). (Ersteller: „Es sollte mit dem Original anfangen“)
- Original und Variante teilen sich dieselbe Schriftgröße und denselben Zeilenabstand; bisher 1,8 gegen 2,1, auf Touchgeräten noch höher. Die Markierfläche der Wörter bleibt gleich hoch wie das Original.
- Der Tastaturhinweis steht unter dem Text statt zwischen Überschrift und Text und gilt auch im Modus „Original erkennen“, wo er bisher fehlte (guess).
- Der Fokus bleibt beim Umblättern auf dem Umschalter (kein Verlust, geprüft am Code); „Blatt 1 von 2“ entfällt, weil es den Namen der Umschalter ändern würde (guess).
- Eine Schrift für alles: Recursive (Variable Font, SIL OFL 1.1), zugeschnitten auf Latein mit Umlauten und nur die Achsen Gewicht, Casual und Mono; in der App gebündelt, keine Anfrage nach außen. (Ersteller: „Recursive als Standard“)
- Einstellungen: Schriftstil (Normal, Rund, Festbreite), Strichstärke, Größe, Zeilenabstand, mit Zurücksetzen. Standard ist Recursive, normal (guess für die Auswahl).
- Die Einstellung bleibt auf dem Gerät erhalten, über den Storage-Wrapper des Tooling, mit eigenem Schlüsselpräfix; ist Speichern gesperrt, funktioniert die App mit den Standardwerten. (Ersteller: „Einstellung merken“)
- Quelle als PDF (A4, ca. 794 px bei 100 %): das PDF braucht mindestens ca. 700 px Breite, um lesbar zu sein. Gemessen: der Rahmen der App ist höchstens 44 rem (ca. 704 px) breit, nebeneinander wird also nie lesbar. Deshalb ist auch das PDF ein Blatt; der Rahmen der Seite wird dafür auf 56 rem geweitet, solange das PDF-Blatt zu sehen ist (App überschreibt dazu die Breite der Laufzeit; andere Modi bleiben schmal; Ersteller: „Können wir das nicht einfach überschreiben?“). Das ersetzt die Entscheidung aus Plan 05 „bei PDF nebeneinander ab 960 px“. (Ersteller: „PDF ist viel zu schmal“, „mach das abhängig vom Viewport“)
- Wo das PDF nicht eingebettet wird (schmaler Bildschirm oder Touch), gibt es kein PDF-Blatt und keinen Umschalter: der Button „PDF öffnen“ steht über der Variante, die die volle Breite hat. (Ersteller: „der Button zum Öffnen des PDFs sollte nicht die Spalte einnehmen“)
- Keine Warnung beim Wechsel von Stufe oder Modus (Ersteller hat sie nicht gewünscht; guess).

## Notes

Nummer: Auf `main` kam parallel der Plan 06 (Hinweis „umformuliert“); dieser Plan wurde deshalb zu 07. Der Branch heißt weiter `increment/06-lesbarkeit`, weil der Pull Request schon offen war.

Reine Darstellung: keine neuen Kompetenzen, Texte oder Quellen. Betroffen: `src/ui/App.vue`, `ChooseView.vue`, `WordList.vue`, `src/messages/de.json` und `en.json`, neu eine Komponente für die Schrift-Einstellungen und ein Modul für die Werte, Playthroughs/e2e, arc42 (Schrift gebündelt, Speicher) und der Abschnitt zur Anzeige im Skill `app-content`.

Recursive: <https://www.recursive.design/>, Lizenz SIL Open Font License 1.1; Lizenztext und Namensnennung kommen mit der Schriftdatei in die App. Größe der zugeschnittenen Datei und Platz im Quota des Tooling sind vor dem Einbau zu messen (offen).

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

- Erst auffällig: Variante zuerst, Hinweis zwischen Überschrift und Text, Text bei Original und Variante unterschiedlich hoch, Schriftart einstellbar.
- „Könnten wir recursive.design nutzen, um nur einen Font zu bundlen und zu konfigurieren?“
- „Recursive als Standard, und Einstellung merken.“

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

- Kein Inhalt ändert sich; keine neuen Muster oder Figuren. Neu ist eine Komponente `ReadingSettings.vue` (Auswahl und Regler) und ein Modul für die gespeicherten Werte. Das Ergebnis wirkt über CSS-Variablen am Wurzelelement der App.
- Skizze (Schrift-Einstellungen, über der Aufgabe, eingeklappt unter „Schrift und Lesen“):
  `[ Schrift und Lesen ▾ ]` → Stil: ( ) Normal ( ) Rund ( ) Festbreite · Strichstärke ──●── · Größe ──●── · Zeilenabstand ──●── · [Zurücksetzen]. Darunter eine Beispielzeile.
- Skizze (Blatt): Überschrift „Original“ / Titel / Text / kleiner Hinweis „Tastatur: …“ (unter dem Text) / Quelle.

### Completed

## Code

<!--
- Load skill lernapps-app, the archetype's skill and the content guide before content.
- Commit after each slice; the hooks check. Pre-commit fails → read node_modules/.cache/lernapps/pre-commit.log.
- Fix from the message; never bypass a hook. Undecidable → choose, mark "(guess)", go on.
- Creator asks for a change → first say your reading in one sentence; never narrow it silently.
-->

### Tasks

- [x] `git switch -c increment/06-lesbarkeit` from `main`. Commit this plan on it.
- [x] `npx --yes github:lernapps/tooling#exp/compact-guidance update`, then `npm install`. It replaces the `lernapps-*` skills: reread
      the ones you use. Commit the update alone; fix its check findings before content.
- [x] Slice 1 Bedienung: Start mit Original; gleiche Höhe (ein Zeilenabstand für Original, Variante und Wählmodus); Hinweis unter den Text und in den Wählmodus; PDF als Blatt in einem auf 56 rem geweiteten Rahmen. Playthroughs und e2e anpassen. Check, Commit.
- [x] Slice 2 Schrift: Recursive zuschneiden und messen (Größe, Quota); in `public/` bündeln samt Lizenz; Einstellungen mit Speichern über den Wrapper; Meldungen de/en; arc42 und Skill `app-content` anpassen; Tests. Check, Commit.
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

### Creator turns after the plan

<!-- Number of creator messages after the confirmation, topic of each. Target: max 3. -->

### Where I had to guess

<!-- Each gap in plan, skills, content guide, messages or answers, and your choice. "None" if none. -->
