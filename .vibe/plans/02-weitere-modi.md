---
# Read by the hooks, the review, the evals. Schema: @lernapps/tooling/guidance/plan-front-matter.v1.schema.json
# Archetype as in the app's first plan; set it when you start. Never changes.
archetype: interactive
# Current phase. Allowed values: explore, plan, code, commit. Change the value line below, never this comment.
phase: commit
# prePushFailures: failed pre-push runs of this increment, written by the hook. Never change it.
prePushFailures: 0
---

# Increment: Zwei weitere Modi: Original erkennen und Quellentreue

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

Skizze der Modi: `.vibe/mockups/modi-2-3.png`.

## Goal

Lernende können zu jedem Text zwei weitere Aufgaben üben: erkennen, welcher von zwei Texten der echte ist (ohne Quelle, nur durch genaues Lesen und Vergleichen), und Fehler in einem Text finden, indem sie ihn mit der Quelle als PDF vergleichen, die in einem neuen Tab aufgeht. Beides für alle Klassenstufen, die es schon gibt.

## Key decisions

- Modi laufen als eigene Routen je Klassenstufe: `klasse-5-6` (Modus 1, Fehler markieren), `klasse-5-6-original` (Modus 2), `klasse-5-6-quelle` (Modus 3). Gleiche Texte, gleiche Seeds, gleiche Daten; keine neuen Datenformate für die Texte. (guess)
- Modus 2 zeigt zwei Texte: das Original (der wörtliche Auszug aus der Quelle) und die Variante mit den Fehlern der Runde. Welcher Text Original und welcher Variante ist, steht nicht dran; der Seed bestimmt die Reihenfolge (Text A / Text B). Lernende entscheiden, welcher Text die Fehler hat (der andere ist das Original), und markieren dort die Fehler wie in Modus 1. (Ersteller: „Bei Modus zwei sollen die Fehler ebenfalls gefunden werden müssen“;  „zwei Texte, von denen wir nicht wissen, was Original und was Variante ist“)
- Modus 2 hat keine weitere Quelle; Lernende vergleichen die beiden Texte miteinander (Sätze entsprechen sich, wie bei Original und Variante). Nur zwei Texte; mehr Texte später. (Ersteller: „erst mal nur zwei Texte“.) Rückmeldung nur mit Erklärung, kein Punktestand (guess), alle Klassenstufen einschließlich 3–4 (guess).
- Modus 3 ist Modus 1 mit der PDF der Quelle anstelle des Originals: nur die Variante mit Fehlern und ein Link „Quelle als PDF öffnen“ (neuer Tab, `target=_blank`, `rel=noopener`). Auf breiten Bildschirmen mit Maus (Desktop) steht die PDF zusätzlich eingebettet neben der Variante (`<iframe>`, gleiche Herkunft; Titel für Screenreader; Knopf „In neuem Tab öffnen“ bleibt). Auf Handy und Tablet nur der Knopf, weil dort die Browser PDFs in eingebetteten Fenstern schlecht zeigen. Die PDF liegt auf derselben Seite (`public/quellen/…`, vom Build ins Hauptverzeichnis kopiert, getestet), keine fremde Anfrage. (Ersteller: „das PDF online anzeigen, zumindest auf dem Desktop“.) (Ersteller: „Modus 3 dann das PDF anstatt des Originals“; früher „PDFs draus machen und die URL einfach als Target=_blank link unterlegen“)
- PDFs entstehen mit dem Skript des Skills `app-textpack` aus der gespeicherten Quelle; Lizenz, Autorenlink und „unverändert“ stehen auf jeder PDF.
- Ein Modus je Plan-Inkrement fertig bedeutet nicht: Modus 4 „Auf Zeit“ bleibt später.

## Notes

**Quellen.** Dieselben wie im ersten Plan (`.vibe/plans/01-sorgfaeltig-lesen.md`, Notes): KMK-Bildungsstandards (Lesen: Textinformationen ermitteln, Texte und Quellen vergleichen und bewerten), IQB-Lernaufgabe „Texte lernorientiert korrigieren“, Wineburg & McGrew (Quellen prüfen: Wer sagt das, woher weiß er das, was sagen andere), Cook et al. (Impfung gegen Falschinformation). Neu gelesen wird nichts; die Zuordnung der Modi zu Kompetenzen ist unsere eigene (abgeleitet).

**Neue Kompetenzen.**
- Klassen 5–13 (Modus 2): Ich kann zwei Texte zum selben Thema vergleichen und begründen, welcher stimmt.
- Klassen 3–13 (Modus 3): Ich kann einen Text mit seiner Quelle vergleichen und Stellen finden, die von der Quelle abweichen.
Beide kommen in die Liste auf der Startseite (`src/app.yaml`) und in den Eintrag im Katalog.

**Fach- und Lernhürden (abgeleitet).**
- Modus 2: Wer nur einen Text liest, vertraut ihm. Der Vergleich zwingt zum zweiten Blick. Hürde: Original und Variante sind in eigenen Worten geschrieben; man muss Aussagen vergleichen, nicht Wörter. Nur zwei Texte (Ersteller).
- Modus 3: Das PDF ist lang. Lernende sollen die passende Stelle suchen, nicht alles lesen; die PDF enthält nur den Artikel, nicht die Seitenleisten. Quellen sind ungleich lang (Igel 4 Seiten); bei langen Artikeln kürzen wir nicht (sonst wäre es nicht die Quelle).

**Umfang.** In: Modus 2 und 3 für die fünf vorhandenen Routen (3–4, 5–6, 7–8, 9–10, 11–13); je ein Text. Aus: weitere Texte, Modus „Auf Zeit“, drei Texte in Modus 2, Prüfung durch Dritte.

**Offene Punkte.** Barrierefreiheit der zwei Texte auf 360 px: Umschalter wie in Modus 1 (Text A | Text B). Ob „Original erkennen“ ohne Markieren genug fordert, zeigt der Test des Erstellers.

## Explore

<!-- All content questions belong here; Plan maps them onto the app. Ask; write no code. Max 2 questions per message.
Skip what earlier answers or the app tell. Answers → "Answers". -->

### Tasks

- [x] **Checkpoint:** research. Show in plain words: curriculum orientation, new competencies by chapter, didactic
      approach, scope, sources and how checked, what is unchecked. Stop and wait. Changes → change, ask again.
- [x] Set `phase: plan`: change the value line (`grep '^phase:'` prints `phase: plan`).

### Answers

<!-- Creator's answers, their words, one bullet each. -->
- „Original erkennen ist Modus zwei, Quellentreue Modus drei“ (Modus 1: Fehler markieren; Modus 4 „Auf Zeit“ später).
- „Modus 2 zuerst, ja.“ (Zwei Texte, einer ist der echte; der andere hat Fehler.)
- „Wir brauchen in Modus 2 erst mal nur zwei Texte, von dem wir nicht wissen, was Original und was Variante ist. Modus 3 dann das PDF anstatt des Originals.“
- Früher: „Man kann beide Texte darstellen und sagen, welches der echte ist“; „Quellentreue: nur die Quelle (als iframe) und den teils falschen Text“; „zum Build-Zeitpunkt PDFs draus machen und die URL einfach als Target=_blank link unterlegen“.

### Completed

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

- Muster „Abweichungen in einer Variante gegen ein bekanntes Original markieren“ (Guide) bleibt Modus 1; unverändert.
- Modus 3 (Quellentreue) = dasselbe Muster, aber die Quelle als PDF (neuer Tab) statt des Originals auf dem Bildschirm. Gleiche Daten, gleiche Auswertung, gleiche Farben. Keine neue Komponente: `App.vue` zeigt statt des Original-Felds den PDF-Knopf und auf dem Desktop das eingebettete Fenster; Pfad der PDF aus `source.pdf` des Pakets. Grenze: Der Test im Browser ohne PDF-Anzeige (kopflos) zeigt das Fenster leer; geprüft wird dort nur, dass es da ist und der Knopf geht.
- Modus 2 (Original erkennen) ist ein neues Muster: „Zwei Texte vergleichen und das Original wählen“. Fest: Auszug und Variante des Pakets, Stufe. Wechselnd: welche Stellen verfälscht sind (Seed), welcher Text links steht. Erfolg: richtige Wahl und gefundene Fehler; Auswertung wie in Modus 1 (Gefunden/Übersehen je Fehlerart mit Original, Variante, Erklärung) plus ein Satz zur Wahl. Wer den falschen Text als Variante wählt, findet keinen Fehler; seine Markierungen zählen als falsch markiert, und das Ergebnis nennt das Original. Neue Komponente `ChooseView.vue` (zwei Textkarten, Umschalter auf dem Handy, Wahl „Dieser Text hat die Fehler“, Wörter des gewählten Texts markierbar wie in `WordList.vue`); Muster kommt in den Guide in derselben Scheibe.
- Figuren: keine. Farben: wie im Guide (Unterschiede im Ergebnis orange mit gestrichelter Linie, Original grün); Farbe ist nie das einzige Zeichen.
- Grenze: Modus 2 hat nur zwei Texte; benennen müssen Lernende die Fehler nicht, nur markieren (wie in Modus 1).

### Completed

## Code

<!--
- Load skill lernapps-app, the archetype's skill and the content guide before content.
- Commit after each slice; the hooks check. Pre-commit fails → read node_modules/.cache/lernapps/pre-commit.log.
- Fix from the message; never bypass a hook. Undecidable → choose, mark "(guess)", go on.
- Creator asks for a change → first say your reading in one sentence; never narrow it silently.
-->

### Tasks

- [x] `git switch -c increment/02-weitere-modi` from `main`. Commit this plan on it.
- [x] `npx --yes github:lernapps/tooling#exp/compact-guidance update`, then `npm install`. It replaces the `lernapps-*` skills: reread
      the ones you use. Commit the update alone; fix its check findings before content.
- [x] Scheibe 1, Kompetenz „Text mit seiner Quelle vergleichen“ (Modus 3): (a) PDFs für die fünf Pakete mit `scripts/source-pdf.mjs` aus den gespeicherten Quellseiten nach `public/quellen/de/<id>.pdf`, `source.pdf` in den Paketen, Schema und Prüfung: Pfad muss existieren; (b) Routen `klasse-…-quelle` in `src/app.yaml` und Stufen in `levels.json` (Route → Stufe + Modus, ohne Daten zu verdoppeln); (c) Kern: `State.mode`, `start` liest Route und Modus; (d) `App.vue`: PDF-Knopf statt Original; ab 960 px Breite mit feinem Zeiger zusätzlich die PDF eingebettet (`<iframe>`, `title`, Höhe wie die Variante, eigener Bildlauf, Tastaturfalle prüfen: Tab verlässt das Feld); (e) Texte in `de.json`; (f) Playthrough `quelle.yaml`; (g) Tests; (h) Guide: Kompetenz und Modus; (i) Eintrag: Themen; `npx lernapps check`; Commit.
- [x] Scheibe 2, Kompetenz „Zwei Texte vergleichen und das Original erkennen“ (Modus 2): (a) Kern: Zustand `choice` (welcher Text hat die Fehler), Aktionen `choose-a`/`choose-b`, Markierungen auf den Wörtern des gewählten Texts, Auswertung (Wahl richtig, gefundene und übersehene Fehler, Markierungen im Original als falsch), Seed bestimmt die Reihenfolge; (b) `ChooseView.vue` und Auswertung; Tastatur: Tasten 1 und 2 wählen den Text, sonst wie in Modus 1; (c) Routen `klasse-…-original`; (d) Texte in `de.json`; (e) Playthrough `original.yaml`; (f) Tests; (g) Guide: neues Muster mit Beispiel; (h) Eintrag: Themen; `npx lernapps check`; Commit.
- [x] Scheibe 3, Dokumentation: arc42 (Bausteine, Laufzeit, Verteilung für Modi und `public/quellen`), Startseite (Beschreibung, Kompetenzen, Begründung: Modi), Skill `app-textpack` (PDF-Schritt jetzt Pflicht, Pfad), `.vibe/texts-log.md`; `npx arc42 validate --strict`; `npx lernapps check`; Commit.
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
