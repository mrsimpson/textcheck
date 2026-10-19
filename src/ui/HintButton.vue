<script setup lang="ts">
// The button that takes the next hint. It waits: until the core's wait is over it is off and says in how many seconds
// the hint comes; after the last hint it says there are no more. A round without hints has no button. It holds no state
// of its own; the hint is an action the root component hands on.
import { computed } from "vue";
import type { Input } from "@lernapps/app-templates/interactive";
import type { State } from "../core/types.ts";
import { translatorOf } from "./messages.ts";

const props = defineProps<{ state: State; lang: string }>();
const emit = defineEmits<{ input: [input: Input] }>();
const t = translatorOf(props.lang);

const spent = computed(() => props.state.hintLevel >= props.state.hintStages.length);
const waiting = computed(() => !spent.value && props.state.hintWait > 0);
const label = computed(() =>
  spent.value
    ? t("tipNone")
    : waiting.value
      ? t("tipWait", { seconds: Math.ceil(props.state.hintWait / 1000) })
      : t("tip"),
);
</script>

<template>
  <button
    v-if="state.hintStages.length > 0"
    type="button"
    :disabled="spent || waiting"
    @click="emit('input', { kind: 'action', name: 'hint' })"
  >
    {{ label }}
  </button>
</template>
