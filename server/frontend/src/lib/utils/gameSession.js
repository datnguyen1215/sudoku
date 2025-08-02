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
      timeElapsed: 0
    };

    // Also store in localStorage for offline support
    localStorage.setItem(`sudoku_session_${session.id}`, JSON.stringify(session));

    return session;
  } catch (error) {
    console.error('Failed to create game session:', error);
    // Fallback to local generation if API fails
    return createLocalGameSession(difficulty);
  }
}

/**
 * Creates a local game session (fallback when API is unavailable)
 * @param {string} difficulty - The difficulty level
 * @returns {Object} Game session data
 */
function createLocalGameSession(difficulty) {
  // Generate temporary local session ID with timestamp to ensure uniqueness
  const sessionId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const { puzzleGrid, solutionGrid } = generateSudokuPuzzle(difficulty);

  const session = {
    id: sessionId,
    difficulty,
    startTime: Date.now(),
    grid: puzzleGrid.map(row => [...row]),
    originalGrid: puzzleGrid.map(row => [...row]),
    solutionGrid: solutionGrid,
    isPaused: false,
    isNotesMode: false,
    selectedCell: null,
    timeElapsed: 0,
    isOffline: true // Mark as offline session
  };

  localStorage.setItem(`sudoku_session_${sessionId}`, JSON.stringify(session));
  return session;
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
      timeElapsed: gameData.timeElapsed || 0
    };

    // Update localStorage
    localStorage.setItem(`sudoku_session_${sessionId}`, JSON.stringify(session));

    return session;
  } catch (error) {
    console.log('Failed to load from API, trying localStorage:', error.message);
    // Fallback to localStorage
    try {
      const stored = localStorage.getItem(`sudoku_session_${sessionId}`);
      return stored ? JSON.parse(stored) : null;
    } catch (localError) {
      logger.error('Failed to load game session from localStorage', { error: localError.message });
      return null;
    }
  }
}

/**
 * Saves a game session to storage
 * @param {Object} session - The session data to save
 */
export async function saveGameSession(session) {
  try {
    // Save to localStorage immediately
    localStorage.setItem(`sudoku_session_${session.id}`, JSON.stringify(session));

    // If not an offline session, also save to backend
    if (!session.isOffline) {
      try {
        await api.updateGame(session.id, session.grid, session.timeElapsed);
        logger.debug('Game saved to backend', { sessionId: session.id });
      } catch (apiError) {
        logger.warn('Failed to save to backend, but localStorage save succeeded', {
          error: apiError.message
        });
      }
    }
  } catch (error) {
    logger.error('Failed to save game session', { error: error.message });
  }
}

/**
 * Generates an empty 9x9 sudoku grid
 * @returns {Array<Array<null>>} Empty grid
 */
function generateEmptyGrid() {
  return Array(9)
    .fill()
    .map(() => Array(9).fill(null));
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
 * Gets difficulty-based clue count mapping
 * @param {string} difficulty - The difficulty level
 * @returns {number} Number of clues to leave in the puzzle
 */
function getClueCount(difficulty) {
  const clueMap = {
    easy: 45, // More clues = easier
    medium: 35, // Medium clues
    hard: 28, // Fewer clues = harder
    expert: 22 // Very few clues = expert
  };
  return clueMap[difficulty] || 35;
}

/**
 * Generates a sudoku puzzle with the specified difficulty
 * @param {string} difficulty - The difficulty level (easy, medium, hard, expert)
 * @returns {Object} Object containing puzzleGrid and solutionGrid
 */
export function generateSudokuPuzzle(difficulty) {
  // Select a random complete solution
  const solutionGrid = SUDOKU_SOLUTIONS[Math.floor(Math.random() * SUDOKU_SOLUTIONS.length)].map(
    row => [...row]
  ); // Deep copy

  // Create puzzle grid by removing numbers
  const puzzleGrid = solutionGrid.map(row => [...row]); // Deep copy
  const clueCount = getClueCount(difficulty);
  const totalCells = 81;
  const cellsToRemove = totalCells - clueCount;

  // Create array of all cell positions
  const allPositions = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      allPositions.push({ row, col });
    }
  }

  // Shuffle positions and remove numbers
  for (let i = allPositions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allPositions[i], allPositions[j]] = [allPositions[j], allPositions[i]];
  }

  // Remove numbers from random positions
  for (let i = 0; i < cellsToRemove && i < allPositions.length; i++) {
    const { row, col } = allPositions[i];
    puzzleGrid[row][col] = null;
  }

  return {
    puzzleGrid,
    solutionGrid
  };
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
