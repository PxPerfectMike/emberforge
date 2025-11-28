<script lang="ts">
	import type { GridCell, GamePhase } from '$lib/game/types';
	import Symbol from './Symbol.svelte';

	interface Props {
		grid: GridCell[][];
		phase: GamePhase;
		heat: number;
	}

	let { grid, phase, heat }: Props = $props();

	const isSpinning = $derived(phase === 'spinning');
	const heatGlow = $derived(`rgba(255, ${Math.max(0, 150 - heat)}, 0, ${heat / 200})`);
</script>

<div class="forge-wheel" style="--heat-glow: {heatGlow}; --heat: {heat}">
	<div class="anvil-frame">
		<div class="forge-rivets">
			<span class="rivet"></span>
			<span class="rivet"></span>
			<span class="rivet"></span>
			<span class="rivet"></span>
		</div>
		<div class="wheel-container">
			{#each grid as row, rowIndex}
				<div class="row">
					{#each row as cell, colIndex}
						<div class="cell" style="--delay: {colIndex * 50}ms">
							<Symbol
								symbolId={cell.symbolId}
								isWinning={cell.isWinning}
								isSpinning={isSpinning}
							/>
						</div>
					{/each}
				</div>
			{/each}
		</div>
		<div class="molten-edge"></div>
	</div>
</div>

<style>
	.forge-wheel {
		width: 100%;
		max-width: 100%;
		position: relative;
	}

	.anvil-frame {
		background: linear-gradient(180deg, #2a1a10 0%, #1a0f08 100%);
		border: 4px solid #4a3020;
		border-radius: 12px;
		padding: clamp(8px, 2vw, 16px);
		box-shadow:
			inset 0 2px 10px rgba(0, 0, 0, 0.8),
			0 4px 20px rgba(0, 0, 0, 0.5),
			0 0 calc(var(--heat) * 0.5px) var(--heat-glow);
		position: relative;
		overflow: hidden;
	}

	.forge-rivets {
		position: absolute;
		top: 8px;
		left: 8px;
		right: 8px;
		display: flex;
		justify-content: space-between;
		pointer-events: none;
	}

	.rivet {
		width: 8px;
		height: 8px;
		background: radial-gradient(circle at 30% 30%, #5a4a3a, #2a1a0a);
		border-radius: 50%;
		box-shadow: inset 0 1px 2px rgba(255, 200, 150, 0.2);
	}

	.wheel-container {
		display: flex;
		flex-direction: column;
		gap: clamp(4px, 1vw, 8px);
		background: linear-gradient(180deg, #0f0a05 0%, #1a0f08 100%);
		border-radius: 8px;
		padding: clamp(6px, 1.5vw, 12px);
		border: 2px solid #3a2515;
	}

	.row {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: clamp(4px, 1vw, 8px);
	}

	.cell {
		animation-delay: var(--delay);
	}

	.molten-edge {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: linear-gradient(90deg,
			transparent 0%,
			var(--heat-glow) 20%,
			rgba(255, 100, 0, calc(var(--heat) / 100)) 50%,
			var(--heat-glow) 80%,
			transparent 100%
		);
		animation: molten-pulse 2s ease-in-out infinite;
	}

	@keyframes molten-pulse {
		0%, 100% { opacity: 0.5; }
		50% { opacity: 1; }
	}
</style>
