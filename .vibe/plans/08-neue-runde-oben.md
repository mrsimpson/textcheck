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
failedChecks: { checks-pass: 1 }
---

# Increment: Nochmal statt Prüfen

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

Nach dem Prüfen finden Lernende sofort den Knopf für eine neue Runde: er steht neben der Überschrift „Ergebnis“, über den Auflösungen, und die Seite scrollt nach dem Prüfen dorthin.

## Key decisions

- Der vorhandene Knopf „Neue Runde“ bleibt (Ersteller: „den Button gibt es ja schon“); die Leiste mit „Prüfen“ bleibt wie sie ist, ein zweiter Knopf „Nochmal“ entfällt. Das ersetzt meinen ersten Entwurf.
- Der Knopf „Neue Runde“ steht direkt direkt unter dem Lob („Stark! …“, sonst unter der Überschrift „Ergebnis“), über Zusammenfassung und Auflösungen. Auf schmalen Bildschirmen füllt er die Breite, mit etwas Abstand. (Ersteller, später: „Besser direkt unter ‚Stark! …‘. Mobile die Breite füllend, etwas margin“) (Ersteller: „direkt unter Ergebnis nebendran … Mobil untendrunter, die Breite füllend“)
- Nach dem Prüfen scrollt die Seite zum Knopf. Heute geht der Fokus auf die Überschrift „Ergebnis“; die Zusammenfassung steht direkt darunter und bleibt sichtbar, der Knopf ist also fast ohne Scrollen sichtbar (guess: Fokus bleibt auf der Überschrift, damit Screenreader zuerst das Ergebnis hören; gescrollt wird so, dass der Knopf im Bild steht).

## Notes

Reine Bedienung: keine neuen Inhalte, Texte oder Quellen. Betroffen: `src/ui/ResultView.vue` (Knopf nach oben), `src/ui/App.vue` (Scrollen nach dem Prüfen), e2e-Tests. Plan 07 ist noch nicht abgeschlossen (Commit-Phase offen); diese Änderung ist ein eigener Plan.

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

- „Nach dem Abschluss einer Übung brauchen wir eine Möglichkeit, eine neue Variante zu starten. Dazu können wir den Prüfen-Button nach Prüfen durch einen ‚Nochmal‘-Button ersetzen.“
- „Oh, den Button gibt es ja schon. Hatte ich übersehen. Er sollte besser oberhalb der Auflösungen stehen und nach dem Prüfen sollte zu ihm gescrollt werden.“

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

- Kein Inhalt ändert sich, kein neues Muster, keine neue Komponente. Skizze breit: `Ergebnis ........ [Neue Runde]`, darunter Zusammenfassung / Auflösungen; schmal: `Ergebnis` / `[ Neue Runde (volle Breite) ]` / Zusammenfassung / Auflösungen nach Fehlerklasse / Legende.

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
- [x] Slice Knopf nach oben: „Neue Runde“ im Ergebnis neben die Überschrift (schmal: darunter, volle Breite), nach dem Prüfen zum Knopf scrollen (auch im Modus „Original erkennen“); e2e anpassen. Check, Commit.
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

- [x] Push the branch; open a pull request to `main`. Pre-push runs the heavy checks; fix failures. See the pull
      request's checks to green. GitHub step fails or refused → skill `lernapps-github`.
- [x] **Checkpoint:** publish. Show what the increment adds and the preview link from the comment "Vorschau der
      App"; ask whether it may go online. Wait for the yes.
- [x] Merge the pull request into `main` (no pull request: merge the branch, push `main`). Watch the `Pages` run of
      that commit. Fails → read the failed step, fix, push.
- [x] Open the address the job `deploy` printed ("published at ...", run summary); confirm the new content. Never
      a derived address; follow redirects.
- [x] App listed and the entry changes (topics, school years, summary) → load skill `lernapps-listing`, write the
      changed entry. Else skip the next task.
- [x] **Checkpoint:** list. Ask before opening the pull request to the catalog; wait for the yes.
- [x] Fill the retrospective.
- [x] Commit this plan on `main` and push it. A push of only `.vibe/` publishes nothing.
- [x] Catalog pull request opened → see it to "bestanden" as the skill says.
- [x] Plan changed since its last push → commit on `main`, push again.

### Completed

## Retrospective

<!-- At the end of Commit. Facts, short, no names. Read by review and evals. -->

### Phases reached

commit; Plan bestätigt, Veröffentlichung bestätigt, online (Pages-Lauf grün). Der Eintrag im Katalog ändert sich nicht, deshalb kein Katalog-Pull-Request.

### Creator turns after the plan

6, alle zum Knopf: Er sollte oberhalb der Auflösungen stehen (statt „Nochmal“ in der Leiste), mit Scrollen dorthin; dann neben der Überschrift; dann direkt unter dem Lob, schmal volle Breite mit Abstand; Screenshot; Merge. Mehr als das Ziel von 3, weil die erste Annahme („Nochmal“ statt „Prüfen“) den vorhandenen Knopf übersehen hatte.

### Where I had to guess

- Fokus nach dem Prüfen bleibt auf der Überschrift; gescrollt wird zur Überschrift (der Ersteller hat auf die Frage nicht geantwortet).
- Ohne Lob steht der Knopf direkt unter der Überschrift.
- Die Veröffentlichung wurde mit der öffentlichen Adresse der Seite geprüft (HTTP 200), nicht mit der Adresse aus der Zusammenfassung des Laufs.
