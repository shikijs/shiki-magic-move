import type { PropType } from 'vue'
import { TransitionGroup, computed, defineComponent, h, nextTick, onMounted, reactive, ref, renderList } from 'vue'
import type { KeyedTokensInfo } from '../../core'
import type { AnimationOptions } from '../types'

export const TokensRenderer = /* #__PURE__ */ defineComponent({
  name: 'TokensRenderer',
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
        delayEnter = 0.7,
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

    const positionMap = new WeakMap<HTMLElement | Element, { left: number, top: number }>()
    const refTransitionGroup = ref<any>()
    const refContainer = computed(() => refTransitionGroup.value?.$el as HTMLPreElement | undefined)

    let positionOffset: { left: number, top: number } | undefined
    function getPositionOffset() {
      if (positionOffset)
        return positionOffset
      const style = getComputedStyle(refContainer.value!)
      const { left: dLeft, top: dTop } = refContainer.value!.getBoundingClientRect()
      positionOffset = {
        left: dLeft + Number.parseInt(style.borderLeftWidth),
        top: dTop + Number.parseInt(style.borderTopWidth),
      }
      // Cache only for the current tick
      nextTick(() => positionOffset = undefined)
      return positionOffset
    }

    function savePosition(el: Element) {
      positionMap.set(el as HTMLElement, getPosition(el))
    }

    function getPosition(el: Element) {
      const { left, top } = el.getBoundingClientRect()
      const offset = getPositionOffset()
      return {
        left: left - offset.left,
        top: top - offset.top,
      }
    }

    const enterSet = new Set<Element>()
    const leaveSet = new Set<Element>()

    function onBeforeLeave(el: Element | HTMLElement) {
      leaveSet.add(el)
      const { left, top } = positionMap.get(el) || getPosition(el)
      if ('style' in el) {
        el.style.position = 'absolute'
        el.style.top = `${top}px`
        el.style.left = `${left}px`
      }
    }

    function onAfterEnter(el: Element | HTMLElement) {
      enterSet.delete(el)
      savePosition(el)
      checkFinished()
    }

    function onAfterLeave(el: Element) {
      leaveSet.delete(el)
      checkFinished()
    }

    function checkFinished() {
      if (leaveSet.size === 0 && enterSet.size === 0)
        updatePositions()
      // TODO: emit event
    }

    function updatePositions() {
      // Save positions of all children
      const children = Array.from(refContainer.value?.children || []) as HTMLElement[]
      for (const el of children)
        savePosition(el)
    }

    function onBeforeEnter(el: Element) {
      enterSet.add(el)
    }

    function onLeaveCancelled(el: Element) {
      leaveSet.delete(el)
      el.remove()
    }

    function onEnterCancelled(el: Element) {
      enterSet.delete(el)
      el.remove()
    }

    onMounted(() => {
      updatePositions()
    })

    return () => {
      return h(
        TransitionGroup,
        {
          ref: refTransitionGroup,
          tag: 'pre',
          name: 'shiki-magic-move',
          class: 'shiki-magic-move-container',
          style: style.value,

          onAfterEnter,
          onAfterLeave,
          onBeforeEnter,
          onBeforeLeave,
          onEnterCancelled,
          onLeaveCancelled,
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
                // for debug
                'data-magic-move-key': token.key,
              },
              token.content,
            )
          }),
        },
      )
    }
  },
})
