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
failedChecks: { checks-pass: 2 }
---

# Increment: Original und Variante als Blätter, die man umblättert

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

Auch am Desktop liegen Original und Variante wie Blätter übereinander; man blättert zwischen beiden hin und her. Das Auge kann die Texte nicht mehr nebeneinander abgleichen, die Lernenden müssen sorgfältig lesen.

## Key decisions

- Nebeneinander entfällt in diesen beiden Modi auf allen Bildschirmen; die Umschalter „Original“/„Variante“ (bisher nur Handy) gelten überall. (Ersteller: „auch auf dem Desktop eine andere Darstellung“)
- Kurzer Umblätter-Effekt beim Wechsel (Seite kippt kurz weg, ca. 0,4 s); bei „weniger Bewegung“ im System ohne Effekt, nur Wechsel. (Ersteller: „gerne optisch ansprechend“; Bewegung abschaltbar wegen Barrierefreiheit, guess)
- Gilt für „Fehler markieren (mit Original)“ und „Original erkennen“. (Ersteller: „Ja, in beiden Modi umblättern“)
- Im Modus mit Quelle als PDF bleibt es am Desktop nebeneinander (PDF neben der Variante), weil man dort das PDF nicht als Text abgleicht. (Ersteller: „Bei PDF-Quelle ist nebeneinander besser“)
- Das markierte Blatt bleibt beim Umblättern unverändert (Markierungen bleiben).

## Notes

Reine Darstellung: keine neuen Kompetenzen, Texte oder Quellen. Betroffen: `src/ui/App.vue`, `src/ui/ChooseView.vue`, Playthrough-/e2e-Tests (Sichtbarkeit der Blätter), Abschnitt „Content structure“ im Skill `app-content` („side by side“), arc42-Texte zur Anzeige.

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
- [x] **Checkpoint:** research (keine Recherche nötig: reine Darstellung; Rückfragen beantwortet). Show in plain words: curriculum orientation, new competencies by chapter, didactic
      approach, scope, sources and how checked, what is unchecked. Stop and wait. Changes → change, ask again.
- [x] Set `phase: plan`: change the value line (`grep '^phase:'` prints `phase: plan`).

### Answers

- „Bei PDF-Quelle ist nebeneinander besser und. Ich verführerisch“ (Satz brach ab)
- „Ja, in beiden Modi umblättern, das PDF bleibt nebeneinander.“

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
- [x] Each new component (kein neues Bauteil; Ablauf in „Content method“) or interactive exercise: show a sketch (static SVG or image, or the steps). Words alone are
      not enough.
- [x] **Checkpoint:** confirm the plan and the content method. Stop and wait for an explicit yes. Changes → change,
      ask again.
- [x] Set `phase: code`: change the value line (`grep '^phase:'` prints `phase: code`).

### Content method

- Muster „Fehler markieren“ und „Original erkennen“ unverändert; nur die Anzeige ändert sich. Keine Figuren, keine neuen Bauteile.
- Anzeige: ein Blatt sichtbar, das andere liegt dahinter. Umschalter „Original“/„Variante“ (im Modus Original erkennen „Text A“/„Text B“) über den Blättern, auf allen Bildschirmen.
- Effekt: Das Blatt kippt um seine linke Kante weg (CSS-Drehung, ca. 0,4 s), das andere erscheint darunter. Nur mit CSS, kein Skript für die Bewegung. Bei „weniger Bewegung“ kein Effekt.
- Das unsichtbare Blatt ist für Bildschirmleser und Tastatur nicht erreichbar (kein Fokus in verdeckten Wörtern); der Wechsel wird angesagt.
- Modus mit Quelle als PDF: unverändert nebeneinander am Desktop (PDF-Rahmen neben der Variante); auf dem Handy bleibt der bestehende Umschalter.
- Grenze: Wer Original und Variante nebeneinander sehen will, kann das in diesen beiden Modi nicht mehr. Das ist gewollt.

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
- [x] Slice 1, Modus „Fehler markieren (mit Original)“ (`App.vue`): Umschalter und Blätter auf allen Bildschirmen; Umblätter-Effekt; „weniger Bewegung“; verdecktes Blatt nicht fokussierbar. Tests und Playthroughs anpassen. Check, commit.
- [x] Slice 2, Modus „Original erkennen“ (`ChooseView.vue`): dasselbe für Text A und B; Markierungen und Wahl bleiben beim Umblättern. Check, commit.
- [x] Slice 3, Modus mit PDF bleibt nebeneinander am Desktop (Test dafür); Schmalbildschirm wie bisher. Check, commit.
- [x] Browser-Test (Playwright) am Desktop und Handy: Blätter wechseln, Effekt an und aus, Tastatur. Commit.
- [x] Skill `app-content` (Abschnitte „Content structure“ und Muster: „side by side“ → Blätter, PDF nebeneinander) und arc42-Texte zur Anzeige anpassen, im selben Commit wie die Änderung.
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
- [x] App listed and the entry changes (der Eintrag ändert sich nicht: übersprungen) (topics, school years, summary) → load skill `lernapps-listing`, write the
      changed entry. Else skip the next task.
- [x] **Checkpoint:** list (übersprungen: kein neuer Eintrag). Ask before opening the pull request to the catalog; wait for the yes.
- [x] Fill the retrospective.
- [x] Commit this plan on `main` and push it. A push of only `.vibe/` publishes nothing.
- [x] Catalog pull request opened (keiner) → see it to "bestanden" as the skill says.
- [x] Plan changed since its last push → commit on `main`, push again.

### Completed

## Retrospective

<!-- At the end of Commit. Facts, short, no names. Read by review and evals. -->

### Phases reached

commit; Plan und Umsetzung mit „Ja, leg los“ bestätigt (inklusive „Wenn das so passt, merge es direkt“), Pull Requests 7 und 8 gemerged, veröffentlichte Seite im echten Browser geprüft.

### Creator turns after the plan

1: „Ja, leg los. Teste es am Ende mit einem echten Browser. Man soll nicht spicken können. Wenn das so passt, merge es direkt“.

### Where I had to guess

- Dauer und Art des Effekts: Blatt kippt um die linke Kante weg, ca. 0,4 s, bei „weniger Bewegung“ aus.
- Der Umschalter gilt für „Fehler markieren (mit Original)“ und „Original erkennen“ (Ersteller bestätigt); der PDF-Modus bleibt nebeneinander (Ersteller).
- Der erste Pull Request (7) ließ den `Pages`-Lauf auf `main` scheitern: Das kippende Blatt fing bei 360 px schnelle Taps auf den Umschalter ab. Behoben im Pull Request 8 (Umschalter über dem Blatt, Test dazu); erst danach wurde veröffentlicht. Die Prüfungen des Pull Requests 7 waren grün gewesen, der Fehler trat im Lauf auf `main` auf (Zeitpunkt der Animation).
- Der Eintrag im Katalog blieb unverändert.
