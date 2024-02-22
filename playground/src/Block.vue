<script setup lang="ts">
import type { ThemedToken } from 'shiki'
import { getHighlighter } from 'shiki'
import { computed, markRaw, nextTick, onMounted, ref } from 'vue'
import { tokenizeWithDiff } from '../../src/index'

import { after, before } from './code'

export interface AnimationOptions {
  /**
   * Duration of the animation in milliseconds
   *
   * @default 500
   */
  duration?: number
  /**
   * Ratio of the duration to delay the move animation
   *
   * @default 0.1
   */
  delayMove?: number
  /**
   * Ratio of the duration to delay the leave animation
   *
   * @default 0.1
   */
  delayLeave?: number
  /**
   * Ratio of the duration to delay the enter animation
   *
   * @default 0.8
   */
  delayEnter?: number
  /**
   * Easing function
   *
   * @default 'ease'
   */
  easing?: string
}

const highlighter = await getHighlighter({
  themes: ['vitesse-light'],
  langs: ['vue'],
})

const {
  duration = 500,
  delayMove = 0.1,
  delayLeave = 0.1,
  delayEnter = 0.8,
  easing = 'ease',
} = {} as AnimationOptions

const result = markRaw(tokenizeWithDiff(
  highlighter,
  before,
  after,
  {
    theme: 'vitesse-light',
    lang: 'vue',
  },
))

const active = ref(false)
const current = computed(() => active.value ? result.to : result.from)

function getTokenKey(token: ThemedToken) {
  const index = result.tokensMap.findIndex(p => p[0] === token || p[1] === token)
  if (index !== -1)
    return `matched-${index}`
  const from = result.from.flatten.findIndex(p => p === token)
  if (from !== -1)
    return `from-${from}`
  const to = result.to.flatten.findIndex(p => p === token)
  if (to !== -1)
    return `to-${to}`
  return `unknown-${token.offset}-${token.content}`
}

const RectMap = new WeakMap <HTMLElement | Element, { left: number, top: number }>()
const refTransitionGroup = ref<any>()
const refContainer = computed(() => refTransitionGroup.value?.$el as HTMLPreElement | undefined)

function savePosition(el: Element) {
  const { left, top } = el.getBoundingClientRect()
  RectMap.set(el as HTMLElement, { left, top })
}

function savePositions() {
  const children = Array.from(refContainer.value?.children || []) as HTMLElement[]
  for (const el of children)
    savePosition(el)
}

onMounted(() => {
  savePositions()
})

function leaveEl(el: Element | HTMLElement) {
  // debugger
  const { left, top } = RectMap.get(el) || el.getBoundingClientRect()
  function applyTransform() {
    if ('style' in el) {
      el.style.position = 'absolute'
      el.style.top = `${top}px`
      el.style.left = `${left}px`
    }
  }
  // debugger
  applyTransform()
  nextTick(() => {
    // debugger
    applyTransform()
  })
}
</script>

<template>
  <TransitionGroup
    ref="refTransitionGroup"
    tag="pre"
    name="shiki-magic-move"
    class="shiki-magic-move-container"
    @before-leave="leaveEl"
    @after-enter="savePosition"
  >
    <template v-for="token of current.flatten" :key="getTokenKey(token)">
      <br v-if="token.content === '\n'" :data-key="getTokenKey(token)">
      <span v-else :style="{ color: token.color }" class="shiki-magic-move-item" :data-key="getTokenKey(token)" v-text="token.content" />
    </template>
  </TransitionGroup>
  <button @click="active = !active">
    {{ active }}
  </button>
</template>

<style scoped>
.shiki-magic-move-container {
  display: relative;
}

.shiki-magic-move-move, /* apply transition to moving elements */
.shiki-magic-move-enter-active,
.shiki-magic-move-leave-active {
  --duration: v-bind(`${duration}ms`);
  /* display: inline-block; */
  transition: all var(--duration) v-bind(easing);
}

.shiki-magic-move-move {
  transition-delay: calc(var(--duration) * v-bind(delayMove));
}

.shiki-magic-move-enter-active {
  transition-delay: calc(var(--duration) * v-bind(delayEnter));
}

.shiki-magic-move-leave-active {
  transition-delay: calc(var(--duration) * v-bind(delayLeave));
}

.shiki-magic-move-item {
  display: inline-block;
}

.shiki-magic-move-enter-from,
.shiki-magic-move-leave-to {
  opacity: 0;
}
br.shiki-magic-move-leave-active {
  display: none;
}
</style>
