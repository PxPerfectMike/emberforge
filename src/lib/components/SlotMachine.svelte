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

	const isSpinning = $derived(phase === 'spinning');
	const heatGlow = $derived(`rgba(255, ${Math.max(0, 150 - heat)}, 0, ${heat / 200})`);

	// Track which reels are still spinning
	let reelStates = $state<('idle' | 'spinning' | 'stopping')[]>([
		'idle', 'idle', 'idle', 'idle', 'idle'
	]);

	// Generate blur symbols for spinning animation
	function getSpinSymbols(): SymbolId[] {
		return Array.from({ length: 8 }, () => pickRandomSymbol());
	}

	// When phase changes to spinning, trigger reel animations
	$effect(() => {
		if (phase === 'spinning') {
			// Start all reels spinning
			reelStates = ['spinning', 'spinning', 'spinning', 'spinning', 'spinning'];
		} else if (phase === 'revealing') {
			// Stagger the reel stops
			for (let i = 0; i < 5; i++) {
				setTimeout(() => {
					reelStates = reelStates.map((s, idx) =>
						idx === i ? 'stopping' : s
					);
					// After stop animation, set to idle
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

<div class="forge-wheel" style="--heat-glow: {heatGlow}; --heat: {heat}">
	<div class="anvil-frame">
		<div class="wheel-container">
			{#each Array(DEFAULT_CONFIG.cols) as _, colIndex}
				<div class="reel" class:spinning={reelStates[colIndex] === 'spinning'} class:stopping={reelStates[colIndex] === 'stopping'}>
					<div class="reel-strip">
						{#if reelStates[colIndex] === 'spinning'}
							<!-- Show blur/spin animation -->
							{#each getSpinSymbols() as symbolId, i}
								<div class="cell blur">
									<Symbol {symbolId} isWinning={false} isSpinning={true} />
								</div>
							{/each}
						{:else}
							<!-- Show actual grid symbols -->
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
				</div>
			{/each}
		</div>
		<div class="reel-dividers">
			{#each Array(DEFAULT_CONFIG.cols - 1) as _, i}
				<div class="divider"></div>
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
		flex: 1;
		min-height: 0;
		display: flex;
		flex-direction: column;
	}

	.anvil-frame {
		background: linear-gradient(180deg, #2a1a10 0%, #1a0f08 100%);
		border: 3px solid #4a3020;
		border-radius: 8px;
		padding: clamp(4px, 1vw, 8px);
		box-shadow:
			inset 0 2px 10px rgba(0, 0, 0, 0.8),
			0 4px 20px rgba(0, 0, 0, 0.5),
			0 0 calc(var(--heat) * 0.5px) var(--heat-glow);
		position: relative;
		overflow: hidden;
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.wheel-container {
		display: flex;
		gap: 2px;
		background: linear-gradient(180deg, #0f0a05 0%, #1a0f08 100%);
		border-radius: 6px;
		padding: clamp(3px, 0.8vw, 6px);
		border: 2px solid #3a2515;
		flex: 1;
		position: relative;
	}

	.reel {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		position: relative;
		background: rgba(0, 0, 0, 0.3);
		border-radius: 4px;
	}

	.reel-strip {
		display: flex;
		flex-direction: column;
		gap: clamp(2px, 0.5vw, 4px);
		padding: clamp(2px, 0.5vw, 4px);
		flex: 1;
		justify-content: space-around;
	}

	.reel.spinning .reel-strip {
		animation: spin-blur 0.1s linear infinite;
	}

	.reel.stopping .reel-strip {
		animation: reel-stop 0.3s ease-out forwards;
	}

	@keyframes spin-blur {
		0% { transform: translateY(0); }
		100% { transform: translateY(-20px); }
	}

	@keyframes reel-stop {
		0% { transform: translateY(-30px); }
		60% { transform: translateY(5px); }
		100% { transform: translateY(0); }
	}

	.cell {
		aspect-ratio: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(145deg, #1a1208, #0f0a05);
		border-radius: 4px;
		border: 1px solid #2a1a10;
		transition: all 0.2s ease;
		flex: 1;
		min-height: 0;
	}

	.cell.blur {
		filter: blur(2px);
		opacity: 0.7;
	}

	.cell.landing {
		animation: cell-land 0.3s ease-out;
		animation-delay: var(--row-delay);
	}

	@keyframes cell-land {
		0% { transform: translateY(-10px); opacity: 0; }
		60% { transform: translateY(2px); }
		100% { transform: translateY(0); opacity: 1; }
	}

	.cell.winning {
		background: linear-gradient(145deg, #3a2a10, #2a1a05);
		border-color: #ffd700;
		box-shadow:
			0 0 10px rgba(255, 215, 0, 0.5),
			inset 0 0 10px rgba(255, 215, 0, 0.2);
		animation: winning-pulse 0.5s ease-in-out infinite alternate;
	}

	@keyframes winning-pulse {
		from { box-shadow: 0 0 10px rgba(255, 215, 0, 0.5), inset 0 0 10px rgba(255, 215, 0, 0.2); }
		to { box-shadow: 0 0 20px rgba(255, 215, 0, 0.8), inset 0 0 15px rgba(255, 215, 0, 0.3); }
	}

	.reel-dividers {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		justify-content: space-around;
		padding: clamp(3px, 0.8vw, 6px);
		pointer-events: none;
	}

	.divider {
		width: 2px;
		height: 100%;
		background: linear-gradient(180deg,
			transparent 0%,
			#4a3020 20%,
			#5a4030 50%,
			#4a3020 80%,
			transparent 100%
		);
		opacity: 0.6;
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
