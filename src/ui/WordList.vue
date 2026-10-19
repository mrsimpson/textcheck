<script setup lang="ts">
// The words of the Variante. While marking, they are one listbox with one tab stop: the arrow keys move between words
// and sentences, the space bar marks, a tap or click marks too. After checking, they show how each word counts, by
// colour and line style, with a hidden status text for screen readers. It holds no state of its own; every change is
// an action the root component hands on.
import { computed, ref } from "vue";
import type { Input } from "@lernapps/app-templates/interactive";
import type { Status, Token } from "../core/types.ts";
import { translatorOf } from "./messages.ts";

const props = defineProps<{
  tokens: readonly Token[];
  marked: readonly number[];
  cursor: number;
  checking: boolean;
  status: readonly Status[];
  label: string;
  lang: string;
}>();
const emit = defineEmits<{ input: [input: Input] }>();
const t = translatorOf(props.lang);
const list = ref<HTMLElement | null>(null);

/** The words grouped by sentence, each with its id. */
const sentences = computed(() => {
  const groups: Token[][] = [];
  for (const token of props.tokens) {
    const group = groups[groups.length - 1];
    if (group !== undefined && group[0]?.sentence === token.sentence) group.push(token);
    else groups.push([token]);
  }
  return groups;
});

const isMarked = (id: number): boolean => props.marked.includes(id);

const KEYS: Readonly<Record<string, string>> = {
  ArrowRight: "next",
  ArrowLeft: "prev",
  ArrowDown: "next-sentence",
  ArrowUp: "prev-sentence",
  Home: "first",
  End: "last",
};

function onKey(event: KeyboardEvent): void {
  const move = KEYS[event.key];
  if (move !== undefined) emit("input", { kind: "action", name: "move", value: move });
  else if (event.key === " " || event.key === "Enter")
    emit("input", { kind: "action", name: "toggle", value: props.cursor });
  else return;
  event.preventDefault();
  event.stopPropagation();
}

function onClick(id: number): void {
  emit("input", { kind: "action", name: "toggle", value: id });
  list.value?.focus();
}

const statusText = (status: Status): string =>
  status === "found"
    ? t("srFound")
    : status === "part"
      ? t("srPart")
      : status === "missed"
        ? t("srMissed")
        : status === "false"
          ? t("srFalse")
          : status === "tolerated"
            ? t("srTolerated")
            : "";

defineExpose({ focus: () => list.value?.focus() });
</script>

<template>
  <div
    v-if="!checking"
    ref="list"
    class="words"
    role="listbox"
    aria-multiselectable="true"
    tabindex="0"
    :aria-label="label"
    :aria-describedby="'words-hint'"
    :aria-activedescendant="`word-${cursor}`"
    @keydown="onKey"
  >
    <p v-for="group in sentences" :key="group[0]?.id">
      <span
        v-for="token in group"
        :id="`word-${token.id}`"
        :key="token.id"
        role="option"
        class="word"
        :class="{ marked: isMarked(token.id), active: token.id === cursor }"
        :aria-selected="isMarked(token.id)"
        @click="onClick(token.id)"
        >{{ token.text }}</span
      >
    </p>
  </div>
  <div v-else class="words" role="group" :aria-label="label">
    <p v-for="group in sentences" :key="group[0]?.id">
      <span v-for="token in group" :key="token.id" class="word checked" :class="status[token.id] ?? 'plain'"
        >{{ token.text
        }}<span v-if="statusText(status[token.id] ?? 'plain') !== ''" class="sr">
          {{ statusText(status[token.id] ?? "plain") }}</span
        ></span
      >
    </p>
  </div>
</template>

<style scoped>
.words p {
  margin: 0 0 0.6em;
  font-size: var(--tc-font-size);
  line-height: var(--tc-line-height);
  font-weight: var(--tc-font-weight);
  font-variation-settings: var(--tc-font-variation);
}

.words:focus-visible {
  outline: 2px solid var(--tc-accent);
  outline-offset: 4px;
  border-radius: 6px;
}

.word {
  display: inline-block;
  padding: 0 0.2em;
  margin: 0 0.05em;
  border-radius: 4px;
  cursor: pointer;
}

@media (pointer: coarse) {
  .word {
    min-height: 2.75rem;
    padding: 0 0.3em;
  }
}

.word:hover:not(.checked) {
  background: var(--tc-line);
}

.words:focus .word.active {
  outline: 3px solid var(--tc-accent);
  outline-offset: 1px;
}

.word.marked {
  background: var(--tc-mark);
  color: var(--tc-mark-ink);
  text-decoration: underline;
  text-decoration-thickness: 2px;
}

.checked {
  cursor: default;
}

.found {
  background: var(--tc-found-bg);
  color: var(--tc-found);
  text-decoration: underline;
}

.part {
  background: var(--tc-found-bg);
  color: var(--tc-found);
}

.missed {
  background: var(--tc-missed-bg);
  color: var(--tc-missed);
  text-decoration: underline dashed;
}

.false {
  background: var(--tc-false-bg);
  color: var(--tc-false);
  text-decoration: line-through;
}

.tolerated {
  background: var(--tc-tol-bg);
  color: var(--tc-tol);
  text-decoration: underline dotted;
}

.sr {
  position: absolute;
  left: -9999px;
}
</style>
