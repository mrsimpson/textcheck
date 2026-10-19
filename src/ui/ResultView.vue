<script setup lang="ts">
// The result of a round: the counts, the errors grouped by class (found or missed, how to detect it, what stands in
// the Variante and in the Original, why), the words marked wrongly or within tolerance, and the legend of the colours.
// It shows the core's result and emits "again" for the next round. Every error found: fireworks when no hint was taken,
// confetti when hints were; with hints, a sentence that encourages the next round without.
import { computed } from "vue";
import type { Input } from "@lernapps/app-templates/interactive";
import type { Result, Token } from "../core/types.ts";
import { translatorOf } from "./messages.ts";

const props = defineProps<{
  result: Result;
  tokens: readonly Token[];
  lang: string;
  choiceNote?: string | null;
  /** How many hints the learner took. */
  hints: number;
}>();
const emit = defineEmits<{ input: [input: Input] }>();
const t = translatorOf(props.lang);

const wordsWith = (status: string): string =>
  props.tokens
    .filter((_, index) => props.result.status[index] === status)
    .map((token) => `„${token.text}“`)
    .join(", ");
const wrongWords = computed(() => wordsWith("false"));
const toleratedWords = computed(() => wordsWith("tolerated"));
const allFound = computed(() => props.result.total > 0 && props.result.found === props.result.total);
// Fireworks: three bursts, each of sparks that fly out from a point and fade (nothing flashes); fixed by index, too.
const bursts = [
  { left: "22%", top: "30%", delay: "0s", hue: 20 },
  { left: "74%", top: "24%", delay: "0.5s", hue: 200 },
  { left: "48%", top: "42%", delay: "1s", hue: 320 },
].map((burst) => ({ ...burst, sparks: Array.from({ length: 14 }, (_, index) => `${index * (360 / 14)}deg`) }));
// Confetti pieces: fixed positions, delays and colours by index, so a round looks the same every time.
const pieces = Array.from({ length: 28 }, (_, index) => ({
  left: `${(index * 37) % 100}%`,
  delay: `${((index * 53) % 100) / 100}s`,
  hue: (index * 47) % 360,
  turn: `${(index % 2 === 0 ? 1 : -1) * (180 + ((index * 29) % 360))}deg`,
}));
</script>

<template>
  <section class="result" aria-labelledby="result-heading">
    <div v-if="allFound && hints === 0" class="fireworks" aria-hidden="true">
      <span
        v-for="(burst, index) in bursts"
        :key="index"
        class="burst"
        :style="{ left: burst.left, top: burst.top, '--hue': burst.hue }"
      >
        <i v-for="angle in burst.sparks" :key="angle" :style="{ '--angle': angle, animationDelay: burst.delay }"></i>
      </span>
    </div>
    <div v-if="allFound && hints > 0" class="confetti" aria-hidden="true">
      <span
        v-for="(piece, index) in pieces"
        :key="index"
        :style="{ left: piece.left, animationDelay: piece.delay, '--hue': piece.hue, '--turn': piece.turn }"
      ></span>
    </div>
    <h2 id="result-heading" tabindex="-1">{{ t("resultHeading") }}</h2>
    <p v-if="choiceNote" class="choice">{{ choiceNote }}</p>
    <p v-if="allFound" class="praise">{{ result.wrong === 0 ? t("praiseClean") : t("praiseAll") }}</p>
    <p v-if="hints > 0" class="praise">{{ t("praiseHints") }}</p>
    <p class="summary">
      {{ t("resultSummary", { found: result.found, total: result.total }) }}
      <template v-if="result.wrong > 0"> · {{ t("resultWrong", { count: result.wrong }) }}</template>
      <template v-if="result.tolerated > 0"> · {{ t("resultTolerated", { count: result.tolerated }) }}</template>
    </p>
    <section v-for="entry in result.classes" :key="entry.errorClass" class="class">
      <h3>
        {{
          t("classLine", { name: t(`errorClass.${entry.errorClass}` as never), found: entry.found, total: entry.total })
        }}
      </h3>
      <div v-for="item in entry.items" :key="item.slot" class="item">
        <p>
          <span class="state" :class="item.found ? 'got' : 'lost'">{{ item.found ? t("found") : t("missed") }}</span>
          <span class="chip">{{ t(`basis.${item.basis}` as never) }}</span>
        </p>
        <dl>
          <dt>{{ t("inRendition") }}</dt>
          <dd>„{{ item.text }}“</dd>
          <dt>{{ t("right") }}</dt>
          <dd>{{ item.correct === "" ? t("noOriginal") : `„${item.correct}“` }}</dd>
        </dl>
        <p class="explanation">{{ item.explanation }}</p>
      </div>
    </section>
    <p v-if="result.wrong > 0" class="note wrong">{{ t("wrongBox", { words: wrongWords }) }}</p>
    <p v-if="result.tolerated > 0" class="note tolerated">{{ t("toleratedBox", { words: toleratedWords }) }}</p>
    <ul class="legend" :aria-label="t('legend')">
      <li class="found">{{ t("legendFound") }}</li>
      <li class="part">{{ t("legendPart") }}</li>
      <li class="missed">{{ t("legendMissed") }}</li>
      <li class="false">{{ t("legendFalse") }}</li>
      <li class="tolerated">{{ t("legendTolerated") }}</li>
    </ul>
    <p>
      <button type="button" class="primary" @click="emit('input', { kind: 'action', name: 'again' })">
        {{ t("again") }}
      </button>
    </p>
  </section>
</template>

<style scoped>
.result {
  margin-top: 1rem;
}

h2 {
  font-size: 1.25rem;
}

h3 {
  margin: 0;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  border-bottom: 1px solid var(--tc-line);
}

.summary {
  font-weight: 600;
}

.class {
  margin: 0.75rem 0;
  border: 1px solid var(--tc-line);
  border-radius: 10px;
  background: var(--tc-card);
  overflow: hidden;
}

.item {
  padding: 0.5rem 0.75rem;
  border-top: 1px solid var(--tc-line);
}

.item:first-of-type {
  border-top: 0;
}

.state {
  padding: 0.1rem 0.5rem;
  border-radius: 6px;
  font-weight: 700;
}

.got {
  background: var(--tc-found-bg);
  color: var(--tc-found);
  text-decoration: underline;
}

.lost {
  background: var(--tc-missed-bg);
  color: var(--tc-missed);
  text-decoration: underline dashed;
}

.chip {
  margin-left: 0.4rem;
  padding: 0.05rem 0.5rem;
  border: 1px solid var(--tc-line);
  border-radius: 999px;
  color: var(--tc-muted);
  font-size: 0.8rem;
}

dl {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.1rem 0.75rem;
  margin: 0.4rem 0;
}

dt {
  color: var(--tc-muted);
}

dd {
  margin: 0;
}

.explanation {
  margin: 0.25rem 0 0;
}

.note {
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
}

.note.wrong {
  border-left: 6px solid var(--tc-false);
  background: var(--tc-false-bg);
  color: var(--tc-false);
}

.note.tolerated {
  border-left: 6px solid var(--tc-tol);
  background: var(--tc-tol-bg);
  color: var(--tc-tol);
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  padding: 0;
  margin: 0.75rem 0;
  list-style: none;
  font-size: 0.85rem;
}

.legend li {
  padding: 0.05rem 0.5rem;
  border-radius: 4px;
}

.legend .found {
  background: var(--tc-found-bg);
  color: var(--tc-found);
  text-decoration: underline;
}

.legend .part {
  background: var(--tc-found-bg);
  color: var(--tc-found);
}

.legend .missed {
  background: var(--tc-missed-bg);
  color: var(--tc-missed);
  text-decoration: underline dashed;
}

.legend .false {
  background: var(--tc-false-bg);
  color: var(--tc-false);
  text-decoration: line-through;
}

.legend .tolerated {
  background: var(--tc-tol-bg);
  color: var(--tc-tol);
  text-decoration: underline dotted;
}

.primary {
  padding: 0.6rem 1.2rem;
  min-height: 2.75rem;
  border: 0;
  border-radius: 8px;
  background: var(--tc-accent);
  color: var(--tc-on-accent);
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}
</style>

<style scoped>
.choice {
  margin: 0 0 0.75rem;
  padding: 0.6rem 0.8rem;
  border-left: 4px solid var(--tc-accent);
  background: var(--tc-card);
  font-weight: 700;
}

.praise {
  margin: 0 0 0.75rem;
  padding: 0.6rem 0.8rem;
  border-left: 4px solid var(--tc-found);
  background: var(--tc-found-bg);
  color: var(--tc-found);
  font-weight: 700;
}

.fireworks {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 10;
}

.burst {
  position: absolute;
  width: 0;
  height: 0;
}

.burst i {
  position: absolute;
  left: -0.25rem;
  top: -0.25rem;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: hsl(var(--hue) 85% 55%);
  opacity: 0;
  animation: spark 1.8s ease-out forwards;
}

@keyframes spark {
  0% {
    opacity: 0;
    transform: rotate(var(--angle)) translateX(0);
  }
  15% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: rotate(var(--angle)) translateX(min(9rem, 28vw));
  }
}

.confetti {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 10;
}

.confetti span {
  position: absolute;
  top: -1.5rem;
  width: 0.6rem;
  height: 1rem;
  border-radius: 2px;
  background: hsl(var(--hue) 80% 55%);
  animation: confetti-fall 2.8s ease-in forwards;
}

@keyframes confetti-fall {
  to {
    transform: translateY(105vh) rotate(var(--turn));
    opacity: 0.9;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fireworks,
  .confetti {
    display: none;
  }
}
</style>
