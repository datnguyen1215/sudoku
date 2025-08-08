import { v4 as uuidv4 } from 'uuid';

/**
 * Offline-first API client for Sudoku game
 * Generates puzzles locally with offline-first architecture
 */

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

/**
 * Pre-made valid sudoku solutions for offline puzzle generation
 */
const SUDOKU_SOLUTIONS = [
  [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
  ],
  [
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [4, 5, 6, 7, 8, 9, 1, 2, 3],
    [7, 8, 9, 1, 2, 3, 4, 5, 6],
    [2, 1, 4, 3, 6, 5, 8, 9, 7],
    [3, 6, 5, 8, 9, 7, 2, 1, 4],
    [8, 9, 7, 2, 1, 4, 3, 6, 5],
    [5, 3, 1, 6, 4, 2, 9, 7, 8],
    [6, 4, 2, 9, 7, 8, 5, 3, 1],
    [9, 7, 8, 5, 3, 1, 6, 4, 2]
  ],
  [
    [9, 1, 2, 3, 4, 5, 6, 7, 8],
    [3, 4, 5, 6, 7, 8, 9, 1, 2],
    [6, 7, 8, 9, 1, 2, 3, 4, 5],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [4, 5, 6, 7, 8, 9, 1, 2, 3],
    [7, 8, 9, 1, 2, 3, 4, 5, 6],
    [2, 3, 1, 5, 6, 4, 8, 9, 7],
    [5, 6, 4, 8, 9, 7, 2, 3, 1],
    [8, 9, 7, 2, 3, 1, 5, 6, 4]
  ]
];

/**
 * Difficulty configurations for puzzle generation
 */
const DIFFICULTY_CONFIG = {
  easy: { clues: 45 },
  medium: { clues: 35 },
  hard: { clues: 28 },
  expert: { clues: 22 }
};

/**
 * Generates a puzzle from a complete solution by removing numbers
 * @param {Array<Array<number>>} solution - Complete 9x9 sudoku solution
 * @param {number} clues - Number of clues to keep in the puzzle
 * @returns {Array<Array<number|null>>} Puzzle with some cells removed
 */
function generatePuzzle(solution, clues) {
  const puzzle = solution.map(row => [...row]);
  const totalCells = 81;
  const cellsToRemove = totalCells - clues;

  // Create list of all cell positions
  const positions = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      positions.push([row, col]);
    }
  }

  // Randomly shuffle positions
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  // Remove cells
  for (let i = 0; i < cellsToRemove && i < positions.length; i++) {
    const [row, col] = positions[i];
    puzzle[row][col] = null;
  }

  return puzzle;
}

/**
 * Selects a random solution and generates a puzzle
 * @param {string} difficulty - Difficulty level
 * @returns {Object} Generated game data
 */
function generateGameData(difficulty) {
  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.medium;
  const solution = SUDOKU_SOLUTIONS[Math.floor(Math.random() * SUDOKU_SOLUTIONS.length)];
  const puzzle = generatePuzzle(solution, config.clues);

  return {
    sessionId: uuidv4(),
    difficulty,
    startTime: new Date().toISOString(),
    puzzle,
    currentGrid: puzzle.map(row => [...row]),
    timeElapsed: 0
  };
}

export const api = {
  /**
   * Creates a new game with offline puzzle generation
   * @param {string} difficulty - Game difficulty level
   * @returns {Promise<Object>} Generated game data
   */
  async createGame(difficulty) {
    // Simulate slight delay for realistic feel
    await new Promise(resolve => setTimeout(resolve, 100));

    return generateGameData(difficulty);
  },

  /**
   * Retrieves game data from localStorage
   * @param {string} sessionId - Session ID to retrieve
   * @returns {Promise<Object>} Game data from localStorage
   */
  async getGame(sessionId) {
    // Simulate slight delay for realistic feel
    await new Promise(resolve => setTimeout(resolve, 50));

    const stored = localStorage.getItem(`sudoku_session_${sessionId}`);
    if (!stored) {
      throw new ApiError('Game session not found', 404);
    }

    try {
      const gameData = JSON.parse(stored);

      // Convert to consistent game data format
      return {
        sessionId: gameData.id,
        difficulty: gameData.difficulty,
        startTime: new Date(gameData.startTime).toISOString(),
        puzzle: gameData.originalGrid,
        currentGrid: gameData.grid,
        timeElapsed: gameData.timeElapsed || 0
      };
    } catch (error) {
      throw new ApiError('Invalid game session data', 400);
    }
  },

  /**
   * Updates game progress (no-op for offline mode, data persisted via localStorage)
   * @param {string} sessionId - Session ID
   * @param {Array<Array<number|null>>} currentGrid - Current game state
   * @param {number} timeElapsed - Time elapsed in seconds
   * @returns {Promise<Object>} Success response
   */
  async updateGame(sessionId, currentGrid, timeElapsed) {
    // Simulate slight delay for realistic feel
    await new Promise(resolve => setTimeout(resolve, 30));

    // Return success - actual persistence is handled by localStorage in save strategies
    return { success: true, message: 'Game updated locally' };
  }
};
