/** @jsxImportSource solid-js */

import type { JSX } from 'solid-js'
import { createEffect, createSignal } from 'solid-js'
import type { KeyedTokensInfo, MagicMoveRenderOptions } from '../types'
import { MagicMoveRenderer as Renderer } from '../renderer'
import { createCSSPropertiesFromString } from './utils'

export interface ShikiMagicMoveRendererProps {
  animate?: boolean
  tokens: KeyedTokensInfo
  previous?: KeyedTokensInfo
  options?: MagicMoveRenderOptions
  onStart?: () => void
  onEnd?: () => void
  class?: string
  style?: JSX.CSSProperties
}

/**
 * A wrapper component to `MagicMoveRenderer`
 */
export function ShikiMagicMoveRenderer(
  {
    animate = true,
    tokens,
    previous,
    options,
    onStart,
    onEnd,
    class: className,
    style,
  }: ShikiMagicMoveRendererProps,
) {
  let container: HTMLPreElement
  let renderer: Renderer
  const [isMounted, setIsMounted] = createSignal(false)

  createEffect(() => {
    if (!container)
      return
    // Remove previous content
    container.innerHTML = ''
    setIsMounted(true)
    renderer = new Renderer(container)
  }, [])

  createEffect(() => {
    async function render() {
      if (!renderer)
        return
      Object.assign(renderer.options, options)
      if (animate) {
        if (previous)
          renderer.replace(previous)

        onStart?.()
        await renderer.render(tokens)
        onEnd?.()
      }
      else {
        renderer.replace(tokens)
      }
    }

    render()
    // FIXME: we should only re-render when tokens change, but react-hooks rule doesn't allow.
    // Try to correct the dependency array if something goes wrong.
  }, [tokens])

  return (
    <pre
      // @ts-expect-error - TS doesn't know that `container` is a ref
      ref={container}
      class={`shiki-magic-move-container ${className || ''}`.trim()}
      style={style}
    >
      {
        // Render initial tokens for SSR

        // FIXME: Remove this element
        // Uncaught DOMException: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.
      }
      <div>
        {isMounted()
          ? undefined
          : tokens.tokens.map((token) => {
            if (token.content === '\n')
              return <br />

            return (
              <span
                style={{
                  ...createCSSPropertiesFromString(token.htmlStyle),
                  color: token.color,
                }}
                class={['shiki-magic-move-item', token.htmlClass].filter(Boolean).join(' ')}
              >
                {token.content}
              </span>
            )
          })}
      </div>
    </pre>
  )
}
