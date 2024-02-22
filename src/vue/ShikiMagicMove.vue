<script setup lang="ts">
import { computed, markRaw, nextTick, ref, watch } from 'vue'
import type { BuiltinLanguage, HighlighterCore } from 'shiki'
import { flattenTokens } from '../core'
import StepAnimator from './StepAnimator.vue'
import type { AnimationOptions } from './types'

const props = defineProps<{
  highlighter: HighlighterCore
  code: string
  lang: BuiltinLanguage | string
  theme: BuiltinLanguage | string
  animation?: AnimationOptions
}>()

const before = ref('')
const isActive = ref(true)

const options = computed(() => ({
  theme: props.theme,
  lang: props.lang,
}))

const step = computed(() => {
  const from = markRaw(flattenTokens(
    before.value,
    props.highlighter.codeToTokens(before.value, options.value).tokens,
  ))
  const toResult = props.highlighter.codeToTokens(props.code, options.value)
  const to = markRaw(flattenTokens(
    props.code,
    toResult.tokens,
  ))
  return {
    from,
    to,
    meta: toResult,
  }
})

watch(
  () => props.code,
  (_, old) => {
    before.value = old
    isActive.value = false
  },
)

watch(
  step,
  () => {
    nextTick(() => {
      isActive.value = true
    })
  },
)
</script>

<template>
  <StepAnimator
    :key="step.to.code"
    :from="step.from"
    :to="step.to"
    :active="isActive"
    :animation="props.animation"
    :style="{
      color: step.meta.fg,
      backgroundColor: step.meta.bg,
    }"
  />
</template>
