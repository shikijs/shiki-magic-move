/** @jsxImportSource solid-js */

import type { RendererFactory, RendererFactoryResult } from './types'
import { createEffect, createSignal } from 'solid-js'
import { render } from 'solid-js/web'
import { ShikiMagicMove } from '../../../src/solid'

export const createRendererSolid: RendererFactory = (options): RendererFactoryResult => {
  const [props, setProps] = createSignal<any>({
    onStart: options.onStart,
    onEnd: options.onEnd,
  })

  function App() {
    const [code, setCode] = createSignal(props().code as string)
    const [highlighter, setHighlighter] = createSignal(props().highlighter)
    const [lang, setLang] = createSignal(props().lang)
    const [theme, setTheme] = createSignal(props().theme)
    const [className, setClassName] = createSignal(props().class)
    const [options, setOptions] = createSignal(props().options)

    createEffect(() => {
      setCode(props().code)
      setHighlighter(props().highlighter)
      setLang(props().lang)
      setTheme(props().theme)
      setClassName(props().class)
      setOptions(props().options)
    })

    return (
      <ShikiMagicMove
        highlighter={highlighter()}
        code={code()}
        class={className()}
        lang={lang()}
        theme={theme()}
        options={options()}
      />
    )
  }

  let dispose: () => void

  return {
    mount: (element, payload) => {
      setProps(prev => ({ ...prev, ...payload }))
      dispose = render(() => <App />, element)
    },
    update: (payload) => {
      setProps(prev => ({ ...prev, ...payload }))
    },
    dispose: () => {
      dispose?.()
    },
  }
}
