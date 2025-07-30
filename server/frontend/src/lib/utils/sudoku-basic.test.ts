import { describe, it, expect } from 'vitest';
import { createEmptyGrid, isValidNumber, isValidPlacement } from './sudoku-engine';

describe('Basic Sudoku Functions', () => {
	describe('createEmptyGrid', () => {
		it('should create a 9x9 grid', () => {
			const grid = createEmptyGrid();
			expect(grid).toHaveLength(9);
			expect(grid[0]).toHaveLength(9);
			expect(grid[0][0].value).toBe(0);
		});
	});

	describe('isValidNumber', () => {
		it('should validate numbers 1-9', () => {
			expect(isValidNumber(1)).toBe(true);
			expect(isValidNumber(9)).toBe(true);
			expect(isValidNumber(0)).toBe(false);
			expect(isValidNumber(10)).toBe(false);
		});
	});

	describe('isValidPlacement', () => {
		it('should allow valid placement', () => {
			const grid = createEmptyGrid();
			expect(isValidPlacement(grid, 0, 0, 5)).toBe(true);
		});

		it('should reject duplicate in row', () => {
			const grid = createEmptyGrid();
			grid[0][1].value = 5;
			expect(isValidPlacement(grid, 0, 0, 5)).toBe(false);
		});
	});
});
