<script setup lang="ts">
import type { ThemedToken } from 'shiki/core'
import { computed, markRaw, onMounted, ref } from 'vue'
import type { FlattenTokensCode } from '../core'
import { diffTokens } from '../core'
import type { AnimationOptions } from './types'

const props = defineProps<{
  from: FlattenTokensCode
  to: FlattenTokensCode
  animation?: AnimationOptions
  active?: boolean
}>()

const {
  duration = 500,
  delayMove = 0.3,
  delayLeave = 0,
  delayEnter = 0.8,
  easing = 'ease',
} = props.animation || {}

const result = markRaw(diffTokens(props.from, props.to))
const current = computed(() => props.active ? result.to : result.from)

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
  RectMap.set(el as HTMLElement, getPosition(el))
}

function getPosition(el: Element) {
  const { left: dLeft, top: dTop } = refContainer.value!.getBoundingClientRect()
  const style = getComputedStyle(refContainer.value!)
  const { left, top } = el.getBoundingClientRect()
  return {
    left: left - dLeft - Number.parseInt(style.borderLeftWidth),
    top: top - dTop - Number.parseInt(style.borderTopWidth),
  }
}

function savePositions() {
  const children = Array.from(refContainer.value?.children || []) as HTMLElement[]
  for (const el of children)
    savePosition(el)
}

function beforeLeave(el: Element | HTMLElement) {
  const { left, top } = RectMap.get(el) || getPosition(el)
  if ('style' in el) {
    el.style.position = 'absolute'
    el.style.top = `${top}px`
    el.style.left = `${left}px`
  }
}

function afterEnter(el: Element | HTMLElement) {
  savePosition(el)
}

onMounted(() => {
  savePositions()
})
</script>

<template>
  <TransitionGroup
    ref="refTransitionGroup"
    tag="pre"
    name="shiki-magic-move"
    class="shiki-magic-move-container"
    @before-leave="beforeLeave"
    @after-enter="afterEnter"
  >
    <template v-for="token of current.flatten" :key="getTokenKey(token)">
      <br
        v-if="token.content === '\n'"
      >
      <span
        v-else :style="{ color: token.color }"
        class="shiki-magic-move-item"
        :data-key="getTokenKey(token)"
        v-text="token.content"
      />
    </template>
  </TransitionGroup>
</template>

<style scoped>
.shiki-magic-move-container {
  position: relative;
  white-space: pre;
  overflow: scroll;
}

.shiki-magic-move-move, /* apply transition to moving elements */
.shiki-magic-move-enter-active,
.shiki-magic-move-leave-active {
  --duration: v-bind(`${duration}ms`);
  transition: all var(--duration) v-bind(easing);
}

.shiki-magic-move-move {
  transition-delay: calc(var(--duration) * v-bind(delayMove));
  z-index: 1;
}

.shiki-magic-move-enter-active {
  transition-delay: calc(var(--duration) * v-bind(delayEnter));
  z-index: 1;
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
