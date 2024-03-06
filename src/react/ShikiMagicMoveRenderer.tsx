import * as React from 'react'
import type { KeyedTokensInfo, MagicMoveRenderOptions } from '../types'
import { MagicMoveRenderer as Renderer } from '../renderer'
import { createCSSPropertiesFromString } from './utils'

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
    className,
    style,
  }: {
    animate?: boolean
    tokens: KeyedTokensInfo
    previous?: KeyedTokensInfo
    options?: MagicMoveRenderOptions
    onStart?: () => void
    onEnd?: () => void
    className?: string
    style?: React.CSSProperties
  },
) {
  const container = React.useRef<HTMLPreElement>(null)
  const renderer = React.useRef<Renderer>()
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    if (!container.current)
      return
    // Remove previous content
    container.current.innerHTML = ''
    setIsMounted(true)
    renderer.current = new Renderer(container.current)
  }, [])

  React.useEffect(() => {
    async function render() {
      if (!renderer.current)
        return
      Object.assign(renderer.current.options, options)
      if (animate) {
        if (previous)
          renderer.current.replace(previous)

        onStart?.()
        await renderer.current.render(tokens)
        onEnd?.()
      }
      else {
        renderer.current.replace(tokens)
      }
    }

    render()
  // FIXME: we should only re-render when tokens change, but react-hooks rule doesn't allow.
  // Try to correct the dependency array if something goes wrong.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens])

  return (
    <pre
      ref={container}
      className={`shiki-magic-move-container ${className}`}
      style={style}
    >
      {
        // Render initial tokens for SSR

        // FIXME: Remove this element
        // Uncaught DOMException: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.
      }
      <div>
        {isMounted
          ? undefined
          : tokens.tokens.map((token) => {
            if (token.content === '\n')
              return <br key={token.key} />

            return (
              <span
                style={{
                  ...createCSSPropertiesFromString(token.htmlStyle),
                  color: token.color,
                }}
                className="shiki-magic-move-item"
                key={token.key}
              >
                {token.content}
              </span>
            )
          })}
      </div>
    </pre>
  )
}
