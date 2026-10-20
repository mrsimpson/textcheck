---
# Read by the git hooks, the review and the evals.
# Schema: @lernapps/tooling/guidance/plan-front-matter.v1.schema.json. Keep all four keys.
# archetype: the kind of app, as in the app's first plan: set it when you start this plan. It never changes.
archetype: interactive
# phase: the phase you work in now: explore, plan, code or commit. Change it when you enter the next phase.
phase: commit
# prePushFailures: failed runs of the pre-push hook during this increment. The hook counts them. Never change it.
prePushFailures: 0
# failedChecks: the rules that failed in a run of lernapps check (hooks included), with the number of runs. The check
# writes it. Never change it.
failedChecks: {}
---

# Increment: Neue Runde beginnt auf der Original-Seite

*Gestartet am 20.10.2026. Explore, Plan, Code, Commit. Der Plan wurde nachgezogen, nachdem die Änderung schon auf dem Branch stand.*

## Goal

Wer im Modus „Fehler markieren (mit Original)“ eine neue Runde beginnt, sieht den Text wieder auf der Seite „Original“, auch wenn vorher die Variante angezeigt wurde.

## Key decisions

- Gilt nur im Modus `mark`, nur beim Wechsel von der Auswertung zur nächsten Runde; die Ansicht „Original/Variante“ wird dort auf „Original“ gesetzt. (Ersteller: „auf die Original-Seite wechseln, wenn Fehler-Finden der Modus war“)
- „Fehler-Finden“ ist der Modus „Fehler markieren (mit Original)“ (`mark`); die Modi `source` und `choose` haben keine Ansicht zum Umschalten und bleiben, wie sie sind. (guess)
- Der Branch ist der von der Umgebung vorgegebene `claude/nifty-goodall-jwfrks`, nicht `increment/11-original-seite`. (guess)

## Notes

Reine Bedienung, kein neuer Inhalt, keine neue Kompetenz. Betroffen: `src/ui/App.vue`. Der Inhalts-Leitfaden und arc42 nennen die Ansicht nicht, sie bleiben unverändert.

## Explore

### Tasks

- [x] Set `archetype` as in the app's first plan in `.vibe/plans/`.
- [x] The skills are in the app's repo, in `.agents/skills/`. Only if they are missing, install them:
      `npx skills add lernapps/tooling`.
- [x] Load the content guide `.agents/skills/app-content/SKILL.md` and the skill `lernapps-content-growth`, and read
      the plans in `.vibe/plans/`: what the app teaches, how its content is made, and what earlier increments left
      open.
- [x] Ask what this increment adds or changes: which competencies, chapters or rounds, for which school years.
- [x] Research the new content: nichts Neues, kein Inhalt betroffen.
- [x] **Checkpoint:** research. Kein Inhalt, nichts zu zeigen; der Ersteller hat die Änderung selbst beschrieben.
- [x] Set `phase: plan`.

### Answers

- Nach dem Erstellen eines neuen Rätsels soll auf die Original-Seite gewechselt werden, wenn Fehler-Finden der Modus ausgewählt war.

### Completed

## Plan

### Tasks

- [x] Write the tasks of Code under "Code".
- [x] Write the content method under "Content method".
- [x] Show the creator the goal and the slice.
- [x] No new component or interactive exercise: no sketch needed.
- [x] **Checkpoint:** confirm the plan. Der Ersteller bat, den Plan nachzuziehen, und beauftragte PR, CI und Merge.
- [x] Set `phase: code`.

### Content method

- Kein Inhalt ändert sich, kein Muster, keine Figur, keine Komponente.

### Completed

## Code

### Tasks

- [x] Switch to a new branch from `main`. (Branch von der Umgebung vorgegeben, siehe Key decisions.)
- [x] Update the app to the newest tooling: entfällt, reine Darstellungsänderung. (guess)
- [x] Slice: Ansicht auf „Original“ zurücksetzen, wenn im Modus `mark` die nächste Runde beginnt (`src/ui/App.vue`). Typcheck, Commit.
- [x] The content guide describes the app as it is now (`app-content-matches`): nichts zu ändern.
- [x] `npx lernapps check` passes.
- [x] Set `phase: commit`.

### Completed

## Commit

### Tasks

- [x] Push the branch and open a pull request to `main` in the app's repo. The pre-push hook runs the heavy checks;
      fix what fails. See the checks of the pull request through to green. When a GitHub step fails or is refused,
      load the skill `lernapps-github`.
- [x] **Checkpoint:** publish. Der Ersteller hat PR, CI und Merge im Voraus beauftragt: Merge, sobald CI grün ist.
- [x] Merge the pull request into `main`. Watch the run of the workflow `Pages` for that commit until it ends.
- [x] Open the address the job `deploy` printed and confirm that it shows the new behaviour.
- [x] Der Eintrag im Katalog ändert sich nicht: Listing entfällt.
- [x] Fill the retrospective.
- [ ] Commit this plan on `main` and push it.

### Completed

## Retrospective

### Phases reached

Commit; Merge in `main` (Pull Request 14) nach grüner CI, Veröffentlichung im Voraus vom Ersteller beauftragt.

### Creator turns after the plan

2: Auftrag der Änderung; Bitte, den Plan nachzuziehen und PR, CI und Merge zu machen. Der Plan wurde erst nach der Änderung geschrieben.

### Where I had to guess

- „Fehler-Finden“ als Modus `mark` gedeutet (die Modi `source` und `choose` haben keinen Umschalter).
- Branch der Umgebung statt `increment/11-original-seite` genutzt.
- Tooling-Update ausgelassen, da reine Darstellungsänderung.
