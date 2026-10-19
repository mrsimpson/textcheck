---
# Read by the hooks, the review, the evals. Schema: @lernapps/tooling/guidance/plan-front-matter.v1.schema.json
# Keep all four keys.
# Archetype as in the app's first plan; set it when you start. Never changes.
archetype: interactive
# Current phase. Allowed values: explore, plan, code, commit. Change the value line below, never this comment.
phase: explore
# prePushFailures: failed pre-push runs of this increment, written by the hook. Never change it.
prePushFailures: 0
# failedChecks: failed rules and runs, written by lernapps check and the hooks. Never change it.
failedChecks: {}
---

# Increment: Hinweise Schritt für Schritt

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

Lernende können sich bei einer schwierigen Runde Schritt für Schritt Hinweise holen, die das Finden der Fehler leichter machen (Entwurf, noch nicht bestätigt).

## Key decisions

- Hinweise kommen in Stufen, jede zeigt mehr, nie das Wort selbst. (Ersteller: letzte Stufe „zu genau“)
- Stufe 1: zeigt die Fehlerklassen der Runde, wenn sie verdeckt sind (`announceClasses: false`). Sind sie schon sichtbar, entfällt die Stufe. (Ersteller)
- Stufe 2: markiert die Sätze der Variante, in denen ein Fehler steckt, und schreibt die Fehlerklasse dazu. Satzebene. (Ersteller: „Satzebene“)
- Kein Hinweis zeigt das Wort oder die Stelle im Satz. (Ersteller)
- Alles gefunden ohne Hinweis: Feuerwerk. Mit Hinweis: Konfetti. Bei „Bewegung reduzieren“ keine Effekte, wie heute. (Ersteller)
- Die Auflösung nennt bei Hinweisen einen ermutigenden Satz: beim nächsten Mal klappt es vielleicht ohne. (Ersteller)
- Der Kern zählt die Hinweisstufe pro Runde (Aktion `hint`); eine neue Runde setzt sie zurück. Das Ergebnis (gefunden, übersehen) ändert sich nicht, es gibt keine Punkte. (guess)
- Im Modus `choose` markiert Stufe 2 den betroffenen Satz in beiden Texten (der Satz des Originals über `evidence.quote`), so verrät der Hinweis nicht, welcher Text die Variante ist; Stufe 1 gilt ohnehin vor der Wahl. Eingefügte Sätze (nur ein Slot, ohne Gegenstück im Original) werden vor der Wahl in keinem Text markiert, nach der Wahl im gewählten Text. (Ersteller: „in beiden Varianten hervorheben“; Einschränkung guess)
- Der Knopf „Hinweis“ steht unter dem Text neben „Prüfen“; ein Hinweis bleibt bis zum Ende der Runde sichtbar und lässt sich nicht zurücknehmen. (guess)

## Notes

Reine Hilfe in der Bedienung: kein neuer Lehrplanbezug, keine neue Kompetenz, keine neuen Texte oder Quellen. Hinweise nutzen die vorhandenen Daten (Fehlerklassen und Slots je Satz). Betroffen sind `src/core` (Aktion `hint`, Zustand), `src/ui` (Knopf, Anzeige, Feuerwerk), `src/messages/de.json` und `en.json`, Playthroughs, e2e, arc42 und der Abschnitt zur Anzeige im Skill `app-content`.

Didaktik: Gestuftes Helfen (erst Art des Fehlers, dann Ort), damit Lernende selbst suchen und das Wort selbst finden; Umfang: Hinweise nur in den Modi `mark`, `source` und (nach der Wahl) `choose`, Deutsch und Englisch, alle Stufen. Nicht dabei: Hinweise nach dem Prüfen, Wort-Hinweise.

Ungeprüft: Die Hinweise sind nicht mit Kindern getestet.

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
- [ ] **Checkpoint:** research. Show in plain words: curriculum orientation, new competencies by chapter, didactic
      approach, scope, sources and how checked, what is unchecked. Stop and wait. Changes → change, ask again.
- [ ] Set `phase: plan`: change the value line (`grep '^phase:'` prints `phase: plan`).

### Answers

- Stufen: Die letzte Stufe „Stelle im Satz eingrenzen“ wäre zu genau. Stufe 1: sind die Fehlerklassen verdeckt, werden sie sichtbar. Danach: Eingrenzung auf den jeweiligen Absatz und die Fehlerklassen dort annotieren.
- Eingrenzung auf Satzebene (nicht Abschnitt). Alles ohne Hinweis gefunden: Feuerwerk. Alles mit Hinweis gefunden: Konfetti.
- Auflösung: Eine Motivation, dass es beim nächsten Mal vielleicht auch ohne Hinweise klappt. Ohne Hinweis gelöst: Feuerwerk statt Konfetti.

<!-- Creator's answers, their words, one bullet each. -->

### Completed

## Plan

<!-- Confirmable in one read. After the confirmation: work on your own (creator turns to the end: max 3). -->

### Tasks

- [ ] Write the Code tasks: one slice per competency (skill `lernapps-content-growth`), in the guide's order; each
      ends in a commit.
- [ ] Write "Content method": the guide's patterns, figures, components per slice; anything new, with why the
      guide's patterns do not fit.
- [ ] Show the creator, short: goal, new competencies by chapter, slices; in plain words what learners see and do,
      and what is new. Max 2 questions.
- [ ] Each new component or interactive exercise: show a sketch (static SVG or image, or the steps). Words alone are
      not enough.
- [ ] **Checkpoint:** confirm the plan and the content method. Stop and wait for an explicit yes. Changes → change,
      ask again.
- [ ] Set `phase: code`: change the value line (`grep '^phase:'` prints `phase: code`).

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

- [ ] `git switch -c increment/<NN>-<short name>` from `main`. Commit this plan on it.
- [ ] `npx --yes github:lernapps/tooling#exp/compact-guidance update`, then `npm install`. It replaces the `lernapps-*` skills: reread
      the ones you use. Commit the update alone; fix its check findings before content.
- [ ] <the slices written in Plan, each: competency, content, exercise, the entry's topic, check, commit>
- [ ] The content guide describes the app as it is now: competencies, chapters, patterns, procedure for the next
      increment (`app-content-matches`). `grep -c "FILL IN" .agents/skills/app-content/SKILL.md` prints 0.
- [ ] `npx lernapps check` passes.
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

### Creator turns after the plan

<!-- Number of creator messages after the confirmation, topic of each. Target: max 3. -->

### Where I had to guess

<!-- Each gap in plan, skills, content guide, messages or answers, and your choice. "None" if none. -->
