# Textcheck

Eine Lern-App für [lernapps.net](https://lernapps.net): Schülerinnen und Schüler von Klasse 3 bis zum Abitur üben,
genau zu lesen. Die App läuft nur im Browser, sammelt nichts und ist barrierearm gebaut. Sie ist online unter
<https://mrsimpson.github.io/textcheck/>.

## Was die App kann

Es gibt zwei Übungen mit je drei Stufen. Die Stufen unterscheiden sich in der Länge der Texte, in den Fehlerarten, in der
Zahl der Fehler je Runde und in den Hilfen. Was eine Stufe enthält, steht in `src/data/stages.json`; die Karten der Stufen
in der App werden daraus und aus den Texten berechnet.

| Übung | Du bekommst | Du suchst | Stufen |
| --- | --- | --- | --- |
| **Fehler im Text finden** | einen Text, keine Vorlage | Fehler, die man am Text selbst sieht | 1 Rechtschreibung und Flüchtigkeitsfehler, 2 dazu Zeichensetzung und Fehler mit echten Wörtern, 3 dazu Widersprüche im Text |
| **Mit der Quelle vergleichen** | eine Wiedergabe und ihre Quelle | was beim Übertragen falsch geworden ist | 1 Zahlen, Namen, Daten, Orte, 2 dazu falsche und hinzugefügte Angaben, Verneinungen, Mengen, 3 dazu Verallgemeinerungen, Folgerungen, Meinungen, Wertungen |

Die Wiedergabe sagt vieles mit eigenen Worten; nur Abweichungen im Inhalt sind Fehler. Auf der letzten Stufe ist die Quelle
der Wikipedia-Artikel selbst (fester Stand); das PDF der Quelle liegt als Reserve bei. Nach dem Prüfen erklärt die App jeden
Fehler und macht einen Vorschlag, wie es weitergeht.

## Wie die Übung begründet ist

Hier steht, woran wir uns halten und was wir selbst abgeleitet haben. **Belegt** heißt: Eine Quelle, die wir gelesen
haben, nennt diese Fehlerart. **Abgeleitet** heißt: ein eigener Schluss aus verwandten Quellen. In welcher Stufe
einer Übung eine Fehlerart vorkommt, ist unsere Einstellung. Keine der gelesenen Quellen ordnet die Fehlerarten Stufen oder Klassen zu.

Die Fehlerarten:

- **Rechtschreibung (Regelfehler)**, belegt, Fehler im Text finden, Stufe 1: IQB-Lernaufgabe und -Handreichung, KMK-Standards.
- **Flüchtigkeitsfehler**, belegt, Fehler im Text finden, Stufe 1: Schmellentin und Lindauer (2019).
- **Fehler mit echtem Wort (das/dass, das fahren)**, belegt, Fehler im Text finden, Stufe 2: IQB-Handreichung und -Lernaufgabe.
- **Zeichensetzung**, abgeleitet, Fehler im Text finden, Stufe 2: KMK-Standards, Schmellentin und Lindauer.
- **Zahl, Name, Datum oder Ort verändert**, abgeleitet, Mit der Quelle vergleichen, Stufe 1: IGLU 2021, KMK-Standards.
- **Sachlich falsche Angabe**, abgeleitet, Mit der Quelle vergleichen, Stufe 2: IGLU 2021, Cook, Ellerton und Kinkead (2018).
- **Hinzugefügte Aussage**, abgeleitet, Mit der Quelle vergleichen, Stufe 2: Voss, Carstensen und Bos (2005).
- **Verbindung oder Verneinung verändert**, abgeleitet, Mit der Quelle vergleichen, Stufe 2: Voss, Carstensen und Bos (2005).
- **Widerspruch im Text**, abgeleitet, Fehler im Text finden, Stufe 3: Voss, Carstensen und Bos (2005), KMK-Standards.
- **Menge oder Grad verändert**, abgeleitet, Mit der Quelle vergleichen, Stufe 2: eigener Schluss, keine Quelle gelesen.
- **Verallgemeinerung**, abgeleitet, Mit der Quelle vergleichen, Stufe 3: Cook, Ellerton und Kinkead (2018).
- **Falsche Folgerung oder Ursache**, abgeleitet, Mit der Quelle vergleichen, Stufe 3: Cook, Ellerton und Kinkead (2018), IGLU 2021.
- **Meinung als Tatsache**, abgeleitet, Mit der Quelle vergleichen, Stufe 3: IGLU 2021, Voss, Carstensen und Bos (2005), KMK-Standards.
- **Falsche Autorität oder Quelle**, abgeleitet, Mit der Quelle vergleichen, Stufe 3: Cook, Lewandowsky und Ecker (2017).
- **Wertende, emotionalisierende Beeinflussung**, abgeleitet, Mit der Quelle vergleichen, Stufe 3: IGLU 2021, KMK-Standards, Cook und andere (2017).

Was wir nicht belegen können:

- Dass diese Übung die Lesekompetenz verbessert. Dafür gibt es keine Studie.
- Dass Fehlersuche in Texten das Prüfen unbekannter Webseiten übt. Das ist etwas anderes (Wineburg und McGrew 2018).
- Die Länge und den Satzbau der Texte je Stufe: Das sind Einstellungen der Autorinnen und Autoren.
- Die Fehler bei der Rechtschreibung sind für die Wörter der Texte konstruiert. Die Arten der Fehler stammen aus den
  IQB-Materialien, die einzelnen Falschschreibungen von Lernenden haben wir nicht gesammelt.

Die Quellen der Fehlerarten sind in `src/data/error-classes.json` genauer benannt; die Recherche steht im Plan
`.vibe/plans/01-sorgfaeltig-lesen.md`.

## Texte und ihre Quellen

Die Texte sind Textpakete in `src/data/packs/<Sprache>/`: ein Ausschnitt aus einer frei lizenzierten Quelle (Klexikon für kurze
Texte, Wikipedia für lange Texte, auf Englisch Simple English Wikipedia und English Wikipedia; alle CC BY-SA 4.0), eine
Wiedergabe in eigenen Worten und Stellen, an denen je Runde Fehler eingebaut werden. Quelle, Stand und Lizenz stehen im
Paket und neben jedem Text in der App. Die Pakete stehen unter derselben Lizenz wie ihre Quellen. Welche Stufe ein Text
bekommt, folgt aus seiner Länge und aus seinen Stellen für die Fehlerarten der Stufe. Neue Texte: Anleitung in
`.agents/skills/app-textpack/SKILL.md`.

## Entwickeln

```sh
npm install
npx vp dev          # lokal ansehen
npx lernapps check  # alle Prüfungen
```

Der Aufbau (Kern, Oberfläche, Daten, Architektur in `docs/arc42/`) und die Inhaltsentscheidungen
(`.agents/skills/app-content/SKILL.md`) sind dokumentiert; jede Änderung hat einen Plan in `.vibe/plans/`.

## Lizenz

Siehe `LICENSE`. Texte und Schrift (Recursive, SIL Open Font License 1.1) behalten ihre eigenen Lizenzen.
