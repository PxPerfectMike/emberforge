<script lang="ts">
	interface Props {
		canSpin: boolean;
		isSpinning: boolean;
		spinCost: number;
		onclick: () => void;
	}

	let { canSpin, isSpinning, spinCost, onclick }: Props = $props();
</script>

<button
	class="forge-button"
	class:disabled={!canSpin}
	class:spinning={isSpinning}
	disabled={!canSpin}
	{onclick}
>
	{#if isSpinning}
		<span class="forge-spinner"></span>
	{:else}
		<span class="text">WORK THE FORGE</span>
		<span class="cost">-{spinCost} coins</span>
	{/if}
</button>

<style>
	.forge-button {
		width: 100%;
		padding: clamp(14px, 4vw, 20px);
		font-size: clamp(1rem, 4.5vw, 1.4rem);
		font-weight: bold;
		text-transform: uppercase;
		letter-spacing: 2px;
		color: #fff;
		background: linear-gradient(180deg, #ff6b35 0%, #cc4400 50%, #992200 100%);
		border: none;
		border-radius: 8px;
		cursor: pointer;
		box-shadow:
			0 4px 0 #661500,
			0 6px 20px rgba(255, 107, 53, 0.3),
			inset 0 1px 0 rgba(255, 200, 150, 0.3);
		transition: all 0.1s ease;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		touch-action: manipulation;
		-webkit-tap-highlight-color: transparent;
		position: relative;
		overflow: hidden;
	}

	.forge-button::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 200, 100, 0.2), transparent);
		animation: shimmer 2s infinite;
	}

	.forge-button:active:not(.disabled) {
		transform: translateY(2px);
		box-shadow:
			0 2px 0 #661500,
			0 4px 10px rgba(255, 107, 53, 0.3);
	}

	.disabled {
		background: linear-gradient(180deg, #3a2a20, #2a1a10);
		box-shadow: 0 4px 0 #1a0a00;
		cursor: not-allowed;
		opacity: 0.6;
	}

	.disabled::before {
		animation: none;
	}

	.spinning {
		background: linear-gradient(180deg, #4a3020, #3a2010);
	}

	.text {
		line-height: 1;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
	}

	.cost {
		font-size: clamp(0.65rem, 2.5vw, 0.85rem);
		opacity: 0.9;
		font-weight: normal;
	}

	.forge-spinner {
		width: 28px;
		height: 28px;
		border: 3px solid rgba(255, 150, 100, 0.3);
		border-top-color: #ffd700;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes shimmer {
		to {
			left: 100%;
		}
	}
</style>
