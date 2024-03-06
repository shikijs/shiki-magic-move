import type { HighlighterCore } from 'shiki/core'
import type { MagicMoveRenderOptions } from '../../../src/core'

export type RendererType = 'vue'

export interface RendererUpdatePayload {
  highlighter: HighlighterCore
  code: string
  lang: string
  theme: string
  class?: string
  options?: MagicMoveRenderOptions
}

export interface RendererFactoryResult {
  dispose: () => void
  mount: (element: HTMLElement, payload: RendererUpdatePayload) => void
  update: (payload: RendererUpdatePayload) => void
}

export interface RendererFactoryOptions {
  onStart?: () => void
  onEnd?: () => void
}

export type RendererFactory = (options: RendererFactoryOptions) => RendererFactoryResult
