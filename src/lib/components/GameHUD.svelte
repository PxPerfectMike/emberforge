<script lang="ts">
	import type { GamePhase } from '$lib/game/types';

	interface Props {
		coins: number;
		tickets: number;
		debt: number;
		tributePaid: number;
		tributeProgress: number;
		tributeBonus: number;
		cycle: number;
		round: number;
		spinsRemaining: number;
		spinsPerBatch: number;
		heat: number;
		lastPayout: number;
		lastTickets: number;
		phase: GamePhase;
	}

	let { coins, tickets, debt, tributePaid, tributeProgress, tributeBonus, cycle, round, spinsRemaining, spinsPerBatch, heat, lastPayout, lastTickets, phase }: Props = $props();

	const showSpinDots = $derived(phase === 'idle' || phase === 'spinning' || phase === 'revealing' || phase === 'win');
	const heatColor = $derived(
		heat < 40 ? '#4ade80' :
		heat < 70 ? '#fbbf24' :
		'#ff6b6b'
	);
</script>

<div class="forge-terminal" style="--heat: {heat}">
	<div class="terminal-frame">
		<div class="terminal-header">
			<div class="rune-indicator"></div>
			<span class="terminal-title">FORGE TERMINAL</span>
			<div class="rune-indicator"></div>
		</div>

		<div class="stat-row">
			<div class="stat coins-display">
				<svg class="coin-icon" viewBox="0 0 24 24" fill="none">
					<circle cx="12" cy="12" r="10" fill="#ffd700" />
					<circle cx="12" cy="12" r="7" fill="#ffaa00" />
					<text x="12" y="16" text-anchor="middle" font-size="10" fill="#8b6914" font-weight="bold">C</text>
				</svg>
				<span class="value">{coins}</span>
			</div>
			<div class="stat tickets-display">
				<svg class="ticket-icon" viewBox="0 0 24 24" fill="none">
					<rect x="2" y="6" width="20" height="12" rx="2" fill="#9b59b6" />
					<circle cx="2" cy="12" r="3" fill="#1a0f08" />
					<circle cx="22" cy="12" r="3" fill="#1a0f08" />
					<text x="12" y="15" text-anchor="middle" font-size="8" fill="#fff" font-weight="bold">TKT</text>
				</svg>
				<span class="value ticket-value">{tickets}</span>
			</div>
		</div>

		<div class="cycle-display">
			<span class="cycle-label">CYCLE {cycle}{round > 0 ? `.${round}` : ''}</span>
			{#if showSpinDots}
				<div class="spins-remaining">
					<span class="spins-count">{spinsRemaining}/{spinsPerBatch}</span>
				</div>
			{:else if phase === 'between_rounds'}
				<span class="phase-indicator between">BETWEEN ROUNDS</span>
			{/if}
		</div>

		<div class="demand-section">
			<div class="demand-header">
				<span class="demand-label">TRIBUTE PAID</span>
				<span class="demand-value">{tributePaid}/{debt}</span>
			</div>
			<div class="demand-bar">
				<div class="demand-progress" style="width: {tributeProgress}%"></div>
				<div class="demand-marker" style="left: {Math.min(tributeProgress, 100)}%"></div>
			</div>
			<div class="demand-status">
				{#if tributeProgress >= 100}
					<span class="can-pay">CYCLE COMPLETE</span>
				{:else if tributeBonus > 1}
					<span class="bonus-active">BONUS: x{tributeBonus.toFixed(2)}</span>
				{:else}
					<span class="need-more">PAY TRIBUTE FOR BONUS</span>
				{/if}
			</div>
		</div>

		<div class="heat-gauge">
			<span class="heat-label">HEAT</span>
			<div class="heat-bar">
				<div class="heat-fill" style="width: {heat}%; background: {heatColor}"></div>
			</div>
		</div>
	</div>

	{#if lastPayout > 0}
		<div class="payout-flash">
			+{lastPayout}
			{#if lastTickets > 0}
				<span class="ticket-bonus">+{lastTickets} TKT</span>
			{/if}
		</div>
	{/if}
</div>

<style>
	.forge-terminal {
		width: 100%;
		position: relative;
	}

	.terminal-frame {
		background: linear-gradient(180deg, #1a1208 0%, #0f0a05 100%);
		border: 2px solid #4a3520;
		border-radius: 6px;
		padding: clamp(6px, 2vw, 12px);
		box-shadow:
			inset 0 0 20px rgba(255, 100, 0, 0.1),
			0 0 calc(var(--heat) * 0.3px) rgba(255, 100, 0, 0.3);
	}

	.terminal-header {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		margin-bottom: 8px;
		padding-bottom: 6px;
		border-bottom: 1px solid #3a2515;
	}

	.rune-indicator {
		width: 8px;
		height: 8px;
		background: #ff6b35;
		border-radius: 50%;
		box-shadow: 0 0 8px #ff6b35;
		animation: rune-pulse 2s ease-in-out infinite;
	}

	.terminal-title {
		font-size: clamp(0.65rem, 2.5vw, 0.8rem);
		color: #8a7a6a;
		letter-spacing: 2px;
		text-transform: uppercase;
	}

	.stat-row {
		display: flex;
		justify-content: space-between;
		gap: 8px;
		margin-bottom: 6px;
	}

	.stat {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.coin-icon, .ticket-icon {
		width: clamp(18px, 4vw, 24px);
		height: clamp(18px, 4vw, 24px);
	}

	.value {
		font-size: clamp(1rem, 4vw, 1.3rem);
		font-weight: bold;
		color: #ffd700;
		font-family: monospace;
	}

	.ticket-value {
		color: #bb6bd9;
	}

	.cycle-display {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 6px;
		padding: 4px 8px;
		background: rgba(0, 0, 0, 0.3);
		border-radius: 4px;
	}

	.cycle-label {
		font-size: clamp(0.7rem, 2.5vw, 0.85rem);
		color: #ff9f43;
		font-weight: bold;
		letter-spacing: 1px;
	}

	.spins-remaining {
		display: flex;
		align-items: center;
	}

	.spins-count {
		font-size: clamp(0.8rem, 3vw, 1rem);
		color: #ff6b35;
		font-weight: bold;
		font-family: monospace;
		text-shadow: 0 0 6px rgba(255, 107, 53, 0.5);
	}

	.phase-indicator {
		font-size: clamp(0.6rem, 2vw, 0.75rem);
		font-weight: bold;
		padding: 2px 8px;
		border-radius: 4px;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.phase-indicator.between {
		background: rgba(251, 191, 36, 0.2);
		color: #fbbf24;
		border: 1px solid #fbbf24;
	}

	.bonus-active {
		color: #4ade80;
		text-shadow: 0 0 8px rgba(74, 222, 128, 0.5);
	}

	.demand-section {
		background: linear-gradient(145deg, #2a1510, #1a0a05);
		padding: clamp(6px, 1.5vw, 10px);
		border-radius: 4px;
		border: 1px solid #4a2515;
		margin-bottom: 6px;
	}

	.demand-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 4px;
	}

	.demand-label {
		font-size: clamp(0.6rem, 2vw, 0.75rem);
		color: #ff6b6b;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.demand-value {
		font-size: clamp(1rem, 3.5vw, 1.2rem);
		font-weight: bold;
		color: #ff6b6b;
		font-family: monospace;
	}

	.demand-bar {
		height: 8px;
		background: #0a0505;
		border-radius: 4px;
		overflow: visible;
		position: relative;
	}

	.demand-progress {
		height: 100%;
		background: linear-gradient(90deg, #ff6b35, #ffd700);
		border-radius: 4px;
		transition: width 0.3s ease;
	}

	.demand-marker {
		position: absolute;
		top: -1px;
		width: 3px;
		height: 10px;
		background: #fff;
		border-radius: 2px;
		transform: translateX(-50%);
		box-shadow: 0 0 4px #fff;
	}

	.demand-status {
		margin-top: 4px;
		font-size: clamp(0.6rem, 1.8vw, 0.7rem);
		text-align: center;
		letter-spacing: 1px;
	}

	.can-pay {
		color: #4ade80;
		text-shadow: 0 0 8px rgba(74, 222, 128, 0.5);
	}

	.need-more {
		color: #888;
	}

	.heat-gauge {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.heat-label {
		font-size: clamp(0.55rem, 1.8vw, 0.65rem);
		color: #666;
		text-transform: uppercase;
		min-width: 30px;
	}

	.heat-bar {
		flex: 1;
		height: 5px;
		background: #1a0a05;
		border-radius: 3px;
		overflow: hidden;
	}

	.heat-fill {
		height: 100%;
		border-radius: 3px;
		transition: all 0.5s ease;
		box-shadow: 0 0 8px currentColor;
	}

	.payout-flash {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: clamp(2rem, 10vw, 3.5rem);
		font-weight: bold;
		color: #ffd700;
		text-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
		animation: payout-pop 1.2s ease-out forwards;
		pointer-events: none;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.ticket-bonus {
		font-size: clamp(1rem, 4vw, 1.5rem);
		color: #bb6bd9;
		text-shadow: 0 0 20px rgba(187, 107, 217, 0.8);
	}

	@keyframes rune-pulse {
		0%, 100% { opacity: 0.6; transform: scale(1); }
		50% { opacity: 1; transform: scale(1.2); }
	}

	@keyframes payout-pop {
		0% {
			opacity: 0;
			transform: translate(-50%, -50%) scale(0.5);
		}
		15% {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1.2);
		}
		100% {
			opacity: 0;
			transform: translate(-50%, -70%) scale(1);
		}
	}
</style>
