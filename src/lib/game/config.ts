import type { GameConfig, Payline } from './types';

// Forge configuration - tweak these values to balance gameplay
export const DEFAULT_CONFIG: GameConfig = {
	rows: 4,
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

// Paylines - multiple ways to win!
// Each payline is an array of row indices for each column
export const PAYLINES: Payline[] = [
	// Horizontal lines
	{ id: 1, name: 'Top', positions: [[0,0], [0,1], [0,2], [0,3], [0,4]] },
	{ id: 2, name: 'Upper-Mid', positions: [[1,0], [1,1], [1,2], [1,3], [1,4]] },
	{ id: 3, name: 'Lower-Mid', positions: [[2,0], [2,1], [2,2], [2,3], [2,4]] },
	{ id: 4, name: 'Bottom', positions: [[3,0], [3,1], [3,2], [3,3], [3,4]] },
	// V-shapes
	{ id: 5, name: 'V-Down', positions: [[0,0], [1,1], [2,2], [1,3], [0,4]] },
	{ id: 6, name: 'V-Up', positions: [[3,0], [2,1], [1,2], [2,3], [3,4]] },
	// Diagonals
	{ id: 7, name: 'Diag-Down', positions: [[0,0], [1,1], [2,2], [3,3], [3,4]] },
	{ id: 8, name: 'Diag-Up', positions: [[3,0], [2,1], [1,2], [0,3], [0,4]] },
	// Zigzags
	{ id: 9, name: 'Zig-Down', positions: [[0,0], [1,1], [0,2], [1,3], [0,4]] },
	{ id: 10, name: 'Zig-Up', positions: [[3,0], [2,1], [3,2], [2,3], [3,4]] },
	// W-shapes
	{ id: 11, name: 'W-Shape', positions: [[0,0], [2,1], [0,2], [2,3], [0,4]] },
	{ id: 12, name: 'M-Shape', positions: [[3,0], [1,1], [3,2], [1,3], [3,4]] },
	// Extended diagonals from edges
	{ id: 13, name: 'Cascade-Down', positions: [[1,0], [2,1], [3,2], [3,3], [3,4]] },
	{ id: 14, name: 'Cascade-Up', positions: [[2,0], [1,1], [0,2], [0,3], [0,4]] },
	// Center focus
	{ id: 15, name: 'Center-V', positions: [[1,0], [2,1], [2,2], [2,3], [1,4]] },
	{ id: 16, name: 'Center-A', positions: [[2,0], [1,1], [1,2], [1,3], [2,4]] },
	// Wave patterns
	{ id: 17, name: 'Wave-1', positions: [[0,0], [1,1], [2,2], [1,3], [2,4]] },
	{ id: 18, name: 'Wave-2', positions: [[3,0], [2,1], [1,2], [2,3], [1,4]] },
	// Step patterns
	{ id: 19, name: 'Steps-Down', positions: [[0,0], [0,1], [1,2], [2,3], [3,4]] },
	{ id: 20, name: 'Steps-Up', positions: [[3,0], [3,1], [2,2], [1,3], [0,4]] },
];

// Animation timings (ms)
export const TIMING = {
	reelSpinBase: 800, // Base spin duration per reel
	reelStagger: 200, // Delay between each reel stopping
	spinDuration: 150, // Legacy - per column cascade
	revealDelay: 100, // Delay between column reveals
	winHighlightDuration: 1500,
	heatPulse: 2000 // Forge heat animation
};
