<script lang="ts">
	import type { GridCell, GamePhase, SymbolId } from '$lib/game/types';
	import Symbol from './Symbol.svelte';
	import { TIMING, DEFAULT_CONFIG } from '$lib/game/config';
	import { pickRandomSymbol } from '$lib/game/symbols';

	interface Props {
		grid: GridCell[][];
		phase: GamePhase;
		heat: number;
	}

	let { grid, phase, heat }: Props = $props();

	const heatGlow = $derived(`rgba(255, ${Math.max(0, 150 - heat)}, 0, ${heat / 200})`);

	// Track which reels are still spinning
	let reelStates = $state<('idle' | 'spinning' | 'stopping')[]>([
		'idle', 'idle', 'idle', 'idle', 'idle'
	]);

	// Generate blur symbols for spinning animation
	function getSpinSymbols(): SymbolId[] {
		return Array.from({ length: DEFAULT_CONFIG.rows }, () => pickRandomSymbol());
	}

	// When phase changes to spinning, trigger reel animations
	$effect(() => {
		if (phase === 'spinning') {
			reelStates = ['spinning', 'spinning', 'spinning', 'spinning', 'spinning'];
		} else if (phase === 'revealing') {
			for (let i = 0; i < DEFAULT_CONFIG.cols; i++) {
				setTimeout(() => {
					reelStates = reelStates.map((s, idx) =>
						idx === i ? 'stopping' : s
					);
					setTimeout(() => {
						reelStates = reelStates.map((s, idx) =>
							idx === i ? 'idle' : s
						);
					}, 300);
				}, i * TIMING.reelStagger);
			}
		}
	});
</script>

<div class="slot-container" style="--heat-glow: {heatGlow}; --heat: {heat}; --rows: {DEFAULT_CONFIG.rows}; --cols: {DEFAULT_CONFIG.cols}">
	<div class="slot-frame">
		<div class="reels-grid">
			{#each Array(DEFAULT_CONFIG.cols) as _, colIndex}
				<div
					class="reel"
					class:spinning={reelStates[colIndex] === 'spinning'}
					class:stopping={reelStates[colIndex] === 'stopping'}
				>
					{#if reelStates[colIndex] === 'spinning'}
						{#each getSpinSymbols() as symbolId}
							<div class="cell blur">
								<Symbol {symbolId} isWinning={false} isSpinning={true} />
							</div>
						{/each}
					{:else}
						{#each grid as row, rowIndex}
							<div
								class="cell"
								class:winning={row[colIndex].isWinning}
								class:landing={reelStates[colIndex] === 'stopping'}
								style="--row-delay: {rowIndex * 50}ms"
							>
								<Symbol
									symbolId={row[colIndex].symbolId}
									isWinning={row[colIndex].isWinning}
									isSpinning={false}
								/>
							</div>
						{/each}
					{/if}
				</div>
			{/each}
		</div>
		<div class="heat-edge"></div>
	</div>
</div>

<style>
	.slot-container {
		/* Container maintains the slot machine at a stable size */
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.slot-frame {
		/* Fixed aspect ratio based on grid dimensions (5 cols x 4 rows with square cells = 5:4) */
		aspect-ratio: calc(var(--cols) / var(--rows));
		height: 100%;
		max-width: 100%;

		background: linear-gradient(180deg, #2a1a10 0%, #1a0f08 100%);
		border: 3px solid #4a3020;
		border-radius: 8px;
		padding: 6px;
		box-sizing: border-box;

		box-shadow:
			inset 0 2px 10px rgba(0, 0, 0, 0.8),
			0 4px 20px rgba(0, 0, 0, 0.5),
			0 0 calc(var(--heat) * 0.5px) var(--heat-glow);

		position: relative;
		overflow: hidden;
	}

	.reels-grid {
		width: 100%;
		height: 100%;
		display: grid;
		grid-template-columns: repeat(var(--cols), 1fr);
		gap: 3px;
		background: linear-gradient(180deg, #0f0a05 0%, #1a0f08 100%);
		border-radius: 4px;
		padding: 4px;
		border: 2px solid #3a2515;
		box-sizing: border-box;
	}

	.reel {
		display: grid;
		grid-template-rows: repeat(var(--rows), 1fr);
		gap: 3px;
		background: rgba(0, 0, 0, 0.3);
		border-radius: 3px;
		overflow: hidden;
	}

	.reel.spinning .cell {
		animation: spin-blur 0.08s linear infinite;
	}

	.reel.stopping .cell {
		animation: reel-stop 0.3s ease-out forwards;
	}

	@keyframes spin-blur {
		0% { transform: translateY(-15%); opacity: 0.6; }
		50% { opacity: 1; }
		100% { transform: translateY(15%); opacity: 0.6; }
	}

	@keyframes reel-stop {
		0% { transform: translateY(-20%); }
		60% { transform: translateY(5%); }
		100% { transform: translateY(0); }
	}

	.cell {
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(145deg, #1a1208, #0f0a05);
		border-radius: 3px;
		border: 1px solid #2a1a10;
		padding: 2px;
		box-sizing: border-box;
	}

	.cell.blur {
		filter: blur(1px);
		opacity: 0.7;
	}

	.cell.landing {
		animation: cell-land 0.3s ease-out;
		animation-delay: var(--row-delay);
	}

	@keyframes cell-land {
		0% { transform: translateY(-10%); opacity: 0; }
		60% { transform: translateY(3%); }
		100% { transform: translateY(0); opacity: 1; }
	}

	.cell.winning {
		background: linear-gradient(145deg, #3a2a10, #2a1a05);
		border-color: #ffd700;
		box-shadow:
			0 0 8px rgba(255, 215, 0, 0.5),
			inset 0 0 6px rgba(255, 215, 0, 0.2);
		animation: winning-pulse 0.5s ease-in-out infinite alternate;
	}

	@keyframes winning-pulse {
		from { box-shadow: 0 0 8px rgba(255, 215, 0, 0.5), inset 0 0 6px rgba(255, 215, 0, 0.2); }
		to { box-shadow: 0 0 15px rgba(255, 215, 0, 0.8), inset 0 0 10px rgba(255, 215, 0, 0.3); }
	}

	.heat-edge {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 3px;
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
