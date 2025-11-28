import type { GamePhase, GridCell, WinLine, SymbolId } from './types';
import { DEFAULT_CONFIG, TIMING } from './config';
import { executeSpin, generateGrid, calculateDebt, calculateHeat } from './engine';

// Create a deterministic initial grid to avoid SSR hydration mismatch
function createInitialGrid(): GridCell[][] {
	const pattern: SymbolId[][] = [
		['coal', 'ember', 'ingot', 'ember', 'coal'],
		['slag', 'rune', 'crown', 'rune', 'slag'],
		['coal', 'ember', 'ingot', 'ember', 'coal']
	];

	return pattern.map((row, rowIndex) =>
		row.map((symbolId, colIndex) => ({
			symbolId,
			row: rowIndex,
			col: colIndex,
			isWinning: false
		}))
	);
}

// Reactive game state using Svelte 5 runes
function createGameState() {
	let coins = $state(DEFAULT_CONFIG.startingCoins);
	let tickets = $state(0);
	let debt = $state(calculateDebt(1));
	let cycle = $state(1);
	let spinsThisCycle = $state(0);
	let phase = $state<GamePhase>('idle');
	let grid = $state<GridCell[][]>(createInitialGrid());
	let lastWinLines = $state<WinLine[]>([]);
	let lastPayout = $state(0);
	let lastTickets = $state(0);
	let forgeHeat = $state(20);

	// Derived state
	const canSpin = $derived(phase === 'idle' && coins >= DEFAULT_CONFIG.spinCost);
	const isGameOver = $derived(phase === 'lose');
	const spinsRemaining = $derived(DEFAULT_CONFIG.spinsPerCycle - spinsThisCycle);

	async function spin() {
		if (!canSpin) return;

		// Deduct spin cost
		coins -= DEFAULT_CONFIG.spinCost;
		phase = 'spinning';
		spinsThisCycle++;

		// Simulate spinning animation delay
		await delay(TIMING.spinDuration * DEFAULT_CONFIG.cols);

		// Execute spin and get results
		const result = executeSpin();
		grid = result.grid;
		lastWinLines = result.winLines;
		lastPayout = result.totalPayout;
		lastTickets = result.totalTickets;

		// Reveal phase
		phase = 'revealing';
		await delay(TIMING.revealDelay * DEFAULT_CONFIG.cols);

		// Add winnings
		if (result.totalPayout > 0) {
			coins += result.totalPayout;
			tickets += result.totalTickets;
			phase = 'win';
			await delay(TIMING.winHighlightDuration);
		}

		// Update forge heat
		forgeHeat = calculateHeat(coins, debt, spinsRemaining);

		// Check cycle end
		if (spinsThisCycle >= DEFAULT_CONFIG.spinsPerCycle) {
			checkCycleEnd();
		} else {
			phase = 'idle';
		}
	}

	function checkCycleEnd() {
		if (coins >= debt) {
			// Paid the forge's demand, advance to next cycle
			coins -= debt;
			cycle++;
			debt = calculateDebt(cycle);
			spinsThisCycle = 0;
			forgeHeat = 20;
			phase = 'idle';
		} else {
			// The forge consumes you
			forgeHeat = 100;
			phase = 'lose';
		}
	}

	function reset() {
		coins = DEFAULT_CONFIG.startingCoins;
		tickets = 0;
		debt = calculateDebt(1);
		cycle = 1;
		spinsThisCycle = 0;
		phase = 'idle';
		grid = createInitialGrid();
		lastWinLines = [];
		lastPayout = 0;
		lastTickets = 0;
		forgeHeat = 20;
	}

	function payDebt() {
		if (coins >= debt) {
			coins -= debt;
			cycle++;
			debt = calculateDebt(cycle);
			spinsThisCycle = 0;
			forgeHeat = 20;
		}
	}

	return {
		get coins() { return coins; },
		get tickets() { return tickets; },
		get debt() { return debt; },
		get cycle() { return cycle; },
		get spinsThisCycle() { return spinsThisCycle; },
		get phase() { return phase; },
		get grid() { return grid; },
		get lastWinLines() { return lastWinLines; },
		get lastPayout() { return lastPayout; },
		get lastTickets() { return lastTickets; },
		get forgeHeat() { return forgeHeat; },
		get canSpin() { return canSpin; },
		get isGameOver() { return isGameOver; },
		get spinsRemaining() { return spinsRemaining; },
		get spinCost() { return DEFAULT_CONFIG.spinCost; },
		spin,
		reset,
		payDebt
	};
}

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// Export singleton game state
export const gameState = createGameState();
