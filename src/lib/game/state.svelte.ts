import type { GamePhase, GridCell, WinLine, SymbolId } from './types';
import { DEFAULT_CONFIG, TIMING } from './config';
import { executeSpin, calculateDebt, calculateHeat } from './engine';

// Create a deterministic initial grid to avoid SSR hydration mismatch
function createInitialGrid(): GridCell[][] {
	const pattern: SymbolId[][] = [
		['coal', 'ember', 'ingot', 'ember', 'coal'],
		['slag', 'rune', 'crown', 'rune', 'slag'],
		['ember', 'coal', 'ingot', 'coal', 'ember'],
		['coal', 'slag', 'ember', 'slag', 'coal']
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
	let tributePaid = $state(0); // Amount paid towards current cycle's debt
	let cycle = $state(1);
	let round = $state(0); // Round within current cycle (0 = haven't started yet)
	let spinsRemaining = $state(0); // Spins left in current batch
	let phase = $state<GamePhase>('between_rounds'); // Start between rounds
	let grid = $state<GridCell[][]>(createInitialGrid());
	let lastWinLines = $state<WinLine[]>([]);
	let lastPayout = $state(0);
	let lastTickets = $state(0);
	let forgeHeat = $state(20);

	// Derived state
	const tributeRemaining = $derived(debt - tributePaid);
	const tributeProgress = $derived(debt > 0 ? (tributePaid / debt) * 100 : 0);
	// Tribute bonus: 1.0 at 0% paid, up to 2.0 at 100% paid (linear scaling)
	const tributeBonus = $derived(1 + (tributePaid / debt));

	// Can buy spins if between rounds and have enough coins
	const canBuySpins = $derived(phase === 'between_rounds' && coins >= DEFAULT_CONFIG.spinBatchCost);
	// Can spin if idle with spins remaining
	const canSpin = $derived(phase === 'idle' && spinsRemaining > 0);
	// Can pay tribute if between rounds and have coins beyond what's needed for spins
	// Must keep at least spinBatchCost to be able to continue (unless tribute is fully paid)
	const maxTributePayment = $derived(
		tributeRemaining <= 0 ? 0 :
		Math.min(tributeRemaining, Math.max(0, coins - DEFAULT_CONFIG.spinBatchCost))
	);
	const canPayTribute = $derived(phase === 'between_rounds' && maxTributePayment > 0);
	const isGameOver = $derived(phase === 'lose');
	// Check if player is stuck: can't buy spins and tribute not fully paid
	const isStuck = $derived(
		phase === 'between_rounds' &&
		coins < DEFAULT_CONFIG.spinBatchCost &&
		tributeRemaining > 0
	);

	// Buy a batch of spins to start a round
	function buySpins() {
		if (!canBuySpins) return;

		coins -= DEFAULT_CONFIG.spinBatchCost;
		spinsRemaining = DEFAULT_CONFIG.spinsPerCycle;
		round++;
		phase = 'idle';
	}

	// Pay towards the tribute (partial payments allowed)
	function payTribute(amount?: number) {
		if (!canPayTribute) return;

		// If no amount specified, pay the maximum possible
		const payment = amount ? Math.min(amount, maxTributePayment) : maxTributePayment;
		if (payment <= 0) return;

		coins -= payment;
		tributePaid += payment;

		// Check if tribute is fully paid - advance to next cycle
		if (tributeRemaining <= 0) {
			cycle++;
			round = 0;
			tributePaid = 0;
			debt = calculateDebt(cycle);
			forgeHeat = 20;
		}
	}

	// Accept fate when stuck (can't afford spins and tribute not paid)
	function acceptFate() {
		forgeHeat = 100;
		phase = 'lose';
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

		// Apply tribute bonus to payout
		const bonusedPayout = Math.floor(result.totalPayout * tributeBonus);
		lastPayout = bonusedPayout;
		lastTickets = result.totalTickets;

		// Reveal phase
		phase = 'revealing';
		await delay(TIMING.revealDelay * DEFAULT_CONFIG.cols);

		// Add winnings (with tribute bonus applied)
		if (bonusedPayout > 0) {
			coins += bonusedPayout;
			tickets += result.totalTickets;
			phase = 'win';
			await delay(TIMING.winHighlightDuration);
		}

		// Update forge heat based on progress toward tribute
		forgeHeat = calculateHeat(coins, tributeRemaining, spinsRemaining);

		// Check if spins are exhausted
		if (spinsRemaining <= 0) {
			// Back to between rounds - can pay tribute or buy more spins
			phase = 'between_rounds';
		} else {
			phase = 'idle';
		}
	}

	function reset() {
		coins = DEFAULT_CONFIG.startingCoins;
		tickets = 0;
		debt = calculateDebt(1);
		tributePaid = 0;
		cycle = 1;
		round = 0;
		spinsRemaining = 0;
		phase = 'between_rounds';
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
		get tributePaid() { return tributePaid; },
		get tributeRemaining() { return tributeRemaining; },
		get tributeProgress() { return tributeProgress; },
		get tributeBonus() { return tributeBonus; },
		get cycle() { return cycle; },
		get round() { return round; },
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
		get maxTributePayment() { return maxTributePayment; },
		get isGameOver() { return isGameOver; },
		get isStuck() { return isStuck; },
		get spinBatchCost() { return DEFAULT_CONFIG.spinBatchCost; },
		get spinsPerBatch() { return DEFAULT_CONFIG.spinsPerCycle; },
		buySpins,
		spin,
		payTribute,
		acceptFate,
		reset
	};
}

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// Export singleton game state
export const gameState = createGameState();
