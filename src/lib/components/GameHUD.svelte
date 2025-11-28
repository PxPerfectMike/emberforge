<script lang="ts">
	interface Props {
		coins: number;
		tickets: number;
		debt: number;
		cycle: number;
		spinsRemaining: number;
		heat: number;
		lastPayout: number;
		lastTickets: number;
	}

	let { coins, tickets, debt, cycle, spinsRemaining, heat, lastPayout, lastTickets }: Props = $props();

	const debtProgress = $derived(Math.min((coins / debt) * 100, 100));
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
			<span class="cycle-label">CYCLE {cycle}</span>
			<div class="spins-remaining">
				{#each Array(3) as _, i}
					<span class="spin-dot" class:used={i >= spinsRemaining}></span>
				{/each}
			</div>
		</div>

		<div class="demand-section">
			<div class="demand-header">
				<span class="demand-label">THE FORGE DEMANDS</span>
				<span class="demand-value">{debt}</span>
			</div>
			<div class="demand-bar">
				<div class="demand-progress" style="width: {debtProgress}%"></div>
				<div class="demand-marker" style="left: {Math.min(debtProgress, 100)}%"></div>
			</div>
			<div class="demand-status">
				{#if coins >= debt}
					<span class="can-pay">TRIBUTE READY</span>
				{:else}
					<span class="need-more">NEED {debt - coins} MORE</span>
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
		border: 3px solid #4a3520;
		border-radius: 8px;
		padding: clamp(10px, 2.5vw, 16px);
		box-shadow:
			inset 0 0 20px rgba(255, 100, 0, 0.1),
			0 0 calc(var(--heat) * 0.3px) rgba(255, 100, 0, 0.3);
	}

	.terminal-header {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		margin-bottom: 12px;
		padding-bottom: 8px;
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
		gap: 12px;
		margin-bottom: 10px;
	}

	.stat {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.coin-icon, .ticket-icon {
		width: clamp(20px, 5vw, 28px);
		height: clamp(20px, 5vw, 28px);
	}

	.value {
		font-size: clamp(1.1rem, 4.5vw, 1.5rem);
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
		margin-bottom: 10px;
		padding: 6px 10px;
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
		gap: 6px;
	}

	.spin-dot {
		width: 12px;
		height: 12px;
		background: #ff6b35;
		border-radius: 50%;
		box-shadow: 0 0 6px #ff6b35;
		transition: all 0.3s ease;
	}

	.spin-dot.used {
		background: #2a1a10;
		box-shadow: none;
	}

	.demand-section {
		background: linear-gradient(145deg, #2a1510, #1a0a05);
		padding: clamp(8px, 2vw, 12px);
		border-radius: 6px;
		border: 1px solid #4a2515;
		margin-bottom: 10px;
	}

	.demand-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 6px;
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
		height: 10px;
		background: #0a0505;
		border-radius: 5px;
		overflow: visible;
		position: relative;
	}

	.demand-progress {
		height: 100%;
		background: linear-gradient(90deg, #ff6b35, #ffd700);
		border-radius: 5px;
		transition: width 0.3s ease;
	}

	.demand-marker {
		position: absolute;
		top: -2px;
		width: 4px;
		height: 14px;
		background: #fff;
		border-radius: 2px;
		transform: translateX(-50%);
		box-shadow: 0 0 6px #fff;
	}

	.demand-status {
		margin-top: 6px;
		font-size: clamp(0.65rem, 2vw, 0.75rem);
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
		gap: 8px;
	}

	.heat-label {
		font-size: clamp(0.6rem, 2vw, 0.7rem);
		color: #666;
		text-transform: uppercase;
		min-width: 35px;
	}

	.heat-bar {
		flex: 1;
		height: 6px;
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
