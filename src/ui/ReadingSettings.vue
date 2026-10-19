<script setup lang="ts">
// The settings for reading, folded away under one heading: the style of the font, its weight, the size and the line
// spacing, with a line of sample text and a button to go back to the defaults. It holds no state of its own; the root
// component gives it the settings and keeps what the learner changes.
import { computed } from "vue";
import { DEFAULT_READING, LIMITS, type FontStyle, type Reading } from "./reading.ts";
import { translatorOf } from "./messages.ts";

const props = defineProps<{ modelValue: Reading; lang: string }>();
const emit = defineEmits<{ "update:modelValue": [reading: Reading] }>();
const t = translatorOf(props.lang);

const styles: { id: FontStyle; label: string }[] = [
  { id: "normal", label: t("styleNormal") },
  { id: "round", label: t("styleRound") },
  { id: "mono", label: t("styleMono") },
];
const change = (patch: Partial<Reading>): void => emit("update:modelValue", { ...props.modelValue, ...patch });
const number = (event: Event): number => Number((event.target as HTMLInputElement).value);
const isDefault = computed(
  () =>
    props.modelValue.style === DEFAULT_READING.style &&
    props.modelValue.weight === DEFAULT_READING.weight &&
    props.modelValue.size === DEFAULT_READING.size &&
    props.modelValue.spacing === DEFAULT_READING.spacing,
);
</script>

<template>
  <details class="reading">
    <summary>{{ t("readingTitle") }}</summary>
    <div class="body">
      <fieldset>
        <legend>{{ t("fontStyle") }}</legend>
        <label v-for="style in styles" :key="style.id" class="choice">
          <input
            type="radio"
            name="font-style"
            :value="style.id"
            :checked="modelValue.style === style.id"
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
          :value="modelValue.weight"
          @input="change({ weight: number($event) })"
        />
      </label>
      <label class="slider">
        <span>{{ t("fontSize") }}</span>
        <input type="range" v-bind="LIMITS.size" :value="modelValue.size" @input="change({ size: number($event) })" />
      </label>
      <label class="slider">
        <span>{{ t("lineSpacing") }}</span>
        <input
          type="range"
          v-bind="LIMITS.spacing"
          :value="modelValue.spacing ?? 2.1"
          @input="change({ spacing: number($event) })"
        />
      </label>
      <p class="sample">{{ t("sample") }}</p>
      <button type="button" :disabled="isDefault" @click="emit('update:modelValue', { ...DEFAULT_READING })">
        {{ t("readingReset") }}
      </button>
    </div>
  </details>
</template>

<style scoped>
.reading {
  margin: 0 0 1rem;
  border: 1px solid var(--tc-line);
  border-radius: 8px;
  background: var(--tc-card);
}

summary {
  min-height: 2.75rem;
  padding: 0.6rem 0.8rem;
  box-sizing: border-box;
  font-weight: 600;
  cursor: pointer;
}

.body {
  display: grid;
  gap: 0.75rem;
  padding: 0 0.8rem 0.8rem;
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
  font-size: var(--tc-font-size);
  line-height: var(--tc-line-height);
  font-weight: var(--tc-font-weight);
  font-variation-settings: var(--tc-font-variation);
}

button {
  justify-self: start;
  min-height: 2.75rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--tc-line);
  border-radius: 8px;
  background: var(--tc-card);
  color: var(--tc-ink);
  font: inherit;
  cursor: pointer;
}

button:disabled {
  opacity: 0.55;
  cursor: default;
}
</style>
