/**
 * Sudoku Generator Module
 * Generates sudoku puzzles with configurable difficulty levels
 * Uses backtracking algorithm with randomization for variety
 */

// Board constants
const BOARD_SIZE = 9;
const BOX_SIZE = 3;

// Cache for shuffled arrays (max 5 items)
const SHUFFLE_CACHE = [];
const MAX_CACHE_SIZE = 5;

/**
 * Gets a shuffled array of numbers 1-9
 * @returns {Array<number>} Shuffled array
 */
const getShuffledNumbers = () => {
  // Reuse from cache if available
  if (SHUFFLE_CACHE.length > 0 && Math.random() > 0.5) {
    return SHUFFLE_CACHE.shift();
  }

  // Generate new shuffled array
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let j = arr.length - 1; j > 0; j--) {
    const k = Math.floor(Math.random() * (j + 1));
    [arr[j], arr[k]] = [arr[k], arr[j]];
  }

  // Add to cache if not full
  if (SHUFFLE_CACHE.length < MAX_CACHE_SIZE) {
    SHUFFLE_CACHE.push([...arr]);
  }

  return arr;
};

/**
 * Creates a deep copy of a sudoku board
 * @param {Array<Array<number|null>>} board - Board to copy
 * @returns {Array<Array<number|null>>} Deep copy of the board
 */
const copyBoard = board => board.map(row => [...row]);

/**
 * Creates an empty 9x9 sudoku board filled with nulls
 * @returns {Array<Array<number|null>>} Empty 9x9 2D array
 */
const generateEmptyBoard = () => {
  return Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(null));
};

/**
 * Validates if a number can be placed at the given position according to sudoku rules
 * @param {Array<Array<number|null>>} board - The sudoku board
 * @param {number} row - Row index (0-8)
 * @param {number} col - Column index (0-8)
 * @param {number} num - Number to validate (1-9)
 * @returns {boolean} True if placement is valid
 */
const isValidPlacement = (board, row, col, num) => {
  // Check row
  for (let x = 0; x < BOARD_SIZE; x++) {
    if (board[row][x] === num) {
      return false;
    }
  }

  // Check column
  for (let x = 0; x < BOARD_SIZE; x++) {
    if (board[x][col] === num) {
      return false;
    }
  }

  // Check 3x3 subgrid
  const startRow = row - (row % BOX_SIZE);
  const startCol = col - (col % BOX_SIZE);
  for (let i = 0; i < BOX_SIZE; i++) {
    for (let j = 0; j < BOX_SIZE; j++) {
      if (board[i + startRow][j + startCol] === num) {
        return false;
      }
    }
  }

  return true;
};

/**
 * Shuffles an array using Fisher-Yates algorithm for randomization
 * @param {Array} array - Array to shuffle
 * @returns {Array} New shuffled array
 */
const shuffleArray = array => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Solves sudoku using backtracking with randomized number selection for variety
 * @param {Array<Array<number|null>>} board - The sudoku board to solve
 * @returns {boolean} True if solved successfully
 */
const solveSudoku = board => {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === null) {
        // Get shuffled numbers for variety
        const numbers = getShuffledNumbers();

        for (const num of numbers) {
          if (isValidPlacement(board, row, col, num)) {
            board[row][col] = num;

            if (solveSudoku(board)) {
              return true;
            }

            // Backtrack
            board[row][col] = null;
          }
        }
        return false;
      }
    }
  }
  return true;
};

/**
 * Generates a complete valid sudoku solution
 * @returns {Array<Array<number>>} Complete 9x9 sudoku grid
 */
const generateCompleteSolution = () => {
  const board = generateEmptyBoard();
  solveSudoku(board);
  return board;
};

/**
 * Removes cells from a complete solution in a symmetric pattern
 * @param {Array<Array<number>>} solution - Complete sudoku solution
 * @param {number} cellsToRemove - Number of cells to remove
 * @returns {Array<Array<number|null>>} Puzzle with cells removed
 */
const removeCellsSymmetrically = (solution, cellsToRemove) => {
  const puzzle = copyBoard(solution);
  let removed = 0;

  // Create list of all cell positions
  const positions = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      positions.push({ row, col });
    }
  }

  // Shuffle positions for random removal order
  const shuffledPositions = shuffleArray(positions);

  for (const pos of shuffledPositions) {
    if (removed >= cellsToRemove) break;

    const { row, col } = pos;

    // Skip if already removed
    if (puzzle[row][col] === null) continue;

    // Try removing this cell and its symmetric counterpart
    const symmetricRow = BOARD_SIZE - 1 - row;
    const symmetricCol = BOARD_SIZE - 1 - col;

    // Remove the cell(s)
    puzzle[row][col] = null;
    removed++;

    // If symmetric cell is different and not already null, remove it too
    if (
      removed < cellsToRemove &&
      (row !== symmetricRow || col !== symmetricCol) &&
      puzzle[symmetricRow][symmetricCol] !== null
    ) {
      puzzle[symmetricRow][symmetricCol] = null;
      removed++;
    }
  }

  return puzzle;
};

/**
 * Generates a sudoku puzzle with the specified difficulty level
 * @param {Object} difficulty - Difficulty configuration object
 * @param {string} difficulty.name - Name of difficulty level
 * @param {number} difficulty.minClues - Minimum number of clues
 * @param {number} difficulty.maxClues - Maximum number of clues
 * @returns {Promise<Object>} Promise resolving to puzzle data
 */
const generatePuzzle = async difficulty => {
  return new Promise(resolve => {
    // Generate complete solution
    const solution = generateCompleteSolution();

    // Calculate target clues (random between min and max)
    const targetClues =
      Math.floor(
        Math.random() * (difficulty.maxClues - difficulty.minClues + 1),
      ) + difficulty.minClues;

    // Calculate cells to remove (total cells - target clues)
    const cellsToRemove = BOARD_SIZE * BOARD_SIZE - targetClues;

    // Remove cells symmetrically
    const puzzle = removeCellsSymmetrically(solution, cellsToRemove);

    // Count actual clues in final puzzle
    const actualClues = puzzle.flat().filter(cell => cell !== null).length;

    resolve({
      puzzle,
      solution,
      difficulty: difficulty.name,
      clues: actualClues,
      targetClues,
    });
  });
};

export default generatePuzzle;
export {
  isValidPlacement,
  copyBoard,
  generateEmptyBoard,
  BOARD_SIZE,
  BOX_SIZE,
};
