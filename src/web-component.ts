import type {
  ShikiMagicMove as ShikiMagicMoveElement,
  ShikiMagicMovePrecompiled as ShikiMagicMovePrecompiledElement,
  ShikiMagicMoveRenderer as ShikiMagicMoveRendererElement,
} from '@shikijs/magic-move/dist/web-component.mjs'

export * from '@shikijs/magic-move/dist/web-component.mjs'

declare global {
  interface HTMLElementTagNameMap {
    'shiki-magic-move': ShikiMagicMoveElement
    'shiki-magic-move-precompiled': ShikiMagicMovePrecompiledElement
    'shiki-magic-move-renderer': ShikiMagicMoveRendererElement
  }
}
