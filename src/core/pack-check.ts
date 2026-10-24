// The checks of a text pack beyond its JSON schema: what a schema cannot say. Used by the unit tests over every pack
// in src/data/packs/ and by whoever writes a pack. Errors fail the build's tests; warnings are read and justified.
import { ERROR_CLASSES } from "./data.ts";
import { candidatesOf, classesOf, fits, KINDS, lengthStageOf, RESERVE, rulesOf, STAGES } from "./stages.ts";
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
  // the stage the text's length puts it in, for each kind of exercise: it needs places for the errors of the stage
  for (const kind of KINDS) {
    const stage = lengthStageOf(pack, kind);
    if (stage > STAGES[kind].length) continue;
    const available = candidatesOf(pack, classesOf(kind, stage)).length;
    const needed = rulesOf(kind, stage).errors;
    if (!fits(pack, kind, stage))
      warnings.push(
        `${kind}, stage ${stage} by its length: ${available} places for ${needed} errors (reserve ${RESERVE}) or too few of the classes the stage adds, it is not used there`,
      );
  }
  return { errors, warnings };
}
