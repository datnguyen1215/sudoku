export interface SudokuCell {
	value: number;
	isOriginal: boolean;
	isError: boolean;
	notes: number[];
}

export type SudokuGrid = SudokuCell[][];

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface Hint {
	row: number;
	col: number;
	value: number;
}

export function createEmptyGrid(): SudokuGrid {
	const grid: SudokuGrid = [];
	for (let row = 0; row < 9; row++) {
		grid[row] = [];
		for (let col = 0; col < 9; col++) {
			grid[row][col] = {
				value: 0,
				isOriginal: false,
				isError: false,
				notes: []
			};
		}
	}
	return grid;
}

export function isValidNumber(num: number): boolean {
	return num >= 1 && num <= 9;
}

export function isValidPlacement(grid: SudokuGrid, row: number, col: number, num: number): boolean {
	// Check row
	for (let c = 0; c < 9; c++) {
		if (c !== col && grid[row][c].value === num) {
			return false;
		}
	}

	// Check column
	for (let r = 0; r < 9; r++) {
		if (r !== row && grid[r][col].value === num) {
			return false;
		}
	}

	// Check 3x3 box
	const boxStartRow = Math.floor(row / 3) * 3;
	const boxStartCol = Math.floor(col / 3) * 3;

	for (let r = boxStartRow; r < boxStartRow + 3; r++) {
		for (let c = boxStartCol; c < boxStartCol + 3; c++) {
			if ((r !== row || c !== col) && grid[r][c].value === num) {
				return false;
			}
		}
	}

	return true;
}

export function solveSudoku(grid: SudokuGrid): boolean {
	for (let row = 0; row < 9; row++) {
		for (let col = 0; col < 9; col++) {
			if (grid[row][col].value === 0) {
				for (let num = 1; num <= 9; num++) {
					if (isValidPlacement(grid, row, col, num)) {
						grid[row][col].value = num;

						if (solveSudoku(grid)) {
							return true;
						}

						grid[row][col].value = 0;
					}
				}
				return false;
			}
		}
	}
	return true;
}

export function generateSudoku(difficulty: DifficultyLevel): {
	puzzle: SudokuGrid;
	solution: SudokuGrid;
} {
	// Create a solved grid first
	const solution = createEmptyGrid();

	// Fill diagonal 3x3 boxes first (they don't interfere with each other)
	fillDiagonalBoxes(solution);

	// Solve the rest
	solveSudoku(solution);

	// Create puzzle by removing numbers based on difficulty
	const puzzle = JSON.parse(JSON.stringify(solution)) as SudokuGrid;

	const cellsToRemove = getDifficultyCellsToRemove(difficulty);
	removeNumbers(puzzle, cellsToRemove);

	// Mark original cells
	for (let row = 0; row < 9; row++) {
		for (let col = 0; col < 9; col++) {
			if (puzzle[row][col].value !== 0) {
				puzzle[row][col].isOriginal = true;
			}
		}
	}

	return { puzzle, solution };
}

function fillDiagonalBoxes(grid: SudokuGrid): void {
	for (let box = 0; box < 3; box++) {
		fillBox(grid, box * 3, box * 3);
	}
}

function fillBox(grid: SudokuGrid, row: number, col: number): void {
	const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	shuffleArray(numbers);

	let idx = 0;
	for (let r = row; r < row + 3; r++) {
		for (let c = col; c < col + 3; c++) {
			grid[r][c].value = numbers[idx++];
		}
	}
}

function shuffleArray(array: number[]): void {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

function getDifficultyCellsToRemove(difficulty: DifficultyLevel): number {
	switch (difficulty) {
		case 'easy':
			return 35;
		case 'medium':
			return 45;
		case 'hard':
			return 55;
		default:
			return 45;
	}
}

function removeNumbers(grid: SudokuGrid, count: number): void {
	let removed = 0;
	const attempts = 0;
	const maxAttempts = count * 3;

	while (removed < count && attempts < maxAttempts) {
		const row = Math.floor(Math.random() * 9);
		const col = Math.floor(Math.random() * 9);

		if (grid[row][col].value !== 0) {
			const backup = grid[row][col].value;
			grid[row][col].value = 0;

			// Check if puzzle still has unique solution (simplified for now)
			// In a more robust implementation, we'd verify uniqueness
			removed++;
		}
	}
}

export function getDifficulty(grid: SudokuGrid): DifficultyLevel {
	let emptyCells = 0;

	for (let row = 0; row < 9; row++) {
		for (let col = 0; col < 9; col++) {
			if (grid[row][col].value === 0) {
				emptyCells++;
			}
		}
	}

	if (emptyCells <= 40) return 'easy';
	if (emptyCells <= 50) return 'medium';
	return 'hard';
}

export function getHint(grid: SudokuGrid): Hint | null {
	// Find the first empty cell that can be solved
	for (let row = 0; row < 9; row++) {
		for (let col = 0; col < 9; col++) {
			if (grid[row][col].value === 0) {
				// Try each number and see if there's only one valid option
				const validNumbers = [];
				for (let num = 1; num <= 9; num++) {
					if (isValidPlacement(grid, row, col, num)) {
						validNumbers.push(num);
					}
				}

				if (validNumbers.length === 1) {
					return {
						row,
						col,
						value: validNumbers[0]
					};
				}
			}
		}
	}

	// No obvious hints found, use backtracking to find any valid move
	for (let row = 0; row < 9; row++) {
		for (let col = 0; col < 9; col++) {
			if (grid[row][col].value === 0) {
				for (let num = 1; num <= 9; num++) {
					if (isValidPlacement(grid, row, col, num)) {
						// Create a copy and try to solve
						const testGrid = JSON.parse(JSON.stringify(grid)) as SudokuGrid;
						testGrid[row][col].value = num;

						if (solveSudoku(testGrid)) {
							return { row, col, value: num };
						}
					}
				}
			}
		}
	}

	return null;
}

export function checkWin(grid: SudokuGrid): boolean {
	// Check if grid is complete
	for (let row = 0; row < 9; row++) {
		for (let col = 0; col < 9; col++) {
			if (grid[row][col].value === 0) {
				return false;
			}
		}
	}

	// Check if all placements are valid
	for (let row = 0; row < 9; row++) {
		for (let col = 0; col < 9; col++) {
			const currentValue = grid[row][col].value;
			grid[row][col].value = 0; // Temporarily remove to test placement

			if (!isValidPlacement(grid, row, col, currentValue)) {
				grid[row][col].value = currentValue; // Restore
				return false;
			}

			grid[row][col].value = currentValue; // Restore
		}
	}

	return true;
}
