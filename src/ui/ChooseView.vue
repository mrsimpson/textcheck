<script setup lang="ts">
// The mode "Original erkennen": two texts, A and B, one of them the Original and the other the Variante with the
// errors; which is which stays hidden until checking. The learner picks the text that has the errors and marks the
// words there, like in the other modes. The two texts lie like sheets, one on top of the other, on every screen: the
// learner turns from one to the other and cannot compare them side by side. It holds no state of its own except which
// text is shown; the pick and the marks are actions the root component hands on.
import { computed, ref } from "vue";
import type { Input } from "@lernapps/app-templates/interactive";
import type { Side, State, Token } from "../core/types.ts";
import WordList from "./WordList.vue";
import { translatorOf } from "./messages.ts";

const props = defineProps<{ state: State; lang: string }>();
const emit = defineEmits<{ input: [input: Input] }>();
const t = translatorOf(props.lang);
const view = ref<"a" | "b">("a");
const words = ref<InstanceType<typeof WordList>[] | null>(null);

const checking = computed(() => props.state.phase === "result");

const texts = computed(() =>
  (["a", "b"] as const).map((side: Side) => {
    const isVariant = props.state.variantSide === side;
    return {
      side,
      name: t(side === "a" ? "textA" : "textB"),
      tokens: isVariant ? props.state.tokens : props.state.originalTokens,
      isVariant,
      chosen: props.state.choice === side,
    };
  }),
);

/** The sentences of a text as plain paragraphs. */
function sentencesOf(tokens: readonly Token[]): string[] {
  const grouped: string[][] = [];
  let sentence = -1;
  for (const token of tokens) {
    if (token.sentence !== sentence) {
      grouped.push([]);
      sentence = token.sentence;
    }
    grouped[grouped.length - 1]?.push(token.text);
  }
  return grouped.map((row) => row.join(" "));
}

defineExpose({ focus: () => words.value?.[0]?.focus() });
</script>

<template>
  <div class="choose">
    <div class="switch" role="group" :aria-label="t('view')">
      <button type="button" :aria-pressed="view === 'a'" @click="view = 'a'">{{ t("textA") }}</button>
      <button type="button" :aria-pressed="view === 'b'" @click="view = 'b'">{{ t("textB") }}</button>
    </div>
    <div class="panels" :data-view="view">
      <section
        v-for="text in texts"
        :key="text.side"
        class="panel"
        :class="text.side"
        :aria-labelledby="`text-${text.side}`"
      >
        <h2 :id="`text-${text.side}`">
          {{ text.name }}
          <template v-if="checking">– {{ text.isVariant ? t("isVariant") : t("isOriginal") }}</template>
        </h2>
        <h3 class="text-title">{{ state.title }}</h3>
        <WordList
          v-if="text.chosen"
          ref="words"
          :tokens="text.tokens"
          :marked="state.marked"
          :cursor="state.cursor"
          :checking="checking"
          :status="state.result?.status ?? []"
          :label="text.name"
          :lang="lang"
          @input="(input) => emit('input', input)"
        />
        <template v-else>
          <p v-for="(sentence, index) in sentencesOf(text.tokens)" :key="index" class="plain">{{ sentence }}</p>
        </template>
        <button
          v-if="!checking"
          type="button"
          class="pick"
          :aria-pressed="text.chosen"
          @click="emit('input', { kind: 'action', name: 'choose', value: text.side })"
        >
          {{ t("pick", { name: text.name }) }}
        </button>
      </section>
    </div>
    <div v-if="!checking" class="bar">
      <span aria-hidden="true">{{
        state.choice === null ? t("pickFirst") : t("marked", { count: state.marked.length })
      }}</span>
      <span class="buttons">
        <button
          type="button"
          :disabled="state.choice === null"
          @click="emit('input', { kind: 'action', name: 'clear' })"
        >
          {{ t("clear") }}
        </button>
        <button
          type="button"
          class="primary"
          :disabled="state.choice === null"
          @click="emit('input', { kind: 'action', name: 'check' })"
        >
          {{ t("check") }}
        </button>
      </span>
    </div>
  </div>
</template>

<style scoped>
.switch {
  position: relative;
  z-index: 1; /* above the sheet that turns: it swings out over the buttons and must not take their taps */
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.switch button,
.pick,
.buttons button {
  min-height: 2.75rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--tc-line);
  border-radius: 8px;
  background: var(--tc-card);
  color: var(--tc-ink);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.switch button {
  flex: 1;
}

.switch button[aria-pressed="true"],
.pick[aria-pressed="true"],
.buttons .primary {
  border-color: var(--tc-accent);
  background: var(--tc-accent);
  color: var(--tc-on-accent);
}

button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.pick {
  width: 100%;
  margin-top: 0.75rem;
}

/* two sheets: only one shows, the other is not in the page at all; the sheet that comes up turns over from its left
   edge */
.panels {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  perspective: 1600px;
}

.panels[data-view="b"] > .a,
.panels[data-view="a"] > .b {
  display: none;
}

.panels > .panel {
  transform-origin: left center;
  animation: turn 0.4s ease-out;
}

@keyframes turn {
  from {
    transform: rotateY(-80deg);
    opacity: 0.3;
    box-shadow: 0 0 2rem rgb(0 0 0 / 0.35);
  }

  to {
    transform: none;
    opacity: 1;
    box-shadow: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .panels > .panel {
    animation: none;
  }
}

.panel {
  padding: 0.75rem 1rem;
  border: 1px solid var(--tc-line);
  border-radius: 12px;
  background: var(--tc-card);
}

h2 {
  margin: 0 0 0.5rem;
  font-size: 1.05rem;
}

.text-title {
  margin: 0 0 0.5rem;
  font-size: 1.3rem;
  line-height: 1.3;
}

.plain {
  margin: 0 0 0.6em;
  font-size: 1.125rem;
  line-height: 1.8;
}

.bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.75rem;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>
