/**
 * Game session management utilities
 */
import { api } from '$lib/api/client.js';
import { createLogger } from '$lib/utils/logger.js';

const logger = createLogger('gameSession.js');

/**
 * Creates a new game session with the specified difficulty
 * @param {string} difficulty - The difficulty level (easy, medium, hard, expert)
 * @returns {Promise<Object>} Game session data
 */
export async function createGameSession(difficulty) {
  try {
    // Call backend API to create game
    const gameData = await api.createGame(difficulty);

    const session = {
      id: gameData.sessionId,
      difficulty: gameData.difficulty,
      startTime: new Date(gameData.startTime).getTime(),
      grid: gameData.puzzle.map(row => [...row]), // Player's current grid state
      originalGrid: gameData.puzzle.map(row => [...row]), // Original clues (read-only)
      isPaused: false,
      isNotesMode: false,
      selectedCell: null,
      timeElapsed: 0,
      incorrectCells: {}, // Track incorrect cells as "row,col" keys
      notes: {} // Track notes for each cell as "row,col": Set([1, 2, 5])
    };

    // Find the matching solution for backend games
    const matchingSolution = findMatchingSolution(gameData.puzzle);
    if (matchingSolution) {
      session.solutionGrid = matchingSolution;
    }

    // Convert notes Sets to arrays for JSON serialization
    const sessionToStore = {
      ...session,
      notes: Object.fromEntries(
        Object.entries(session.notes).map(([key, value]) => [key, Array.from(value || [])])
      )
    };

    // Also store in localStorage for offline support
    localStorage.setItem(`sudoku_session_${session.id}`, JSON.stringify(sessionToStore));

    return session;
  } catch (error) {
    console.error('Failed to create game session:', error);
    // Re-throw error to be handled by the caller
    throw new Error(`Backend service is unavailable. Please try again later.`);
  }
}


/**
 * Loads a game session from storage
 * @param {string} sessionId - The session ID to load
 * @returns {Promise<Object|null>} Game session data or null if not found
 */
export async function loadGameSession(sessionId) {
  try {
    // Try to load from backend first
    const gameData = await api.getGame(sessionId);

    const session = {
      id: gameData.sessionId,
      difficulty: gameData.difficulty,
      startTime: new Date(gameData.startTime).getTime(),
      grid: gameData.currentGrid.map(row => [...row]),
      originalGrid: gameData.puzzle.map(row => [...row]),
      isPaused: false,
      isNotesMode: false,
      selectedCell: null,
      timeElapsed: gameData.timeElapsed || 0,
      incorrectCells: {}, // Track incorrect cells as "row,col" keys
      notes: {} // Track notes for each cell as "row,col": Set([1, 2, 5])
    };

    // Find the matching solution for backend games
    const matchingSolution = findMatchingSolution(gameData.puzzle);
    if (matchingSolution) {
      session.solutionGrid = matchingSolution;
    }

    // Convert notes Sets to arrays for JSON serialization
    const sessionToStore = {
      ...session,
      notes: Object.fromEntries(
        Object.entries(session.notes).map(([key, value]) => [key, Array.from(value || [])])
      )
    };

    // Update localStorage
    localStorage.setItem(`sudoku_session_${sessionId}`, JSON.stringify(sessionToStore));

    return session;
  } catch (error) {
    console.log('Failed to load from API, trying localStorage:', error.message);
    // Fallback to localStorage
    try {
      const stored = localStorage.getItem(`sudoku_session_${sessionId}`);
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      // Convert notes arrays back to Sets
      if (parsed.notes) {
        parsed.notes = Object.fromEntries(
          Object.entries(parsed.notes).map(([key, value]) => [key, new Set(value || [])])
        );
      }
      return parsed;
    } catch (localError) {
      logger.error('Failed to load game session from localStorage', { error: localError.message });
      return null;
    }
  }
}

// Debounced backend save to reduce API calls
let backendSaveTimeout = null;
const BACKEND_SAVE_DELAY = 2000; // 2 seconds

/**
 * Saves a game session to localStorage only (for frequent timer updates)
 * @param {Object} session - The session data to save
 */
export function saveGameSessionLocally(session) {
  try {
    // Convert notes Sets to arrays for JSON serialization
    const sessionToStore = {
      ...session,
      notes: session.notes ? Object.fromEntries(
        Object.entries(session.notes).map(([key, value]) => [key, Array.from(value || [])])
      ) : {}
    };

    // Save to localStorage immediately
    localStorage.setItem(`sudoku_session_${session.id}`, JSON.stringify(sessionToStore));
  } catch (error) {
    logger.error('Failed to save game session locally', { error: error.message });
  }
}

/**
 * Saves a game session to both localStorage and backend (debounced)
 * @param {Object} session - The session data to save
 * @param {boolean} immediate - Whether to save immediately or use debouncing
 */
export async function saveGameSession(session, immediate = false) {
  try {
    // Always save to localStorage immediately
    saveGameSessionLocally(session);

    // If not an offline session, also save to backend
    if (!session.isOffline) {
      if (immediate) {
        // Clear any pending debounced save
        if (backendSaveTimeout) {
          clearTimeout(backendSaveTimeout);
          backendSaveTimeout = null;
        }

        try {
          await api.updateGame(session.id, session.grid, session.timeElapsed);
          logger.debug('Game saved to backend immediately', { sessionId: session.id });
        } catch (apiError) {
          logger.warn('Failed to save to backend immediately, but localStorage save succeeded', {
            error: apiError.message
          });
        }
      } else {
        // Debounced backend save
        if (backendSaveTimeout) {
          clearTimeout(backendSaveTimeout);
        }

        backendSaveTimeout = setTimeout(async () => {
          try {
            await api.updateGame(session.id, session.grid, session.timeElapsed);
            logger.debug('Game saved to backend (debounced)', { sessionId: session.id });
          } catch (apiError) {
            logger.warn('Failed to save to backend (debounced), but localStorage save succeeded', {
              error: apiError.message
            });
          }
          backendSaveTimeout = null;
        }, BACKEND_SAVE_DELAY);
      }
    }
  } catch (error) {
    logger.error('Failed to save game session', { error: error.message });
  }
}


/**
 * Pre-made valid sudoku solutions
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
 * Finds which solution matches the given puzzle by checking clues
 * @param {Array<Array<number|null>>} puzzleGrid - The puzzle with clues
 * @returns {Array<Array<number>>|null} The matching solution or null if none found
 */
function findMatchingSolution(puzzleGrid) {
  for (const solution of SUDOKU_SOLUTIONS) {
    let matches = true;

    // Check if all non-null values in puzzle match the solution
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (puzzleGrid[row][col] !== null && puzzleGrid[row][col] !== solution[row][col]) {
          matches = false;
          break;
        }
      }
      if (!matches) break;
    }

    if (matches) {
      return solution.map(row => [...row]); // Return a deep copy
    }
  }

  return null; // No matching solution found
}


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
/**
 * Forces immediate backend save (for cleanup/critical saves)
 * @param {Object} session - The session data to save
 */
export async function forceBackendSave(session) {
  if (!session || session.isOffline) return;

  // Clear any pending debounced save
  if (backendSaveTimeout) {
    clearTimeout(backendSaveTimeout);
    backendSaveTimeout = null;
  }

  try {
    await api.updateGame(session.id, session.grid, session.timeElapsed);
    logger.debug('Game force saved to backend', { sessionId: session.id });
  } catch (apiError) {
    logger.error('Failed to force save to backend', {
      error: apiError.message,
      sessionId: session.id
    });
  }
}

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
 * Formats elapsed time in MM:SS format
 * @param {number} milliseconds - Time elapsed in milliseconds
 * @returns {string} Formatted time string
 */
export function formatTime(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}
