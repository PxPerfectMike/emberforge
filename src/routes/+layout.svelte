<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="mobile-web-app-capable" content="yes" />
	<meta name="theme-color" content="#1a0f08" />
	<title>Emberforge</title>
</svelte:head>

<div class="game-viewport">
	<div class="game-canvas">
		{@render children()}
	</div>
</div>

<style>
	/* Game viewport - fills screen and centers the game canvas */
	.game-viewport {
		width: 100vw;
		height: 100dvh;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #0a0605;
		/* Prevent pull-to-refresh and overscroll */
		overscroll-behavior: none;
		touch-action: manipulation;
	}

	/* Game canvas - fixed aspect ratio container like a game engine */
	.game-canvas {
		/* Mobile-first: 9:16 aspect ratio (portrait phone) */
		--game-aspect: calc(9 / 16);

		/* Calculate dimensions to fit within viewport while maintaining aspect ratio */
		width: min(100vw, calc(100dvh * var(--game-aspect)));
		height: min(100dvh, calc(100vw / var(--game-aspect)));
		max-width: 500px;
		max-height: calc(500px / var(--game-aspect));

		/* Account for safe areas on notched devices */
		padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
		box-sizing: border-box;

		/* Contain layout to prevent reflows from affecting viewport */
		contain: layout style;
		position: relative;
	}
</style>
