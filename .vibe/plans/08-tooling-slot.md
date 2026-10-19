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
failedChecks: { checks-pass: 2 }
---

# Increment: Neues Tooling, Titelzeile über den Slot

<!--
This file guides you, the assistant, through one increment of an app that is already published: new competencies,
chapters, pages, rounds or questions, or a correction. It shows the creator where you are.
- Keep it at .vibe/plans/<NN>-<short name>.md, NN one more than the highest number there (02 after 01). The plan with
  the highest number is the current one; the others record earlier increments: never change them. In an app made
  before plans per piece of work, `.vibe/plan.md` is plan 01: start this one as 02; the update in Code moves it.
- Read each skill and page this plan names in full, from its file: a skill from the app's `.agents/skills/`, a page
  downloaded unchanged. Never work from the summary of a fetch tool: it loses tasks and rules.
- The decisions of the first version stand: the archetype, the content method and the content guide
  `.agents/skills/app-content/SKILL.md`. Follow the guide; change it only where this increment needs a new pattern,
  figure type or source rule, and say so at the checkpoints.
- Work through one phase at a time: Explore, Plan, Code, Commit. Do the tasks of the current phase in order.
- Tick a task when it is done and move it to "Completed" of its phase. Add tasks as you find them.
- A task marked as a checkpoint means: stop, show the creator what they need to decide, and wait for their answer.
- A push to `main` publishes the app. Work on the branch `increment/<NN>-<short name>` until the creator says yes to
  publishing; if your environment asks you to push, push that branch only. While a check fails, tell the creator
  instead of pushing.
- Write the plan in the language you talk to the creator in. Keep the headings and the front matter keys as they
  are: the review reads them.
- Delete these comments only where you have filled the part they explain.
-->

*Gestartet am 19.10.2026. Explore, Plan, Code, Commit.*

## Goal

Die App läuft auf dem neuen Tooling und den neuen Templates. Die Titelzeile mit dem Knopf „Schrift“ kommt über den Slot des Tooling, ohne eigene Überschrift und ohne CSS-Umgehung; der Name der App steht nicht mehr doppelt.

## Key decisions

- Auslöser: Das Issue lernapps/tooling#111 (Slot in der Titelzeile, keine doppelte App-Name-Zeile) ist umgesetzt; das Tooling steht auf `main` (fece9ea), die Templates auf 5df0763. Aktualisiert wird mit `npx --yes github:lernapps/tooling#main update` (`exp/compact-guidance` kennt die neue Version nicht). (Ersteller: „Es gibt eine neue Version des toolings und der templates“)
- Das Update allein macht den Check rot: Das Tooling zeichnet die Überschrift jetzt in einer eigenen Zeile (`.interactive-title`), unsere CSS-Regel `.interactive > h1 { display: none }` greift nicht mehr, und die Seite hat zwei `<h1>`. Deshalb gehören Update und Umstellung in einen Commit (guess).
- Der Knopf „Schrift“ wird eine eigene Komponente `Controls.vue`, die das Tooling über `startInteractive(core, App, { title: Controls })` in den Slot neben dem `<h1>` setzt. Sie bekommt dieselben Props wie die Wurzelkomponente. Die Einstellungen (`reading`) liegen dafür gemeinsam in `src/ui/reading.ts` (eine Quelle für Knopf und Texte), nicht mehr im Zustand der Wurzelkomponente (guess).
- Die eigene Titelzeile, der Text `appTitle` und die CSS-Regel zum Ausblenden des Tooling-`<h1>` entfallen.
- Die Farben der App liegen nicht mehr nur am Wurzelelement der Komponente, sondern am `main`-Element, weil der Slot außerhalb davon liegt (guess).
- Die Rahmenbreite für „PDF neben der Variante“ (80 rem) kommt über `--interactive-max-width` statt über das Überschreiben der Selektoren des Tooling (guess: gesetzt solange das PDF neben der Variante steht).
- Die Kopfzeile des Tooling hat jetzt nur noch den Sprachenwähler; es gibt keinen Link mit dem App-Namen mehr. Dafür ist nichts zu tun.

## Notes

Reine Darstellung, kein neuer Inhalt. Betroffen: `package.json`, `package-lock.json`, `.github/workflows/`, `.agents/`, `.claude/`, `skills-lock.json`, `docs/arc42/` (Referenz der Templates), `src/main.ts` (Option `title`), `src/ui/App.vue`, neu `src/ui/Controls.vue`, `src/ui/ReadingSettings.vue`, `src/ui/reading.ts`, die Meldungsdateien, `e2e/reading.e2e.ts`, arc42-Texte der App und der Abschnitt zur Anzeige im Skill `app-content`.

Offen aus Plan 07: Die Aufgaben der Phase Commit sind dort nicht abgehakt (Retrospektive, Plan auf `main`), obwohl der Pull Request #9 gemergt ist.

## Explore

<!--
Find out what this increment adds, and research it. Ask the creator; write no code. Ask one or two questions per
turn, in plain words. Do not ask what you can derive from earlier answers or from the app. Write each answer under
"Answers".
-->

### Tasks

- [x] Set `archetype` as in the app's first plan in `.vibe/plans/`.
- [x] The skills are in the app's repo, in `.agents/skills/`. Only if they are missing, install them:
      `npx skills add lernapps/tooling`.
- [x] Load the content guide `.agents/skills/app-content/SKILL.md` and the skill `lernapps-content-growth`, and read
      the plans in `.vibe/plans/`: what the app teaches, how its content is made, and what earlier increments left
      open.
- [x] Ask what this increment adds or changes: which competencies, chapters or rounds, for which school years.
- [x] Research the new content: follow the guide's curriculum and sources, and the skill `lernapps-content-research`
      for what the guide does not cover yet. Write the curriculum orientation (the Lehrplan, cited where you used
      one), the new competencies by chapter and the verified sources under "Notes".
- [x] **Checkpoint:** research. Explain to the creator, in plain words, what you found and how: the curriculum
      orientation, the new competencies by chapter, the sources and how you checked them, and what you could not check.
      Stop and wait for the creator. Change it if they ask, then ask again.
- [x] Set `phase: plan`.

### Answers

- „Es gibt eine neue Version des toolings und der templates“ (nach Issue lernapps/tooling#111, das der Ersteller dort öffnen und in einer eigenen Sitzung umsetzen ließ).

### Completed

## Plan

<!--
Turn the answers into tasks the creator can confirm in one read. After the confirmation you work on your own: the
creator's turns from here to the end are counted in the retrospective (target: at most 3).
-->

### Tasks

- [x] Write the tasks of Code under "Code": one slice per competency, as the skill `lernapps-content-growth` says, in
      the order the guide's procedure names. Each slice ends in a commit.
- [x] Write the content method under "Content method": which patterns, figures and components of the guide each
      slice uses, and anything new, with the reason the guide's patterns do not fit.
- [x] Show the creator the goal, the new competencies by chapter and the slices, short. Explain in plain words what
      learners will see and do, and anything new in how the content is made.
- [x] For every new component and interactive exercise, show a sketch: a static SVG or image of what learners see,
      or the steps (what they do, what they see after each). A description in words alone is not enough.
- [x] **Checkpoint:** confirm the plan and the content method. Stop and wait for the creator. Change the plan if they
      ask, then ask again.
- [x] Set `phase: code`.

### Content method

- Kein Inhalt ändert sich; keine neuen Muster oder Figuren. Neu ist nur die Komponente `Controls.vue` (Knopf „Schrift“ und sein Dialog) im Slot der Titelzeile.
- Skizze (Titelzeile): `Textcheck` (Überschrift des Tooling, links) · `[ Schrift ]` (unser Knopf im Slot, rechts); darüber nur der Sprachenwähler; darunter Altersstufe und Modus wie bisher.

### Completed

## Code

<!--
Build the increment slice by slice. Load the skill lernapps-app, the skill of the archetype and the content guide
before you write content. Commit after each slice: the git hooks run the checks. The pre-commit hook is quiet: when
it fails, it prints one line naming the step and its log, `node_modules/.cache/lernapps/pre-commit.log`; read that
log for the messages. Fix every failed check from its message; never bypass a hook. When you cannot decide
something, choose, mark it "(guess)" under "Key decisions" and go on.
-->

### Tasks

- [x] Switch to a new branch from `main`: `git switch -c increment/08-tooling-slot`. Commit this plan on it.
- [x] Update the app to the newest tooling and runtime: `npx --yes github:lernapps/tooling#main update`, then
      `npm install`. It also replaces the `lernapps-*` skills: read the ones you use again. (Der Check meldet danach
      zwei `<h1>`; Update und Umstellung kommen deshalb in einen Commit, siehe Key decisions.)
- [x] Slice 1: `reading.ts` hält die Einstellungen gemeinsam; neu `Controls.vue` (Knopf „Schrift“ und Dialog) aus `ReadingSettings.vue`; `src/main.ts` übergibt `{ title: Controls }`; eigene Titelzeile, `appTitle` und die Ausblende-Regel entfallen; Farben am `main`; Rahmenbreite über `--interactive-max-width`. Tests (`e2e/reading.e2e.ts`: eine Überschrift, Knopf in ihrer Zeile), arc42 und Skill `app-content`. `lernapps check` grün, Commit zusammen mit dem Update.
- [x] The content guide describes the app as it is now: its competencies, chapters and patterns, and its procedure
      for the next increment (`app-content-matches`).
- [x] `npx lernapps check` passes.
- [x] Set `phase: commit`.

### Completed

## Commit

<!--
Publish the increment and update the app's entry, each only after the creator says yes. Then fill the retrospective.
A push to `main` publishes the app: the workflow `Pages` checks it and, in its job `deploy`, publishes the checked
bundle. A pull request to `main` runs the same checks without publishing.
-->

### Tasks

- [ ] Push the branch and open a pull request to `main` in the app's repo. The pre-push hook runs the heavy checks;
      fix what fails. See the checks of the pull request through to green. When a GitHub step fails or is refused,
      load the skill `lernapps-github`.
- [ ] **Checkpoint:** publish. Show the creator what the increment adds and the link to its preview from the comment
      "Vorschau der App" on the pull request, and ask whether it may go online. Wait for their yes.
- [ ] Merge the pull request into `main` (or, without a pull request, merge the branch into `main` and push `main`).
      Watch the run of the workflow `Pages` for that commit until it ends. If it fails, read the message of the
      failed step, fix what you can and push again.
- [ ] Open the address the job `deploy` printed ("published at ...", also in the run's summary) and confirm that it
      shows the new content. Take that address, never one you derive; follow its redirects.
- [ ] If the app is listed and the increment changes what its entry says (topics, school years, summary): load the
      skill `lernapps-listing` and write the changed entry. Otherwise skip the next task.
- [ ] **Checkpoint:** list. Ask the creator before you open the pull request to the catalog, and wait for their yes.
- [ ] Fill the retrospective.
- [ ] Commit this plan on `main` and push it. A push that changes only `.vibe/` publishes nothing again.
- [ ] If you opened a pull request to the catalog, see it through to "bestanden" as the skill says.
- [ ] If this plan changed since its last push, commit it on `main` and push it again.

### Completed

## Retrospective

<!--
Fill it at the end of Commit: facts, short, no names of people. The review reads it; the evals compare it across
runs and increments. It stays in the creator's repo.
-->

### Phases reached

<!-- The last phase you completed and the checkpoints the creator passed. Example: "commit; confirmed, published". -->

### Creator turns after the plan

<!-- How many messages the creator sent after confirming the plan, and what each was about. Target: at most 3. -->

### Where I had to guess

<!--
Each place where this plan, a skill, the content guide, a message or the creator's answers did not tell you what to
do, and what you chose. Write "None" if there was none.
-->
