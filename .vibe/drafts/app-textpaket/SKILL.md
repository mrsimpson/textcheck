---
name: app-textpaket
description: Entwurf. Use when you create a new Textpaket for Textcheck (a source excerpt, a summary in sentences, and places with correct and wrong variants), for one pair of adjacent school years and one topic. Not yet installed in the app; the final version replaces "Pfade" and the build command after `create`.
---

# Textpaket erstellen (Entwurf)

Ein Textpaket gehört zu **zwei benachbarten Klassenstufen** und **einem Thema**. Der Seed wählt später in der App, welche Stellen verfälscht werden und mit welcher Variante. Du lieferst die Daten, nicht die Auswahl.

## Eingaben im Auftrag

- Klassenstufen (`von`, `bis`), Thema, Paket-Id (Kleinbuchstaben mit Bindestrichen).
- Optional: Quelle. Ohne Vorgabe wählst du eine Seite, die du vollständig öffnen und lesen kannst.

## Vorgehen

1. **Quelle öffnen und lesen.** Nur Seiten mit einer Lizenz aus dem Schema (`quelle.lizenz`). Bei Wikipedia einen festen Stand (`oldid`) verwenden. Inhalte nie aus dem Gedächtnis. Antwortet der Server mit 429, warte und melde es im Bericht; kein Scraper, keine Schleife.
2. **Original-Auszug.** Wörtlich und unverändert, Satz für Satz. Länge und Satzbau passen zur Klassenstufe. Richtwerte stehen noch nicht fest; sie werden nach dem Pilot eingetragen (`FILL IN`). Das Prüfwerkzeug berechnet nur LIX zur Orientierung, kein Grenzwert.
3. **Zusammenfassung.** Eigene Sätze in einfacher Sprache. Jeder Satz mit Text bekommt `beleg.zitat`: die wörtliche Stelle im Original, die ihn trägt. Nur Aussagen, die das Original trägt.
4. **Stellen.** Eine Stelle ist ein Wort oder eine Wortgruppe der Zusammenfassung mit `richtig` und mindestens einer falschen Variante.
   - Jede Variante hat `klasse`, `basis`, `auffaelligkeit` (1 bis 3), `erklaerung`. Klassen nur aus `klassen.yaml`, nur solche mit `ab_klasse` bis zur oberen Klassenstufe des Pakets.
   - `basis`: `text` (nur am Text erkennbar), `vergleich` (nur im Vergleich mit dem Original), `vorwissen`. Bei `vergleich` ein `beleg` aus dem Original.
   - Mehrere Varianten je Stelle, wo es sinnvoll ist: das macht Runden unvorhersagbar.
   - Genug Stellen: mindestens 3 Fehlerklassen, mindestens die Zahl der Stellen, die die Stufe pro Runde braucht, plus drei Reserve.
   - Lange Stellen (ab drei Wörtern) bekommen `toleranz` (Anzahl Nachbarwörter), aber nur, wenn im selben Satz Wörter daneben stehen. Einzelne Wörter bekommen keine.
   - Eine Stelle mit `richtig: ""` fügt einen Satz ein (z. B. Meinung als Tatsache). Sie steht in einem eigenen Satz.
5. **Erklärungen** der Varianten in einfacher Sprache für die Klassenstufe, mit dem Wortlaut des Originals. Bei Klassen der Familien C und D die Technik beim Namen nennen und kurz erklären.
6. **Familie D (Beeinflussung):** harmlose Themen, keine echte Propaganda, keine Hetze gegen Gruppen, keine Namen realer Lernender.
7. **Prüfen:** `python3 pruefe_textpaket.py <datei>` muss „bestanden“ melden. Warnungen liest du und begründest sie in `vermerke`.
8. **Quelle sichern (Modus Quellentreue):** PDF der Quelle mit festem Stand erzeugen und Lizenz, Autoren-Link und Hinweis „unverändert“ ergänzen. Siehe `pdf_erzeugen` (noch zu schreiben).

## Abgabe

- Datei `<Pfad>/<id>.yaml` (Pfad nach `create` festlegen), dazu die PDF.
- Branch `text/<id>`, nicht in `work` mergen.
- Bericht an den Auftraggeber: Quelle und Stand, Prüfergebnis, Warnungen, Unsicherheiten, was du nicht prüfen konntest.

## Nie

- Nichts erfinden. Keine Zahl, kein Name, kein Zitat, das du nicht in der geöffneten Quelle gefunden hast.
- Keine Angaben zu Lehrplänen, die du nicht gelesen hast.
- Keine Namen, Klassen oder Schulen realer Lernender.
- Keine Prüfung abschwächen, um ein Paket durchzubringen.
