#!/usr/bin/env python3
"""Draft checker for text packs (Python, outside the app). Later a TypeScript step in the build.

Usage: python3 check_textpack.py <pack.yaml> [...]
Exit 0 = no errors, 1 = at least one error. Warnings do not change the exit code.
"""
import json
import re
import sys
from pathlib import Path

import yaml
from jsonschema import Draft202012Validator

HERE = Path(__file__).parent
SCHEMA = json.loads((HERE / "textpack.v1.schema.json").read_text(encoding="utf-8"))
CLASSES = yaml.safe_load((HERE / "error-classes.yaml").read_text(encoding="utf-8"))


def norm(s):
    return re.sub(r"\s+", " ", s).strip()


def lix(text):
    words = re.findall(r"[\wÄÖÜäöüß-]+", text)
    sentences = max(1, len(re.findall(r"[.!?]+(?:\s|$)", text)))
    long_words = sum(1 for w in words if len(w) > 6)
    return len(words), sentences, round(len(words) / sentences + 100 * long_words / max(1, len(words)), 1)


def correct_text(sentence, slots):
    return norm("".join(t if isinstance(t, str) else slots.get(t["slot"], {}).get("correct", "") for t in sentence))


def check(path):
    errors, warnings = [], []
    pack = yaml.safe_load(Path(path).read_text(encoding="utf-8"))
    for e in sorted(Draft202012Validator(SCHEMA).iter_errors(pack), key=lambda e: list(e.path)):
        errors.append(f"schema: {'/'.join(map(str, e.path)) or '(root)'}: {e.message[:140]}")
    if errors:
        return errors, warnings, None
    lo, hi = pack["grades"]["from"], pack["grades"]["to"]
    if hi < lo or hi - lo > 1:
        errors.append(f"grades: {lo} to {hi} are not two adjacent school years")
    if pack["id"] != Path(path).stem:
        warnings.append(f"id '{pack['id']}' differs from the file name '{Path(path).stem}'")

    excerpt = norm(" ".join(x["text"] for x in pack["excerpt"]))
    used = []
    for i, s in enumerate(pack["rendition"]):
        used += [t["slot"] for t in s["sentence"] if isinstance(t, dict)]
        if correct_text(s["sentence"], pack["slots"]) and "evidence" not in s:
            errors.append(f"rendition[{i}]: sentence has text but no evidence")
        if "evidence" in s and norm(s["evidence"]["quote"]) not in excerpt:
            errors.append(f"rendition[{i}]: evidence.quote is not verbatim in the excerpt")
    for sid in pack["slots"]:
        n = used.count(sid)
        if n != 1:
            errors.append(f"slot '{sid}' appears {n} times in the rendition (must be exactly once)")
    for sid in set(used) - set(pack["slots"]):
        errors.append(f"rendition refers to unknown slot '{sid}'")

    seen_classes = set()
    for sid, slot in pack["slots"].items():
        texts = [v["text"] for v in slot["variants"]]
        if len(set(texts)) != len(texts):
            errors.append(f"slot '{sid}': duplicate variant")
        if slot["correct"] in texts:
            errors.append(f"slot '{sid}': a variant equals the correct wording")
        for v in slot["variants"]:
            c = CLASSES[v["errorClass"]]
            seen_classes.add(v["errorClass"])
            if c["fromGrade"] > hi:
                errors.append(f"slot '{sid}': class {v['errorClass']} starts at grade {c['fromGrade']} (pack goes to {hi})")
            if pack["language"] not in c["languages"]:
                errors.append(f"slot '{sid}': class {v['errorClass']} is not reviewed for language '{pack['language']}'")
            if v["basis"] not in c["usualBasis"]:
                warnings.append(f"slot '{sid}': basis '{v['basis']}' differs from the usual {c['usualBasis']} for {v['errorClass']}")
            if v["basis"] == "comparison" and "evidence" not in v and v["errorClass"] != "added_claim":
                warnings.append(f"slot '{sid}': basis 'comparison' without evidence")
            if "evidence" in v and norm(v["evidence"]) not in excerpt:
                errors.append(f"slot '{sid}': evidence is not verbatim in the excerpt")
            if "tolerance" in v:
                sentence = next(s for s in pack["rendition"] if any(isinstance(t, dict) and t["slot"] == sid for t in s["sentence"]))
                if not norm("".join(t for t in sentence["sentence"] if isinstance(t, str))):
                    errors.append(f"slot '{sid}': tolerance, but the sentence has no neighbouring words")
                if len(v["text"].split()) < 3:
                    warnings.append(f"slot '{sid}': tolerance on a short slot (under 3 words)")
    if len(seen_classes) < 3:
        warnings.append(f"only {len(seen_classes)} different error classes in the pack")
    if len(pack["slots"]) < 6:
        warnings.append(f"only {len(pack['slots'])} slots; more slots give more variation between seeds")
    if not pack.get("isExample") and not pack["source"].get("pdf"):
        warnings.append("no local PDF of the source (needed for the source fidelity mode)")
    w, s_, l = lix(excerpt)
    return errors, warnings, {"words": w, "sentences": s_, "lix": l}


if __name__ == "__main__":
    rc = 0
    for f in sys.argv[1:]:
        errs, warns, read = check(f)
        print(f"== {f}")
        for x in errs:
            print("  ERROR  ", x)
        for x in warns:
            print("  warning", x)
        if read:
            print(f"  readability (computed from the excerpt): {read['words']} words, {read['sentences']} sentences, LIX {read['lix']}")
        print("  =>", "failed" if errs else "passed")
        rc |= 1 if errs else 0
    sys.exit(rc)
