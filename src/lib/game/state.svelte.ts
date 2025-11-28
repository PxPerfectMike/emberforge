import type { GamePhase, GridCell, WinLine, SymbolId } from './types';
import { DEFAULT_CONFIG, TIMING } from './config';
import { executeSpin, calculateDebt, calculateHeat } from './engine';

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
	let spinsRemaining = $state(0); // Spins left in current batch
	let phase = $state<GamePhase>('buy_spins'); // Start by buying spins
	let grid = $state<GridCell[][]>(createInitialGrid());
	let lastWinLines = $state<WinLine[]>([]);
	let lastPayout = $state(0);
	let lastTickets = $state(0);
	let forgeHeat = $state(20);

	// Derived state
	const canBuySpins = $derived(phase === 'buy_spins' && coins >= DEFAULT_CONFIG.spinBatchCost);
	const canSpin = $derived(phase === 'idle' && spinsRemaining > 0);
	const canPayTribute = $derived(phase === 'pay_tribute' && coins >= debt);
	const isGameOver = $derived(phase === 'lose');

	// Buy a batch of spins at the start of a cycle
	function buySpins() {
		if (!canBuySpins) return;

		coins -= DEFAULT_CONFIG.spinBatchCost;
		spinsRemaining = DEFAULT_CONFIG.spinsPerCycle;
		phase = 'idle';
		forgeHeat = 20;
	}

	async function spin() {
		if (!canSpin) return;

		phase = 'spinning';
		spinsRemaining--;

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

		// Update forge heat based on progress toward tribute
		forgeHeat = calculateHeat(coins, debt, spinsRemaining);

		// Check if spins are exhausted
		if (spinsRemaining <= 0) {
			// Time to pay tribute
			phase = 'pay_tribute';
		} else {
			phase = 'idle';
		}
	}

	// Pay the forge's tribute at end of cycle
	function payTribute() {
		if (coins >= debt) {
			coins -= debt;
			cycle++;
			debt = calculateDebt(cycle);
			forgeHeat = 20;
			phase = 'buy_spins'; // Ready to buy next batch
		} else {
			// Can't pay - the forge consumes you
			forgeHeat = 100;
			phase = 'lose';
		}
	}

	function reset() {
		coins = DEFAULT_CONFIG.startingCoins;
		tickets = 0;
		debt = calculateDebt(1);
		cycle = 1;
		spinsRemaining = 0;
		phase = 'buy_spins';
		grid = createInitialGrid();
		lastWinLines = [];
		lastPayout = 0;
		lastTickets = 0;
		forgeHeat = 20;
	}

	return {
		get coins() { return coins; },
		get tickets() { return tickets; },
		get debt() { return debt; },
		get cycle() { return cycle; },
		get spinsRemaining() { return spinsRemaining; },
		get phase() { return phase; },
		get grid() { return grid; },
		get lastWinLines() { return lastWinLines; },
		get lastPayout() { return lastPayout; },
		get lastTickets() { return lastTickets; },
		get forgeHeat() { return forgeHeat; },
		get canBuySpins() { return canBuySpins; },
		get canSpin() { return canSpin; },
		get canPayTribute() { return canPayTribute; },
		get isGameOver() { return isGameOver; },
		get spinBatchCost() { return DEFAULT_CONFIG.spinBatchCost; },
		get spinsPerBatch() { return DEFAULT_CONFIG.spinsPerCycle; },
		buySpins,
		spin,
		payTribute,
		reset
	};
}

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// Export singleton game state
export const gameState = createGameState();
