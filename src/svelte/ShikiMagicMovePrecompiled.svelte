<script lang="ts">
	import { syncTokenKeys, toKeyedTokens } from '../core'
	import ShikiMagicMoveRenderer from './ShikiMagicMoveRenderer.svelte'
	import type { KeyedTokensInfo, MagicMoveDifferOptions, MagicMoveRenderOptions } from '../types.d.ts'

	interface ShikiMagicMovePrecompileProps {
		steps: KeyedTokensInfo[]
		step?: number
		animate?: boolean
		options?: MagicMoveRenderOptions & MagicMoveDifferOptions
		onStart?: () => void
		onEnd?: () => void
	}
	
	const {
		steps,
		step = 0,
		animate = true,
		options,
		onStart,
		onEnd,
	}: ShikiMagicMovePrecompileProps = $props()

	const EMPTY = toKeyedTokens('', [])
	
	let previous = EMPTY
	const result = $derived.by(() => {
		if (steps.length === 0) return
		const res = syncTokenKeys(previous, steps[Math.min(step, steps.length - 1)], options)
		previous = res.to
		return res
	})
</script>

{#if result}
	<ShikiMagicMoveRenderer
		tokens={result.to}
		previous={result.from}
		{options}
		{animate}
		{onStart}
		{onEnd}
	/>
{/if}