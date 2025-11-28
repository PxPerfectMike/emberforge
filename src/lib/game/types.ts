// Core game types - extend these as you add features

// Forge Wheel symbols
export type SymbolId = 'slag' | 'coal' | 'ember' | 'ingot' | 'rune' | 'crown';

export interface SymbolConfig {
	id: SymbolId;
	name: string;
	emoji: string;
	weight: number; // Higher = more likely to appear
	baseValue: number; // Base coin value for matches
	ticketChance?: number; // Chance to award tickets on match (0-1)
}

export interface GridCell {
	symbolId: SymbolId;
	row: number;
	col: number;
	isWinning: boolean;
}

export interface WinLine {
	cells: GridCell[];
	symbolId: SymbolId;
	count: number;
	payout: number;
	ticketsAwarded: number;
}

export interface SpinResult {
	grid: GridCell[][];
	winLines: WinLine[];
	totalPayout: number;
	totalTickets: number;
}

export interface GameConfig {
	rows: number;
	cols: number;
	startingCoins: number;
	spinBatchCost: number; // Cost to buy a batch of spins
	debtBase: number;
	debtMultiplier: number;
	spinsPerCycle: number; // How many spins per batch
}

// Game phases:
// 'buy_spins' - Need to purchase spins to continue
// 'idle' - Ready to spin (have spins remaining)
// 'spinning' - Wheel is spinning
// 'revealing' - Revealing results
// 'win' - Showing win animation
// 'pay_tribute' - Cycle ended, must pay tribute
// 'lose' - Failed to pay tribute
export type GamePhase = 'buy_spins' | 'idle' | 'spinning' | 'revealing' | 'win' | 'pay_tribute' | 'lose';

export interface GameState {
	coins: number;
	tickets: number;
	debt: number;
	cycle: number; // renamed from deadline
	spinsThisCycle: number;
	phase: GamePhase;
	grid: GridCell[][];
	lastWinLines: WinLine[];
	lastPayout: number;
	lastTickets: number;
	forgeHeat: number; // 0-100, visual indicator of danger
}

// Trinkets - ancient tools that modify the Forge Wheel
export interface Trinket {
	id: string;
	name: string;
	description: string;
	rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
	cost: number; // in tickets
	apply: (state: GameState, config: GameConfig) => void;
}

// For future modifier system
export interface Modifier {
	id: string;
	name: string;
	description: string;
	apply: (state: GameState, config: GameConfig) => void;
}
