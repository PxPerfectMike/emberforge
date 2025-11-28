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

		<SlotMachine
			grid={gameState.grid}
			phase={gameState.phase}
			heat={gameState.forgeHeat}
		/>

		<div class="controls">
			{#if gameState.phase === 'between_rounds'}
				<!-- Between rounds: can pay tribute or buy spins -->
				{#if gameState.tributeRemaining > 0}
					<div class="tribute-section">
						<div class="tribute-info">
							<span class="tribute-label">TRIBUTE REMAINING</span>
							<span class="tribute-amount">{gameState.tributeRemaining}</span>
						</div>
						{#if gameState.tributeBonus > 1}
							<div class="bonus-indicator">
								BONUS: x{gameState.tributeBonus.toFixed(2)}
							</div>
						{/if}
						{#if gameState.canPayTribute}
							<button
								class="pay-tribute-button"
								onclick={() => gameState.payTribute()}
							>
								<span class="btn-text">PAY TRIBUTE</span>
								<span class="btn-cost">-{gameState.maxTributePayment} coins (max)</span>
							</button>
						{/if}
					</div>
				{:else}
					<div class="tribute-complete">
						TRIBUTE COMPLETE - NEXT CYCLE READY
					</div>
				{/if}

				{#if gameState.isStuck}
					<!-- Can't afford spins and tribute not paid -->
					<p class="tribute-warning">Not enough coins! The forge will consume you...</p>
					<button class="accept-fate-button" onclick={() => gameState.acceptFate()}>
						ACCEPT YOUR FATE
					</button>
				{:else if gameState.canBuySpins}
					<button
						class="buy-spins-button"
						onclick={() => gameState.buySpins()}
					>
						<span class="btn-text">BUY {gameState.spinsPerBatch} SPINS</span>
						<span class="btn-cost">-{gameState.spinBatchCost} coins</span>
					</button>
				{/if}
			{:else}
				<!-- During spins: show spin button -->
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
		gap: clamp(6px, 1.5vh, 12px);
		padding: clamp(8px, 2vw, 16px);
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
		font-size: clamp(1.2rem, 5vw, 1.8rem);
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
		margin: 4px auto 0;
		background: linear-gradient(90deg, transparent, #ff6b35, transparent);
		opacity: 0.5;
	}

	.controls {
		display: flex;
		flex-direction: column;
		gap: clamp(6px, 1.5vh, 10px);
		flex-shrink: 0;
		margin-top: auto;
	}

	.tribute-section {
		display: flex;
		flex-direction: column;
		gap: clamp(4px, 1vh, 8px);
		padding: clamp(8px, 2vw, 12px);
		background: linear-gradient(145deg, #2a1510, #1a0a05);
		border: 1px solid #4a2515;
		border-radius: 6px;
	}

	.tribute-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.tribute-label {
		font-size: clamp(0.7rem, 2.5vw, 0.85rem);
		color: #ff6b6b;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.tribute-amount {
		font-size: clamp(1.1rem, 4vw, 1.4rem);
		font-weight: bold;
		color: #ff6b6b;
		font-family: monospace;
	}

	.bonus-indicator {
		font-size: clamp(0.7rem, 2.5vw, 0.85rem);
		color: #4ade80;
		text-align: center;
		padding: 4px 8px;
		background: rgba(74, 222, 128, 0.1);
		border: 1px solid rgba(74, 222, 128, 0.3);
		border-radius: 4px;
		text-shadow: 0 0 8px rgba(74, 222, 128, 0.5);
	}

	.tribute-complete {
		font-size: clamp(0.7rem, 2.5vw, 0.9rem);
		color: #4ade80;
		text-align: center;
		padding: clamp(8px, 2vw, 12px);
		background: rgba(74, 222, 128, 0.1);
		border: 1px solid rgba(74, 222, 128, 0.3);
		border-radius: 6px;
		text-shadow: 0 0 8px rgba(74, 222, 128, 0.5);
		letter-spacing: 1px;
		animation: pulse-complete 2s ease-in-out infinite;
	}

	@keyframes pulse-complete {
		0%, 100% { opacity: 0.8; box-shadow: 0 0 10px rgba(74, 222, 128, 0.2); }
		50% { opacity: 1; box-shadow: 0 0 20px rgba(74, 222, 128, 0.4); }
	}

	.pay-tribute-button {
		width: 100%;
		padding: clamp(8px, 2vw, 12px);
		font-size: clamp(0.75rem, 3vw, 0.9rem);
		font-weight: bold;
		color: #1a0a00;
		background: linear-gradient(180deg, #ffd700, #ffaa00);
		border: none;
		border-radius: 6px;
		cursor: pointer;
		box-shadow: 0 2px 0 #996600;
		transition: all 0.1s ease;
		touch-action: manipulation;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.pay-tribute-button:active {
		transform: translateY(2px);
		box-shadow: 0 1px 0 #996600;
	}

	.buy-spins-button {
		width: 100%;
		padding: clamp(10px, 2.5vw, 14px);
		font-size: clamp(0.8rem, 3.5vw, 1rem);
		font-weight: bold;
		color: #1a0a00;
		background: linear-gradient(180deg, #4ade80, #22c55e);
		border: none;
		border-radius: 6px;
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
