import type { GridCell, WinLine, SpinResult, SymbolId } from './types';
import { pickRandomSymbol, getSymbol } from './symbols';
import { DEFAULT_CONFIG, WIN_MULTIPLIERS } from './config';

// Generate a new grid with random symbols
export function generateGrid(rows: number = DEFAULT_CONFIG.rows, cols: number = DEFAULT_CONFIG.cols): GridCell[][] {
	const grid: GridCell[][] = [];

	for (let row = 0; row < rows; row++) {
		const rowCells: GridCell[] = [];
		for (let col = 0; col < cols; col++) {
			rowCells.push({
				symbolId: pickRandomSymbol(),
				row,
				col,
				isWinning: false
			});
		}
		grid.push(rowCells);
	}

	return grid;
}

// Check for horizontal wins (3+ matching symbols in a row)
export function findWinLines(grid: GridCell[][]): WinLine[] {
	const winLines: WinLine[] = [];

	for (let row = 0; row < grid.length; row++) {
		const rowCells = grid[row];
		let currentSymbol: SymbolId | null = null;
		let matchCells: GridCell[] = [];

		for (let col = 0; col < rowCells.length; col++) {
			const cell = rowCells[col];

			if (cell.symbolId === currentSymbol) {
				matchCells.push(cell);
			} else {
				// Check if previous match was a win (3+)
				if (matchCells.length >= 3 && currentSymbol) {
					winLines.push(createWinLine(matchCells, currentSymbol));
				}
				// Start new match
				currentSymbol = cell.symbolId;
				matchCells = [cell];
			}
		}

		// Check end of row
		if (matchCells.length >= 3 && currentSymbol) {
			winLines.push(createWinLine(matchCells, currentSymbol));
		}
	}

	return winLines;
}

function createWinLine(cells: GridCell[], symbolId: SymbolId): WinLine {
	const symbol = getSymbol(symbolId);
	const count = cells.length;
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
