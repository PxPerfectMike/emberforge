import type { GameConfig } from './types';

// Forge configuration - tweak these values to balance gameplay
export const DEFAULT_CONFIG: GameConfig = {
	rows: 3,
	cols: 5,
	startingCoins: 100,
	spinCost: 5,
	debtBase: 50,
	debtMultiplier: 1.5, // Each cycle increases the forge's demand
	spinsPerCycle: 3 // Spins before the forge demands payment
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
