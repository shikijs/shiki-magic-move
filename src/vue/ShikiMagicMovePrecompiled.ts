import type { PropType } from 'vue'
import { computed, defineComponent, h } from 'vue'
import type { KeyedTokensInfo, MagicMoveRenderOptions } from '../types'
import { ShikiMagicMoveRenderer } from './ShikiMagicMoveRenderer'

/**
 * Component to render a compiled magic move step,
 * Where the tokens can be generated on build time.
 */
export const ShikiMagicMovePrecompiled = /* #__PURE__ */ defineComponent({
  name: 'ShikiMagicMovePrecompiled',
  props: {
    steps: {
      type: Array as PropType<KeyedTokensInfo[]>,
      required: true,
    },
    step: {
      type: Number,
      default: 0,
    },
    animate: {
      type: Boolean,
      default: true,
    },
    options: {
      type: Object as PropType<MagicMoveRenderOptions>,
      default: () => ({}),
    },
  },
  emits: [
    'start',
    'end',
  ],
  setup(props, { emit }) {
    const current = computed(() => props.steps[props.step])

    return () => h(ShikiMagicMoveRenderer, {
      tokens: current.value,
      options: props.options,
      animate: props.animate,
      onStart: () => emit('start'),
      onEnd: () => emit('end'),
    })
  },
})
