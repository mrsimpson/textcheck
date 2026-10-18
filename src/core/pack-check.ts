// The checks of a text pack beyond its JSON schema: what a schema cannot say. Used by the unit tests over every pack
// in src/data/packs/ and by whoever writes a pack. Errors fail the build's tests; warnings are read and justified.
import { ERROR_CLASSES, LEVELS } from "./data.ts";
import { candidatesOf } from "./round.ts";
import type { TextPack } from "./types.ts";

export interface PackReport {
  errors: string[];
  warnings: string[];
}

const squeeze = (text: string): string => text.replace(/\s+/g, " ").trim();

/** The sentence of the rendition with every slot in its correct wording, without the slot named `skip`. */
function around(pack: TextPack, sentence: number, skip: string): string {
  const parts = pack.rendition[sentence]?.sentence ?? [];
  return squeeze(parts.map((part) => (typeof part === "string" ? part : "")).join(" ")) + (skip === "" ? "" : "");
}

export function checkPack(pack: TextPack): PackReport {
  const errors: string[] = [];
  const warnings: string[] = [];
  const { from, to } = pack.grades;
  const upperSchool = from === 11 && to === 13; // the Oberstufe is one pack range
  if (to < from || (to - from > 1 && !upperSchool))
    errors.push(`grades ${from} to ${to} are not two adjacent school years (or the Oberstufe 11 to 13)`);
  if (pack.isExample === true) errors.push("an example pack does not belong in src/data/packs");

  const excerpt = squeeze(pack.excerpt.map((entry) => entry.text).join(" "));
  const used: string[] = [];
  pack.rendition.forEach((entry, index) => {
    for (const part of entry.sentence) if (typeof part !== "string") used.push(part.slot);
    const correct = squeeze(
      entry.sentence.map((part) => (typeof part === "string" ? part : (pack.slots[part.slot]?.correct ?? ""))).join(""),
    );
    if (correct !== "" && entry.evidence === undefined)
      errors.push(`rendition[${index}]: the sentence has no evidence`);
    if (entry.evidence !== undefined && !excerpt.includes(squeeze(entry.evidence.quote)))
      errors.push(`rendition[${index}]: evidence.quote is not verbatim in the excerpt`);
  });
  for (const slot of Object.keys(pack.slots)) {
    const times = used.filter((other) => other === slot).length;
    if (times !== 1) errors.push(`slot ${slot} stands ${times} times in the rendition (must be exactly once)`);
  }
  for (const slot of new Set(used))
    if (pack.slots[slot] === undefined) errors.push(`unknown slot ${slot} in the rendition`);

  const classes = new Set<string>();
  for (const [name, slot] of Object.entries(pack.slots)) {
    const texts = slot.variants.map((variant) => variant.text);
    if (new Set(texts).size !== texts.length) errors.push(`slot ${name}: a variant stands twice`);
    if (texts.includes(slot.correct)) errors.push(`slot ${name}: a variant equals the correct wording`);
    for (const variant of slot.variants) {
      const info = ERROR_CLASSES[variant.errorClass];
      classes.add(variant.errorClass);
      if (info === undefined) {
        errors.push(`slot ${name}: unknown error class ${variant.errorClass}`);
        continue;
      }
      if (info.fromGrade > to)
        errors.push(`slot ${name}: ${variant.errorClass} starts at grade ${info.fromGrade}, the pack ends at ${to}`);
      if (!info.languages.includes(pack.language))
        errors.push(`slot ${name}: ${variant.errorClass} is not reviewed for the language ${pack.language}`);
      if (!info.usualBasis.includes(variant.basis))
        warnings.push(
          `slot ${name}: basis ${variant.basis} is not the usual ${info.usualBasis.join(" or ")} of ${variant.errorClass}`,
        );
      if (variant.basis === "comparison" && variant.evidence === undefined && variant.errorClass !== "added_claim")
        warnings.push(`slot ${name}: basis comparison without evidence`);
      if (variant.evidence !== undefined && !excerpt.includes(squeeze(variant.evidence)))
        errors.push(`slot ${name}: evidence is not verbatim in the excerpt`);
      if (variant.tolerance !== undefined) {
        const sentence = pack.rendition.findIndex((entry) =>
          entry.sentence.some((part) => typeof part !== "string" && part.slot === name),
        );
        if (around(pack, sentence, name) === "")
          errors.push(`slot ${name}: tolerance, but the sentence has no neighbouring words`);
        if (variant.text.trim().split(/\s+/).length < 3)
          warnings.push(`slot ${name}: tolerance on a slot of fewer than three words`);
      }
    }
  }
  if (classes.size < 3) warnings.push(`only ${classes.size} different error classes`);
  for (const [route, level] of Object.entries(LEVELS)) {
    if (level.grades.from !== from || level.grades.to !== to) continue;
    const available = candidatesOf(pack, level).length;
    if (available < level.errors)
      errors.push(`route ${route} needs ${level.errors} errors, the pack offers ${available} slots`);
    else if (available < level.errors + 3)
      warnings.push(`route ${route}: only ${available} slots for ${level.errors} errors, add reserve`);
    // the mode Original erkennen builds no errors of the form family (the Variante would be given away)
    const compared = candidatesOf(pack, {
      ...level,
      classes: level.classes.filter((name) => ERROR_CLASSES[name]?.family !== "form"),
    }).length;
    if (compared < level.errors)
      errors.push(
        `route ${route}-original needs ${level.errors} errors, the pack offers ${compared} slots without form`,
      );
    else if (compared < level.errors + 2)
      warnings.push(
        `route ${route}-original: only ${compared} slots without form for ${level.errors} errors, add reserve`,
      );
  }
  return { errors, warnings };
}
