---
# Read by the hooks, the review, the evals. Schema: @lernapps/tooling/guidance/plan-front-matter.v1.schema.json
# Keep all four keys.
# Archetype as in the app's first plan; set it when you start. Never changes.
archetype: interactive
# Current phase. Allowed values: explore, plan, code, commit. Change the value line below, never this comment.
phase: plan
# prePushFailures: failed pre-push runs of this increment, written by the hook. Never change it.
prePushFailures: 0
# failedChecks: failed rules and runs, written by lernapps check and the hooks. Never change it.
failedChecks: {}
---

# Increment: PDF-Link über der Variante, wenn das PDF nicht eingebettet ist

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

*Gestartet 2026-10-19. Aufbauend auf Plan 06 (Pull Request #10, noch nicht veröffentlicht). Explore, Plan, Code, Commit.*

## Goal

Im Modus „Fehler markieren (mit Quelle als PDF)“ hat die Variante auf jedem Bildschirm, auf dem das PDF nicht neben ihr steht, die volle Breite. Der Link zum PDF steht dann darüber.

## Key decisions

- Eingebettet (breit, Maus, ab 960 px): PDF neben der Variante, wie bisher.
- Nicht eingebettet: kein Spaltenplatz für die Quelle; Link „Quelle als PDF öffnen (neuer Tab)“ und die Quellenangabe in einem Block über der Variante, Variante in voller Breite.
- Der Umschalter „Quelle / Variante“ auf schmalen Bildschirmen entfällt im PDF-Modus (guess): nichts mehr umzuschalten.
- Im Modus „Original anzeigen“ und „Original erkennen“ ändert sich nichts.

## Notes

Kein neuer Inhalt, keine Quelle, kein Lehrplanbezug. Nur Oberfläche: `src/ui/App.vue`.
Ungeprüft: Anzeige auf echten Geräten.

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

- „Wenn wir PDF auswählen und die Anzeige zu schmal für nebeneinander ist, sollte der Button zum Öffnen des PDFs nicht die Spalte einnehmen, sondern einfach oberhalb der Variante angezeigt werden, damit die Variante die volle Bildschirmbreite zur Verfügung hat.“

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
- [ ] **Checkpoint:** confirm the plan and the content method. Stop and wait for an explicit yes. Changes → change,
      ask again.
- [ ] Set `phase: code`: change the value line (`grep '^phase:'` prints `phase: code`).

### Content method

- Muster unverändert (Modus `source`); nur die Anordnung ändert sich. Der Leitfaden-Absatz zum Modus `source` wird angepasst.

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
- [ ] Slice, Anordnung: in `src/ui/App.vue` den PDF-Block nur dann als Spalte neben die Variante, wenn das PDF eingebettet ist (`embed`); sonst als Block über der Variante, Variante volle Breite; Umschalter im PDF-Modus entfällt; Leitfaden-Absatz anpassen; Screenshot bei 360, 800 und 1280 px prüfen; commit.
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
