<script lang='ts'>
  import type { KeyedTokensInfo, MagicMoveRenderOptions } from 'shiki-magic-move/types'
  import { MagicMoveRenderer } from 'shiki-magic-move/renderer'

  interface ShikiMagicMoveRendererProps {
    class?: string
    animate?: boolean
    tokens: KeyedTokensInfo
    previous?: KeyedTokensInfo
    options?: MagicMoveRenderOptions
    onStart?: () => void
    onEnd?: () => void
  }

  const {
    animate = true,
    tokens,
    previous,
    options,
    onStart,
    onEnd,
    ...props
  }: ShikiMagicMoveRendererProps = $props()

  let container: HTMLPreElement
  let renderer: MagicMoveRenderer
  let isMounted = $state(false)

  $effect(() => {
    if (!container)
      return
    container.innerHTML = ''
    isMounted = true
    renderer = new MagicMoveRenderer(container)
  })

  $effect(() => {
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
  })
</script>

<pre bind:this={container} class='shiki-magic-move-container {props?.class}' {...props}>
  <!-- render initial tokens for SSR -->
  {#if !isMounted}
    {#each tokens.tokens as token (token.key)}
      {#if token.content === '\n'}
        <br />
      {/if}
      <span
        class='shiki-magic-move-item'
        style:color={token.color}
        style={token.htmlStyle}>
        {token.content}
      </span>
    {/each}
  {/if}
</pre>
