import type { GridCell, WinLine, SpinResult, SymbolId } from './types';
import { pickRandomSymbol, getSymbol, SYMBOLS } from './symbols';
import { DEFAULT_CONFIG, WIN_MULTIPLIERS, PAYLINES } from './config';

// Generate a reel strip (single column) with stacked symbols
function generateReel(rows: number): SymbolId[] {
	const reel: SymbolId[] = [];
	let i = 0;

	while (i < rows) {
		const symbolId = pickRandomSymbol();
		const symbol = getSymbol(symbolId);
		const stackWeight = symbol.stackWeight || 0;

		// Determine stack size (1-3 symbols)
		let stackSize = 1;
		if (Math.random() < stackWeight && i + 1 < rows) {
			stackSize = 2;
			// Chance for triple stack
			if (Math.random() < stackWeight * 0.5 && i + 2 < rows) {
				stackSize = 3;
			}
		}

		// Don't exceed row count
		stackSize = Math.min(stackSize, rows - i);

		// Add stacked symbols
		for (let s = 0; s < stackSize; s++) {
			reel.push(symbolId);
			i++;
		}
	}

	return reel;
}

// Generate a new grid with stacked symbols (column-based generation)
export function generateGrid(rows: number = DEFAULT_CONFIG.rows, cols: number = DEFAULT_CONFIG.cols): GridCell[][] {
	// Generate each reel (column) independently
	const reels: SymbolId[][] = [];
	for (let col = 0; col < cols; col++) {
		reels.push(generateReel(rows));
	}

	// Convert to row-based grid
	const grid: GridCell[][] = [];
	for (let row = 0; row < rows; row++) {
		const rowCells: GridCell[] = [];
		for (let col = 0; col < cols; col++) {
			rowCells.push({
				symbolId: reels[col][row],
				row,
				col,
				isWinning: false
			});
		}
		grid.push(rowCells);
	}

	return grid;
}

// Check if two symbols match (accounting for wilds)
function symbolsMatch(sym1: SymbolId, sym2: SymbolId): boolean {
	if (sym1 === sym2) return true;
	const s1 = getSymbol(sym1);
	const s2 = getSymbol(sym2);
	return s1.isWild || s2.isWild;
}

// Get the "effective" symbol for a match (prefer non-wild)
function getEffectiveSymbol(symbols: SymbolId[]): SymbolId {
	// Find the first non-wild symbol to use for payout calculation
	for (const sym of symbols) {
		if (!getSymbol(sym).isWild) {
			return sym;
		}
	}
	// All wilds - use wild's value
	return 'wild';
}

// Check a single payline for a win
function checkPayline(grid: GridCell[][], payline: typeof PAYLINES[0]): WinLine | null {
	const positions = payline.positions;
	const cells: GridCell[] = positions.map(([row, col]) => grid[row][col]);
	const symbols = cells.map(c => c.symbolId);

	// Count consecutive matching symbols from left
	let matchCount = 1;
	const firstSymbol = symbols[0];

	for (let i = 1; i < symbols.length; i++) {
		if (symbolsMatch(firstSymbol, symbols[i]) || symbolsMatch(symbols[i - 1], symbols[i])) {
			matchCount++;
		} else {
			break;
		}
	}

	// Need at least 3 matching symbols for a win
	if (matchCount < 3) return null;

	// Get the cells that are part of the win
	const winningCells = cells.slice(0, matchCount);
	const winningSymbols = symbols.slice(0, matchCount);
	const effectiveSymbol = getEffectiveSymbol(winningSymbols);

	return createWinLine(winningCells, effectiveSymbol, matchCount);
}

// Check all paylines for wins
export function findWinLines(grid: GridCell[][]): WinLine[] {
	const winLines: WinLine[] = [];

	for (const payline of PAYLINES) {
		const win = checkPayline(grid, payline);
		if (win) {
			winLines.push(win);
		}
	}

	return winLines;
}

function createWinLine(cells: GridCell[], symbolId: SymbolId, count: number): WinLine {
	const symbol = getSymbol(symbolId);
	const multiplier = WIN_MULTIPLIERS[count] || WIN_MULTIPLIERS[5];
	const payout = symbol.baseValue * multiplier;

	// Calculate ticket chance based on symbol and match length
	let ticketsAwarded = 0;
	if (symbol.ticketChance && Math.random() < symbol.ticketChance * (count - 2)) {
		ticketsAwarded = count >= 5 ? 2 : 1;
	}

	// Mark cells as winning
	cells.forEach((cell) => {
		cell.isWinning = true;
	});

	return {
		cells: [...cells],
		symbolId,
		count,
		payout,
		ticketsAwarded
	};
}

// Generate reel strips for animation (longer strips for visual spinning)
export function generateReelStrips(rows: number, cols: number, stripLength: number = 20): SymbolId[][] {
	const strips: SymbolId[][] = [];
	for (let col = 0; col < cols; col++) {
		const strip: SymbolId[] = [];
		while (strip.length < stripLength) {
			const reel = generateReel(Math.min(rows, stripLength - strip.length));
			strip.push(...reel);
		}
		strips.push(strip.slice(0, stripLength));
	}
	return strips;
}

// Execute a spin and calculate results
export function executeSpin(): SpinResult {
	const grid = generateGrid();
	const winLines = findWinLines(grid);
	const totalPayout = winLines.reduce((sum, line) => sum + line.payout, 0);
	const totalTickets = winLines.reduce((sum, line) => sum + line.ticketsAwarded, 0);

	return {
		grid,
		winLines,
		totalPayout,
		totalTickets
	};
}

// Calculate the forge's demand for a given cycle
export function calculateDebt(cycle: number): number {
	return Math.floor(DEFAULT_CONFIG.debtBase * Math.pow(DEFAULT_CONFIG.debtMultiplier, cycle - 1));
}

// Calculate forge heat based on how close to failure (0-100)
export function calculateHeat(coins: number, debt: number, spinsRemaining: number): number {
	const progress = coins / debt;
	const urgency = 1 - (spinsRemaining / DEFAULT_CONFIG.spinsPerCycle);

	if (progress >= 1) return 20; // Safe, low heat

	// Heat increases as you get closer to deadline with less money
	const danger = (1 - progress) * urgency;
	return Math.min(100, Math.floor(20 + danger * 80));
}
