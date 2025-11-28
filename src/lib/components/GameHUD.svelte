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

	const showSpins = $derived(phase === 'idle' || phase === 'spinning' || phase === 'revealing' || phase === 'win');
	const heatColor = $derived(
		heat < 40 ? '#4ade80' :
		heat < 70 ? '#fbbf24' :
		'#ff6b6b'
	);
</script>

<div class="hud">
	<!-- Top row: Coins, Cycle, Tickets -->
	<div class="hud-top">
		<div class="stat coins">
			<svg viewBox="0 0 24 24" class="icon">
				<circle cx="12" cy="12" r="10" fill="#ffd700" />
				<circle cx="12" cy="12" r="7" fill="#ffaa00" />
				<text x="12" y="16" text-anchor="middle" font-size="10" fill="#8b6914" font-weight="bold">C</text>
			</svg>
			<span class="value">{coins}</span>
		</div>

		<div class="cycle-badge">
			<span class="cycle-num">C{cycle}</span>
			{#if showSpins}
				<span class="spins">{spinsRemaining}/{spinsPerBatch}</span>
			{:else}
				<span class="round">.{round}</span>
			{/if}
		</div>

		<div class="stat tickets">
			<svg viewBox="0 0 24 24" class="icon">
				<rect x="2" y="6" width="20" height="12" rx="2" fill="#9b59b6" />
				<circle cx="2" cy="12" r="3" fill="#1a0f08" />
				<circle cx="22" cy="12" r="3" fill="#1a0f08" />
			</svg>
			<span class="value">{tickets}</span>
		</div>
	</div>

	<!-- Progress bar: Tribute -->
	<div class="tribute-bar">
		<div class="bar-bg">
			<div class="bar-fill" style="width: {tributeProgress}%"></div>
		</div>
		<div class="tribute-text">
			<span class="label">TRIBUTE</span>
			<span class="progress">{tributePaid}/{debt}</span>
		</div>
	</div>

	<!-- Heat indicator -->
	<div class="heat-row">
		<span class="heat-label">HEAT</span>
		<div class="heat-bar">
			<div class="heat-fill" style="width: {heat}%; background: {heatColor}"></div>
		</div>
		{#if tributeBonus > 1}
			<span class="bonus">x{tributeBonus.toFixed(1)}</span>
		{/if}
	</div>

	<!-- Payout flash -->
	{#if lastPayout > 0}
		<div class="payout">
			+{lastPayout}
			{#if lastTickets > 0}
				<span class="tkt">+{lastTickets}TKT</span>
			{/if}
		</div>
	{/if}
</div>

<style>
	.hud {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: 6px;
		background: linear-gradient(180deg, #1a1208 0%, #0f0a05 100%);
		border: 2px solid #4a3520;
		border-radius: 6px;
		padding: 8px;
		box-sizing: border-box;
		position: relative;
	}

	.hud-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.stat {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.icon {
		width: 20px;
		height: 20px;
	}

	.value {
		font-size: clamp(0.9rem, 4vw, 1.1rem);
		font-weight: bold;
		font-family: monospace;
	}

	.coins .value {
		color: #ffd700;
	}

	.tickets .value {
		color: #bb6bd9;
	}

	.cycle-badge {
		display: flex;
		align-items: baseline;
		gap: 2px;
		padding: 4px 10px;
		background: rgba(0, 0, 0, 0.4);
		border-radius: 4px;
		border: 1px solid #3a2515;
	}

	.cycle-num {
		font-size: clamp(0.8rem, 3vw, 0.95rem);
		color: #ff9f43;
		font-weight: bold;
	}

	.spins {
		font-size: clamp(0.75rem, 2.5vw, 0.9rem);
		color: #ff6b35;
		font-family: monospace;
	}

	.round {
		font-size: clamp(0.7rem, 2.5vw, 0.85rem);
		color: #888;
	}

	.tribute-bar {
		position: relative;
	}

	.bar-bg {
		height: 14px;
		background: #0a0505;
		border-radius: 3px;
		overflow: hidden;
	}

	.bar-fill {
		height: 100%;
		background: linear-gradient(90deg, #ff6b35, #ffd700);
		transition: width 0.3s ease;
	}

	.tribute-text {
		position: absolute;
		inset: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 6px;
		font-size: clamp(0.55rem, 2vw, 0.7rem);
	}

	.label {
		color: rgba(255, 255, 255, 0.7);
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.progress {
		color: #fff;
		font-family: monospace;
		font-weight: bold;
	}

	.heat-row {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.heat-label {
		font-size: clamp(0.5rem, 1.8vw, 0.6rem);
		color: #666;
		text-transform: uppercase;
		min-width: 28px;
	}

	.heat-bar {
		flex: 1;
		height: 4px;
		background: #1a0a05;
		border-radius: 2px;
		overflow: hidden;
	}

	.heat-fill {
		height: 100%;
		border-radius: 2px;
		transition: all 0.5s ease;
		box-shadow: 0 0 6px currentColor;
	}

	.bonus {
		font-size: clamp(0.6rem, 2vw, 0.75rem);
		color: #4ade80;
		font-weight: bold;
		padding: 1px 4px;
		background: rgba(74, 222, 128, 0.15);
		border-radius: 3px;
	}

	.payout {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: clamp(1.5rem, 8vw, 2.5rem);
		font-weight: bold;
		color: #ffd700;
		text-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
		animation: pop 1.2s ease-out forwards;
		pointer-events: none;
		display: flex;
		align-items: baseline;
		gap: 8px;
	}

	.tkt {
		font-size: clamp(0.8rem, 3vw, 1rem);
		color: #bb6bd9;
	}

	@keyframes pop {
		0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
		15% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
		100% { opacity: 0; transform: translate(-50%, -70%) scale(1); }
	}
</style>
