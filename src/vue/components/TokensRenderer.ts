import type { PropType } from 'vue'
import { computed, defineComponent, h, onMounted, ref, renderList } from 'vue'
import type { KeyedTokensInfo } from '../../core'
import type { AnimationOptions } from '../types'
import { TransitionGroup } from './vendor/TransitionGroup'

/**
 * Component to render a compiled tokens and animate them.
 * This is a low-level component.
 */
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
    /**
     * When parents are scaled, it will chose getBoundingClientRect() to be incorrect.
     * Have to pass the global scale to fix the positions.
     */
    globalScale: {
      type: Number,
      default: 1,
    },
  },
  setup(props) {
    const style = computed(() => {
      const {
        duration = 500,
        delayMove = 0.3,
        delayLeave = 0.1,
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

    const enterSet = new Set<Element>()
    const leaveSet = new Set<Element>()
    const anchor = ref<HTMLElement>()

    function savePosition(el: Element) {
      positionMap.set(el as HTMLElement, getPosition(el))
    }

    function getPosition(el: Element) {
      const e = el.getBoundingClientRect()
      const a = anchor.value!.getBoundingClientRect()
      return {
        left: e.left - a.left,
        top: e.top - a.top,
      }
    }

    function onBeforeLeave(el: Element | HTMLElement) {
      leaveSet.add(el)
      const { left, top } = positionMap.get(el) || getPosition(el)
      if ('style' in el) {
        el.style.position = 'absolute'
        el.style.top = `${top / props.globalScale}px`
        el.style.left = `${left / props.globalScale}px`
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
          class: 'shiki-magic-move-container shiki',
          style: [style.value, props.tokens.rootStyle],

          // This props is provided by local modifications of TransitionGroup
          globalScale: props.globalScale,

          onAfterEnter,
          onAfterLeave,
          onBeforeEnter,
          onBeforeLeave,
          onEnterCancelled,
          onLeaveCancelled,
        },
        {
          default: () => [
            // Use a empty anchor div to calculate the relative position when setting absolute position
            h('div', {
              key: 'anchor',
              ref: anchor,
              style: 'position:absolute;top:0;left:0;width:1px;height:1px;',
            }),
            // Render the tokens, TransitionGroup will handle the animations for elements with the same key
            renderList(props.tokens.tokens, (token) => {
              if (token.content === '\n')
                return h('br', { key: token.key })
              return h(
                'span',
                {
                  'style': [{ color: token.color }, token.htmlStyle],
                  'class': 'shiki-magic-move-item',
                  'key': token.key,
                  // for debug
                  'data-magic-move-key': token.key,
                },
                token.content,
              )
            }),
          ],
        },
      )
    }
  },
})
