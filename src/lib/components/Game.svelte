<script lang="ts">
	import { gameState } from '$lib/game/state.svelte';
	import SlotMachine from './SlotMachine.svelte';
	import GameHUD from './GameHUD.svelte';
	import SpinButton from './SpinButton.svelte';
	import GameOver from './GameOver.svelte';

	const isSpinning = $derived(gameState.phase === 'spinning' || gameState.phase === 'revealing');
</script>

<div class="game-layout" style="--heat: {gameState.forgeHeat}">
	<!-- Header area - fixed -->
	<header class="game-header">
		<h1 class="title">EMBERFORGE</h1>
	</header>

	<!-- HUD area - fixed proportion -->
	<section class="hud-area">
		<GameHUD
			coins={gameState.coins}
			tickets={gameState.tickets}
			debt={gameState.debt}
			tributePaid={gameState.tributePaid}
			tributeProgress={gameState.tributeProgress}
			tributeBonus={gameState.tributeBonus}
			cycle={gameState.cycle}
			round={gameState.round}
			spinsRemaining={gameState.spinsRemaining}
			spinsPerBatch={gameState.spinsPerBatch}
			heat={gameState.forgeHeat}
			lastPayout={gameState.lastPayout}
			lastTickets={gameState.lastTickets}
			phase={gameState.phase}
		/>
	</section>

	<!-- Slot machine area - stable fixed proportion -->
	<section class="slot-area">
		<SlotMachine
			grid={gameState.grid}
			phase={gameState.phase}
			heat={gameState.forgeHeat}
		/>
	</section>

	<!-- Controls area - fixed height, content changes but container stable -->
	<section class="controls-area">
		{#if gameState.phase === 'between_rounds'}
			<div class="between-rounds-controls">
				{#if gameState.tributeRemaining > 0}
					<div class="tribute-row">
						<div class="tribute-info">
							<span class="tribute-label">TRIBUTE:</span>
							<span class="tribute-amount">{gameState.tributeRemaining}</span>
						</div>
						{#if gameState.tributeBonus > 1}
							<div class="bonus-tag">x{gameState.tributeBonus.toFixed(2)}</div>
						{/if}
						{#if gameState.canPayTribute}
							<button class="pay-btn" onclick={() => gameState.payTribute()}>
								PAY -{gameState.maxTributePayment}
							</button>
						{/if}
					</div>
				{:else}
					<div class="tribute-complete">TRIBUTE COMPLETE</div>
				{/if}

				{#if gameState.isStuck}
					<p class="warning-text">The forge will consume you...</p>
					<button class="fate-btn" onclick={() => gameState.acceptFate()}>
						ACCEPT FATE
					</button>
				{:else if gameState.canBuySpins}
					<button class="buy-btn" onclick={() => gameState.buySpins()}>
						BUY {gameState.spinsPerBatch} SPINS
						<span class="cost">-{gameState.spinBatchCost}</span>
					</button>
				{/if}
			</div>
		{:else}
			<SpinButton
				canSpin={gameState.canSpin}
				{isSpinning}
				onclick={() => gameState.spin()}
			/>
		{/if}
	</section>

	{#if gameState.isGameOver}
		<GameOver cycle={gameState.cycle} onrestart={() => gameState.reset()} />
	{/if}

	<!-- Ambient heat effects -->
	<div class="heat-overlay"></div>
</div>

<style>
	.game-layout {
		width: 100%;
		height: 100%;
		display: grid;
		/* Fixed proportions: header(auto) hud(~18%) slots(~52%) controls(~18%) + gaps */
		grid-template-rows: auto minmax(0, 18fr) minmax(0, 52fr) minmax(0, 18fr);
		gap: 8px;
		padding: 8px;
		box-sizing: border-box;
		background: radial-gradient(ellipse at center bottom, #2a1a10 0%, #1a0f08 50%, #0f0805 100%);
		position: relative;
		overflow: hidden;
	}

	.game-header {
		text-align: center;
		padding: 4px 0;
	}

	.title {
		margin: 0;
		font-size: clamp(1rem, 5vw, 1.5rem);
		color: #ff6b35;
		text-shadow: 0 0 20px rgba(255, 107, 53, 0.5);
		letter-spacing: 3px;
		font-weight: bold;
	}

	.hud-area {
		min-height: 0;
		overflow: hidden;
	}

	.slot-area {
		min-height: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.controls-area {
		min-height: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 6px;
	}

	/* Between rounds controls */
	.between-rounds-controls {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.tribute-row {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 12px;
		background: linear-gradient(145deg, #2a1510, #1a0a05);
		border: 1px solid #4a2515;
		border-radius: 6px;
	}

	.tribute-info {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.tribute-label {
		font-size: clamp(0.65rem, 2.5vw, 0.8rem);
		color: #ff6b6b;
		text-transform: uppercase;
	}

	.tribute-amount {
		font-size: clamp(0.9rem, 3.5vw, 1.1rem);
		font-weight: bold;
		color: #ff6b6b;
		font-family: monospace;
	}

	.bonus-tag {
		font-size: clamp(0.6rem, 2vw, 0.75rem);
		color: #4ade80;
		padding: 2px 6px;
		background: rgba(74, 222, 128, 0.15);
		border: 1px solid rgba(74, 222, 128, 0.4);
		border-radius: 4px;
	}

	.pay-btn {
		margin-left: auto;
		padding: 6px 12px;
		font-size: clamp(0.7rem, 2.5vw, 0.85rem);
		font-weight: bold;
		color: #1a0a00;
		background: linear-gradient(180deg, #ffd700, #ffaa00);
		border: none;
		border-radius: 4px;
		cursor: pointer;
		box-shadow: 0 2px 0 #996600;
		touch-action: manipulation;
	}

	.pay-btn:active {
		transform: translateY(1px);
		box-shadow: 0 1px 0 #996600;
	}

	.tribute-complete {
		font-size: clamp(0.7rem, 2.5vw, 0.85rem);
		color: #4ade80;
		text-align: center;
		padding: 8px;
		background: rgba(74, 222, 128, 0.1);
		border: 1px solid rgba(74, 222, 128, 0.3);
		border-radius: 6px;
	}

	.buy-btn {
		width: 100%;
		padding: 12px;
		font-size: clamp(0.85rem, 3.5vw, 1rem);
		font-weight: bold;
		color: #1a0a00;
		background: linear-gradient(180deg, #4ade80, #22c55e);
		border: none;
		border-radius: 6px;
		cursor: pointer;
		box-shadow: 0 3px 0 #166534;
		touch-action: manipulation;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
	}

	.buy-btn:active {
		transform: translateY(2px);
		box-shadow: 0 1px 0 #166534;
	}

	.cost {
		font-size: clamp(0.7rem, 2.5vw, 0.85rem);
		opacity: 0.8;
		font-weight: normal;
	}

	.warning-text {
		color: #ff6b6b;
		font-size: clamp(0.75rem, 2.5vw, 0.85rem);
		text-align: center;
		margin: 0;
		animation: pulse 1s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 0.7; }
		50% { opacity: 1; }
	}

	.fate-btn {
		width: 100%;
		padding: 12px;
		font-size: clamp(0.85rem, 3.5vw, 1rem);
		font-weight: bold;
		color: #fff;
		background: linear-gradient(180deg, #dc2626, #991b1b);
		border: none;
		border-radius: 6px;
		cursor: pointer;
		box-shadow: 0 3px 0 #7f1d1d;
		touch-action: manipulation;
	}

	.fate-btn:active {
		transform: translateY(2px);
		box-shadow: 0 1px 0 #7f1d1d;
	}

	/* Ambient heat effect */
	.heat-overlay {
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 100;
		background:
			radial-gradient(ellipse at 30% 100%, rgba(255, 100, 0, calc(var(--heat) / 600)) 0%, transparent 50%),
			radial-gradient(ellipse at 70% 100%, rgba(255, 50, 0, calc(var(--heat) / 600)) 0%, transparent 40%);
	}
</style>
