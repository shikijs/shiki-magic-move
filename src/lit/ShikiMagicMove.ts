import type { Ref } from 'lit/directives/ref.js'
import type { HighlighterCore } from 'shiki/core'
import type { KeyedTokensInfo, MagicMoveDifferOptions, MagicMoveRenderOptions } from '../types'
import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { codeToKeyedTokens, createMagicMoveMachine } from '../core'
import { MagicMoveRenderer as Renderer } from '../renderer'

@customElement('shiki-magic-move')
export class ShikiMagicMove extends LitElement {
  @property()
  highlighter?: HighlighterCore

  @property()
  lang: string = 'typescript'

  @property()
  theme: string = 'github-light'

  @property()
  code: string = ''

  @property()
  class: string = ''

  @property()
  options?: MagicMoveRenderOptions & MagicMoveDifferOptions

  machine?: {
    commit: (code: string, override?: MagicMoveDifferOptions) => {
      current: KeyedTokensInfo
      previous: KeyedTokensInfo
    }
  }

  result?: { current: KeyedTokensInfo, previous: KeyedTokensInfo }

  container: Ref<HTMLPreElement> = createRef()

  renderer?: Renderer

  get tokens() {
    return this.result?.current
  }

  get previous() {
    return this.result?.previous
  }

  createRenderRoot() {
    // Disable shadow DOM.
    return this
  }

  getResult() {
    this.result = this.machine?.commit(this.code, this.options)
  }

  firstUpdated() {
    this.renderer = new Renderer(this.container.value!)
    this.machine = createMagicMoveMachine(
      code => codeToKeyedTokens(
        this.highlighter as HighlighterCore,
        code,
        {
          lang: this.lang,
          theme: this.theme,
        },
        this.options?.lineNumbers,
      ),
      this.options,
    )
    this.getResult()
    if (this.tokens)
      this.renderer?.render(this.tokens)
  }

  async playAnimation() {
    if (this.renderer) {
      if (this.previous)
        this.renderer.replace(this.previous)
      this.dispatchEvent(new CustomEvent('onStart'))
      if (this.tokens)
        await this.renderer?.render(this.tokens)
      this.dispatchEvent(new CustomEvent('onEnd'))
    }
  }

  shouldUpdate(changedProperties: Map<string, any>) {
    // Check for whether it's the first time rendering.
    if (this.hasUpdated) {
      this.getResult()
      if (this.renderer) {
        if (changedProperties.has('options'))
          Object.assign(this.renderer?.options, changedProperties.get('options'))
        this.playAnimation()
        return false
      }
    }
    return true
  }

  render() {
    return html`<pre ${ref(this.container)} class="shiki-magic-move-container ${this.class}"></pre>`
  }
}
