import type { PropType } from 'vue'
import { TransitionGroup, computed, defineComponent, h, nextTick, onMounted, ref, renderList } from 'vue'
import type { KeyedTokensInfo } from '../../core'
import type { AnimationOptions } from '../types'

export const TokensRenderer = defineComponent({
  props: {
    tokens: {
      type: Object as PropType<KeyedTokensInfo>,
      required: true,
    },
    animation: {
      type: Object as PropType<AnimationOptions>,
    },
  },
  setup(props) {
    const style = computed(() => {
      const {
        duration = 500,
        delayMove = 0.3,
        delayLeave = 0,
        delayEnter = 0.8,
        easing = 'ease',
      } = props.animation || {}

      return {
        '--smm-duration': `${duration}ms`,
        '--smm-delay-move': `${delayMove}`,
        '--smm-delay-leave': `${delayLeave}`,
        '--smm-delay-enter': `${delayEnter}`,
        '--smm-easing': easing,
      }
    })

    const positionMap = new WeakMap <HTMLElement | Element, { left: number, top: number }>()
    const refTransitionGroup = ref<any>()
    const refContainer = computed(() => refTransitionGroup.value?.$el as HTMLPreElement | undefined)
    let positionOffset: { left: number, top: number } | undefined

    function savePosition(el: Element) {
      positionMap.set(el as HTMLElement, getPosition(el))
    }

    function getPositionOffset() {
      if (positionOffset)
        return positionOffset
      const style = getComputedStyle(refContainer.value!)
      const { left: dLeft, top: dTop } = refContainer.value!.getBoundingClientRect()

      positionOffset = {
        left: dLeft + Number.parseInt(style.borderLeftWidth),
        top: dTop + Number.parseInt(style.borderTopWidth),
      }

      nextTick(() => positionOffset = undefined)
      return positionOffset
    }

    function getPosition(el: Element) {
      const { left, top } = el.getBoundingClientRect()
      const offset = getPositionOffset()
      return {
        left: left - offset.left,
        top: top - offset.top,
      }
    }

    function savePositions() {
      const children = Array.from(refContainer.value?.children || []) as HTMLElement[]
      for (const el of children)
        savePosition(el)
    }

    function beforeLeave(el: Element | HTMLElement) {
      const { left, top } = positionMap.get(el) || getPosition(el)
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

    return () => h(
      TransitionGroup,
      {
        ref: refTransitionGroup,
        tag: 'pre',
        name: 'shiki-magic-move',
        class: 'shiki-magic-move-container',
        style: style.value,
        onBeforeLeave: beforeLeave,
        onAfterEnter: afterEnter,
      },
      {
        default: () => renderList(props.tokens.tokens, (token) => {
          if (token.content === '\n')
            return h('br', { key: token.key })
          return h(
            'span',
            {
              'style': { color: token.color },
              'class': 'shiki-magic-move-item',
              'key': token.key,
              'data-key': token.key,
            },
            token.content,
          )
        }),
      },
    )
  },
})
