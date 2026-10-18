---
# Read by the hooks, the review, the evals. Schema: @lernapps/tooling/guidance/plan-front-matter.v1.schema.json
# Archetype, null until chosen in Explore. Allowed values: explainer, interactive, quiz.
archetype: interactive
# Current phase. Allowed values: explore, plan, code, commit. Change the value line below, never this comment.
phase: code
# prePushFailures: written by the pre-push hook. Never change it.
prePushFailures: 0
---

# Plan: <app name>, first version

<!--
For you, the assistant.
- Path: .vibe/plans/01-<short name>.md. Later changes: increment template, own plan.
- Read this plan before each step. One phase at a time, tasks in order.
- Done → tick `[x]` at once, move it to "Completed" of its phase. Unticked boxes count as not done.
- New task found → add it.
- Read every skill and page named here in full, from its file (curl, cat). Never a summarising fetch tool.
- Checkpoint task: stop, ask, wait for the creator's answer.
- Work on the branch `work` until the first publish; push only `work`. Commit brings `work` into `main`.
- GitHub step fails → skill `lernapps-github`.
- Plan in the creator's language. Keep headings and front matter keys.
- Delete a comment once its part is filled.
-->

*Started <date>. Explore, Plan, Code, Commit.*

## Goal

Lernende lesen zwei Fassungen eines Textes mit bekannter Quelle (Original und Zusammenfassung mit eingebauten Fehlern), finden die Fehler und markieren sie, und üben so genaues, prüfendes Lesen von Klasse 3 bis zum Abitur.

## Key decisions

- Begriffe: Die zweite Textfassung heißt in den Daten `rendition` und im Plan "Fassung": eine genaue Wiedergabe des Originals mit Stellen, an denen Fehler eingebaut werden können. Eine echte, kürzere Zusammenfassung ist nicht Version 1; sie wäre später ein eigener Modus (Fehler durch Auslassen, Verallgemeinern; Beleg je Satz mit mehreren Quellstellen). Das Wort in der App (z. B. "Fassung" oder "Wiedergabe") ist mit dem Ersteller zu klären. (guess: "Fassung")
- Sprache: Code, Dateinamen, Schema-Schlüssel, Ids und `docs/arc42` auf Englisch. Texte für Lernende nur in Nachrichtendateien (`src/messages/<sprache>.json`, `translator`) und in den Textpaketen (je Paket eine `language`). Version 1 liefert nur Deutsch; `app.yaml` führt nur `de`. Jede weitere Sprache braucht vollständige Nachrichten und eigene Pakete. Die Rechtschreibklassen folgen der deutschen Orthografie und gelten für andere Sprachen erst nach eigener Prüfung (Feld `languages` in `error-classes.yaml`).
- Version 1 = ein echter Text zum Testen: eine App, ein Modus ("Original bekannt"), ein Textpaket (Klasse 5–6) mit allen Bausteinen (Seed, Stellen, Toleranz, Auswertung nach Klasse). Weitere Pakete, Modi und das Profil über Runden sind Erweiterungen nach dem Test, jede mit eigenem Plan aus der Vorlage für Erweiterungen.
- App: Titel "Textcheck" (guess, nach dem Namen des Repositorys), Repository https://github.com/mrsimpson/textcheck (Ersteller), Erstellername im Katalog: "Oliver" (Ersteller).
- Archetyp `interactive`: eine App-Seite, auf der Lernende markieren; Seeds sind in der Laufzeit schon vorgesehen (`app/?seed=<n>`), der Kern ist deterministisch. (Quiz zu eng, Erklärseiten passen nicht zu "Lernende handeln".)
- Ein Prinzip, mehrere Varianten: Text → Zusammenfassung → systematisch eingebaute Fehlerklassen → Verpackung als Variante.
- Version 1 = Stufe 1 (der echte Text ist bekannt: Fehler im zweiten Text finden). Stufe 2 (echter Text unklar, mehrere Fassungen) und Stufe 3 (auf Zeit) als Issue festhalten, später. (Ersteller: Stufen sinnvoll, Issue anlegen.)
- Texte entstehen als Daten, die Fehler werden vom Seed ausgewählt und eingesetzt: gleicher Seed → gleicher Text. Mehrere Fehlervarianten je Stelle halten das Ergebnis unvorhersagbar. (Ersteller: "deterministisch, aber mehrere Varianten, Seeds".)
- Klassen 3 bis 13 (Ersteller), gestaffelt in vier Stufen: 3–4, 5–6, 7–10, 11–13 (guess).
- Nur Deutsch (guess).
- Gefühl: ruhig wie ein Arbeitsblatt mit Textmarker, ohne Zeitdruck; Zeit erst in Stufe 3 (guess).
- Texte und Zusammenfassungen schreibe ich selbst, jeweils mit Quelle und Link zum Original; Fakten werden an der Quelle geprüft (Ersteller: "Hauptsache im Original nachlesbar").

## Notes

### GitHub-Stand

- Repository https://github.com/mrsimpson/textcheck war leer. Zweige eingerichtet und gepusht: `main` (leerer Startcommit), `gh-pages` (leerer Commit), `work`. Standardzweig ist `main` (geprüft per `gh api`).
- Offen: GitHub Pages aus `gh-pages`, Ordner `/`. Die Sitzung darf die Pages-Schnittstelle nicht aufrufen (HTTP 403 vom Proxy). Klick für Oliver (Skill lernapps-github): Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: gh-pages, Ordner / (root) → Save.

### Lehrplanorientierung

Kein Land genannt, deshalb die KMK-Bildungsstandards Deutsch als Orientierung (heruntergeladen und gelesen):

- Primarbereich, Beschluss vom 15.10.2004 i.d.F. vom 23.06.2022, Kultusministerkonferenz,
  https://www.kmk.org/fileadmin/Dateien/veroeffentlichungen_beschluesse/2022/2022_06_23-Bista-Primarbereich-Deutsch.pdf :
  Abschnitt 4.3 Lesen (S. 16–17; Lesefertigkeiten "genau" lesen; Leseverstehen; Lesestrategien "Texte organisierend lesen: wichtige Aussagen markieren");
  Abschnitt 4.2 Schreiben, "Orthografisch schreiben" (S. 14–15; Fehleraufmerksamkeit, Texte auf orthografische Richtigkeit überprüfen und korrigieren).
- Erster und Mittlerer Schulabschluss, i.d.F. vom 23.06.2022,
  https://www.kmk.org/fileadmin/Dateien/veroeffentlichungen_beschluesse/2022/2022_06_23-Bista-ESA-MSA-Deutsch.pdf :
  Abschnitt 4.3 Lesen (S. 29–31: Leseverstehen, Strategien "während und nach dem Lesen", Verstehen prüfen und Schwierigkeiten erkennen und beheben); 4.4 Sich mit Texten und anderen Medien auseinandersetzen (Texte nach Aussagekraft, Intention und Sachgehalt einschätzen).
- Allgemeine Hochschulreife, Beschluss vom 18.10.2012,
  https://www.kmk.org/fileadmin/Dateien/veroeffentlichungen_beschluesse/2012/2012_10_18-Bildungsstandards-Deutsch-Abi.pdf :
  Abschnitt 2.3 Lesen ("die Qualität von Textinformationen vor dem Hintergrund ihres fachlichen Wissens prüfen und beurteilen", "Geltungsansprüche von Texten reflektieren", "Verstehensbarrieren identifizieren").

### Kompetenzen nach Kapitel (Ich-kann-Sätze)

Kapitel 1, Klasse 3–4 (Primarbereich):
- Ich kann falsch geschriebene Wörter in einem kurzen Text finden und markieren.
- Ich kann Zahlen, Namen und Wörter finden, die vom Original abweichen.
- Ich kann ein Wort markieren, das im Satz keinen Sinn ergibt.

Kapitel 2, Klasse 5–6:
- Ich kann Stellen markieren, an denen die Zusammenfassung dem Original widerspricht.
- Ich kann Sätze finden, die sich im selben Text widersprechen.
- Ich kann eine falsche Zeit-, Orts- oder Mengenangabe mit dem Original abgleichen.

Kapitel 3, Klasse 7–10 (ESA/MSA):
- Ich kann eine Meinung von einer Tatsache unterscheiden und die Meinung markieren.
- Ich kann eine Folgerung erkennen, die der Text nicht trägt.
- Ich kann unbelegte Behauptungen und Verallgemeinerungen ("alle", "immer", "nie") markieren.

Kapitel 4, Klasse 11–13 (Abitur):
- Ich kann wertende, emotionalisierende oder einseitige Formulierungen in einer Zusammenfassung erkennen und benennen.
- Ich kann Ursache und Wirkung vertauscht oder fehlerhafte Schlüsse im Text erkennen.
- Ich kann die Qualität von Textinformationen mit meinem Fachwissen und der Quelle prüfen.

### Didaktik

- Ableiten statt nur zeigen: Nach der Prüfung zeigt die Rückmeldung zu jedem Fehler die Stelle im Original und benennt die Fehlerklasse in einfachen Worten ("Zahl verändert", "Meinung als Tatsache").
- Typische Fehlvorstellung: Lernende suchen nur Rechtschreibfehler und überlesen Sinnfehler. Die Rückmeldung zählt getrennt nach Fehlerklasse, welche du gefunden und welche du übersehen hast.
- Falsch markierte Stellen (Fehlalarm) zählen mit und werden erklärt; so lernt man, nicht alles zu markieren.

### Fehlerklassen (aus den Quellen, Neufassung)

Lesehilfe: **Quelle** = was ich gelesen habe und was dort steht. **Status**: "belegt" = die Quelle nennt genau diese Fehlerart oder Fähigkeit; "abgeleitet" = die Quelle nennt eine verwandte Fähigkeit oder ein Modell, die Fehlerklasse ist unser eigener Schluss. **Basis** = was man zum Erkennen braucht (T = nur am Text, V = Vergleich mit dem Original, W = Vorwissen). **Ab** = Einstellung der Autorin oder des Autors, nicht gemessen und nicht aus einer Quelle.

Familie A, Form (Rechtschreibung und Zeichen)

| Id | Klasse | Quelle | Status | Basis | Ab |
|---|---|---|---|---|---|
| rechtschreibung_regel | Regelfehler, Unterarten nach AFRA (z. B. Großschreibung, Vokalkürze mit Doppelkonsonant, Auslautverhärtung, z/tz) | IQB-Lernaufgabe (AFRA-Liste), IQB-Handreichung (Fehlerschwerpunkte); KMK Primar "Fehleraufmerksamkeit" | belegt | T | 3 |
| fluechtigkeit | Flüchtigkeitsfehler: Buchstabendreher, fehlender oder doppelter Buchstabe (Beispiele dort: "jetz", "nieman") | Schmellentin & Lindauer (Regel- und Flüchtigkeitsfehler trennen) | belegt; "Wort doppelt oder fehlt" als Unterart abgeleitet | T | 3 |
| echtes_wort | Fehler mit echtem Wort: das/dass, "das fahren" statt "das Fahren" (ein Rechtschreibprogramm findet sie nicht) | IQB-Handreichung (das/dass als Problemfeld der Sek. I), IQB-Lernaufgabe (Rechtschreibprogramm übersieht Substantivierungen) | belegt | T | 5 |
| zeichensetzung | Satzzeichen: Satzschluss früh, Komma später | KMK Primar (Punkt, Komma, Fragezeichen, Anführungszeichen), Schmellentin & Lindauer (Komma vor uneingeleiteten Teilsätzen früh nicht erwartet, ein Einzelfall) | Kompetenz belegt, Stufung abgeleitet | T | 3 (Satzschluss), 7 (Komma) |

Familie B, Abweichung der Zusammenfassung vom Original

| Id | Klasse | Quelle | Status | Basis | Ab |
|---|---|---|---|---|---|
| zahl_name_datum | Zahl, Name, Datum oder Ort verändert | IGLU 2021: "explizit angegebene Informationen lokalisieren" (u. a. Zeit und Ort); KMK: Textinformationen auf lokaler Ebene ermitteln | Prozess belegt, Fehlerklasse abgeleitet | V | 3 |
| sachlich_falsch | Aussage ersetzt, sodass sie dem Original widerspricht | IGLU 2021 "Prüfen und Bewerten" (Behauptungen bestätigen oder widerlegen, Vergleich mit anderen Quellen); Cook et al. 2018 (Verzerrung der Gegenposition) | abgeleitet | V (oder W) | 5 |
| hinzugefuegt | Aussage steht in der Zusammenfassung, nicht im Original | Irwin über Voss et al. (Makroregeln: Auslassen, Generalisieren, Konstruieren) | abgeleitet | V | 5 |

Familie C, Innere Logik

| Id | Klasse | Quelle | Status | Basis | Ab |
|---|---|---|---|---|---|
| konjunktion_verneinung | Verbindungswort oder Verneinung verändert ("weil" zu "obwohl", "keinen" zu "einen") | Irwin über Voss et al. (integrative Prozesse: Konjunktionen, adversative Verbindungen) | Prozess belegt, Klasse abgeleitet | T | 5 |
| widerspruch_im_text | Zwei Stellen im selben Text widersprechen sich | Irwin über Voss et al. (metakognitiv: vor- und zurückspringen, um Widersprüche zu klären); KMK ESA/MSA (Verstehensschwierigkeiten erkennen) | Prozess belegt, Klasse abgeleitet | T | 5 |
| menge_grad | Menge oder Grad verändert ("einige" zu "alle", "kann" zu "muss", "etwa" zu "genau") | keine Quelle gelesen, die das nennt | abgeleitet (eigener Schluss) | V oder T | 7 |
| verallgemeinerung | Aus wenigen Fällen wird "alle" oder "immer" | Cook et al. 2018 (induktiv schwacher Schluss, Beispiel "ein weißer Schwan, also sind alle weiß") | belegt als Schlussart, Übertragung abgeleitet | T oder V | 7 |
| folgerung_ursache | Falsche Folgerung, falsche Ursache, einzige Ursache | Cook et al. 2018 (falsche Ursache, Non sequitur, Einzelursache, Übervereinfachung); IGLU 2021 (einfache Schlussfolgerung: ein Ereignis verursacht ein anderes) | belegt als Fehlschluss (Klima), Übertragung abgeleitet | T oder W | 7 |

Familie D, Standpunkt und Beeinflussung

| Id | Klasse | Quelle | Status | Basis | Ab |
|---|---|---|---|---|---|
| meinung_als_tatsache | Meinung steht wie eine Tatsache da | IGLU 2021 ("Standpunkt oder Voreingenommenheit bestimmen"); Irwin über Voss et al. (zwischen objektiver und subjektiver Begründung unterscheiden); KMK ESA/MSA 4.4 (Intention, Sachgehalt) | Fähigkeit belegt, Klasse abgeleitet | V oder T | 7 |
| falsche_autoritaet | "Experten sagen ..." ohne Beleg, oder Quelle falsch zugeschrieben | Cook et al. 2017 und 2018 (falsche Experten) | belegt für Erwachsene und Klima, Übertragung abgeleitet | V oder W | 10 |
| wertende_beeinflussung | Wertende, emotionalisierende, einseitige Formulierung ("Demagogie" in der Sprache des Erstellers) | IGLU 2021 (Wirkung sprachlicher Merkmale, Voreingenommenheit); KMK Abitur 2.3 (Geltungsansprüche reflektieren, Qualität von Textinformationen prüfen); Cook et al. 2017 (Technik erklären) | Fähigkeit belegt, Klasse abgeleitet | T | 10 |

Nicht in Version 1 (mit Grund):
- **Weggelassenes** (Rosinenpickerei bei Cook): lässt sich mit Wortmarkierung nicht markieren, weil an der Stelle kein Wort steht. Braucht eine andere Bedienung; als Issue festhalten.
- **Falscher Pronomenbezug** (Anaphern bei Irwin): Kandidat, noch nicht ausgearbeitet.
- **Weitere Fehlschlüsse aus Cook 2018** (falsches Dilemma, Ablenkung, Äquivokation, falsche Gleichsetzung, aufgebauschte Minderheit, unerfüllbare Erwartungen, Verschwörungstheorie, voreiliges Abwinken): erst wenn Stufe 10 bis 13 inhaltlich steht; die Quelle behandelt Klimaleugnung, nicht Schultexte.

Hinweise:
- Die Stufung ("Ab") ist durchgehend unsere Einstellung. Keine der gelesenen Quellen ordnet diese Fehlerarten Klassenstufen zu.
- Rückmeldung bei den Familien C und D nennt die Technik beim Namen und erklärt sie (Cook et al. 2017: so erklärte Techniken wirkten bei Erwachsenen); bei Familie A nennt sie die Regel (IQB, Schmellentin & Lindauer).
- Texte für Familie D dürfen keine echte Propaganda oder Gruppenhetze enthalten. Wir bauen die Beeinflussung an harmlosen Themen (Tiere, Freizeit, Produkte).

### Modi (Entwurf, noch nicht entschieden)

- Genannt vom Ersteller: (1) beide Texte zeigen, welcher der echte ist ("Finde den Fehler im Bild"); (2) nur die Unterschiede im zweiten Text finden, wissend, dass der andere richtig ist; Ausbaustufe 2: unklar, welcher Text richtig ist, oder mehrere Varianten; letzte Stufe: auf Zeit; neu: Modus "Quellentreue" nur mit der Quelle (als iframe) und dem teils falschen Text.
- Modus B "Original bekannt" (2): im Mockup umgesetzt; Version 1.
- Modus "Vergleich ohne Quelle" (A und C zusammengelegt, entschieden vom Ersteller): Die Zahl der Fassungen und die Fehlerklassen bestimmen die Komplexität. Es entfällt die Trennung in zwei Modi.
- Folge der Dimension "Erkennungsbasis": ohne Original sind nur Klassen mit Basis "Text" (und "Vorwissen") entscheidbar. Bei Basis "Vergleich" (z. B. 9 gegen 19) sieht man nur den Unterschied, nicht welche Fassung stimmt. Die frühere Aussage, Modus A mache "Vergleich"-Klassen leichter, war unvollständig und ist damit berichtigt.
- Modus D "Auf Zeit": Zeitabweichung gehört in `limits` im Eintrag (Plattformregel `accessible`, Interaktiv-Skill); Option ohne Zeit nötig; nicht Version 1.
- Modus "Quellentreue" (Ersteller: nur Quelle und der teils falsche Text): Entscheidung des Erstellers: zum Bauzeitpunkt aus der Quelle eine PDF erzeugen, die URL der Originalseite als Link mit `target="_blank"` darunter. Damit entfallen iframe, Drittanbieter-Anfrage vor dem Klick und die Cookie-Frage; die PDF liegt lokal. Gemessen (Chromium, `page.pdf`, Playwright 1.56): der Wikipedia-Artikel "Elefanten" ergibt in einem festen Stand (`oldid=270301714`) 55 A4-Seiten, 2,3 MB, die PDF ist als "tagged" gekennzeichnet (Güte der Tags nicht geprüft), enthält "Abgerufen von ...oldid=..." aber keinen Lizenzhinweis und keine Autorenangabe. Folgen: Lizenzhinweis (CC BY-SA 4.0), Link zur Versionsgeschichte als Autorenliste und Hinweis "unverändert" müssen wir selbst ergänzen (rechtlich nicht geprüft); Quellen müssen kurz sein (55 Seiten sind zum Nachschlagen zu viel); Beleg je Stelle als Seitenzahl, Sprung per `#page=n` (Verhalten je Betrachter ungeprüft); Erzeugung besser als Skript der Autorin oder des Autors mit eingechecktem Ergebnis statt im Build, weil `vite.config.ts` unverändert bleiben muss (`keep-the-preset`). Erzeugung als Skript beim Anlegen eines Textpakets mit eingechecktem Ergebnis, nicht im Build: bestätigt vom Ersteller ("ja").

### Textproduktion (Entwurf, Wunsch des Erstellers)

- Der Ersteller wünscht: Textaufbereitung als Skill mit Schema ablegen; der Auftraggeber (diese Sitzung) vergibt Aufträge an beliebig viele parallele, echte Sitzungen, nimmt die Ergebnisse zurück, prüft und archiviert die Sitzungen. Menge: etwa 10 Pakete je zwei benachbarte Klassenstufen.
- Entwürfe liegen in `.vibe/drafts/app-textpack/` (Englisch, wie der Code): `SKILL.md` (Skill `app-textpack`), `textpack.v1.schema.json` (JSON Schema 2020-12), `error-classes.yaml`, `messages.de.json`, `check_textpack.py` (Prüfwerkzeug), `example-beach-mouse.yaml` (erfunden, gültig), `orchestration.md`. Noch nicht in der App: nach `create` wird der Skill unter `.agents/skills/app-textpack/` abgelegt, das Prüfwerkzeug als TypeScript in den Build (Regel `strict-typescript`: Daten des Erstellers beim Bauen prüfen).
- Das Prüfwerkzeug prüft zusätzlich zum Schema: zwei benachbarte Klassenstufen, jede Stelle genau einmal in der Fassung, Zitate stehen wörtlich im Original, Klasse passt zur Klassenstufe (`ab_klasse`), Toleranz nur mit Nachbarwörtern im selben Satz, LIX (nur Orientierung).
- Ungeklärt: Pfade und Build-Befehl nach `create`; Richtwerte für Textlänge und Satzbau je Stufe (nach dem Pilot); Lizenz der Texte im Repository (CC BY-SA 4.0 für Auszüge und Zusammenfassungen aus Wikipedia, Code unter eigener Lizenz); Themenliste; Zahl gleichzeitiger Sitzungen.

### Mechanismus (grundlegend, von Anfang an)

- Ein Textpaket = Original (Quelle, Link, Lizenz) + Zusammenfassung als Folge von Sätzen; je Satz optionale "Stellen" mit der richtigen Form und mehreren falschen Varianten je Fehlerklasse, mit Stufenmarkierung.
- `start(seed, route)` wählt mit dem Seed Textpaket und die Stellen, die verfälscht werden, und die Variante; Anzahl und Klassen der Fehler hängen von Stufe ab.
- Reine Funktion der Daten und des Seeds, ohne `Math.random` und ohne Uhr; Playthroughs belegen: gleicher Seed → gleicher Text, anderer Seed → andere Fehler.
- Der Mechanismus wird als eigenes, getestetes Modul gebaut und zuerst entwickelt.

### Methodische Quellen (gelesen)

- IQB, Lernaufgabe "Texte lernorientiert und fehlerdifferenziert korrigieren" (ESA/MSA), CC BY 4.0,
  https://www.iqb.hu-berlin.de/media/exercise_files/Lernaufgaben_Deutsch_/TextekorrigierenEM_Aufgabe.pdf :
  Fehlerkorrektur gilt als eine der anspruchsvollsten Rechtschreibtätigkeiten (Fehlersensibilität, Konzentration, Fokus vom Inhalt auf die Form); fehlerdifferenziert nach Fehlerschwerpunkt statt Totalkorrektur; Rechtschreibprogramme übersehen Fehler (z. B. Substantivierungen: "das fahren"); Kategorien der AFRA (Aachener Förderdiagnostische Rechtschreibfehler-Analyse): FG, GF, SG, GK, VL, VK, VA, KA, UM, MG; Texte "künstlich erstellt unter Berücksichtigung authentischer Fehler der Zielgruppe".
- IQB, Didaktische Handreichung "Fehlerschwerpunkte", CC BY (4 S.),
  https://www.iqb.hu-berlin.de/media/exercise_files/VERA-8_Deutsch_/fehlerschwerpunkte_Didaktische-Kommentierung.pdf :
  Fehlerschwerpunkte erkennen als Voraussetzung zum Abbau; Beispiele: Auslautverhärtung, Konsonantenverdopplung, das/dass, z/tz; "Hervorhebung der Fehler wirkt erleichternd", ohne Markierung deutlich schwerer.
- Schmellentin & Lindauer (2019), Leseforum 3/2019, https://doi.org/10.58098/lffl/2019/3/675 :
  Totalkorrektur ist nicht lernförderlich; Fehler gewichten, auf wenige Regelbereiche begrenzen (Primarstufe einer, Sek. I mehrere); Regelfehler und Flüchtigkeitsfehler trennen; Rückmeldung zeigt die Regel, nicht Einzelwörter. Der Beitrag nennt selbst: empirisch belastbare Ergebnisse liegen nicht vor.
- Cook, Ellerton, Kinkead (2018), Environ. Res. Lett. 13, 024018, CC BY 3.0, https://doi.org/10.1088/1748-9326/aaa49f :
  Argumente prüfen in Schritten (Behauptung, Prämissen, Schlussweise, Mehrdeutigkeit, Wahrheit der Prämissen); führt 16 Fehlschlüsse auf: Mehrdeutigkeit, Rosinenpickerei, Verschwörungstheorie, Äquivokation, falsche Ursache, falsche Gleichsetzung, falsche Experten, falsches Dilemma, unerfüllbare Erwartungen, aufgebauschte Minderheit, Verzerrung der Gegenposition (misrepresentation), Non sequitur, Übervereinfachung, Ablenkung (red herring), voreiliges Abwinken (slothful induction), Einzelursache. Das Papier behandelt Klimaleugnung und nur deduktive Behauptungen; die Übertragung auf Schultexte ist unsere Ableitung. Wirkung der Erklärmethode: Das Erklären der Technik (statt der Fakten) wirkte in einer zitierten Studie (Cook et al 2017) als "Impfung"; wir haben diese Studie nicht gelesen.
- McElvany et al. (Hrsg.) (2023), IGLU 2021, Kap. 3.2–3.3 (Lorenz, McElvany, Schilcher, Ludewig), https://www.pedocs.de/volltexte/2023/28075/pdf/McElvany_et_al_2023_IGLU_2021_Lesekompetenz.pdf (gelesen: S. 54–69):
  Vier Verstehensprozesse (Klasse 4): explizite Informationen lokalisieren; einfache Schlussfolgerungen; komplexe Schlussfolgerungen/Interpretieren und Kombinieren; Prüfen und Bewerten von Inhalt und Sprache. Letzteres umfasst u. a. Vollständigkeit/Klarheit beurteilen, Wahrscheinlichkeit beschriebener Ereignisse, Standpunkt und Voreingenommenheit des Textes bestimmen, Glaubwürdigkeit beurteilen. Fünf Kompetenzstufen. Testtexte Klasse 4 in drei Schwierigkeitsstufen: etwa 500, 700 und 850 Wörter, mit zunehmend komplexerer Satzstruktur und spezifischerem Vokabular; Lesbarkeit mit LIX und gSmog gemessen (Beispiele LIX 36,8–38; gSmog 5,6–5,7). Der Bericht betont die Wechselwirkung von Textlänge und -komplexität mit der Komplexität der Verstehensprozesse.
- Voss, Carstensen, Bos (2005), "Textgattungen und Verstehensaspekte", in: Bos et al. (Hrsg.), IGLU. Vertiefende Analysen, Waxmann, Kap. 2.2–2.3 (gelesen), https://fdz.iqb.hu-berlin.de/media/study_files/103/IGLULeseverstae.pdf :
  Modell von Irwin (1986) mit fünf Verstehensebenen: Mikroprozesse (Satzebene: Gliedern, Wichtiges auswählen), integrative Prozesse (zwischen Sätzen: Pronomen/Bezüge, Konjunktionen, Inferenzen), Makroprozesse (Textebene: Zusammenfassen durch Auslassen, Generalisieren, Konstruieren), elaborative Prozesse (Vorwissen, kritisches Lesen: Quellen vergleichen, Absicht des Autors, objektiv/subjektiv unterscheiden), metakognitive Prozesse (Verstehen überwachen, vor- und zurückspringen, um Widersprüche zu klären). Dieses Modell erlaubt, jede Fehlerklasse einer Verstehensebene zuzuordnen (Zuordnung folgt, sobald die Fehlerklassen festgelegt sind).
- Cook, Lewandowsky, Ecker (2017), PLOS ONE 12(5): e0175799, CC BY, https://doi.org/10.1371/journal.pone.0175799 (gelesen bis zu den Schlussfolgerungen):
  Zwei Experimente mit repräsentativen US-Stichproben (N=714 und N=392), Erwachsene, Thema Klimawandel. Das vorherige Erklären der Technik ("falsche Experten", "falsche Ausgewogenheit") neutralisierte die Wirkung der Falschinformation auf die wahrgenommene Einigkeit der Wissenschaft. Nicht untersucht: Schülerinnen und Schüler, Lesekompetenz, Fehlersuche in Texten. Die Übertragung auf unsere App ist eine Annahme.
- Wineburg & McGrew (2018, im Druck in Teachers College Record), https://stacks.stanford.edu/file/yk133ht8603/Wineburg%20McGrew_Lateral%20Reading%20and%20the%20Nature%20of%20Expertise.pdf (gelesen: Zusammenfassung, Einleitung, Methode, Ergebnis Aufgabe 1, Limitationen, Diskussion):
  45 Personen (10 Historiker, 10 Faktenprüfer, 25 Studierende) bewerteten Webseiten. Faktenprüfer lasen "lateral": sie verließen die Seite und prüften außerhalb, Historiker und Studierende lasen "vertikal" auf der Seite. Wichtig für uns: Das Dokument widerspricht Checklisten, die nur interne Merkmale prüfen ("hardly confers credibility ... making sure a site is free of typos"). Genaues Lesen eines einzelnen Textes (close reading) ist nützlich, ersetzt aber keine Quellenprüfung. Kleine, explorative Studie; Studierende einer Eliteuniversität.
- Nicht gelesen: PISA-2018-Rahmenwerk (OECD). Der Abruf der OECD-Seiten wurde vom Netzzugang mit 403 abgelehnt; ich habe nicht versucht, das zu umgehen. Die PISA-Aussagen aus der Suche (drei Bereiche: Informationen ermitteln, Interpretieren, Reflektieren und Bewerten) sind unbelegt und stehen nicht im Plan als Beleg.

### Grenzen dessen, was die App trainiert (transparent)

- Die App trainiert genaues, vergleichendes Lesen: Abweichungen zwischen einem Text und seiner genannten Quelle sowie innere Widersprüche und unbelegte Aussagen. Sie trainiert nicht die Prüfung unbekannter Webseiten (laterales Lesen).
- Typos oder Fehlerfreiheit sind kein Zeichen für Glaubwürdigkeit; die App darf das nicht nahelegen (Wineburg & McGrew).
- Es gibt keine Studie, die zeigt, dass Fehlersuche in Zusammenfassungen die Lesekompetenz verbessert. Schmellentin & Lindauer nennen für ihren Ansatz selbst keine empirisch belastbaren Ergebnisse. Die App ist daher eine begründete Übungsform, kein belegt wirksames Verfahren. Das steht auch in der App.
- Fehlerklassen und Klassenzuordnung sind aus den Quellen abgeleitet, nicht aus ihnen übernommen; im Plan und in `app-content` wird je Klasse vermerkt: belegt (Quelle) oder abgeleitet (eigener Schluss).

### Umfang

- Drin: Stufe 1 (echter Text bekannt, Fehler im zweiten Text markieren) für Klasse 3–13; mehrere Textpakete je Kapitel; Rückmeldung nach Fehlerklasse.
- Draußen (Issue): Stufe 2 (echter Text unklar, mehrere Fassungen), Stufe 3 (auf Zeit), Teilnehmerkonten und Ranglisten (kein Konto, keine Daten).
- Variante "welcher Text ist der echte" (Ersteller nannte sie als erste Verpackung): in Version 1 nicht enthalten; Reihenfolge noch zu klären.
- Sprache: Deutsch.
- Datenumfang: Anzahl der Textpakete je Kapitel noch offen.

### Quellen und Lizenzen

- Originaltexte: bevorzugt Wikipedia (CC BY-SA 4.0) und Klexikon (CC BY-SA 3.0, Kindertexte), je Textpaket Link, Autorenverweis und Lizenz. Eine Zusammenfassung ist eine Bearbeitung, also ebenfalls unter CC BY-SA mit Namensnennung (`third-party-licence`).
- Nichts davon bisher geprüft; jede Quelle wird beim Anlegen des Textpakets geöffnet und gelesen.
- Offen: Wikipedia/Klexikon sind Ersteller-Wunsch ("unterschiedlichste Materialien") nicht festgelegt.

## Explore

<!--
- All content questions belong here: what, for whom, scope, didactics, look and feel. Plan only maps them onto the
  scaffold.
- Ask; write no code; run no `create`.
- Max 2 questions per message. Skip what earlier answers tell. Never ask the same question twice.
- Each answer → "Answers".
-->

### Tasks


### Answers

<!-- Creator's answers, their words, one bullet each. -->

- Tun/Lernen: "eine Anwendung, die Schüler lehrt, sorgfältig zu lesen. Dafür sehr viele Texte erzeugen und Fehler unterschiedlicher Art einbauen, die die Schüler beim Lesen entdecken und markieren sollen."
- Lernende/Fach: "für diese Kompetenz schon sehr früh benötigt; Länge der Texte, Komplexität und Arten der Fehler je nach Altersstufe variieren; zielt auf Deutsch, Lesekompetenz und Textverständnis; Teil des Kompetenzrahmens" (keine feste Klassenstufe, Staffelung nach Altersstufe).
- Prinzip (Erstellerin/Ersteller): "ein grundlegendes Prinzip mit mehreren Varianten." Texte zu einem Thema, dessen Quelle bekannt ist; dazu eine Zusammenfassung, auf Basis unterschiedlichster Materialien, "Hauptsache sie sind auch im Original nachlesbar"; darin werden systematisch Fehlerklassen eingebaut, "von Rechtschreibfehlern über Logikfehler bis hin zu Meinungen oder demagogischen Beeinflussungen"; Fehlerarten und Textlänge passen zur Komplexität der Altersstufe.
- Varianten (Erstellerin/Ersteller): (1) beide Texte zeigen, welcher der echte ist, im Stil "finde den Fehler im Bild"; (2) nur die Unterschiede im zweiten Text finden, wissend, dass der andere richtig ist; Ausbaustufe 2: nicht mehr klar, welcher Text der richtige ist, oder mehrere Varianten zur Auswahl; letzte Ausbaustufe: alles auf Zeit.
- Fehlerklassen (Ersteller, nach Vorlage der Neufassung): "Die Klassen klingen super und gut verständlich." Familien A bis D, Stufung ("Ab") weiterhin als Einstellung zu bestätigen.
- Handy (Ersteller): "Am Handy die Varianten per Button togglen finde ich passend." Umsetzung: Umschalter "Original | Zusammenfassung" statt untereinander; nicht die Satz-für-Satz-Einblendung des Originals.
- Markieren (Ersteller): "Wörter markieren. Zu viel markieren (bis zu einer Schwelle) wäre auch ok." Zur Schwelle: "das kann man nicht rechnerisch lösen. Beim Erstellen kann pro Fehler die Toleranz optional mitgegeben werden. Lange Fehlerstellen bekommen dann eine Toleranz, einzelne Wörter eben nicht." Umsetzung im Mockup: Treffer = mindestens ein markiertes Wort in der Fehlerstelle; `toleranz: n` (optional, Standard 0) am einzelnen Fehler in der Textdefinition = n Nachbarwörter links und rechts der Stelle, die ohne Folge markiert werden dürfen, bestätigt vom Ersteller ("umgebende Wörter"), mit der Einschränkung "nur innerhalb desselben Satzes"; eine globale Schwelle je Stufe gibt es nicht.
- Umfang: "Ab Klasse drei bis zum Abitur", Texte und Fehler entsprechend komplexer. Die Stufen (1 echten Text kennen, 2 unklar/mehrere Varianten, 3 auf Zeit) sinnvoll, "sogar schon ein issue dafür einlegen" (Stufe 2 und 3 als Issue festhalten). Wichtig von Anfang an: "der Mechanismus, wie die Texte und ihre Variationen gebildet werden. Dies muss deterministisch sein, aber auch gleichzeitig mehrere Varianten vorhalten, damit es nicht zu vorhersagbar wird (seeds)."
- Freigabe (Ersteller): "Recherche gebe ich frei." Auftrag: "Arbeite durch, bis ein erster echt-Test für mich mit einem Text möglich ist. Danach skalieren wir dann auch viele Texte." (Die Bestätigung des Plans bleibt ein eigener Schritt mit ausdrücklichem Ja.)
- Sprache (Ersteller): "Code in Englisch, die Anwendung soll auch mehrere Sprachen unterstützen (auch wenn wir erst mal nur Deutsch machen)."
- Begriff (Ersteller): "Warum nennst du es konsequent Zusammenfassung? Zusammengefasst ist doch nichts!" Die zweite Textfassung ist eine genaue Wiedergabe mit eingebauten Fehlern, keine Zusammenfassung. Vorläufig im Plan "Fassung", im Code `rendition`; Wortwahl in der App offen, siehe Key decisions.
- Bestätigung (Ersteller), nach der Frage "Bestätigst du den Plan und die Inhaltsmethode ausdrücklich?": "Paare passen. Wähle Themen selbst, abhängig von der Altersstufe. Leg los, bis zum PR." Auslegung: Der Plan ist bestätigt; Auftrag bis zur Entwurfs-Pull-Request (`work` → `main`). Das Wort "Fassung" blieb unbeantwortet und gilt als Annahme (guess). Klassenstufen-Paare: 3–4, 5–6, 7–8, 9–10, 11–12 oder 12–13 (letztes Paar nicht entschieden, guess).

### Entry draft

<!-- YAML valid against the entry schema; its property names. Only known values, never invented. -->

```yaml
# Entwurf; Adresse folgt mit der Veröffentlichung
title: Textcheck                 # guess, nach dem Repository-Namen
subject: Deutsch
grades: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
summary: >-
  Zwei Fassungen eines Textes lesen und die Fehler in der zweiten Fassung finden und markieren:
  von Rechtschreibfehlern bis zu Meinungen, die wie Tatsachen klingen. Die Texte werden je nach Klasse länger
  und schwieriger. Zu jedem Text gibt es die Quelle zum Nachlesen.
keywords: [Lesen, Textverständnis, Fehlersuche, Korrekturlesen, Lesekompetenz, genau lesen]
creator: { name: Oliver }
source: https://github.com/mrsimpson/textcheck
fitness:
  account: false
  install: false
  storage: device   # nur wenn der Lernstand gespeichert wird (guess)
  thirdParty: none
```

### Completed

- [x] Install the skills, if missing: `npx skills add lernapps/tooling#exp/compact-guidance`. The app commits them.
- [x] Tell the creator where the app lives: GitHub Pages of their own repo, free, public, own address (usually
      `https://<owner>.github.io/<repo>/`). Offer a short explanation of GitHub; say they need not know it. Page for
      them: <https://lernapps.net/tooling/github/>. Example: "Deine App wird über GitHub veröffentlicht, kostenlos
      und öffentlich, unter deiner eigenen Adresse. Soll ich dir kurz erklären, was GitHub ist?"
- [x] Set up the branches before anything else is pushed:
      - settle the repo name with the creator first (a rename can cost your access);
      - no git repo: `git init --initial-branch=main`;
      - no `main` (`git ls-remote --heads origin main`, `git branch --list main` empty): `git switch --orphan main`,
        `git commit --allow-empty -m "chore: start"`, `git push -u origin main`;
      - missing `gh-pages`: `git switch --orphan gh-pages`, `git commit --allow-empty -m "chore: gh-pages"`;
      - missing `work`: `git switch -c work main`;
      - `git push -u origin gh-pages work`. No remote yet: push all three later, `main` first;
      - Pages from `gh-pages`, root (`pages-from-gh-pages`): `gh api -X POST repos/<owner>/<repo>/pages
        -f build_type=legacy -f "source[branch]=gh-pages" -f "source[path]=/"`; refused → put the click from skill
        `lernapps-github` into your next question;
      - default branch not `main` (`gh api repos/<owner>/<repo> --jq .default_branch`) → skill `lernapps-github`.
      Notiz: Zweige `main`, `gh-pages`, `work` im Repository mrsimpson/textcheck angelegt und gepusht. GitHub Pages konnte die Sitzung nicht einschalten (HTTP 403 vom Proxy); Klick für Oliver offen, siehe Notes "GitHub-Stand".
- [x] Load skill `lernapps-content-research` before the first question about learners or curriculum.
- [x] Ask: what do learners do in the app, what do they learn?
- [x] Ask: who are the learners (subject, school year, prior knowledge)? Land and Schulform: only if the creator
      names a school or class, at most once; no answer → KMK-Bildungsstandards.
- [x] Ask: where does the content come from (own material such as worksheets, tests, experiments; or others' with
      source and licence)?
- [x] Read the catalog https://lernapps.net/apps/llms.txt. Ask: is an app there a model? What matters most:
      exercises, visualisations, game feel?
- [x] Ask: which hurdles and misconceptions do learners have? Which examples or experiments does the creator use?
      Notiz: Frage gestellt, vom Ersteller nicht beantwortet; für Version 1 ohne eigene Hürdenliste.
- [x] Ask: languages (German only, or more)?
      Notiz: Ersteller: Code Englisch, Anwendung mehrsprachig anlegen, vorerst nur Deutsch.
- [x] Interactive or game-like: ask how it should feel and look (e.g. "wie ein echter Spielblock", colours).
      Notiz: ruhig wie ein Arbeitsblatt mit Textmarker (Annahme, nicht widersprochen); Farben und Legende nach Rückmeldung des Erstellers.
- [x] Research: follow skill `lernapps-content-research` (filled-in `app-content` first). Write under "Notes":
      curriculum orientation (Lehrplan cited where used), competencies by chapter as Ich-kann-Sätze, verified
      sources. No competencies written = task not done.
- [x] Didactic approach under "Notes", one line per competency: how learners get there (derive, not only read off;
      e.g. a tree diagram shows how a probability comes about), which misconception the feedback catches.
- [x] Scope under "Notes": what is in, what is out (and why), data range (e.g. "all main-group elements", not a
      silent "1–20"), languages.
- [x] Fetch https://lernapps.net/apps/schemas/entry.v1.schema.json; read every property's description. Ask what
      helps teachers and parents find the app. Fill "Entry draft". Search words: short, one or two words each, as
      people type them into a search.
- [x] Choose the archetype; write it with its reason under "Key decisions"; set `archetype`:
      - `interactive`: learners act in one app page (game, trainer, simulation; e.g. a typing game);
      - `explainer`: many pages of explanation, each with exercises;
      - `quiz`: questions with options and feedback.
- [x] **Checkpoint:** research. Show in plain words: curriculum orientation, competencies by chapter, didactic
      approach, scope (in, out, data range, languages), sources and how checked, what is unchecked, archetype and
      reason. Stop and wait. Changes → change, ask again.
      Notiz: Freigegeben vom Ersteller: "Recherche gebe ich frei".
- [x] Set `phase: plan`: change the value line (`grep '^phase:'` prints `phase: plan`).
## Plan

<!--
- Map the confirmed content onto the scaffold: the archetype's blocks, components, data files, patterns.
- No new content questions; a content gap → back to Explore, say so.
- Confirmable in one read. After the confirmation: work on your own (creator turns to the listing: max 3).
-->

### Tasks

- [x] Write the Code tasks under "Code": pages or screens, content, what each shows; each ends in a commit.
- [x] Load the archetype's skill with all its references, `lernapps-app/references/archetype-rules.md`, skill
      `lernapps-exercise-patterns` with `references/patterns.md` and `references/success.md`. Explainer with
      quiz-type exercises: also skill `lernapps-quiz`. Write "Content method".
- [x] Show the creator, short: goal, competencies by chapter, entry draft, tasks; the content method in plain words
      (what learners see and do, what it cannot do). Max 2 questions.
- [x] Each screen, component or interactive exercise: show a sketch (static SVG or image, or the steps with what
      learners see after each). Words alone are not enough.
- [x] **Checkpoint:** confirm the plan and the content method. Only with the sketches shown. Stop and wait for an
      explicit yes. Changes → change, ask again. No `create` before the yes.
- [x] Set `phase: code`: change the value line (`grep '^phase:'` prints `phase: code`).

### Content method

- Übungsmuster: "Abweichungen in einer Fassung gegen ein bekanntes Original markieren". Im Katalog der Muster gibt es dafür keinen Eintrag (am nächsten "beurteilen, entscheiden"); der Archetyp `interactive` erlaubt eine eigene Oberfläche. Lücke vermerkt; kein Issue bei app-templates, solange nur Textcheck das braucht.
- Daten: Textpakete (`src/data/packs/<language>/<grades>/<id>.yaml`, Schema `textpack.v1`), Fehlerklassen (`src/data/error-classes.yaml`), Stufen (`src/data/levels.yaml`: erlaubte Klassen, erlaubte Erkennungsbasen, Fehler je Runde, ob die gesuchte Klasse genannt wird). Alles Englisch benannt, Lernertexte in `language`.
- Texte für Lernende: Nachrichtendateien `src/messages/<language>.json` mit `translator`; Namen der Fehlerklassen, Beschriftungen, Legende, Erklärtexte der Seiten. Version 1: nur `de`.
- Abbildungen: keine in Version 1. Farben: eine feste Zuordnung (gefunden, Rest einer gefundenen Stelle, übersehen, fälschlich markiert, im Rahmen) in Text und Auswertung, zusätzlich Linienarten, Statustext für Screenreader.
- Kern (`src/core/`): rein, ohne DOM. `start(seed, route)` baut eine Runde aus Paket und Stufe: Seed wählt Stellen und Varianten; `step(state, input)`: Wort markieren, Markierung löschen, prüfen, neue Runde. Zufall nur aus dem Seed.
- Komponenten (`src/ui/`): Rundenansicht (Computer: Original und Fassung nebeneinander; Handy: Umschalter), Wortmarkierung (eine Tab-Stelle, Pfeiltasten, Leertaste), Auswertung nach Fehlerklasse mit Legende. Zeigen nur den Zustand.
- Was die Markierung prüft: Treffer = mindestens ein markiertes Wort der Stelle; `tolerance` = Nachbarwörter im selben Satz ohne Folge. Sie kann nicht beurteilen, ob ein Wort aus dem richtigen Grund markiert wurde, und bewertet keine Teilfehler.
- Neues Textpaket: Skill `app-textpack`, Prüfwerkzeug beim Bauen, Eintrag in `.vibe/texts-log.md`; für viele Pakete parallele Sitzungen laut `orchestration.md` (Erweiterung, nicht Version 1).

### Completed

## Code

<!--
- Commit after each task; the hooks check. Pre-commit fails → read node_modules/.cache/lernapps/pre-commit.log.
- Fix from the message; never bypass a hook.
- Undecidable → choose, mark "(guess)" under "Key decisions", go on.
- Creator asks for a change → first say your reading in one sentence ("Ich nehme alle 44 Hauptgruppenelemente
  auf."); never narrow it silently. Content change → update "Notes" too.
- Test fails at runtime → read the archetype's `references/runtime.md` first.
- Push `work` after each task: the pull request's preview shows the creator the current state. Never push `main`.
- `create` needs git, Node ≥ 22.18, github.com, codeload.github.com, registry.npmjs.org. Blocked → ask the creator
  to allow it, rerun. Never write the app by hand.
-->

### Tasks

- [ ] Zwischenstopp auf Wunsch des Erstellers: Vorschau-Link an Oliver für den ersten Test mit einem echten Text; Rückmeldung abwarten, ändern, danach weiter mit den übrigen Aufgaben.
- [ ] Every box of Explore, Plan and Code ticked.
- [ ] Set `phase: commit`: change the value line (`grep '^phase:'` prints `phase: commit`).

### Completed

- [x] Only after the confirmation: in this plan's folder, `npx --yes github:lernapps/tooling#exp/compact-guidance create
      --archetype <archetype>`. Keeps this plan.
      Notiz: create lief ohne Fehler (app-templates f28d020). Vorher mussten `.vibe/mockups` und `.vibe/drafts` aus dem Ordner (create verlangt einen Ordner nur mit `.git`, Plan und Skills); danach zurückkopiert.
- [x] `git switch work`, then `npm install` (dependencies, git hooks). From now on: `npx lernapps check`.
- [x] Commit the generated app with this plan on `work`.
      Notiz: Pre-commit schlug an: Formatierung der Skizzen und Entwürfe unter `.vibe/`; behoben mit `npx vp check --fix`, kein Umgehen.
- [x] `git push -u origin work`; open a draft pull request `work` → `main` (`gh pr create --draft --base main
      --head work --title "Erste Version" --body "Vorschau für die Erstellerin oder den Ersteller"`). The comment
      "Vorschau der App" links the preview; give the creator the link once. Refused → skill `lernapps-github`.
      Notiz: Pre-push: lernapps check ok, 9 Regeln, keine Befunde. `gh pr create` ist gesperrt (GraphQL); Pull Request #1 über `gh api` als Entwurf geöffnet: https://github.com/mrsimpson/textcheck/pull/1
- [x] Load skill `lernapps-app` and the archetype's skill.
- [x] Fill the content guide `.agents/skills/app-content/SKILL.md` from the plan and its content method: replace
      every placeholder comment with concrete instructions (files, ids, data files, one example). Delete its top
      comment. `grep -c "FILL IN" .agents/skills/app-content/SKILL.md` must print 0. Commit it before any content.
      Notiz: Ausgefüllt vor dem Inhalt; `grep -c "FILL IN"` gibt 0. Englisch geschrieben (Agenten-Anleitung).
- [x] Textpaket-Format in die App holen: Schema `textpack.v1`, Fehlerklassen, Nachrichten, TypeScript-Typen, Prüfung beim Bauen (das Prüfwerkzeug aus `.vibe/drafts/app-textpack/` nach TypeScript), Skill `app-textpack` unter `.agents/skills/`. Commit.
      Notiz: Schema `src/data/textpack.v1.schema.json`, `error-classes.json`, `levels.json`, TypeScript-Prüfung `src/core/pack-check.ts` mit Ajv in den Tests, Skill `app-textpack`. Datenformat JSON statt YAML (die Plattform importiert JSON-Module).
- [x] Kern: Rundenbau aus Seed, Markieren, Prüfen, Auswertung nach Klasse, Toleranz im selben Satz. Playthroughs: gleicher Seed gleicher Text; Treffer; Übersehen; Fehlmarkierung; Toleranz im selben Satz; Toleranz endet an der Satzgrenze; unbekannte Eingabe ändert nichts. Commit.
      Notiz: Tests in `src/core/core.test.ts`; Durchläufe `marking.yaml` (Seed 1) und `tolerance.yaml` (Seed 3), im Browser auf beiden Breiten gespielt.
- [x] Oberfläche: Rundenansicht mit Umschalter am Handy, Wortmarkierung mit einer Tab-Stelle und Pfeiltasten, Auswertung mit Farben, Linienarten und Legende, Trefferfläche mindestens 44 Pixel hoch. Texte aus den Nachrichtendateien. Commit.
      Notiz: Trefferfläche mindestens 44 Pixel hoch nur bei groben Zeigegeräten (`pointer: coarse`), sonst Zeilenhöhe 2,1; sonst wäre der Text sehr luftig.
- [x] Statische Startseite (was, für wen, wie anfangen) und Seite "Wie diese Übung begründet ist" aus den Fehlerklassen und den Grenzen. Commit.
      Notiz: Die Begründungsseite ist ein Abschnitt der Startseite (`src/app.yaml`, Markdown ohne Tabelle: Liste); ein Test hält sie mit den Fehlerklassen im Gleichschritt.
- [x] Pilot: ein echtes Textpaket für Klasse 5–6 nach Skill `app-textpack`: Quelle geöffnet und gelesen, fester Stand, Lizenz, Zitate geprüft, Prüfwerkzeug "passed". Quelle und Lizenz erscheinen in der App. Commit.
      Notiz: Klexikon "Fledermäuse", Revision 157941 (6. Mai 2024), CC BY-SA 4.0; zehn Auszugssätze wörtlich geprüft; 15 Stellen, 8 Fehlerklassen.
- [x] Architektur: `docs/arc42` mit jedem Commit, der Code ändert (Block je Teil von `src/`).
      Notiz: `arc42 validate --strict`: 0 Fehler, 0 Warnungen, 0 Hinweise.
- [x] Content guide still matches what was built (`app-content-matches`); `grep -c "FILL IN"` prints 0.
- [x] `npx lernapps check` passes.
- [x] Look at a screenshot of every screen and state (start, each mode, pause, end), desktop and 360 px; check each
      against the confirmed sketches and the archetype's rules (interactive: `references/frame.md`).
      Notiz: Start, Runde, markiert, Auswertung, Desktop und 360 px, an der echten App gesehen. Tastatur: Pfeile und Leertaste markieren, Fokus geht nach dem Prüfen zur Überschrift der Auswertung.

## Commit

<!--
- Push to `main` = publish (workflow `Pages`, job `deploy`). Until the creator's yes: branch `work`.
- Only `main` publishes; it must be the default branch. Explore set up branches and Pages; here: verify.
- A push of only `.vibe/` publishes nothing; push the plan when a task says so.
- Every push to `main` needs a run of `Pages`: none after a minute
  (`gh run list --workflow Pages --branch main --commit <commit>`) → `gh workflow run Pages --ref main`.
- "403 Resource not accessible by integration" → a click for the creator (skill `lernapps-github`). Never push to
  trigger a run.
-->

### Tasks

- [ ] `git push origin work` (not `main`). Pre-push runs the heavy checks; fix failures. See the pull request's
      checks to green; mark it ready (`gh pr ready`).
- [ ] Verify over REST: default branch `main` (`gh api repos/<owner>/<repo> --jq .default_branch`); Pages serves
      `gh-pages` from `/` (`gh api repos/<owner>/<repo>/pages`; "Not Found" = off). Not right and not yours to
      change → note the creator's click (skill `lernapps-github`).
- [ ] **Checkpoint:** publish. Show the preview link from the comment "Vorschau der App"; ask before the app goes
      online; wait for the yes. Put the noted clicks into the same question.
- [ ] `git switch main`, `git merge --ff-only work`, `git push origin main` (GitHub marks the pull request merged
      and removes the preview). Run started?
      `gh run list --workflow Pages --branch main --commit "$(git rev-parse HEAD)"`; none after a minute →
      `gh workflow run Pages --ref main` (refused: creator clicks Actions → Pages → Run workflow). Watch it
      (`gh run watch`). Fails → read the failed step, fix, push. Admin-only Pages setting → the run deployed
      anyway; after the creator's click the app appears without a new run.
- [ ] Open the address the job `deploy` printed ("published at ...", also in the run summary); confirm the app shows.
      Use that address, never a derived one; follow redirects. Do not wait for it yourself.
- [ ] Load skill `lernapps-listing`.
- [ ] Complete the entry draft (e.g. the address).
- [ ] **Checkpoint:** list. Ask before opening the listing pull request; wait for the yes.
- [ ] Fill the retrospective.
- [ ] Commit this plan on `main` and push it (listing check and review read it there).
- [ ] Open the listing pull request as the skill says; see it to "bestanden" (not "nicht bestanden") in the results
      comment.
- [ ] Plan changed since its last push → commit on `main`, push again.

### Completed

## Retrospective

<!-- At the end of Commit, before the listing pull request. Facts, short, no names. Read by review and evals. -->

### Phases reached

<!-- Last phase completed, checkpoints passed. E.g. "commit; confirmed, published". -->

### Failed checks

<!-- Each failed check: rule id, count. E.g. "`no-request-before-click`: 2". Not the pre-push count. -->

### Creator turns after the plan

<!-- Number of creator messages after the confirmation, topic of each. Target: max 3. -->

### Where I had to guess

<!-- Each gap in plan, skills, messages or answers, and your choice. "None" if none. -->
- Nach dem ersten Test (Oliver): Das Wort für den Text, den Lernende prüfen, ist „Variante“ (vorher „Fassung“, geraten). Der Dark Mode folgt der Systemeinstellung auch für die Seite; vorher blieb die Seite hell.
