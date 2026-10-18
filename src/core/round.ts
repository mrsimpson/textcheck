// Builds a round from a text pack: which slots are corrupted and with which variant (drawn from the seed within the
// limits of the level), and the words of the Fassung as learners see them.
import { ERROR_CLASSES } from "./data.ts";
import { random } from "./random.ts";
import type { Corruption, Level, TextPack, Token, Variant } from "./types.ts";

/** A slot with the variants the level allows for it. */
interface Candidate {
  slot: string;
  variants: Variant[];
}

/** The slots that have at least one variant of an allowed class and basis, for a pack of grades up to the level's. */
export function candidatesOf(pack: TextPack, level: Level): Candidate[] {
  const found: Candidate[] = [];
  for (const [slot, { variants: all }] of Object.entries(pack.slots)) {
    const variants = all.filter(
      (variant) =>
        level.classes.includes(variant.errorClass) &&
        level.bases.includes(variant.basis) &&
        (ERROR_CLASSES[variant.errorClass]?.fromGrade ?? Infinity) <= level.grades.to,
    );
    if (variants.length > 0) found.push({ slot, variants });
  }
  return found;
}

/** The slots to corrupt and the variant of each: a seeded shuffle of the candidates, the first `level.errors`. */
export function chooseVariants(candidates: Candidate[], level: Level, next: () => number): Map<string, Variant> {
  const shuffled = [...candidates];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const other = Math.floor(next() * (index + 1));
    const held = shuffled[index];
    const swap = shuffled[other];
    if (held !== undefined && swap !== undefined) {
      shuffled[index] = swap;
      shuffled[other] = held;
    }
  }
  const chosen = new Map<string, Variant>();
  for (const { slot, variants } of shuffled.slice(0, level.errors)) {
    const variant = variants[Math.floor(next() * variants.length)];
    if (variant !== undefined) chosen.set(slot, variant);
  }
  return chosen;
}

/**
 * The words of the rendition with each chosen slot in its wrong wording and every other slot in its correct one. A
 * word belongs to a slot when it overlaps the slot's text, so that punctuation next to a slot goes with it.
 */
export function tokensOf(pack: TextPack, chosen: ReadonlyMap<string, Variant>): Token[] {
  const tokens: Token[] = [];
  pack.rendition.forEach((entry, sentence) => {
    let text = "";
    const ranges: { slot: string; start: number; end: number }[] = [];
    for (const part of entry.sentence) {
      if (typeof part === "string") {
        text += part;
        continue;
      }
      const wording = chosen.get(part.slot)?.text ?? pack.slots[part.slot]?.correct ?? "";
      ranges.push({ slot: part.slot, start: text.length, end: text.length + wording.length });
      text += wording;
    }
    for (const word of text.matchAll(/\S+/g)) {
      const start = word.index;
      const end = start + word[0].length;
      const slot = ranges.find((range) => range.start < end && range.end > start)?.slot ?? null;
      tokens.push({ id: tokens.length, text: word[0], sentence, slot });
    }
  });
  return tokens;
}

/** The errors of the round, in the order their slots stand in the text. */
export function corruptionsOf(
  pack: TextPack,
  chosen: ReadonlyMap<string, Variant>,
  tokens: readonly Token[],
): Corruption[] {
  const order = (slot: string): number => tokens.find((token) => token.slot === slot)?.id ?? Infinity;
  return [...chosen.entries()]
    .map(([slot, variant]) => ({
      slot,
      errorClass: variant.errorClass,
      basis: variant.basis,
      text: variant.text.trim(),
      correct: pack.slots[slot]?.correct ?? "",
      tolerance: variant.tolerance ?? 0,
      explanation: variant.explanation,
      evidence: variant.evidence ?? null,
    }))
    .sort((a, b) => order(a.slot) - order(b.slot));
}

/** A round: the pack the seed picks among `packs`, its corrupted slots and its words. */
export function buildRound(packs: readonly TextPack[], level: Level, seed: number) {
  const next = random(seed);
  const pack = packs[Math.floor(next() * packs.length)];
  if (pack === undefined) throw new Error("no text pack for this level");
  const chosen = chooseVariants(candidatesOf(pack, level), level, next);
  const tokens = tokensOf(pack, chosen);
  return { pack, tokens, corruptions: corruptionsOf(pack, chosen, tokens) };
}
