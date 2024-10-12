/** @jsxImportSource solid-js */

import type { RendererFactory, RendererFactoryResult } from './types'
import { createEffect, createSignal } from 'solid-js'
import { render } from 'solid-js/web'
import { shallowReactive, watch } from 'vue'
import { ShikiMagicMove } from '../../../src/solid'

export const createRendererSolid: RendererFactory = (options): RendererFactoryResult => {
  const props = shallowReactive<any>({
    onStart: options.onStart,
    onEnd: options.onEnd,
  })

  function App() {
    const [code, setCode] = createSignal(props.code as string)
    const [highlighter, setHighlighter] = createSignal(props.highlighter)
    const [lang, setLang] = createSignal(props.lang)
    const [theme, setTheme] = createSignal(props.theme)
    const [className, setClassName] = createSignal(props.class)

    createEffect(() => {
      watch(props, () => {
        // Force Solid to re-render
        setCode(props.code)
        setHighlighter(props.highlighter)
        setLang(props.lang)
        setTheme(props.theme)
        setClassName(props.class)
      })
    })

    return (
      <>
        <ShikiMagicMove
          highlighter={highlighter()}
          code={code()}
          class={className()}
          lang={lang()}
          theme={theme()}
          options={props.options}
        />
      </>
    )
  }

  let dispose = () => {}

  return {
    mount: (element, payload) => {
      Object.assign(props, payload)
      dispose = render(
        () => <App />,
        element,
      )
    },

    update: (payload) => {
      Object.assign(props, payload)
    },
    dispose: () => {
      dispose?.()
    },
  }
}
