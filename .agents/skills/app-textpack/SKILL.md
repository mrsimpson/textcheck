---
name: app-textpack
description: Use when you write a new text pack for Textcheck - research a source, draft the rendition, build error slots from the error patterns, save the source as PDF and hand the pack in. Content authoring only; for one pair of adjacent school years, one topic, one language. The content guide app-content takes precedence.
---

# Write a text pack

You deliver one pack: a source excerpt, a faithful rendition of it ("Variante"), and slots where errors can be built
in. You do not select errors; that happens later, by seed. You do not change code.

Pack = **two adjacent school years** + **one topic** + **one language** + **one source**. Code, ids, file names: English.
Everything learners read: in the pack's language. Terms: Original, Variante (never "Zusammenfassung"); see `app-content`.

## Workflow

Do the steps in order. Read the reference when you reach the step.

1. **Brief.** Get school years, topic (or choose one that fits the age), pack id (lowercase, hyphens), language. Read
   `src/data/levels.json` for the allowed error classes, bases and errors per round of these school years.
2. **Research** - [references/research.md](references/research.md). Find a source you may reuse, open it completely,
   fix the revision, note licence and authors. No source read in full, no pack.
3. **Draft** - [references/drafting.md](references/drafting.md). Choose the excerpt, write the rendition sentence by
   sentence with evidence quotes. Length and wording fit the school years.
4. **Error slots** - [references/error-patterns.md](references/error-patterns.md). Pick places, build several
   variants per place from the patterns of the allowed classes; write explanations.
5. **Check** - `npx vp test run src/core/pack-check.test.ts` (schema + pack checks). Then do what no check does:
   compare excerpt and quotes with the opened source (`verified: true` only after that), and read each variant in its
   sentence aloud. Never weaken a check.
6. **Source PDF** - [references/pdf.md](references/pdf.md). Only if the assignment asks for it or the mode Quellentreue
   exists; the script is `scripts/source-pdf.mjs`.
7. **Hand in.** File `src/data/packs/<language>/<from>-<to>/<id>.json` (id = file name). Add a line to
   `.vibe/texts-log.md`. Branch `text/<id>`, no merge into `work`. Report: source and revision, check result,
   warnings, what you could not verify, what reads badly.

Format: schema `src/data/textpack.v1.schema.json`, example `src/data/packs/de/5-6/fledermaeuse.json`. Copy the
structure from there; do not describe or re-invent it.

## Never

- Never invent a number, name, date or quote. Everything comes from the opened source.
- Never write a pack from memory or from a search snippet.
- No real people (learners, teachers, schools). No real propaganda or incitement in the stance classes; harmless
  topics only.
- Never circumvent a block (403, 429, captcha, paywall): wait, report, choose another source.
- Never write a class that the school years do not allow, never loosen a check to get a pack through.
