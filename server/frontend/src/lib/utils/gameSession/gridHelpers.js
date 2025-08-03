/**
 * Grid utility functions for Sudoku game
 */

/**
 * Gets all filled numbers in a specific row
 * @param {Array<Array<number|null>>} grid - The sudoku grid
 * @param {number} row - Row index
 * @returns {Set<number>} Set of filled numbers in the row
 */
export function getFilledNumbersInRow(grid, row) {
  const filled = new Set();
  for (let col = 0; col < 9; col++) {
    if (grid[row][col] !== null) {
      filled.add(grid[row][col]);
    }
  }
  return filled;
}

/**
 * Gets all filled numbers in a specific column
 * @param {Array<Array<number|null>>} grid - The sudoku grid
 * @param {number} col - Column index
 * @returns {Set<number>} Set of filled numbers in the column
 */
export function getFilledNumbersInColumn(grid, col) {
  const filled = new Set();
  for (let row = 0; row < 9; row++) {
    if (grid[row][col] !== null) {
      filled.add(grid[row][col]);
    }
  }
  return filled;
}

/**
 * Gets all filled numbers in a specific 3x3 box
 * @param {Array<Array<number|null>>} grid - The sudoku grid
 * @param {number} row - Row index
 * @param {number} col - Column index
 * @returns {Set<number>} Set of filled numbers in the box
 */
export function getFilledNumbersInBox(grid, row, col) {
  const filled = new Set();
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (grid[r][c] !== null) {
        filled.add(grid[r][c]);
      }
    }
  }
  return filled;
}

/**
 * Gets valid candidates for an empty cell
 * @param {Array<Array<number|null>>} grid - The sudoku grid
 * @param {number} row - Row index
 * @param {number} col - Column index
 * @returns {Set<number>} Set of valid candidate numbers for the cell
 */
export function getValidCandidates(grid, row, col) {
  // If cell already has a value, return empty set
  if (grid[row][col] !== null) {
    return new Set();
  }

  // Start with all possible numbers (1-9)
  const candidates = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  // Remove numbers that appear in the same row
  const rowNumbers = getFilledNumbersInRow(grid, row);
  for (const num of rowNumbers) {
    candidates.delete(num);
  }

  // Remove numbers that appear in the same column
  const colNumbers = getFilledNumbersInColumn(grid, col);
  for (const num of colNumbers) {
    candidates.delete(num);
  }

  // Remove numbers that appear in the same 3x3 box
  const boxNumbers = getFilledNumbersInBox(grid, row, col);
  for (const num of boxNumbers) {
    candidates.delete(num);
  }

  return candidates;
}