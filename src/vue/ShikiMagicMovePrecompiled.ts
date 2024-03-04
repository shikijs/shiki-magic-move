import type { PropType } from 'vue'
import { computed, defineComponent, h } from 'vue'
import type { KeyedTokensInfo, MagicMoveRenderOptions } from '../types'
import { syncTokenKeys, toKeyedTokens } from '../core'
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
    const EMPTY = toKeyedTokens('', [])

    let previous = EMPTY
    const result = computed(() => {
      const res = syncTokenKeys(previous, props.steps[Math.min(props.step, props.steps.length - 1)])
      previous = res.to
      return res
    })

    return () => h(ShikiMagicMoveRenderer, {
      tokens: result.value.to,
      previous: result.value.from,
      options: props.options,
      animate: props.animate,
      onStart: () => emit('start'),
      onEnd: () => emit('end'),
      style: [
        {
          color: result.value.to.fg,
          backgroundColor: result.value.to.bg,
        },
        result.value.to.rootStyle,
      ],
    })
  },
})
