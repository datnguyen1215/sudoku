import { describe, it, expect, beforeEach } from 'vitest';
import {
	type SudokuGrid,
	type SudokuCell,
	createEmptyGrid,
	isValidNumber,
	isValidPlacement,
	solveSudoku,
	generateSudoku,
	getDifficulty,
	getHint,
	checkWin
} from './sudoku-engine';

describe('SudokuEngine', () => {
	let emptyGrid: SudokuGrid;

	beforeEach(() => {
		emptyGrid = createEmptyGrid();
	});

	describe('createEmptyGrid', () => {
		it('should create a 9x9 grid with all cells set to 0', () => {
			expect(emptyGrid).toHaveLength(9);
			expect(emptyGrid[0]).toHaveLength(9);

			for (let row = 0; row < 9; row++) {
				for (let col = 0; col < 9; col++) {
					expect(emptyGrid[row][col].value).toBe(0);
					expect(emptyGrid[row][col].isOriginal).toBe(false);
					expect(emptyGrid[row][col].isError).toBe(false);
					expect(emptyGrid[row][col].notes).toEqual([]);
				}
			}
		});
	});

	describe('isValidNumber', () => {
		it('should return true for numbers 1-9', () => {
			for (let i = 1; i <= 9; i++) {
				expect(isValidNumber(i)).toBe(true);
			}
		});

		it('should return false for numbers outside 1-9 range', () => {
			expect(isValidNumber(0)).toBe(false);
			expect(isValidNumber(10)).toBe(false);
			expect(isValidNumber(-1)).toBe(false);
		});
	});

	describe('isValidPlacement', () => {
		it('should return true for valid placement in empty grid', () => {
			expect(isValidPlacement(emptyGrid, 0, 0, 5)).toBe(true);
		});

		it('should return false if number already exists in row', () => {
			emptyGrid[0][1].value = 5;
			expect(isValidPlacement(emptyGrid, 0, 0, 5)).toBe(false);
		});

		it('should return false if number already exists in column', () => {
			emptyGrid[1][0].value = 5;
			expect(isValidPlacement(emptyGrid, 0, 0, 5)).toBe(false);
		});

		it('should return false if number already exists in 3x3 box', () => {
			emptyGrid[1][1].value = 5;
			expect(isValidPlacement(emptyGrid, 0, 0, 5)).toBe(false);
		});

		it('should return true if placement is valid in complex scenario', () => {
			// Fill some cells but leave 0,0 valid for number 9
			emptyGrid[0][1].value = 1;
			emptyGrid[1][0].value = 2;
			emptyGrid[1][1].value = 3;
			expect(isValidPlacement(emptyGrid, 0, 0, 9)).toBe(true);
		});
	});

	describe('solveSudoku', () => {
		it('should solve a simple sudoku puzzle', () => {
			// Create a simple puzzle (incomplete but solvable)
			const puzzle: number[][] = [
				[5, 3, 0, 0, 7, 0, 0, 0, 0],
				[6, 0, 0, 1, 9, 5, 0, 0, 0],
				[0, 9, 8, 0, 0, 0, 0, 6, 0],
				[8, 0, 0, 0, 6, 0, 0, 0, 3],
				[4, 0, 0, 8, 0, 3, 0, 0, 1],
				[7, 0, 0, 0, 2, 0, 0, 0, 6],
				[0, 6, 0, 0, 0, 0, 2, 8, 0],
				[0, 0, 0, 4, 1, 9, 0, 0, 5],
				[0, 0, 0, 0, 8, 0, 0, 7, 9]
			];

			const grid = createGridFromArray(puzzle);
			const solved = solveSudoku(grid);

			expect(solved).toBe(true);
			// Check that solution is complete and valid
			for (let row = 0; row < 9; row++) {
				for (let col = 0; col < 9; col++) {
					expect(grid[row][col].value).toBeGreaterThan(0);
					expect(grid[row][col].value).toBeLessThanOrEqual(9);
				}
			}
		});

		it('should return false for unsolvable puzzle', () => {
			const invalidPuzzle: number[][] = [
				[1, 1, 0, 0, 0, 0, 0, 0, 0], // Invalid: two 1s in same row
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0]
			];

			const grid = createGridFromArray(invalidPuzzle);
			const solved = solveSudoku(grid);
			expect(solved).toBe(false);
		});
	});

	describe('generateSudoku', () => {
		it('should generate a valid sudoku puzzle', () => {
			const { puzzle, solution } = generateSudoku('medium');

			// Check puzzle structure
			expect(puzzle).toHaveLength(9);
			expect(solution).toHaveLength(9);

			// Check that puzzle has some empty cells
			let emptyCells = 0;
			for (let row = 0; row < 9; row++) {
				for (let col = 0; col < 9; col++) {
					if (puzzle[row][col].value === 0) emptyCells++;
				}
			}
			expect(emptyCells).toBeGreaterThan(30); // Medium difficulty should have 40-50 empty cells

			// Check that solution is complete
			for (let row = 0; row < 9; row++) {
				for (let col = 0; col < 9; col++) {
					expect(solution[row][col].value).toBeGreaterThan(0);
				}
			}
		});
	});

	describe('getDifficulty', () => {
		it('should return correct difficulty based on empty cells', () => {
			const easyGrid = createEmptyGrid();
			// Easy: 30-40 empty cells
			fillRandomCells(easyGrid, 55);
			expect(getDifficulty(easyGrid)).toBe('easy');

			const mediumGrid = createEmptyGrid();
			// Medium: 40-50 empty cells
			fillRandomCells(mediumGrid, 40);
			expect(getDifficulty(mediumGrid)).toBe('medium');

			const hardGrid = createEmptyGrid();
			// Hard: 50+ empty cells
			fillRandomCells(hardGrid, 30);
			expect(getDifficulty(hardGrid)).toBe('hard');
		});
	});

	describe('getHint', () => {
		it('should return a valid hint for solvable position', () => {
			const puzzle: number[][] = [
				[5, 3, 0, 0, 7, 0, 0, 0, 0],
				[6, 0, 0, 1, 9, 5, 0, 0, 0],
				[0, 9, 8, 0, 0, 0, 0, 6, 0],
				[8, 0, 0, 0, 6, 0, 0, 0, 3],
				[4, 0, 0, 8, 0, 3, 0, 0, 1],
				[7, 0, 0, 0, 2, 0, 0, 0, 6],
				[0, 6, 0, 0, 0, 0, 2, 8, 0],
				[0, 0, 0, 4, 1, 9, 0, 0, 5],
				[0, 0, 0, 0, 8, 0, 0, 7, 9]
			];

			const grid = createGridFromArray(puzzle);
			const hint = getHint(grid);

			expect(hint).toBeDefined();
			expect(hint).not.toBeNull();

			if (hint) {
				expect(hint.row).toBeGreaterThanOrEqual(0);
				expect(hint.row).toBeLessThan(9);
				expect(hint.col).toBeGreaterThanOrEqual(0);
				expect(hint.col).toBeLessThan(9);
				expect(hint.value).toBeGreaterThan(0);
				expect(hint.value).toBeLessThanOrEqual(9);

				// Hint should be valid placement
				expect(isValidPlacement(grid, hint.row, hint.col, hint.value)).toBe(true);
			}
		});

		it('should return null for completed grid', () => {
			const completedGrid = createEmptyGrid();
			// Fill the grid completely (simplified for test)
			for (let row = 0; row < 9; row++) {
				for (let col = 0; col < 9; col++) {
					completedGrid[row][col].value = ((row * 3 + Math.floor(row / 3) + col) % 9) + 1;
				}
			}

			const hint = getHint(completedGrid);
			expect(hint).toBeNull();
		});
	});

	describe('checkWin', () => {
		it('should return false for incomplete grid', () => {
			expect(checkWin(emptyGrid)).toBe(false);
		});

		it('should return false for completed but invalid grid', () => {
			const invalidGrid = createEmptyGrid();
			// Fill with invalid solution (repeated numbers)
			for (let row = 0; row < 9; row++) {
				for (let col = 0; col < 9; col++) {
					invalidGrid[row][col].value = 1; // All 1s - invalid
				}
			}

			expect(checkWin(invalidGrid)).toBe(false);
		});

		it('should return true for valid completed grid', () => {
			const validSolution: number[][] = [
				[5, 3, 4, 6, 7, 8, 9, 1, 2],
				[6, 7, 2, 1, 9, 5, 3, 4, 8],
				[1, 9, 8, 3, 4, 2, 5, 6, 7],
				[8, 5, 9, 7, 6, 1, 4, 2, 3],
				[4, 2, 6, 8, 5, 3, 7, 9, 1],
				[7, 1, 3, 9, 2, 4, 8, 5, 6],
				[9, 6, 1, 5, 3, 7, 2, 8, 4],
				[2, 8, 7, 4, 1, 9, 6, 3, 5],
				[3, 4, 5, 2, 8, 6, 1, 7, 9]
			];

			const grid = createGridFromArray(validSolution);
			expect(checkWin(grid)).toBe(true);
		});
	});
});

// Helper functions for testing
function createGridFromArray(arr: number[][]): SudokuGrid {
	const grid = createEmptyGrid();
	for (let row = 0; row < 9; row++) {
		for (let col = 0; col < 9; col++) {
			grid[row][col].value = arr[row][col];
		}
	}
	return grid;
}

function fillRandomCells(grid: SudokuGrid, count: number): void {
	let filled = 0;
	while (filled < count) {
		const row = Math.floor(Math.random() * 9);
		const col = Math.floor(Math.random() * 9);
		if (grid[row][col].value === 0) {
			grid[row][col].value = Math.floor(Math.random() * 9) + 1;
			filled++;
		}
	}
}
