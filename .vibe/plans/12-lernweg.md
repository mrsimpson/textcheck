---
# Read by the git hooks, the review and the evals.
# Schema: @lernapps/tooling/guidance/plan-front-matter.v1.schema.json. Keep all four keys.
# archetype: the kind of app, as in the app's first plan: set it when you start this plan. It never changes.
archetype: interactive
# phase: the phase you work in now: explore, plan, code or commit. Change it when you enter the next phase.
phase: code
# prePushFailures: failed runs of the pre-push hook during this increment. The hook counts them. Never change it.
prePushFailures: 0
# failedChecks: the rules that failed in a run of lernapps check (hooks included), with the number of runs. The check
# writes it. Never change it.
failedChecks: { checks-pass: 1 }
---

# Increment: Zwei Übungsarten mit drei Stufen

*Gestartet am 24.10.2026. Workflow: Explore, Plan, Code, Commit.*

## Goal

Lernende wählen zuerst, was sie üben wollen: „Fehler im Text finden“ (ein Text, keine Vorlage) oder „Mit der Quelle
vergleichen“ (Wiedergabe und Quelle). Danach wählen sie eine von drei Stufen. Jede Stufe sagt, was in ihr steckt: wie
lang die Texte sind, welche Fehlerarten vorkommen (neue sind markiert) und welche Hilfen es gibt. Jede Übungsart übt eine
andere Art des gründlichen Lesens und sagt das auch. Die Auswahl nach Klassen und der Modus „Original erkennen“ fallen weg.

## Key decisions

- Zwei Übungsarten statt drei Modi. Auslöser ist die Rückmeldung zum Lesen: Fehler, die man ohne Vorlage sieht
  (Rechtschreibung, Grammatik, Widerspruch im Text), und Fehler, die beim Übertragen aus einer Quelle entstehen,
  verlangen verschiedenes Lesen. (Ersteller)
- „Original erkennen“ entfällt ganz, es hat „kaum Wert“. Der Abgleich mit einem wörtlichen Original („B“) entfällt auch;
  seine Fehlerarten (Zahl, Name, Datum, Ort, Menge, Verneinung) gehören zu „Mit der Quelle vergleichen“. (Ersteller)
- Drei Stufen je Übungsart, nach Textlänge und Art der Fehler, ohne Klasse. Frühe Stufen: Form (Rechtschreibung,
  Zeichensetzung). Späte Stufen: Inhalt. (Ersteller)
- Zweistufige Auswahl, kein Zickzack: erst die Übungsart, dann die Stufe; die Stufenkarte erklärt, was die Stufe von
  den anderen unterscheidet. Kein „Hier weitermachen“. (Ersteller)
- Alles, was eine Stufe zeigt, wird aus Regeln als Daten berechnet, nichts steht als Text fest in der Seite: neue
  Fehlerarten („neu“), Zahl der Fehler, Textlänge (gemessen), Hilfen. (Ersteller)
- „Mit der Quelle vergleichen“: Quelle und fehlerhafte Wiedergabe liegen nie nebeneinander. Unter der Quelle steht ein
  einziger Knopf „Weiter zur Wiedergabe“; „Prüfen“ und „Markierungen löschen“ stehen nur unter der Wiedergabe. Das
  eingebettete PDF fällt weg. (Ersteller)
- Stufe 3 der Quelle ist der Link auf die feste Fassung des Wikipedia-Artikels (`oldid`); das PDF bleibt als Reserve
  für den Fall, dass der Artikel verschwindet. (Ersteller)
- Nach der Runde ein Vorschlag, kein Zwang: nächste Stufe, noch eine Runde mit Tipp zur übersehenen Fehlerart, oder bei
  der Quelle der Hinweis, dass andere Wörter noch kein Fehler sind. (Ersteller, im Mock bestätigt)
- Ein einzelner Lesetipp steht als Satz, nicht als Liste mit einem Punkt. (Ersteller)
- Nur Didaktik und Bedienung. Die Texte (zu lang, zu schwer, vor allem ab Klasse 7) bleiben, wie sie sind; sie werden in
  einem eigenen Schritt gekürzt und vereinfacht. (Ersteller: „erst einmal auf die Didaktik und die Benutzerführung
  konzentrieren“)
- Keine Abwärtskompatibilität, radikal aufräumen, Änderungen an der Architektur sind gewollt. (Ersteller) Daraus folgt:
  alte Routen (`klasse-…`), `levels.json`, Modus `choose`, PDF-Einbettung, Klassen in Paketen und Fehlerarten,
  Nachrichten und Tests der alten Oberfläche fallen ersatzlos weg; die Pakete liegen künftig ohne Klassenverzeichnis
  unter `src/data/packs/<Sprache>/`, das Feld `grades` entfällt aus Schema und Paketen; veraltete Skizzen in
  `.vibe/mockups/` werden gelöscht (die Pläne bleiben als Protokoll). Was die Schriftwahl auf dem Gerät speichert, bleibt.
- Routen: `text-1`, `text-2`, `text-3`, `quelle-1`, `quelle-2`, `quelle-3`; die Auswahlseiten `text` und `quelle`.
  Eine unbekannte Adresse zeigt die erste Auswahl.
- Das PDF bleibt in `public/quellen/` und wird in Stufe 3 der Quelle als zweiter, kleiner Link angeboten („Artikel
  nicht erreichbar oder anders? Quelle als PDF“). (guess)
- „Geschafft“ je Stufe (alle Fehler gefunden, höchstens ein Wort zu viel) wird auf dem Gerät gemerkt, mit
  `createStorage`; der Eintrag wechselt dafür von `storage: none` zu `storage: device`. Ohne Speicher läuft alles weiter. (guess)
- Welche Stufe ein Text bekommt, wird aus seiner gemessenen Länge (Sätze, Wörter je Satz) und aus den Fehlerstellen
  berechnet, die er für die Fehlerarten der Stufe hat. Ein Text, dem Stellen fehlen, wird für diese Stufe nicht gewählt.
  Die Texte liegen ohne Klassenverzeichnis unter `packs/<Sprache>/`.
- „Widerspruch im Text“ gehört zu „Fehler im Text finden“, Stufe 3: man sieht ihn ohne Vorlage, er braucht aber das
  Verständnis des ganzen Textes. Stellen, die als Widerspruch eingestuft sind, aber nur mit der Quelle erkennbar sind
  (etwa ein falsches Datum), wandern zu den Quellen-Fehlerarten. (guess)

## Notes

- Mock zum Ausprobieren: `.vibe/mockups/lernweg-mock.html` (eine Datei, Beispieltexte aus den Paketen). Der Ersteller hat
  ihn ausprobiert und „wirklich gut“ gefunden. Der Mock berechnet Karten und Runden aus Regeln wie unten beschrieben.
- Stufen der Übungsarten (aus dem Mock; die Zahlen sind Einstellungen von Ersteller und Assistent, keine Funde einer Quelle):
  - Fehler im Text finden: 1 Rechtschreibung, Flüchtigkeitsfehler; 2 dazu Zeichensetzung, Fehler mit echtem Wort;
    3 dazu Widerspruch im Text. Fehler je Runde 3, 4, 5.
  - Mit der Quelle vergleichen: 1 Zahl, Name, Datum, Ort; 2 dazu sachlich falsche Angabe, hinzugefügte Aussage,
    Verbindung oder Verneinung, Menge oder Grad; 3 dazu Verallgemeinerung, falsche Folgerung, Meinung als Tatsache,
    falsche Autorität, Wertung. Fehler je Runde 3, 4, 5.
  - Fehlerarten genannt: Stufe 1 und 2 ja, Stufe 3 nein. Lesetipp: Stufe 1 ausführlich, 2 kurz, 3 nur auf Wunsch.
    Quelle: Stufe 1 und 2 als Blatt mit dem Ausschnitt, Stufe 3 als Link auf den ganzen Artikel.
- Die Wiedergabe sagt manches mit eigenen Worten; der Hinweis darauf gehört nur zu „Mit der Quelle vergleichen“.
- Erklärungen der Fehler sagen heute „Im Original steht …“. In „Mit der Quelle vergleichen“ heißt es „In der Quelle“.
  Die Wörter ändern sich überall: Original → Quelle, Variante → Wiedergabe (Quelle) oder Text (Textübung).
- Offen und bewusst später: Texte kürzen und vereinfachen; Pakete mit zu wenigen Fehlerstellen für eine Stufe ergänzen.
  Die Zählung der Fehlerstellen je Paket zeigt, dass Stellen der Art „Wiedergabe prüfen“ (Verallgemeinerung, Folgerung,
  Meinung, Wertung) in den Texten für Klasse 3 bis 6 fast fehlen; Stufe 3 der Quelle nimmt deshalb die langen Texte.
- Das Katalogeintrag-Entwurf `.vibe/listing-entry.yaml` nennt Modi und Klassen im Text; er ändert sich.

## Explore

### Tasks

- [x] Set `archetype` as in the app's first plan in `.vibe/plans/`.
- [x] The skills are in the app's repo, in `.agents/skills/`. Only if they are missing, install them:
      `npx skills add lernapps/tooling`.
- [x] Load the content guide `.agents/skills/app-content/SKILL.md` and the skill `lernapps-content-growth`, and read
      the plans in `.vibe/plans/`: what the app teaches, how its content is made, and what earlier increments left
      open.
- [x] Ask what this increment adds or changes: Ersteller bringt die Rückmeldung zum Lesen und zur Schwierigkeit.
- [x] Research the new content: kein neuer Inhalt; die Texte und Quellen bleiben. Die Einteilung der Fehlerarten nach
      Art des Lesens stammt aus der Rückmeldung; die Fehlerklassen und ihre Quellen stehen in `src/data/error-classes.json`.
- [x] **Checkpoint:** research. Nichts Neues zu belegen; der Ersteller hat die Einteilung selbst gegeben und am Mock bestätigt.
- [x] Set `phase: plan`.

### Answers

- Die Modi decken eigentlich komplett unterschiedliche Arten des gründlichen Lesens ab. Bei Fehler finden sind es genau
  genommen zwei: Fehler, die auch ohne den Vergleich sichtbar werden, wie Rechtschreib- oder Grammatikfehler; inhaltliche
  Fehler, die nur erkennbar werden, wenn man weiß, was der richtige Text ist; und Fehler, die beim Übertragen einer
  Primärquelle in eine Sekundärquelle entstehen. Das geht aus der aktuellen Benutzerführung überhaupt nicht hervor.
- Widerspruch im Text ist ein Widerspruch zu anderen Stellen im selben Text: Das wäre A, aber auch schwierig. Ohnehin sind
  die Texte ziemlich schwer, war ein weiteres Feedback.
- Erst einmal auf die Didaktik und die Benutzerführung konzentrieren. „Original erkennen“ hilft keiner Art des Lesens.
- „Original erkennen“ ganz weglassen, es hat kaum einen Wert.
- Die PDF-Dateien sind sehr lang. Lieber ein Link auf Wikipedia; falls sich der Artikel ändert, das PDF noch in der Hinterhand.
- B komplett weglassen. Die Schwierigkeit anhand der Textlänge und der Art der Fehler vorgeben, gar nicht direkt einer Klasse zuordnen.
- Neues didaktisches Konzept und UX: In frühen Klassen stehen Rechtschreibung und Grammatik im Vordergrund, später
  inhaltliche Fehler; mit der Stufe nimmt die Komplexität der Texte zu. Die Übungen danach auswählen.
- Kein Zickzack zwischen den Modi. Zwei Modi mit Schwierigkeitsstufen, als zweistufige Auswahl; bei der Stufe erklären,
  was sie von der anderen unterscheidet oder was darin enthalten ist.
- „Hier weitermachen“ weg. Neue Fehlerarten und Einstufungen aus Code erzeugen, nicht fest als Text in die Seite schreiben.
- Quelle und fehlerhafte Variante auch auf großen Bildschirmen nie nebeneinander. Prüfen-Knöpfe nur unter der fehlerhaften
  Variante; unter der Quelle ein einziger Knopf, der zur Variante umschaltet.
- Ein Lesetipp mit nur einem Punkt braucht keine Aufzählung.

### Completed

## Plan

### Tasks

- [x] Write the tasks of Code under "Code": one slice per competency, as the skill `lernapps-content-growth` says, in
      the order the guide's procedure names. Each slice ends in a commit. Hier keine neue Kompetenz, sondern ein Umbau in
      Scheiben (siehe Code).
- [x] Write the content method under "Content method": which patterns, figures and components of the guide each
      slice uses, and anything new, with the reason the guide's patterns do not fit.
- [x] Show the creator the goal, the new competencies by chapter and the slices, short. Explain in plain words what
      learners will see and do, and anything new in how the content is made.
- [x] For every new component and interactive exercise, show a sketch: a static SVG or image of what learners see,
      or the steps (what they do, what they see after each). A description in words alone is not enough. Der Mock
      `.vibe/mockups/lernweg-mock.html` ist der Entwurf, den der Ersteller schon ausprobiert hat.
- [x] **Checkpoint:** confirm the plan and the content method. Der Ersteller hat auf die Vorstellung des Plans mit der
      Ergänzung „keine Abwärtskompatibilität, radikal aufräumen“ geantwortet und die Umsetzung damit beauftragt.
- [x] Set `phase: code`.

### Content method

- Muster „Abweichungen in einer Variante gegen ein bekanntes Original markieren“ wird zu zwei Mustern, je eine
  Übungsart:
  - **Fehler im Text finden:** ein Text, keine Vorlage; Fehlerarten, die man am Text selbst sieht. Leitfrage „Ist das
    richtig geschrieben?“, ab Stufe 3 auch „Passt das zu dem, was vorher stand?“.
  - **Mit der Quelle vergleichen:** Wiedergabe und Quelle; Fehlerarten, die beim Übertragen entstehen. Leitfrage „Sagt die
    Quelle das wirklich so?“. Stufe 1 und 2 mit dem Ausschnitt als Blatt, Stufe 3 mit dem Artikel als Link.
- Beide spielen dieselbe Runde (Wörter markieren, prüfen, Erklärung je Fehler) mit denselben Textpaketen; sie
  unterscheiden sich in den erlaubten Fehlerarten, im Material und in den Hilfen.
- Neu: die Regeln der Stufen als Daten (`src/data/stages.json`), aus denen Karten, Zielzeile, Hinweise und die Auswahl der
  Fehler entstehen; die Stufe eines Textes aus Messung und Fehlerstellen; Vorschlag nach der Runde; „geschafft“ auf dem
  Gerät. Eine Figur und eine neue Komponente gibt es nicht; die Oberfläche bleibt Vue mit denselben Wortlisten.
- Fällt weg: Modus `choose` mit `ChooseView.vue`, das eingebettete PDF, `levels.json` nach Klassen, die Klassenauswahl.
- Alles geht in dieselbe Scheibe in den Leitfaden, die es ändert (`app-content-guide`, `app-content-matches`).

### Completed

## Code

### Tasks

- [x] Switch to a new branch from `main`: `git switch -c increment/12-lernweg`. Commit this plan and the mock on it.
- [ ] Update the app to the newest tooling and runtime: `npx --yes github:lernapps/tooling#main update`, then
      `npm install`. It also replaces the `lernapps-*` skills: read the ones you use again. Commit the update on its
      own, and fix what its checks report before you add content.
- [ ] **Scheibe 1, Regeln und Kern.** `src/data/stages.json` (je Übungsart drei Stufen: neue Fehlerarten, Fehler je
      Runde, Fehlerarten nennen, Lesetipp, Quelle als Blatt oder Link) ersetzt `levels.json`; die Stufen sind kumulativ,
      „neu“ ist die Differenz zur vorigen Stufe. Routen `text-1…3`, `quelle-1…3`, Auswahlseiten `text` und `quelle`.
      Der Kern bekommt die Phasen `stages`, `tip`, `marking`, `result` und die Eingabe `view` (Quelle oder Wiedergabe);
      der Modus `choose` entfällt mit Zustand und Eingaben. Die Textwahl: `src/core/data.ts` misst die Länge jedes Textes
      und wählt Texte, die für Stufe und Übungsart genug Fehlerstellen haben (Fehlerarten der Stufe, mindestens Fehler
      je Runde plus drei Reserve). Playthroughs und Kerntests anpassen: `marking`, `quelle`, `hinweise`, `tolerance`
      bleiben sinngemäß, `original*` entfallen, neu ein Durchgang `lernweg` (Auswahl, Stufe, Tipp, Wiedergabe, Prüfen,
      Vorschlag). Arc42-Blöcke `core` und `data` mit nachziehen. Kern-Tests, `npx lernapps check`, Commit.
- [ ] **Scheibe 2, Auswahl und Stufenkarten.** Neue Ansichten in `src/ui/`: Wahl der Übungsart (zwei Karten) und
      Stufenkarten (Text: Sätze, Wörter je Satz, längster Satz, aus den Texten gemessen; Fehler je Runde; Fehlerarten mit
      „neu“; Hilfen aus den Regeln erzeugt), Lesetipp-Seite („So liest du hier“, ein Tipp als Satz). Auswahl nach Klassen
      und Modus raus. `src/app.yaml`: Routen, Anleitung, Kompetenzen, Seite „Wie diese Übung begründet ist“ (Arten statt
      „ab Klasse“, was Stufe und Fehlerart verbindet). Texte in `src/messages/de.json` und `en.json`, gleiche Schlüssel.
      Arc42-Block `ui`. Prüfen, Commit.
- [ ] **Scheibe 3, Die Runde.** „Fehler im Text finden“: ein Blatt mit Leitfrage und Fehlerzahl. „Mit der Quelle
      vergleichen“: Stufe 1 und 2 erst die Quelle mit einem Knopf „Weiter zur Wiedergabe“, dann die Wiedergabe mit
      „Quelle ansehen“, „Markierungen löschen“, „Prüfen“; Stufe 3 der Link auf den festen Stand des Artikels mit Abschnitten
      und Stand-Datum, dazu der kleine Link zum PDF. Eingebettetes PDF und `ChooseView.vue` entfernen. Hinweise
      (Knopf „Hinweis“) bleiben und folgen der Regel „Fehlerarten nennen“. Auswertung mit Vorschlag (weiter, noch eine
      Runde mit Tipp zur übersehenen Fehlerart, bei der Quelle der Hinweis zu zu viel Markiertem), „geschafft“ je Stufe
      über `createStorage`. Wörter: Original → Quelle, Variante → Wiedergabe oder Text, auch in den Erklärungen der
      Pakete (per Skript, Ergebnis gelesen). Bedienung per Tastatur und Ansagen für Screenreader wie bisher; 360 px prüfen.
      End-to-End-Tests neu (`sheets`, `switching`, `english`, `hints`, `reading`, `effects` anpassen, `interactive`
      belassen). Prüfen, Commit.
- [ ] **Scheibe 4, Fehlerarten und Texte.** `error-classes.json`: Familie und `fromGrade` ersetzen durch die Zuordnung zu
      Übungsart; Fehlerstellen, die „Widerspruch im Text“ heißen, aber die Quelle brauchen, zu den Quellen-Fehlerarten
      umhängen. Paketprüfung (`pack-check`, Tests): je Sprache, Übungsart und Stufe mindestens zwei Texte mit genug
      Stellen; der Bericht nennt, wo Texte fehlen. Was fehlt, wird im Plan unter „Notes“ als offen vermerkt, nicht
      erfunden. Textlogbuch `.vibe/texts-log.md` ergänzen. Prüfen, Commit.
- [ ] **Scheibe 5, Leitfaden, Doku, Eintrag.** `app-content` neu schreiben, wo Klassen und Modi standen (Lehrplan-
      Orientierung bleibt als Begründung der Fehlerarten; Stufen statt Klassen; zwei Muster; Begriffe Text, Quelle,
      Wiedergabe; Regeln aus Fehlern, auch der Lesetipp als Satz). `lernapps-interactive`-konforme arc42-Doku gegenprüfen.
      `.vibe/listing-entry.yaml`: Zusammenfassung ohne Klassen und Modi, `storage: device`, Themen neu. Prüfen, Commit.
- [ ] The content guide describes the app as it is now: its competencies, chapters and patterns, and its procedure
      for the next increment (`app-content-matches`).
- [ ] `npx lernapps check` passes.
- [ ] Set `phase: commit`.

### Completed

## Commit

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
      skill `lernapps-listing` and write the changed entry. Otherwise skip the next task. Hier ändert sich die
      Zusammenfassung und der Speicher: ausführen.
- [ ] **Checkpoint:** list. Ask the creator before you open the pull request to the catalog, and wait for their yes.
- [ ] Fill the retrospective.
- [ ] Commit this plan on `main` and push it. A push that changes only `.vibe/` publishes nothing again.
- [ ] If you opened a pull request to the catalog, see it through to "bestanden" as the skill says.
- [ ] If this plan changed since its last push, commit it on `main` and push it again.

### Completed

## Retrospective

### Phases reached

### Creator turns after the plan

### Where I had to guess
