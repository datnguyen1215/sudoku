/**
 * Sudoku Generator Module
 * Generates sudoku puzzles with configurable difficulty levels
 * Uses backtracking algorithm with randomization for variety
 */

/**
 * Creates an empty 9x9 sudoku board filled with nulls
 * @returns {Array<Array<number|null>>} Empty 9x9 2D array
 */
const generateEmptyBoard = () => {
  return Array(9)
    .fill(null)
    .map(() => Array(9).fill(null));
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
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) {
      return false;
    }
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) {
      return false;
    }
  }

  // Check 3x3 subgrid
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
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
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === null) {
        // Try numbers 1-9 in random order for variety
        const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        
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
 * Counts the number of possible solutions for a given board (up to a limit)
 * @param {Array<Array<number|null>>} board - The sudoku board
 * @param {number} limit - Maximum number of solutions to find (default: 2)
 * @returns {number} Number of solutions found (capped at limit)
 */
const countSolutions = (board, limit = 2) => {
  let solutions = 0;
  
  const solve = currentBoard => {
    if (solutions >= limit) return;
    
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (currentBoard[row][col] === null) {
          for (let num = 1; num <= 9; num++) {
            if (isValidPlacement(currentBoard, row, col, num)) {
              currentBoard[row][col] = num;
              solve(currentBoard);
              currentBoard[row][col] = null;
            }
          }
          return;
        }
      }
    }
    solutions++;
  };

  // Create a copy to avoid modifying the original
  const boardCopy = board.map(row => [...row]);
  solve(boardCopy);
  return solutions;
};

/**
 * Checks if a sudoku puzzle has exactly one unique solution
 * @param {Array<Array<number|null>>} board - The sudoku board to check
 * @returns {boolean} True if the puzzle has exactly one solution
 */
const hasUniqueSolution = board => {
  return countSolutions(board, 2) === 1;
};

/**
 * Removes cells from a complete solution in a symmetric pattern
 * @param {Array<Array<number>>} solution - Complete sudoku solution
 * @param {number} cellsToRemove - Number of cells to remove
 * @returns {Array<Array<number|null>>} Puzzle with cells removed
 */
const removeCellsSymmetrically = (solution, cellsToRemove) => {
  const puzzle = solution.map(row => [...row]);
  let removed = 0;
  const maxAttempts = 1000;
  let attempts = 0;

  // Create list of all cell positions
  const positions = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      positions.push({ row, col });
    }
  }

  // Shuffle positions for random removal order
  const shuffledPositions = shuffleArray(positions);

  for (const pos of shuffledPositions) {
    if (removed >= cellsToRemove || attempts >= maxAttempts) break;
    attempts++;

    const { row, col } = pos;
    
    // Skip if already removed
    if (puzzle[row][col] === null) continue;

    // Try removing this cell and its symmetric counterpart
    const symmetricRow = 8 - row;
    const symmetricCol = 8 - col;
    
    const originalValue = puzzle[row][col];
    const symmetricValue = puzzle[symmetricRow][symmetricCol];
    
    // Remove the cell(s)
    puzzle[row][col] = null;
    let cellsRemovedThisRound = 1;
    
    // If symmetric cell is different and not already null, remove it too
    if (
      (row !== symmetricRow || col !== symmetricCol) &&
      puzzle[symmetricRow][symmetricCol] !== null
    ) {
      puzzle[symmetricRow][symmetricCol] = null;
      cellsRemovedThisRound = 2;
    }

    // Check if puzzle still has unique solution
    if (hasUniqueSolution(puzzle)) {
      removed += cellsRemovedThisRound;
    } else {
      // Restore the cells if removing them breaks uniqueness
      puzzle[row][col] = originalValue;
      if (cellsRemovedThisRound === 2) {
        puzzle[symmetricRow][symmetricCol] = symmetricValue;
      }
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
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Puzzle generation timeout'));
    }, 3000);

    try {
      // Generate complete solution
      const solution = generateCompleteSolution();
      
      // Calculate target clues (random between min and max)
      const targetClues = Math.floor(
        Math.random() * (difficulty.maxClues - difficulty.minClues + 1)
      ) + difficulty.minClues;
      
      // Calculate cells to remove (81 total cells - target clues)
      const cellsToRemove = 81 - targetClues;
      
      // Remove cells symmetrically while maintaining unique solution
      const puzzle = removeCellsSymmetrically(solution, cellsToRemove);
      
      // Count actual clues in final puzzle
      const actualClues = puzzle.flat().filter(cell => cell !== null).length;
      
      clearTimeout(timeout);
      resolve({
        puzzle,
        solution,
        difficulty: difficulty.name,
        clues: actualClues,
        targetClues,
      });
    } catch (error) {
      clearTimeout(timeout);
      reject(error);
    }
  });
};

export default generatePuzzle;