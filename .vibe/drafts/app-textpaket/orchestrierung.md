# Parallele Erstellung (Entwurf des Ablaufs)

Gilt für den Auftraggeber (die Sitzung, die die Pakete einsammelt). Noch nicht ausgeführt.

## Vorbereitung

1. Themenliste je Klassenstufen-Paar festlegen (zusammen mit Oliver). Jedes Thema bekommt eine Paket-Id.
2. Pilot: 2 Pakete, ein frühes und ein spätes Stufenpaar. Erst wenn Skill, Schema und Prüfwerkzeug sie sauber tragen, skalieren.

## Pro Auftrag (eine Sitzung)

- `create_session` mit dem Repository, Basis `work`, eigenem Branch (`outcome_branch: text/<id>`), Etikett `textcheck-texte`.
- Der Auftrag enthält: Stufenpaar, Thema, Paket-Id, den Verweis auf Skill `app-textpaket`, die Id der Auftraggeber-Sitzung und die Bitte, den Bericht per Nachricht zurückzuschicken.
- Gleichzeitig höchstens wenige Sitzungen (Vorschlag 4): die Git-Verbindung der Sitzung begrenzt gleichzeitige Operationen, und Wikipedia antwortet bei zu vielen Anfragen mit 429. Beides haben wir in dieser Sitzung selbst gesehen.

## Rücklauf pro Paket

1. Branch holen, `pruefe_textpaket.py` selbst ausführen (nicht dem Bericht glauben).
2. Stichprobe gegen die Quelle: Zitate und Zahlen im Original öffnen.
3. Bei „bestanden“: nach `work` mergen, Eintrag in `.vibe/texte-log.md` (Id, Stufen, Quelle, oldid, Prüfergebnis, Sitzungs-Id).
4. Erst danach die Sitzung archivieren (`archive_session`).
5. Bei Fehlern: einmal mit konkreter Rückmeldung zurückschicken, dann neu vergeben. Keine Prüfung lockern.

## Menge

- Ziel von Oliver: etwa 10 Pakete je zwei benachbarten Klassenstufen. Bei Klasse 3 bis 13 sind das 5 bis 6 Paare, also etwa 50 bis 60 Pakete.
- Aufwand und Kosten je Sitzung kennen wir nicht; der Pilot soll das zeigen.
