---
# Read by the hooks, the review, the evals. Schema: @lernapps/tooling/guidance/plan-front-matter.v1.schema.json
# Archetype as in the app's first plan; set it when you start. Never changes.
archetype: interactive
# Current phase. Allowed values: explore, plan, code, commit. Change the value line below, never this comment.
phase: commit
# prePushFailures: failed pre-push runs of this increment, written by the hook. Never change it.
prePushFailures: 0
---

# Increment: Überschriften und Einleitungen in allen Texten

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

Jeder Text beginnt mit einer Überschrift und einer kleinen Einleitung, im Original wie in der Variante. Die Lernenden verstehen vom ersten Satz an, worum es geht.

## Key decisions

- Überschrift = `title` des Pakets, über dem Original und über der Variante (auch in beiden Texten des Modus Original erkennen); in der Variante nicht markierbar, nicht verfälscht. (Ersteller: „Sie brauchen sicher eine Überschrift … direkt im Original als auch Variante“)
- Der Auszug beginnt mit der Einleitung des Artikels (erster Satz, wörtlich); die Variante beginnt mit derselben Einleitung in eigenen Worten und nennt das Thema. (Ersteller: „die Texte sollen mit einer kleinen Einleitung beginnen“)
- Alle 30 Pakete werden durchgesehen, eine Sitzung je Stufe (Ersteller: „guck dir noch mal alle neuen Texte an“); Prüfskript `check-lead.mjs` im Skill `app-textpack`; ich prüfe die Ergebnisse selbst.
- Die Pakete ändern sich nur im Anfang und in dem, was dafür nötig ist (Länge ungefähr gleich, Stellen und Varianten bleiben, soweit sie noch passen).

## Notes

Nachtrag (Ersteller direkt an Sitzung 7–8): „Du darfst bei allen diesen Beispielen auch die Originale leicht vereinfachen bzw. glätten“. Neun Auszugssätze der Stufe 7–8 sind deshalb nicht mehr wörtlich (in den notes der Pakete vermerkt); alle anderen Stufen sind wörtlich.

Befund (Prüfskript über die Quell-PDFs): 17 von 30 Paketen beginnen nicht mit der Einleitung des Artikels (zum Beispiel Eichhörnchen, Biber, Igel, Mond, Photosynthese, Regenwald, Dampfmaschine, Penicillin). Quellen und Lizenzen unverändert; die PDFs enthalten die ganzen Artikel, die Sitzungen brauchen keine neuen Abrufe.

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

- [x] `git switch -c increment/04-ueberschriften` from `main`. Commit this plan on it.
- [x] Überschrift in der Oberfläche (Original, Variante, Modus 2), Prüfskript, Skill.
- [x] Fünf Sitzungen (eine je Stufe; gestartet 19.10.2026 04:16 UTC: 3–4 session_01XXFyjKrCE7hhwpdVawmTLE, 5–6 session_012YFu4QXhikur9wHXquXbTG, 7–8 session_017Z9qdAJyw3uK7txWXBdzop, 9–10 session_018BJN2cetFd327GwmAcxjdV, 11–13 session_019Cz1hdP83wuW4y3dkR4Nia; Zweige text-fix/<stufe>) überarbeiten die Pakete ihrer Stufe.
- [x] Ergebnisse prüfen (Tests, `check-lead.mjs`, Runden gelesen), zusammenführen.
- [x] Durchläufe der Stufe 5–6 und Tests prüfen; `npx lernapps check` und `npx arc42 validate --strict` bestehen.
- [x] Der Guide beschreibt die App, wie sie jetzt ist: Überschrift, Einleitung; Hinweis zu Durchläufen und Paketzahl. `grep -c "FILL IN" .agents/skills/app-content/SKILL.md` ergibt 0.
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

<!-- Last phase completed, checkpoints passed. E.g. "commit; confirmed, published". -->
commit; Auftrag des Erstellers, Veröffentlichung ausdrücklich bestätigt („Passt“), Pull Request #5 zusammengeführt, Seite geprüft. Der Katalogeintrag ändert sich nicht (keine neuen Einstiege).

### Failed checks

<!-- Each failed check: rule id, count. E.g. "`no-request-before-click`: 2". Not the pre-push count. -->
Keine.

### Creator turns after the plan

<!-- Number of creator messages after the confirmation, topic of each. Target: max 3. -->
2: „Fertig“ (Sitzungen), „Passt, Wörtlichkeit ist kein Muss“ (Veröffentlichung); dazu zwei Nachrichten direkt an Sitzung 7–8 („Anfang von Photosynthese“, „Originale leicht vereinfachen“).

### Where I had to guess

<!-- Each gap in plan, skills, content guide, messages or answers, and your choice. "None" if none. -->
Die Prüfung des Anfangs durch das Skript ist eine Näherung (Infokästen vor dem Text); Entscheidung: Treffer von Hand lesen. Wörtlichkeit der Originale ist kein Muss (Ersteller); die Prüfung gegen die PDFs bleibt als Hinweis.
