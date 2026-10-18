#!/usr/bin/env python3
"""Entwurf eines Prüfwerkzeugs für Textpakete (Python, ohne App). Später als TypeScript im Build.

Aufruf: python3 pruefe_textpaket.py <paket.yaml> [...]
Exit 0 = keine Fehler, 1 = mindestens ein Fehler. Warnungen ändern den Exit-Code nicht.
"""
import json, re, sys
from pathlib import Path
import yaml
from jsonschema import Draft202012Validator

HIER = Path(__file__).parent
SCHEMA = json.loads((HIER / "textpaket.v1.schema.json").read_text(encoding="utf-8"))
KLASSEN = yaml.safe_load((HIER / "klassen.yaml").read_text(encoding="utf-8"))


def norm(s):
    return re.sub(r"\s+", " ", s).strip()


def lix(text):
    woerter = re.findall(r"[\wÄÖÜäöüß-]+", text)
    saetze = max(1, len(re.findall(r"[.!?]+(?:\s|$)", text)))
    lang = sum(1 for w in woerter if len(w) > 6)
    return len(woerter), saetze, round(len(woerter) / saetze + 100 * lang / max(1, len(woerter)), 1)


def pruefe(pfad):
    fehler, warnungen = [], []
    p = yaml.safe_load(Path(pfad).read_text(encoding="utf-8"))
    for e in sorted(Draft202012Validator(SCHEMA).iter_errors(p), key=lambda e: list(e.path)):
        fehler.append(f"Schema: {'/'.join(map(str, e.path)) or '(Wurzel)'}: {e.message[:140]}")
    if fehler:
        return fehler, warnungen, None
    von, bis = p["klassen"]["von"], p["klassen"]["bis"]
    if bis < von or bis - von > 1:
        fehler.append(f"klassen: von {von} bis {bis} sind keine zwei benachbarten Klassenstufen")
    if p["id"] != Path(pfad).stem:
        warnungen.append(f"id '{p['id']}' ist nicht der Dateiname '{Path(pfad).stem}'")

    original = norm(" ".join(o["text"] for o in p["original"]))
    benutzt = []
    for i, s in enumerate(p["zusammenfassung"]):
        ids = [t["stelle"] for t in s["satz"] if isinstance(t, dict)]
        benutzt += ids
        richtig = norm("".join(t if isinstance(t, str) else p["stellen"].get(t["stelle"], {}).get("richtig", "") for t in s["satz"]))
        if richtig and "beleg" not in s:
            fehler.append(f"zusammenfassung[{i}]: Satz hat Text, aber keinen beleg")
        if "beleg" in s and norm(s["beleg"]["zitat"]) not in original:
            fehler.append(f"zusammenfassung[{i}]: beleg.zitat steht nicht wörtlich im Original")
    for sid in p["stellen"]:
        n = benutzt.count(sid)
        if n != 1:
            fehler.append(f"stelle '{sid}' kommt {n}-mal in der Zusammenfassung vor (muss genau 1-mal)")
    for sid in set(benutzt) - set(p["stellen"]):
        fehler.append(f"zusammenfassung verweist auf unbekannte stelle '{sid}'")

    klassen_vorhanden = set()
    for sid, st in p["stellen"].items():
        texte = [v["text"] for v in st["varianten"]]
        if len(set(texte)) != len(texte):
            fehler.append(f"stelle '{sid}': doppelte Variante")
        if st["richtig"] in texte:
            fehler.append(f"stelle '{sid}': eine Variante ist gleich der richtigen Fassung")
        for v in st["varianten"]:
            k = KLASSEN[v["klasse"]]
            klassen_vorhanden.add(v["klasse"])
            if k["ab_klasse"] > bis:
                fehler.append(f"stelle '{sid}': Klasse {v['klasse']} gehört erst ab Klasse {k['ab_klasse']} (Paket bis {bis})")
            if v["basis"] not in k["basis_typisch"]:
                warnungen.append(f"stelle '{sid}': basis '{v['basis']}' weicht vom Üblichen {k['basis_typisch']} für {v['klasse']} ab")
            if v["basis"] == "vergleich" and "beleg" not in v and v["klasse"] not in ("hinzugefuegt",):
                warnungen.append(f"stelle '{sid}': basis 'vergleich' ohne beleg")
            if "beleg" in v and norm(v["beleg"]) not in original:
                fehler.append(f"stelle '{sid}': beleg steht nicht wörtlich im Original")
            if "toleranz" in v:
                satz = next(s for s in p["zusammenfassung"] if any(isinstance(t, dict) and t["stelle"] == sid for t in s["satz"]))
                rest = norm("".join(t if isinstance(t, str) else "" for t in satz["satz"]))
                if not rest:
                    fehler.append(f"stelle '{sid}': toleranz, aber im selben Satz stehen keine Nachbarwörter")
                if len(v["text"].split()) < 3:
                    warnungen.append(f"stelle '{sid}': toleranz bei einer kurzen Stelle (unter 3 Wörter)")
            if re.search(r"\b(Experten sagen|alle wissen)\b", v["text"]) and v["klasse"] not in ("falsche_autoritaet", "verallgemeinerung"):
                warnungen.append(f"stelle '{sid}': Wortlaut passt zu einer anderen Klasse")
    if len(klassen_vorhanden) < 3:
        warnungen.append(f"nur {len(klassen_vorhanden)} verschiedene Fehlerklassen im Paket")
    if len(p["stellen"]) < 6:
        warnungen.append(f"nur {len(p['stellen'])} Stellen; für Runden mit mehreren Fehlern und Wechsel durch den Seed besser mehr")
    if not p.get("ist_beispiel") and not p["quelle"].get("pdf"):
        warnungen.append("keine lokale PDF der Quelle (nötig für den Modus Quellentreue)")
    w, s_, l = lix(original)
    return fehler, warnungen, {"woerter": w, "saetze": s_, "lix": l}


if __name__ == "__main__":
    rc = 0
    for f in sys.argv[1:]:
        fe, wa, lb = pruefe(f)
        print(f"== {f}")
        for x in fe:
            print("  FEHLER ", x)
        for x in wa:
            print("  Warnung", x)
        if lb:
            print(f"  Lesbarkeit (aus dem Original, berechnet): {lb['woerter']} Wörter, {lb['saetze']} Sätze, LIX {lb['lix']}")
        print("  =>", "nicht bestanden" if fe else "bestanden")
        rc |= 1 if fe else 0
    sys.exit(rc)
