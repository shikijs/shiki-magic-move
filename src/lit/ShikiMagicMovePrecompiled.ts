import type { KeyedTokensInfo, MagicMoveDifferOptions, MagicMoveRenderOptions } from '../types'
import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { syncTokenKeys, toKeyedTokens } from '../core'

import './ShikiMagicMoveRenderer'

@customElement('shiki-magic-move-precompiled')
export class ShikiMagicMovePrecompiled extends LitElement {
  @property()
  steps: KeyedTokensInfo[] = []

  @property()
  step: number = 0

  @property()
  animated: boolean = true

  @property()
  options?: MagicMoveRenderOptions & MagicMoveDifferOptions

  previous: KeyedTokensInfo = toKeyedTokens('', [])

  createRenderRoot() {
    // Disable shadow DOM.
    return this
  }

  render() {
    const result = syncTokenKeys(
      this.previous,
      this.steps[Math.min(this.step, this.steps.length - 1)],
      this.options,
    )
    this.previous = result.to

    return html`<shiki-magic-move-renderer
      .tokens=${result.to}
      .previous=${result.from}
      .options=${this.options}
      .animate=${this.animated}
      @onStart=${() => this.dispatchEvent(new CustomEvent('onStart'))}
      @onEnd=${() => this.dispatchEvent(new CustomEvent('onEnd'))}
    ></shiki-magic-move-renderer>`
  }
}
