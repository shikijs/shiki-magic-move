import type { HighlighterCore } from 'shiki/core'
import type { KeyedTokensInfo, MagicMoveDifferOptions, MagicMoveRenderOptions } from '../types'
import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { codeToKeyedTokens, createMagicMoveMachine } from '../core'

import './ShikiMagicMoveRenderer'

@customElement('shiki-magic-move')
export class ShikiMagicMove extends LitElement {
  @property()
  highlighter!: HighlighterCore

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

  shouldUpdate() {
    // Check for whether it's the first time rendering.
    if (!this.hasUpdated) {
      this.machine = createMagicMoveMachine(
        code => codeToKeyedTokens(
          this.highlighter,
          code,
          {
            lang: this.lang,
            theme: this.theme,
          },
          this.options?.lineNumbers,
        ),
        this.options,
      )
    }
    return true
  }

  render() {
    this.result = this.machine?.commit(this.code, this.options)
    return html`<shiki-magic-move-renderer
      .tokens=${this.tokens}
      .previous=${this.previous}
      .options=${this.options}
      .class=${this.class}
      @onStart=${() => this.dispatchEvent(new CustomEvent('onStart'))}
      @onEnd=${() => this.dispatchEvent(new CustomEvent('onEnd'))}
    ></shiki-magic-move-renderer>`
  }
}
