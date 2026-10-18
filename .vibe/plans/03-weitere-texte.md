---
# Read by the hooks, the review, the evals. Schema: @lernapps/tooling/guidance/plan-front-matter.v1.schema.json
# Archetype as in the app's first plan; set it when you start. Never changes.
archetype: interactive
# Current phase. Allowed values: explore, plan, code, commit. Change the value line below, never this comment.
phase: code
# prePushFailures: failed pre-push runs of this increment, written by the hook. Never change it.
prePushFailures: 0
---

# Increment: Fünf weitere Texte je Altersstufe

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

## Goal

Lernende finden zu jeder Altersstufe sechs statt einem Text vor (fünf neue je Stufe, 3–4, 5–6, 7–8, 9–10, 11–13), in allen drei Modi. Es ändert sich nichts am Aufbau der App.

## Key decisions

- Fünf neue Textpakete je Stufe, eine eigene Sitzung je Stufe, parallel (Ersteller: „je 5 weiteren Texten pro Stufe, ein Agent pro Stufe“). Skill `app-textpack` ist die Anweisung; das Prüfwerkzeug (`npx vp test run`) entscheidet, nicht der Bericht.
- Themen und Quellen bestimmt der Assistent je Stufe, damit keine Sitzung doppelt arbeitet (guess): Klexikon für 3–6, Wikipedia ab 7. Wikimedia sperrt bei zu vielen Anfragen von einer Adresse (429): jede Sitzung läuft in eigenem Container, lädt je Text eine Seite und wartet bei 429, statt zu umgehen.
- Die Sitzungen ändern nur Dateien ihrer Stufe: `src/data/packs/de/<stufe>/*.json` und `public/quellen/de/*.pdf`. Nicht `.vibe/texts-log.md`, nicht den Guide, nicht den Code: die Zeilen fürs Protokoll stehen im Bericht, der Assistent trägt sie ein (keine Zusammenführungskonflikte).
- Neue Regel im Prüfwerkzeug: Jeder Text braucht genug Stellen ohne Fehler der Familie Form für den Modus Original erkennen (Fehler, wenn weniger als Fehler je Runde; Hinweis bei weniger als +2).
- Die Startseite zeigt die Liste der 15 Routen („Auswahl“) nicht mehr; die Auswahlfelder der App-Seite ersetzen sie. (Ersteller: „unnötig, entferne sie“)

## Notes

**Quellen und Lizenz.** Wie im ersten Plan: nur Quellen unter CC BY-SA (Klexikon, Wikipedia) oder frei nutzbar; Revision festhalten; Lizenz und Autorenliste in `source`.

**Themen (Vorschlag, die Sitzung darf in der Stufe tauschen und meldet das).**
- 3–4 (Klexikon): Biber, Eichhörnchen, Honigbiene, Regenbogen, Fahrrad.
- 5–6 (Klexikon): Vulkan, Pyramiden, Wikinger, Sonnensystem, Römisches Reich.
- 7–8 (Wikipedia): Photosynthese, Gezeiten, Plattentektonik, Regenwald, Blutkreislauf.
- 9–10 (Wikipedia): Industrielle Revolution, Französische Revolution, Treibhauseffekt, Penicillin, Berliner Mauer.
- 11–13 (Wikipedia, historisch/politisch): Marshallplan, Kubakrise, Weimarer Verfassung, Wiener Kongress, Deutsche Wiedervereinigung.

**Umfang.** In: fünf Pakete je Stufe mit Quell-PDF. Aus: neue Modi, neue Fehlerklassen, neue Stufen, Änderungen am Code (außer Prüfregel).

**Offen.** Prüfen jedes Pakets durch den Assistenten: Prüfwerkzeug, Auszugssätze wörtlich in Quelle und PDF, Stichprobe der Zahlen, mehrere Seeds gespielt in allen Modi.

## Explore

<!-- All content questions belong here; Plan maps them onto the app. Ask; write no code. Max 2 questions per message.
Skip what earlier answers or the app tell. Answers → "Answers". -->

### Tasks

- [x] Set `archetype` as in the app's first plan in `.vibe/plans/`.
- [x] Skills are in `.agents/skills/`. Only if missing: `npx skills add lernapps/tooling#exp/compact-guidance`.
- [x] Load the content guide `.agents/skills/app-content/SKILL.md` and skill `lernapps-content-growth`; read the
      plans in `.vibe/plans/` (what the app teaches, how content is made, what is open).
- [x] Ask: which competencies, chapters or rounds, for which school years?
- [x] Research: the guide's curriculum and sources; skill `lernapps-content-research` for the rest. Under "Notes":
      curriculum orientation (Lehrplan cited where used), new competencies by chapter as Ich-kann-Sätze, verified
      sources.
- [x] Ask: which hurdles and misconceptions, which examples or experiments for the new content? Under "Notes": the
      didactic approach per competency and the scope (in, out, data range).
- [x] **Checkpoint:** research. Show in plain words: curriculum orientation, new competencies by chapter, didactic
      approach, scope, sources and how checked, what is unchecked. Stop and wait. Changes → change, ask again.
- [x] Set `phase: plan`: change the value line (`grep '^phase:'` prints `phase: plan`).

### Answers

<!-- Creator's answers, their words, one bullet each. -->
- „Mach dich an die Zusammenstellung von je 5 weiteren Texten pro Stufe, ein Agent pro Stufe.“ (Ersteller, nach der Veröffentlichung von Plan 02; zählt als Bestätigung dieses Plans)

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

<!-- One line each: guide patterns, figures, components used, and where; anything new, what it does and cannot.
New things go into the guide in the slice that adds them. -->

### Completed

## Code

<!--
- Load skill lernapps-app, the archetype's skill and the content guide before content.
- Commit after each slice; the hooks check. Pre-commit fails → read node_modules/.cache/lernapps/pre-commit.log.
- Fix from the message; never bypass a hook. Undecidable → choose, mark "(guess)", go on.
- Creator asks for a change → first say your reading in one sentence; never narrow it silently.
-->

### Tasks

- [x] `git switch -c increment/03-weitere-texte` from `main`. Commit this plan on it.
- [x] Basis vorbereiten: Startseite ohne Routenliste, Prüfregel für Modus 2, Tests grün.
- [ ] Fünf Sitzungen starten (`create_session`, je Stufe, Basis `increment/03-weitere-texte`, Zweig `text/<stufe>`), Anweisung mit Themen, Skill, Grenzen und Berichtsform.
- [ ] Jeden Bericht prüfen: Zweig holen, `npx vp test run`, Auszug in Quelle und PDF, Stichprobe der Zahlen, mehrere Seeds in den drei Modi gespielt. Bei Mängeln einmal zurückschicken.
- [ ] Geprüfte Zweige in `increment/03-weitere-texte` zusammenführen, Protokollzeilen eintragen, Sitzungen archivieren (erst nach dem Zusammenführen).
- [ ] Der Guide beschreibt die App, wie sie jetzt ist (`app-content-matches`); `grep -c "FILL IN" .agents/skills/app-content/SKILL.md` ergibt 0.
- [ ] `npx lernapps check` und `npx arc42 validate --strict` bestehen.
- [ ] Every box of Explore, Plan and Code ticked.
- [ ] Set `phase: commit`: change the value line (`grep '^phase:'` prints `phase: commit`).

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
