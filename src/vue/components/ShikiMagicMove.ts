import type { HighlighterCore } from 'shiki/core'
import type { PropType } from 'vue'
import { computed, defineComponent, h, markRaw, nextTick, ref, watch } from 'vue'
import { flattenTokens } from '../../core'
import type { AnimationOptions } from '../types'
import { StepAnimator } from './StepAnimator'

export const ShikiMagicMove = defineComponent({
  name: 'ShikiMagicMove',
  props: {
    highlighter: {
      type: Object as PropType<HighlighterCore>,
      required: true,
    },
    lang: {
      type: String,
      required: true,
    },
    theme: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    animation: {
      type: Object as PropType<AnimationOptions>,
      default: () => ({}),
    },
  },
  setup(props) {
    const before = ref('')
    const isActive = ref(true)

    const options = computed(() => ({
      lang: props.lang,
      theme: props.theme,
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

    return () => h(StepAnimator, {
      key: step.value.to.code,
      active: isActive.value,
      from: step.value.from,
      to: step.value.to,
      animation: props.animation,
      style: {
        color: step.value.meta.fg,
        backgroundColor: step.value.meta.bg,
      },
    })
  },
})
