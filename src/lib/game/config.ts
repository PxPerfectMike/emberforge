import type { GameConfig } from './types';

// Forge configuration - tweak these values to balance gameplay
export const DEFAULT_CONFIG: GameConfig = {
	rows: 3,
	cols: 5,
	startingCoins: 100,
	spinBatchCost: 20, // Cost to buy a batch of spins at start of cycle
	debtBase: 30, // Starting tribute demand (easier early game)
	debtMultiplier: 1.3, // Each cycle increases the forge's demand
	spinsPerCycle: 7 // Number of spins you get per batch
};

// Win multipliers based on match count (3, 4, or 5 in a row)
export const WIN_MULTIPLIERS: Record<number, number> = {
	3: 1,
	4: 3,
	5: 10
};

// Animation timings (ms)
export const TIMING = {
	spinDuration: 150, // Per column cascade
	revealDelay: 100, // Delay between column reveals
	winHighlightDuration: 1500,
	heatPulse: 2000 // Forge heat animation
};
