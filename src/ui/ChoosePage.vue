<script setup lang="ts">
// The first page: what do you want to practise? One card for each kind of exercise, with the question it asks and what
// it is like. A card opens the stages of that kind. It holds no state of its own.
import { KINDS, stagesRoute } from "../core/stages.ts";
import { translatorOf } from "./messages.ts";

const props = defineProps<{ lang: string }>();
const emit = defineEmits<{ open: [route: string] }>();
const t = translatorOf(props.lang);
</script>

<template>
  <div class="choose">
    <h2 id="page-heading" tabindex="-1">{{ t("chooseLead") }}</h2>
    <div class="cards">
      <button
        v-for="kind in KINDS"
        :key="kind"
        type="button"
        class="card"
        :class="kind"
        @click="emit('open', stagesRoute(kind))"
      >
        <span class="tc-badge" :class="kind">{{ t(`kindShort.${kind}` as never) }}</span>
        <span class="name">{{ t(`kind.${kind}` as never) }}</span>
        <span class="question">{{ t(`question.${kind}` as never) }}</span>
        <span class="what">{{ t(`kindWhat.${kind}` as never) }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
h2 {
  margin: 0 0 1rem;
  font-size: 1.15rem;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 1rem;
}

.card {
  display: grid;
  gap: 0.5rem;
  align-content: start;
  justify-items: start;
  padding: 1rem 1.1rem;
  border: 1px solid var(--tc-line);
  border-top: 6px solid var(--tc-kind-text);
  border-radius: 12px;
  background: var(--tc-card);
  color: var(--tc-ink);
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.card.quelle {
  border-top-color: var(--tc-kind-quelle);
}

.card:hover {
  border-color: var(--tc-accent);
}

.name {
  font-size: 1.15rem;
  font-weight: 700;
}

.question {
  font-weight: 600;
}

.what {
  color: var(--tc-muted);
  font-size: 0.95rem;
}
</style>
