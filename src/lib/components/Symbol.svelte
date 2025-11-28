<script lang="ts">
	import type { SymbolId } from '$lib/game/types';

	interface Props {
		symbolId: SymbolId;
		isWinning?: boolean;
		isSpinning?: boolean;
	}

	let { symbolId, isWinning = false, isSpinning = false }: Props = $props();

	// Color schemes for each symbol
	const symbolColors: Record<SymbolId, { primary: string; secondary: string; glow: string }> = {
		slag: { primary: '#666', secondary: '#444', glow: '#888' },
		coal: { primary: '#1a1a1a', secondary: '#333', glow: '#555' },
		ember: { primary: '#ff6b35', secondary: '#ff4500', glow: '#ff8c00' },
		ingot: { primary: '#c0c0c0', secondary: '#a0a0a0', glow: '#e0e0e0' },
		rune: { primary: '#9b59b6', secondary: '#8e44ad', glow: '#bb6bd9' },
		crown: { primary: '#ffd700', secondary: '#ffaa00', glow: '#ffee88' }
	};

	const colors = $derived(symbolColors[symbolId]);
</script>

<div class="symbol" class:winning={isWinning} class:spinning={isSpinning}>
	<svg viewBox="0 0 100 100" class="icon">
		{#if symbolId === 'slag'}
			<!-- Broken rock/slag -->
			<polygon points="50,15 75,35 70,70 55,85 30,75 25,40" fill={colors.primary} />
			<polygon points="50,15 55,45 75,35" fill={colors.secondary} />
			<polygon points="55,45 70,70 55,85 45,60" fill="#555" />
		{:else if symbolId === 'coal'}
			<!-- Coal chunk -->
			<ellipse cx="50" cy="55" rx="35" ry="30" fill={colors.primary} />
			<ellipse cx="45" cy="50" rx="25" ry="20" fill={colors.secondary} />
			<ellipse cx="55" cy="45" rx="10" ry="8" fill="#444" />
		{:else if symbolId === 'ember'}
			<!-- Glowing ember/flame -->
			<ellipse cx="50" cy="60" rx="25" ry="15" fill={colors.secondary} opacity="0.5" />
			<path d="M50,20 Q65,40 55,55 Q60,65 50,80 Q40,65 45,55 Q35,40 50,20" fill={colors.primary} />
			<path d="M50,35 Q58,48 52,60 Q55,68 50,75 Q45,68 48,60 Q42,48 50,35" fill={colors.glow} />
			<ellipse cx="50" cy="55" rx="8" ry="12" fill="#fff" opacity="0.6" />
		{:else if symbolId === 'ingot'}
			<!-- Metal ingot -->
			<path d="M20,60 L35,40 L80,40 L80,60 L65,80 L20,80 Z" fill={colors.primary} />
			<path d="M35,40 L80,40 L80,60 L35,60 Z" fill={colors.glow} />
			<path d="M20,60 L35,40 L35,60 L20,80 Z" fill={colors.secondary} />
		{:else if symbolId === 'rune'}
			<!-- Mystical rune stone -->
			<rect x="25" y="20" width="50" height="65" rx="5" fill="#3a3a4a" />
			<rect x="30" y="25" width="40" height="55" rx="3" fill="#2a2a3a" />
			<!-- Rune symbol -->
			<path d="M50,30 L50,70 M40,40 L60,55 M60,40 L40,55" stroke={colors.primary} stroke-width="4" fill="none" />
			<circle cx="50" cy="50" r="3" fill={colors.glow} />
		{:else if symbolId === 'crown'}
			<!-- Molten crown -->
			<path d="M20,70 L25,45 L35,60 L50,35 L65,60 L75,45 L80,70 Z" fill={colors.primary} />
			<path d="M20,70 L80,70 L75,80 L25,80 Z" fill={colors.secondary} />
			<circle cx="35" cy="52" r="5" fill={colors.glow} />
			<circle cx="50" cy="42" r="6" fill={colors.glow} />
			<circle cx="65" cy="52" r="5" fill={colors.glow} />
			<!-- Dripping effect -->
			<ellipse cx="30" cy="82" rx="3" ry="5" fill={colors.secondary} opacity="0.7" />
			<ellipse cx="70" cy="84" rx="2" ry="4" fill={colors.secondary} opacity="0.7" />
		{/if}
	</svg>
</div>

<style>
	.symbol {
		display: flex;
		align-items: center;
		justify-content: center;
		aspect-ratio: 1;
		background: linear-gradient(145deg, #2a2018, #1a1410);
		border-radius: 8px;
		border: 2px solid #4a3828;
		transition: all 0.2s ease;
	}

	.icon {
		width: 70%;
		height: 70%;
	}

	.winning {
		background: linear-gradient(145deg, #4a2818, #3a1808);
		border-color: #ff6b35;
		box-shadow: 0 0 20px rgba(255, 107, 53, 0.6);
		animation: pulse 0.5s ease-in-out infinite alternate;
	}

	.spinning {
		animation: spin-blur 0.1s linear infinite;
	}

	@keyframes pulse {
		from {
			transform: scale(1);
		}
		to {
			transform: scale(1.05);
		}
	}

	@keyframes spin-blur {
		0% {
			opacity: 0.5;
			transform: translateY(-20%);
		}
		50% {
			opacity: 1;
		}
		100% {
			opacity: 0.5;
			transform: translateY(20%);
		}
	}
</style>
