<script lang="ts">
	import { gameState } from '$lib/game/state.svelte';
	import SlotMachine from './SlotMachine.svelte';
	import GameHUD from './GameHUD.svelte';
	import SpinButton from './SpinButton.svelte';
	import GameOver from './GameOver.svelte';

	const isSpinning = $derived(gameState.phase === 'spinning' || gameState.phase === 'revealing');
</script>

<div class="game-container" style="--heat: {gameState.forgeHeat}">
	<div class="forge-chamber">
		<header class="game-header">
			<h1 class="title">EMBERFORGE</h1>
			<div class="title-decoration"></div>
		</header>

		<GameHUD
			coins={gameState.coins}
			tickets={gameState.tickets}
			debt={gameState.debt}
			cycle={gameState.cycle}
			spinsRemaining={gameState.spinsRemaining}
			spinsPerBatch={gameState.spinsPerBatch}
			heat={gameState.forgeHeat}
			lastPayout={gameState.lastPayout}
			lastTickets={gameState.lastTickets}
			phase={gameState.phase}
		/>

		<SlotMachine
			grid={gameState.grid}
			phase={gameState.phase}
			heat={gameState.forgeHeat}
		/>

		<div class="controls">
			{#if gameState.phase === 'buy_spins'}
				<!-- Buy spins at start of cycle -->
				<button
					class="buy-spins-button"
					class:disabled={!gameState.canBuySpins}
					disabled={!gameState.canBuySpins}
					onclick={() => gameState.buySpins()}
				>
					<span class="btn-text">BUY {gameState.spinsPerBatch} SPINS</span>
					<span class="btn-cost">-{gameState.spinBatchCost} coins</span>
				</button>
			{:else if gameState.phase === 'pay_tribute'}
				<!-- Pay tribute at end of cycle -->
				<button
					class="pay-tribute-button"
					class:disabled={!gameState.canPayTribute}
					disabled={!gameState.canPayTribute}
					onclick={() => gameState.payTribute()}
				>
					<span class="btn-text">PAY TRIBUTE</span>
					<span class="btn-cost">-{gameState.debt} coins</span>
				</button>
				{#if !gameState.canPayTribute}
					<p class="tribute-warning">Not enough coins! The forge will consume you...</p>
					<button class="accept-fate-button" onclick={() => gameState.payTribute()}>
						ACCEPT YOUR FATE
					</button>
				{/if}
			{:else}
				<!-- Normal spin button -->
				<SpinButton
					canSpin={gameState.canSpin}
					{isSpinning}
					onclick={() => gameState.spin()}
				/>
			{/if}
		</div>

		{#if gameState.isGameOver}
			<GameOver cycle={gameState.cycle} onrestart={() => gameState.reset()} />
		{/if}
	</div>

	<!-- Ambient effects -->
	<div class="molten-cracks"></div>
	<div class="ash-particles"></div>
</div>

<style>
	.game-container {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom)
			env(safe-area-inset-left);
		position: relative;
		overflow: hidden;
	}

	.forge-chamber {
		position: relative;
		width: 100%;
		max-width: 500px;
		height: 100%;
		max-height: 100dvh;
		display: flex;
		flex-direction: column;
		gap: clamp(10px, 2.5vw, 16px);
		padding: clamp(12px, 3vw, 20px);
		box-sizing: border-box;
		overflow: hidden;
		z-index: 1;
	}

	.game-header {
		text-align: center;
		flex-shrink: 0;
	}

	.title {
		margin: 0;
		font-size: clamp(1.4rem, 6vw, 2rem);
		color: #ff6b35;
		text-shadow:
			0 0 20px rgba(255, 107, 53, 0.5),
			0 0 40px rgba(255, 107, 53, 0.3);
		letter-spacing: 4px;
		font-weight: bold;
	}

	.title-decoration {
		width: 60%;
		height: 2px;
		margin: 8px auto 0;
		background: linear-gradient(90deg, transparent, #ff6b35, transparent);
		opacity: 0.5;
	}

	.controls {
		display: flex;
		flex-direction: column;
		gap: 10px;
		flex-shrink: 0;
		margin-top: auto;
	}

	.pay-tribute-button {
		width: 100%;
		padding: clamp(10px, 3vw, 14px);
		font-size: clamp(0.85rem, 3.5vw, 1rem);
		font-weight: bold;
		color: #1a0a00;
		background: linear-gradient(180deg, #ffd700, #ffaa00);
		border: none;
		border-radius: 8px;
		cursor: pointer;
		box-shadow: 0 3px 0 #996600;
		transition: all 0.1s ease;
		touch-action: manipulation;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.pay-tribute-button:active {
		transform: translateY(2px);
		box-shadow: 0 1px 0 #996600;
	}

	.pay-tribute-button.disabled,
	.buy-spins-button.disabled {
		background: linear-gradient(180deg, #3a3a3a, #2a2a2a);
		box-shadow: 0 3px 0 #1a1a1a;
		cursor: not-allowed;
		opacity: 0.6;
	}

	.buy-spins-button {
		width: 100%;
		padding: clamp(10px, 3vw, 14px);
		font-size: clamp(0.85rem, 3.5vw, 1rem);
		font-weight: bold;
		color: #1a0a00;
		background: linear-gradient(180deg, #4ade80, #22c55e);
		border: none;
		border-radius: 8px;
		cursor: pointer;
		box-shadow: 0 3px 0 #166534;
		transition: all 0.1s ease;
		touch-action: manipulation;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.buy-spins-button:active:not(.disabled) {
		transform: translateY(2px);
		box-shadow: 0 1px 0 #166534;
	}

	.btn-text {
		display: block;
	}

	.btn-cost {
		display: block;
		font-size: clamp(0.7rem, 2.5vw, 0.85rem);
		opacity: 0.8;
		font-weight: normal;
	}

	.tribute-warning {
		color: #ff6b6b;
		font-size: clamp(0.75rem, 2.5vw, 0.9rem);
		text-align: center;
		margin: 0;
		animation: pulse-warning 1s ease-in-out infinite;
	}

	@keyframes pulse-warning {
		0%, 100% { opacity: 0.8; }
		50% { opacity: 1; }
	}

	.accept-fate-button {
		width: 100%;
		padding: clamp(10px, 3vw, 14px);
		font-size: clamp(0.85rem, 3.5vw, 1rem);
		font-weight: bold;
		color: #fff;
		background: linear-gradient(180deg, #dc2626, #991b1b);
		border: none;
		border-radius: 8px;
		cursor: pointer;
		box-shadow: 0 3px 0 #7f1d1d;
		transition: all 0.1s ease;
		touch-action: manipulation;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.accept-fate-button:active {
		transform: translateY(2px);
		box-shadow: 0 1px 0 #7f1d1d;
	}

	/* Ambient effects */
	.molten-cracks {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 30%;
		background:
			radial-gradient(ellipse at 20% 100%, rgba(255, 100, 0, calc(var(--heat) / 500)) 0%, transparent 50%),
			radial-gradient(ellipse at 80% 100%, rgba(255, 50, 0, calc(var(--heat) / 500)) 0%, transparent 40%),
			radial-gradient(ellipse at 50% 100%, rgba(255, 150, 0, calc(var(--heat) / 400)) 0%, transparent 60%);
		pointer-events: none;
		z-index: 0;
	}

	.ash-particles {
		position: absolute;
		inset: 0;
		background-image:
			radial-gradient(1px 1px at 10% 20%, rgba(255, 200, 150, 0.3) 50%, transparent 50%),
			radial-gradient(1px 1px at 30% 40%, rgba(255, 200, 150, 0.2) 50%, transparent 50%),
			radial-gradient(1px 1px at 60% 30%, rgba(255, 200, 150, 0.3) 50%, transparent 50%),
			radial-gradient(1px 1px at 80% 60%, rgba(255, 200, 150, 0.2) 50%, transparent 50%),
			radial-gradient(1px 1px at 45% 70%, rgba(255, 200, 150, 0.3) 50%, transparent 50%);
		animation: ash-float 8s linear infinite;
		pointer-events: none;
		z-index: 0;
		opacity: calc(var(--heat) / 150);
	}

	@keyframes ash-float {
		from {
			transform: translateY(0);
		}
		to {
			transform: translateY(-100px);
		}
	}
</style>
