<script setup lang="ts">
// What the app puts into the heading line of the page, where the runtime mounts it beside the h1 (the option `title`
// of startInteractive; it gets the props and the input event of the root component, and uses none of them): one small
// button "Schrift", and behind it a dialog for the settings for reading: the style of the font, its weight, the size
// and the line spacing, with a line of sample text and a button to go back to the defaults. The texts change while the
// learner sets; the settings are shared with the root component (reading.ts) and kept on the device.
import { computed, ref } from "vue";
import type { Input } from "@lernapps/app-templates/interactive";
import type { State } from "../core/index.ts";
import { DEFAULT_READING, LIMITS, reading, readingStyle, type FontStyle, type Reading } from "./reading.ts";
import { translatorOf } from "./messages.ts";

const props = defineProps<{ state: State; lang: string }>();
defineEmits<{ input: [input: Input] }>();
const t = translatorOf(props.lang);

const dialog = ref<HTMLDialogElement | null>(null);
const styles: { id: FontStyle; label: string }[] = [
  { id: "normal", label: t("styleNormal") },
  { id: "round", label: t("styleRound") },
  { id: "mono", label: t("styleMono") },
];
const change = (patch: Partial<Reading>): void => {
  reading.value = { ...reading.value, ...patch };
};
const number = (event: Event): number => Number((event.target as HTMLInputElement).value);
const isDefault = computed(
  () =>
    reading.value.style === DEFAULT_READING.style &&
    reading.value.weight === DEFAULT_READING.weight &&
    reading.value.size === DEFAULT_READING.size &&
    reading.value.spacing === DEFAULT_READING.spacing,
);
</script>

<template>
  <div class="controls" :style="readingStyle">
    <button type="button" class="open" aria-haspopup="dialog" @click="dialog?.showModal()">
      {{ t("readingButton") }}
    </button>
    <dialog ref="dialog" class="reading" aria-labelledby="reading-title">
      <h2 id="reading-title">{{ t("readingTitle") }}</h2>
      <div class="body">
        <fieldset>
          <legend>{{ t("fontStyle") }}</legend>
          <label v-for="style in styles" :key="style.id" class="choice">
            <input
              type="radio"
              name="font-style"
              :value="style.id"
              :checked="reading.style === style.id"
              @change="change({ style: style.id })"
            />
            {{ style.label }}
          </label>
        </fieldset>
        <label class="slider">
          <span>{{ t("fontWeight") }}</span>
          <input
            type="range"
            v-bind="LIMITS.weight"
            :value="reading.weight"
            @input="change({ weight: number($event) })"
          />
        </label>
        <label class="slider">
          <span>{{ t("fontSize") }}</span>
          <input type="range" v-bind="LIMITS.size" :value="reading.size" @input="change({ size: number($event) })" />
        </label>
        <label class="slider">
          <span>{{ t("lineSpacing") }}</span>
          <input
            type="range"
            v-bind="LIMITS.spacing"
            :value="reading.spacing ?? 2.1"
            @input="change({ spacing: number($event) })"
          />
        </label>
        <p class="sample">{{ t("sample") }}</p>
        <div class="buttons">
          <button type="button" :disabled="isDefault" @click="reading = { ...DEFAULT_READING }">
            {{ t("readingReset") }}
          </button>
          <button type="button" class="primary" @click="dialog?.close()">{{ t("readingDone") }}</button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<style scoped>
/* the controls stand outside the root component: the font and the colours are theirs to say */
.controls {
  font-family: "Recursive TC", system-ui, sans-serif;
  color: var(--tc-ink);
}

.open {
  min-height: 2.75rem;
  padding: 0.4rem 0.9rem;
  border: 1px solid var(--tc-line);
  border-radius: 8px;
  background: var(--tc-card);
  color: var(--tc-ink);
  font: inherit;
  font-size: 0.9rem;
  cursor: pointer;
}

.reading {
  width: min(28rem, calc(100vw - 2rem));
  box-sizing: border-box;
  padding: 1rem 1.25rem;
  border: 1px solid var(--tc-line);
  border-radius: 12px;
  background: var(--tc-card);
  color: var(--tc-ink);
}

.reading::backdrop {
  background: rgb(0 0 0 / 0.45);
}

h2 {
  margin: 0 0 0.75rem;
  font-size: 1.1rem;
}

.body {
  display: grid;
  gap: 0.75rem;
}

fieldset {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1.25rem;
  margin: 0;
  padding: 0;
  border: 0;
}

legend {
  padding: 0;
  margin-bottom: 0.25rem;
  font-weight: 600;
}

.choice {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 2.75rem;
}

.choice input {
  width: 1.25rem;
  height: 1.25rem;
}

.slider {
  display: grid;
  gap: 0.25rem;
  font-weight: 600;
}

.slider input {
  width: 100%;
  min-height: 2.75rem;
  margin: 0;
}

.sample {
  margin: 0;
  padding: 0.5rem 0.75rem;
  border-left: 4px solid var(--tc-line);
  font-size: var(--tc-font-size, 1.125rem);
  line-height: var(--tc-line-height, 2.1);
  font-weight: var(--tc-font-weight, 400);
  font-variation-settings: var(--tc-font-variation, "MONO" 0, "CASL" 0);
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: flex-end;
}

.buttons button {
  min-height: 2.75rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--tc-line);
  border-radius: 8px;
  background: var(--tc-card);
  color: var(--tc-ink);
  font: inherit;
  cursor: pointer;
}

.buttons .primary {
  border-color: var(--tc-accent);
  background: var(--tc-accent);
  color: var(--tc-on-accent);
  font-weight: 700;
}

.buttons button:disabled {
  opacity: 0.55;
  cursor: default;
}
</style>
