<script lang="ts">
	interface Props {
		cycle: number;
		onrestart: () => void;
	}

	let { cycle, onrestart }: Props = $props();
</script>

<div class="forge-consumed-overlay">
	<div class="flames-bg"></div>
	<div class="forge-consumed-content">
		<div class="skull-icon">
			<svg viewBox="0 0 100 100" fill="none">
				<ellipse cx="50" cy="45" rx="35" ry="40" fill="#2a1a0a" />
				<ellipse cx="35" cy="40" rx="10" ry="12" fill="#ff6b35" />
				<ellipse cx="65" cy="40" rx="10" ry="12" fill="#ff6b35" />
				<path d="M35,65 L40,75 L45,65 L50,75 L55,65 L60,75 L65,65" stroke="#1a0a00" stroke-width="3" />
			</svg>
		</div>
		<h1 class="title">CONSUMED BY FLAME</h1>
		<p class="message">The forge has claimed you...</p>
		<p class="stats">Survived {cycle - 1} cycle{cycle > 2 ? 's' : ''}</p>
		<button class="restart-button" onclick={onrestart}>
			Return to the Forge
		</button>
	</div>
</div>

<style>
	.forge-consumed-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, rgba(30, 10, 0, 0.95), rgba(50, 20, 0, 0.98));
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
		animation: fade-in 0.5s ease;
		overflow: hidden;
	}

	.flames-bg {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(ellipse at 50% 100%, rgba(255, 100, 0, 0.4) 0%, transparent 50%),
			radial-gradient(ellipse at 30% 90%, rgba(255, 50, 0, 0.3) 0%, transparent 40%),
			radial-gradient(ellipse at 70% 95%, rgba(255, 150, 0, 0.3) 0%, transparent 40%);
		animation: flames-flicker 1s ease-in-out infinite alternate;
	}

	.forge-consumed-content {
		text-align: center;
		padding: clamp(20px, 5vw, 40px);
		position: relative;
		z-index: 1;
	}

	.skull-icon {
		width: clamp(60px, 15vw, 100px);
		height: clamp(60px, 15vw, 100px);
		margin: 0 auto 16px;
		animation: skull-pulse 1s ease-in-out infinite alternate;
	}

	.skull-icon svg {
		width: 100%;
		height: 100%;
		filter: drop-shadow(0 0 20px rgba(255, 107, 53, 0.8));
	}

	.title {
		font-size: clamp(1.5rem, 8vw, 3rem);
		color: #ff6b35;
		margin: 0 0 16px;
		text-shadow: 0 0 30px rgba(255, 107, 53, 0.8);
		animation: shake 0.5s ease-in-out;
		letter-spacing: 2px;
	}

	.message {
		font-size: clamp(1rem, 4vw, 1.4rem);
		color: #aa8866;
		margin: 0 0 8px;
	}

	.stats {
		font-size: clamp(0.9rem, 3vw, 1.1rem);
		color: #886644;
		margin: 0 0 24px;
	}

	.restart-button {
		padding: clamp(12px, 3vw, 16px) clamp(24px, 6vw, 40px);
		font-size: clamp(0.9rem, 3.5vw, 1.1rem);
		font-weight: bold;
		color: #fff;
		background: linear-gradient(180deg, #ff6b35, #cc4400);
		border: none;
		border-radius: 8px;
		cursor: pointer;
		box-shadow: 0 4px 0 #661500;
		transition: all 0.1s ease;
		touch-action: manipulation;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.restart-button:active {
		transform: translateY(2px);
		box-shadow: 0 2px 0 #661500;
	}

	@keyframes fade-in {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes shake {
		0%, 100% { transform: translateX(0); }
		20%, 60% { transform: translateX(-10px); }
		40%, 80% { transform: translateX(10px); }
	}

	@keyframes flames-flicker {
		from { opacity: 0.8; transform: scale(1); }
		to { opacity: 1; transform: scale(1.05); }
	}

	@keyframes skull-pulse {
		from { transform: scale(1); }
		to { transform: scale(1.1); }
	}
</style>
