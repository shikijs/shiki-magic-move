import type { PropType } from 'vue'
import { computed, defineComponent, h } from 'vue'
import type { KeyedTokensInfo } from '../../core'
import type { AnimationOptions } from '..'
import { TokensRenderer } from './TokensRenderer'

/**
 * Component to render a compiled magic move step,
 * Where the tokens can be generated on build time.
 */
export const ShikiMagicMoveCompiled = /* #__PURE__ */ defineComponent({
  name: 'ShikiMagicMoveCompiled',
  props: {
    steps: {
      type: Array as PropType<KeyedTokensInfo[]>,
      required: true,
    },
    step: {
      type: Number,
      default: 0,
    },
    animation: {
      type: Object as PropType<AnimationOptions>,
      default: () => ({}),
    },
  },
  setup(props) {
    const current = computed(() => props.steps[props.step])

    return () => h(TokensRenderer, {
      tokens: current.value,
      animation: props.animation,
    })
  },
})
