// Builds a round from a text pack: which slots are corrupted and with which variant (drawn from the seed within the
// rules of the stage), and the words of the rendition as learners see them.
import { random } from "./random.ts";
import { candidatesOf, MIN_NEW } from "./stages.ts";
import type { Corruption, HintSentence, StageRules, TextPack, Token, Variant } from "./types.ts";

/** A slot with the variants the stage allows for it. */
interface Candidate {
  slot: string;
  variants: Variant[];
}

/** A seeded shuffle of a copy of the list. */
function shuffled<T>(list: readonly T[], next: () => number): T[] {
  const copy = [...list];
  for (let index = copy.length - 1; index > 0; index--) {
    const other = Math.floor(next() * (index + 1));
    const held = copy[index];
    const swap = copy[other];
    if (held !== undefined && swap !== undefined) {
      copy[index] = swap;
      copy[other] = held;
    }
  }
  return copy;
}

/**
 * The slots to corrupt and the variant of each: a seeded shuffle of the candidates. At least `MIN_NEW` errors (fewer if the
 * stage has fewer errors) are of the classes the stage adds, so that every round shows what is new in the stage; the
 * rest are of any class of the stage.
 */
export function chooseVariants(
  pack: TextPack,
  classes: readonly string[],
  rules: StageRules,
  next: () => number,
): Map<string, Variant> {
  const all: Candidate[] = candidatesOf(pack, classes);
  const fresh = shuffled(
    all.filter(({ variants }) => variants.some((variant) => rules.adds.includes(variant.errorClass))),
    next,
  ).slice(0, Math.min(MIN_NEW, rules.errors));
  const rest = shuffled(
    all.filter((candidate) => !fresh.includes(candidate)),
    next,
  ).slice(0, rules.errors - fresh.length);
  const chosen = new Map<string, Variant>();
  for (const candidate of [...fresh, ...rest]) {
    const pool = fresh.includes(candidate)
      ? candidate.variants.filter((variant) => rules.adds.includes(variant.errorClass))
      : candidate.variants;
    const variant = pool[Math.floor(next() * pool.length)];
    if (variant !== undefined) chosen.set(candidate.slot, variant);
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
export function buildRound(packs: readonly TextPack[], classes: readonly string[], rules: StageRules, seed: number) {
  const next = random(seed);
  const pack = packs[Math.floor(next() * packs.length)];
  if (pack === undefined) throw new Error("no text pack for this stage");
  const chosen = chooseVariants(pack, classes, rules, next);
  const tokens = tokensOf(pack, chosen);
  return { pack, tokens, corruptions: corruptionsOf(pack, chosen, tokens) };
}

/**
 * The sentences a hint may point to: those of the rendition with an error whose sentence says something the source says
 * (it has an evidence quote). A sentence without a quote is inserted; pointing at it would give away that something was
 * added, so it is left out.
 */
export function hintSentencesOf(
  pack: TextPack,
  corruptions: readonly Corruption[],
  tokens: readonly Token[],
): HintSentence[] {
  const found = new Map<number, HintSentence>();
  for (const corruption of corruptions) {
    const sentence = tokens.find((token) => token.slot === corruption.slot)?.sentence;
    if (sentence === undefined || pack.rendition[sentence]?.evidence === undefined) continue;
    const held = found.get(sentence) ?? { sentence, classes: [] };
    if (!held.classes.includes(corruption.errorClass)) held.classes.push(corruption.errorClass);
    found.set(sentence, held);
  }
  return [...found.values()].sort((a, b) => a.sentence - b.sentence);
}
