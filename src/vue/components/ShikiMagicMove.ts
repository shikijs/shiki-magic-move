import type { HighlighterCore } from 'shiki/core'
import type { PropType } from 'vue'
import { computed, defineComponent, h } from 'vue'
import { codeToKeyedTokens, createMagicMoveMachine } from '../../core'
import type { AnimationOptions } from '../types'
import { TokensRenderer } from './TokensRenderer'

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
    animation: {
      type: Object as PropType<AnimationOptions>,
      default: () => ({}),
    },
    globalScale: {
      type: Number,
      default: 1,
    },
  },
  setup(props) {
    const machine = createMagicMoveMachine(code =>
      codeToKeyedTokens(props.highlighter, code, {
        lang: props.lang,
        theme: props.theme,
      }),
    )
    const tokens = computed(() => machine.commit(props.code))

    return () => h(TokensRenderer, {
      tokens: tokens.value,
      animation: props.animation,
      globalScale: props.globalScale,
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
