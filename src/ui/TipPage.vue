<script setup lang="ts">
// The reading tip before a round: the question the exercise asks and how to read for it. A stage with the full tip shows
// all of it, one with the short tip only the last line. It holds no state of its own; "begin" starts the round.
import { computed } from "vue";
import type { Input } from "@lernapps/app-templates/interactive";
import { classesOf, stagesRoute } from "../core/stages.ts";
import type { State } from "../core/types.ts";
import { translatorOf } from "./messages.ts";
import { questionOf, tipLines } from "./reading-tip.ts";

const props = defineProps<{ state: State; lang: string }>();
const emit = defineEmits<{ input: [input: Input]; open: [route: string] }>();
const t = translatorOf(props.lang);
const kind = computed(() => props.state.kind ?? "text");
const stage = computed(() => props.state.stage ?? 1);
const lines = computed(() => tipLines(kind.value, props.state.rules?.tip ?? "full"));
</script>

<template>
  <div class="tip">
    <button type="button" class="tc-back" @click="emit('open', stagesRoute(kind))">{{ t("backToStages") }}</button>
    <p>
      <span class="tc-badge" :class="kind">
        {{ t(`kindShort.${kind}` as never) }} · {{ t(`stageTitle.${stage}` as never) }}
      </span>
    </p>
    <h2 id="page-heading" tabindex="-1">{{ t("tipHeading") }}</h2>
    <div class="box">
      <p class="question">{{ questionOf(t, kind, classesOf(kind, stage)) }}</p>
      <p v-if="lines.length === 1">{{ t(lines[0] as never) }}</p>
      <ol v-else>
        <li v-for="line in lines" :key="line">{{ t(line as never) }}</li>
      </ol>
    </div>
    <p>
      <button type="button" class="tc-btn primary" @click="emit('input', { kind: 'action', name: 'begin' })">
        {{ t("tipGo") }}
      </button>
    </p>
  </div>
</template>

<style scoped>
h2 {
  margin: 0 0 0.75rem;
  font-size: 1.3rem;
}

.box {
  margin: 0 0 1rem;
  padding: 1rem 1.1rem;
  border: 1px solid var(--tc-line);
  border-radius: 12px;
  background: var(--tc-card);
}

.box p,
.box ol {
  margin: 0 0 0.6rem;
}

.box ol {
  padding-left: 1.3rem;
}

.question {
  font-size: 1.2rem;
  font-weight: 700;
}
</style>
