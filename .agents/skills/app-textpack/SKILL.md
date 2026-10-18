---
name: app-textpack
description: Use when you create a new text pack for Textcheck - a source excerpt, a rendition of it in sentences, and slots with the correct wording and several wrong variants - for one pair of adjacent school years, one topic and one language. The content guide app-content takes precedence.
---

# Create a text pack

A text pack belongs to **two adjacent school years**, **one topic** and **one language**. At run time a seed decides which slots are corrupted and with which variant. You deliver the data, not the selection.

## Language

- Code, file names, schema keys and ids are English.
- All learner-facing text in the pack (title, topic, excerpt, rendition, slot texts, explanations) is written in the pack's `language`. Version 1 ships German (`de`) only; the format and the app support more languages.
- Spelling classes follow German orthography (see `src/data/error-classes.json`, `languages`). For another language, review the classes first and say so in `notes`; do not reuse them silently.
- Learner-facing names of error classes and of the detection basis live in the message files (`src/messages/<language>.json`), not in the pack.

## Inputs (from the assignment)

- School years (`from`, `to`), topic, pack id (lowercase with hyphens), language.
- Optionally a source. Without one, pick a page you can open and read completely.

## Steps

1. **Open and read the source.** Only sources with a licence listed in the schema (`source.license`). For Wikipedia use a fixed revision. Never write from memory. On HTTP 429 wait and report it; no scraper, no loops.
2. **Excerpt.** Verbatim and unchanged, sentence by sentence. Length and sentence structure fit the school years. Guide values per school-year pair are fixed after the pilot; the pilot pack has ten sentences.
3. **Rendition.** The text learners check, in your own words, sentence by sentence and faithful to the excerpt. It is not a summary unless the assignment says so. Every sentence with text gets `evidence.quote`: the verbatim passage of the excerpt that supports it. Only claims the excerpt supports.
4. **Slots.** A slot is a word or phrase of the rendition with a `correct` wording and at least one wrong variant.
   - Each variant has `errorClass`, `basis`, `conspicuousness` (1 to 3) and `explanation`. Classes only from `src/data/error-classes.json`, only those with `fromGrade` up to the upper school year of the pack.
   - `basis`: `text` (detectable in the text alone), `comparison` (only by comparing with the excerpt; give `evidence`), `prior_knowledge`.
   - Several variants per slot where it makes sense: this keeps rounds unpredictable.
   - Enough slots: at least 3 error classes, and at least the number of errors a round needs for these years, plus three in reserve.
   - Long slots (three words or more) get `tolerance` (neighbouring words), but only when the same sentence has words next to the slot. Single words get none.
   - A slot with `correct: ""` inserts a sentence (for example an opinion stated as fact). It stands in a sentence of its own.
5. **Explanations** in plain language for the school years, quoting the excerpt. For classes of the families `logic` and `stance`, name the technique and explain it briefly.
6. **Family `stance`:** harmless topics only. No real propaganda, no incitement against groups, no names of real learners.
7. **Check:** `npx vp test run src/core/pack-check.test.ts` must pass: the schema (`src/data/textpack.v1.schema.json`) and the pack checks (`src/core/pack-check.ts`). To read the warnings, call `checkPack(pack)` in a scratch test. Justify warnings in `notes`.
8. **Secure the source (not version 1):** a PDF of the source at the fixed revision for the mode source fidelity comes with that mode; then add licence, author link and the note "unchanged" to the cover page.

## Hand-in

- File `src/data/packs/<language>/<from>-<to>/<id>.json`; the id equals the file name. Add a line to `.vibe/texts-log.md`.
- Branch `text/<id>`; do not merge into `work`.
- Report to the requester: source and revision, check result, warnings, uncertainties, what you could not verify.
- Play it: `app/?seed=<n>#klasse-<from>-<to>` with several seeds, as a learner would, and note what reads badly (a grammatical slip after a variant, a sentence that depends on another).

## Never

- Never invent. No number, name or quote that you did not find in the opened source.
- No statements about curricula you have not read.
- No names, classes or schools of real learners.
- Never weaken a check to get a pack through.

## Learned the hard way

- A variant must keep the sentence grammatical: if a slot's variant is a number, include the noun it agrees with in the slot ("ein Jungtier" to "zwei Jungtiere", not "ein" to "zwei" before "Jungtier").
- A variant that creates an obvious contradiction with another slot of the pack will also be flagged when the other slot is not corrupted; make the contradiction hold either way.
- Only claims the source supports. The pilot pack checks the Fassung against its source, not the source against biology.
