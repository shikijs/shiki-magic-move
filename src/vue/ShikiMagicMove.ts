import type { HighlighterCore } from 'shiki/core'
import type { PropType } from 'vue'
import { computed, defineComponent, h } from 'vue'
import { codeToKeyedTokens, createMagicMoveMachine } from '../core'
import type { MagicMoveRenderOptions } from '../types'
import { ShikiMagicMoveRenderer } from './ShikiMagicMoveRenderer'

export const ShikiMagicMove = /* #__PURE__ */ defineComponent({
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
    const machine = createMagicMoveMachine(code =>
      codeToKeyedTokens(props.highlighter, code, {
        lang: props.lang,
        theme: props.theme,
      }),
    )
    const tokens = computed(() => machine.commit(props.code))

    return () => h(ShikiMagicMoveRenderer, {
      tokens: tokens.value,
      options: props.options,
      onStart: () => emit('start'),
      onEnd: () => emit('end'),
      style: [
        {
          color: tokens.value.fg,
          backgroundColor: tokens.value.bg,
        },
        tokens.value.rootStyle,
      ],
    })
  },
})
