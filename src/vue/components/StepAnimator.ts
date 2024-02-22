import type { ThemedToken } from 'shiki/core'
import type { PropType } from 'vue'
import { TransitionGroup, computed, defineComponent, h, markRaw, nextTick, onMounted, ref, renderList } from 'vue'
import type { FlattenTokensCode } from '../../core'
import { diffTokens } from '../../core'
import type { AnimationOptions } from '../types'

export const StepAnimator = defineComponent({
  props: {
    from: {
      type: Object as PropType<FlattenTokensCode>,
      required: true,
    },
    to: {
      type: Object as PropType<FlattenTokensCode>,
      required: true,
    },
    animation: {
      type: Object as PropType<AnimationOptions>,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const result = markRaw(diffTokens(props.from, props.to))
    const current = computed(() => props.active ? result.to : result.from)

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
        default: () => renderList(current.value.flatten, (token) => {
          if (token.content === '\n')
            return h('br', { key: getTokenKey(token) })
          return h(
            'span',
            {
              'style': { color: token.color },
              'class': 'shiki-magic-move-item',
              'key': getTokenKey(token),
              'data-key': getTokenKey(token),
            },
            token.content,
          )
        }),
      },
    )
  },
})
