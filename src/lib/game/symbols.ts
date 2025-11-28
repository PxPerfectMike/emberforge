import type { SymbolConfig, SymbolId } from './types';

// Forge Wheel symbol definitions
export const SYMBOLS: Record<SymbolId, SymbolConfig> = {
	slag: {
		id: 'slag',
		name: 'Slag',
		emoji: 'ite_stone',
		weight: 1.4,
		baseValue: 3
	},
	coal: {
		id: 'coal',
		name: 'Coal',
		emoji: 'ite_coal',
		weight: 1.3,
		baseValue: 5
	},
	ember: {
		id: 'ember',
		name: 'Ember',
		emoji: 'ite_ember',
		weight: 1.0,
		baseValue: 10
	},
	ingot: {
		id: 'ingot',
		name: 'Ingot',
		emoji: 'ite_ingot',
		weight: 0.9,
		baseValue: 15
	},
	rune: {
		id: 'rune',
		name: 'Rune',
		emoji: 'ite_rune',
		weight: 0.6,
		baseValue: 30,
		ticketChance: 0.2
	},
	crown: {
		id: 'crown',
		name: 'Molten Crown',
		emoji: 'ite_crown',
		weight: 0.3,
		baseValue: 75,
		ticketChance: 0.5
	}
};

export const SYMBOL_LIST = Object.values(SYMBOLS);
export const SYMBOL_IDS = Object.keys(SYMBOLS) as SymbolId[];

// Get total weight for probability calculations
export function getTotalWeight(): number {
	return SYMBOL_LIST.reduce((sum, s) => sum + s.weight, 0);
}

// Pick a random symbol based on weights
export function pickRandomSymbol(): SymbolId {
	const totalWeight = getTotalWeight();
	let random = Math.random() * totalWeight;

	for (const symbol of SYMBOL_LIST) {
		random -= symbol.weight;
		if (random <= 0) {
			return symbol.id;
		}
	}

	return SYMBOL_LIST[SYMBOL_LIST.length - 1].id;
}

// Get symbol config by ID
export function getSymbol(id: SymbolId): SymbolConfig {
	return SYMBOLS[id];
}
