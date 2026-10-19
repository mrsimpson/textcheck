<script setup lang="ts">
// What the hints taken so far say, one sentence each, in the order they were given; they stay until the round ends.
// The sentences with an error are marked in the texts themselves (see the prop `tags` of WordList).
import { computed } from "vue";
import type { State } from "../core/types.ts";
import { translatorOf } from "./messages.ts";
import { hintTextsOf } from "./hints.ts";

const props = defineProps<{ state: State; lang: string }>();
const t = translatorOf(props.lang);
const texts = computed(() => hintTextsOf(props.state, t));
</script>

<template>
  <ul v-if="texts.length > 0" class="tips" :aria-label="t('tip')">
    <li v-for="text in texts" :key="text">{{ text }}</li>
  </ul>
</template>

<style scoped>
.tips {
  margin: 0.75rem 0;
  padding: 0.6rem 1rem 0.6rem 1.75rem;
  border: 1px solid var(--tc-tol);
  border-radius: 8px;
  background: var(--tc-tol-bg);
  color: var(--tc-tol);
  font-size: 1rem;
  line-height: 1.5;
}
</style>
