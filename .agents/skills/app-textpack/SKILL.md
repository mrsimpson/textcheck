---
name: app-textpack
description: Use when you write a new text pack for Textcheck - research a source, draft the rendition, build error slots from the error patterns, save the source as PDF and hand the pack in. Content authoring only; one topic, one language, one source; the stage of the pack follows from its length. The content guide app-content takes precedence.
---

# Write a text pack

You deliver one pack: a source excerpt, a faithful rendition of it (learners see it as "Text" in the exercise without a source and as "Wiedergabe" in the comparison with a source), and slots where errors can be built
in. You do not select errors; that happens later, by seed. You do not change code.

Pack = **one topic** + **one language** + **one source**. The stage of a pack comes from its measured length (words of the
rendition against `maxWords` in `src/data/stages.json`) and from the places it has for the error classes of the stage; there
is no school year in a pack. Code, ids, file names: English. Everything learners read: in the pack's language. Terms: Quelle
(the excerpt), Wiedergabe, Text (never "Original", "Variante", "Zusammenfassung"); see `app-content`.

## Workflow

Do the steps in order. Read the reference when you reach the step.

1. **Brief.** Get the age of the readers, the stage the pack is meant for (short, medium or long text), topic (or choose
   one that fits the age), pack id (lowercase, hyphens), language. Read `src/data/stages.json` for the error classes,
   the errors per round and the length limit of each stage.
2. **Research** - [references/research.md](references/research.md). Find a source you may reuse, open it completely,
   fix the revision, note licence and authors. No source read in full, no pack.
3. **Draft** - [references/drafting.md](references/drafting.md). Choose the excerpt (it begins with the introduction of
   the article; the pack's `title` is the heading), write the rendition sentence by sentence with evidence quotes.
   Length fits the stage; wording fits the age of the readers.
4. **Error slots** - [references/error-patterns.md](references/error-patterns.md). Pick places, build several
   variants per place from the patterns of the allowed classes; write explanations.
5. **Check** - `npx vp test run src/core/pack-check.test.ts` (schema + pack checks) and
   `node .agents/skills/app-textpack/scripts/check-lead.mjs <pack.json>` (the text begins with the introduction). Then do what no check does:
   compare excerpt and quotes with the opened source (`verified: true` only after that), and read each variant in its
   sentence aloud. Never weaken a check.
6. **Source PDF** - [references/pdf.md](references/pdf.md). Kept as a reserve for the day the article changes or goes away:
   `public/quellen/<language>/<id>.pdf` and `source.pdf` in the pack; the script is `scripts/source-pdf.mjs`.
7. **Hand in.** File `src/data/packs/<language>/<id>.json` (id = file name). Add a line to
   `.vibe/texts-log.md`. Branch `text/<id>`, no merge into `work`. Report: source and revision, check result,
   warnings, what you could not verify, what reads badly.

Format: schema `src/data/textpack.v1.schema.json`, example `src/data/packs/de/fledermaeuse.json`. Copy the
structure from there; do not describe or re-invent it.

## Never

- Never invent a number, name, date or quote. Everything comes from the opened source.
- Never write a pack from memory or from a search snippet.
- No real people (learners, teachers, schools). No real propaganda or incitement in the stance classes; harmless
  topics only.
- Never circumvent a block (403, 429, captcha, paywall): wait, report, choose another source.
- Never write a class that `src/data/error-classes.json` does not have, never loosen a check to get a pack through.
