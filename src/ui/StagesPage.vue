<script setup lang="ts">
// The stages of one kind of exercise. Each card says what the stage holds, all of it derived from the core's cards: how
// long the texts are, how many errors a round has, which kinds of error occur (the ones the stage adds are marked as
// new) and what help there is. A tick shows a stage the learner has passed. It holds no state of its own.
import { computed } from "vue";
import type { State, StageCard } from "../core/types.ts";
import { passed, clearPassed } from "./progress.ts";
import { translatorOf } from "./messages.ts";

const props = defineProps<{ state: State; lang: string }>();
const emit = defineEmits<{ open: [route: string] }>();
const t = translatorOf(props.lang);
const kind = computed(() => props.state.kind ?? "text");

const help = (card: StageCard): string =>
  [
    t(`helpTip.${card.tip}` as never),
    card.material === "none" ? "" : t(`helpMaterial.${card.material}` as never),
    t(card.announce ? "helpNamed" : "helpHidden"),
  ]
    .filter((part) => part !== "")
    .join(" ");

const anyPassed = computed(() => props.state.cards.some((card) => passed.value.includes(card.route)));
</script>

<template>
  <div class="stages">
    <button type="button" class="tc-back" @click="emit('open', 'start')">{{ t("backToChoose") }}</button>
    <p>
      <span class="tc-badge" :class="kind">{{ t(`kindShort.${kind}` as never) }}</span>
    </p>
    <h2 id="page-heading" tabindex="-1">{{ t(`kind.${kind}` as never) }}</h2>
    <p class="lead">{{ t("stagesLead") }}</p>
    <article v-for="card in state.cards" :key="card.route" class="card" :aria-labelledby="`stage-${card.stage}`">
      <h3 :id="`stage-${card.stage}`">
        {{ t(`stageTitle.${card.stage}` as never) }}
        <span v-if="passed.includes(card.route)" class="done">✓ {{ t("stageDone") }}</span>
      </h3>
      <button
        type="button"
        class="tc-btn go"
        :aria-label="t('stagePractiseLabel', { stage: t(`stageName.${card.stage}` as never) })"
        @click="emit('open', card.route)"
      >
        {{ t("stagePractise") }}
      </button>
      <dl>
        <dt>{{ t("cardText") }}</dt>
        <dd>{{ t("cardTextValue", { words: card.words, sentences: card.sentences, longest: card.longest }) }}</dd>
        <dt>{{ t("cardErrors") }}</dt>
        <dd>{{ t("cardErrorsValue", { count: card.errors }) }}</dd>
        <dt>{{ t("cardClasses") }}</dt>
        <dd>
          <ul class="chips">
            <li v-for="id in card.before" :key="id" class="chip">{{ t(`errorClass.${id}` as never) }}</li>
            <li v-for="id in card.adds" :key="id" class="chip" :class="{ added: card.stage > 1 }">
              {{ t(`errorClass.${id}` as never) }}
              <span v-if="card.stage > 1" class="new">{{ t("cardNew") }}</span>
            </li>
          </ul>
        </dd>
        <dt>{{ t("cardHelp") }}</dt>
        <dd>{{ help(card) }}</dd>
      </dl>
    </article>
    <p v-if="anyPassed">
      <button type="button" class="tc-btn" @click="clearPassed(state.cards.map((card) => card.route))">
        {{ t("stageReset") }}
      </button>
    </p>
  </div>
</template>

<style scoped>
h2 {
  margin: 0 0 0.5rem;
  font-size: 1.3rem;
}

.lead {
  margin: 0 0 1rem;
  color: var(--tc-muted);
}

.card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.6rem 1rem;
  align-items: start;
  margin: 0 0 1rem;
  padding: 1rem 1.1rem;
  border: 1px solid var(--tc-line);
  border-radius: 12px;
  background: var(--tc-card);
}

h3 {
  margin: 0;
  font-size: 1.1rem;
}

.done {
  margin-left: 0.5rem;
  color: var(--tc-found);
  font-size: 0.85rem;
}

.go {
  min-width: 6rem;
}

dl {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  gap: 0.35rem 1rem;
  margin: 0;
  font-size: 0.95rem;
}

dt {
  color: var(--tc-muted);
}

dd {
  margin: 0;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem 0.4rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.chip {
  padding: 0.05rem 0.6rem;
  border: 1px solid var(--tc-line);
  border-radius: 999px;
  font-size: 0.85rem;
}

.chip.added {
  border-color: var(--tc-accent);
  background: var(--tc-tol-bg);
  font-weight: 650;
}

.new {
  color: var(--tc-accent);
  font-size: 0.75rem;
}

@media (max-width: 34rem) {
  dl {
    grid-template-columns: 1fr;
  }

  dt {
    margin-top: 0.3rem;
  }
}
</style>
