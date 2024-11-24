import type { Ref } from 'lit/directives/ref.js'
import type { KeyedTokensInfo, MagicMoveRenderOptions } from '../types'
import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { MagicMoveRenderer as Renderer } from '../renderer'

@customElement('shiki-magic-move-renderer')
export class ShikiMagicMoveRenderer extends LitElement {
  @property()
  animated: boolean = true

  @property()
  tokens?: KeyedTokensInfo

  @property()
  previous?: KeyedTokensInfo

  @property()
  options?: MagicMoveRenderOptions

  @property()
  class: string = ''

  container: Ref<HTMLPreElement> = createRef()

  renderer?: Renderer

  createRenderRoot() {
    // Disable shadow DOM.
    return this
  }

  async transform() {
    if (this.renderer) {
      if (this.animated) {
        if (this.previous)
          this.renderer.replace(this.previous)
        this.dispatchEvent(new CustomEvent('onStart'))
        if (this.tokens)
          await this.renderer?.render(this.tokens)
        this.dispatchEvent(new CustomEvent('onEnd'))
      }
      else if (this.tokens) {
        this.renderer.replace(this.tokens)
      }
    }
  }

  shouldUpdate(changedProperties: Map<string, any>) {
    if (this.hasUpdated) {
      if (this.renderer) {
        if (changedProperties.has('options'))
          Object.assign(this.renderer?.options, changedProperties.get('options'))
        this.transform()
        return false
      }
    }
    return true
  }

  firstUpdated() {
    this.renderer = new Renderer(this.container.value!)
    if (this.tokens)
      this.renderer?.render(this.tokens)
  }

  render() {
    return html`<pre ${ref(this.container)} class="shiki-magic-move-container ${this.class}"></pre>`
  }
}
