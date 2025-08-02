/**
 * Game session creation and loading utilities
 */
import { api } from '$lib/api/client.js';
import { createLogger } from '$lib/utils/logger.js';
import { findMatchingSolution } from './solutionMatcher.js';

const logger = createLogger('sessionManager.js');

/**
 * Converts notes arrays back to Sets from localStorage
 * @param {Object} session - Session with notes as arrays
 * @returns {Object} Session with notes as Sets
 */
function restoreNotesFromStorage(session) {
  if (session.notes) {
    session.notes = Object.fromEntries(
      Object.entries(session.notes).map(([key, value]) => [key, new Set(value || [])])
    );
  }
  return session;
}

/**
 * Prepares session for storage (converts Sets to arrays)
 * @param {Object} session - Session with notes as Sets
 * @returns {Object} Session ready for storage
 */
function prepareSessionForStorage(session) {
  return {
    ...session,
    notes: Object.fromEntries(
      Object.entries(session.notes).map(([key, value]) => [key, Array.from(value || [])])
    )
  };
}

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

    // Store in localStorage for offline support
    const sessionToStore = prepareSessionForStorage(session);
    localStorage.setItem(`sudoku_session_${session.id}`, JSON.stringify(sessionToStore));

    return session;
  } catch (error) {
    console.error('Failed to create game session:', error);
    // Re-throw error to be handled by the caller
    throw new Error(`Backend service is unavailable. Please try again later.`);
  }
}

/**
 * Validates originalGrid integrity against expected puzzle data
 * @param {Array<Array<number|null>>} originalGrid - Grid to validate
 * @param {Array<Array<number|null>>} expectedPuzzle - Expected original puzzle
 * @returns {boolean} True if originalGrid is valid
 */
function validateOriginalGrid(originalGrid, expectedPuzzle) {
  if (!originalGrid || !expectedPuzzle) return false;
  if (originalGrid.length !== 9 || expectedPuzzle.length !== 9) return false;

  for (let row = 0; row < 9; row++) {
    if (!originalGrid[row] || !expectedPuzzle[row]) return false;
    if (originalGrid[row].length !== 9 || expectedPuzzle[row].length !== 9) return false;

    for (let col = 0; col < 9; col++) {
      // Original grid should match expected puzzle exactly for clue positions
      if (originalGrid[row][col] !== expectedPuzzle[row][col]) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Merges localStorage UI state with backend core data
 * @param {Object} backendData - Core game data from backend
 * @param {Object} localStorageData - UI state from localStorage
 * @returns {Object} Merged session data
 */
function mergeSessionData(backendData, localStorageData) {
  // Start with backend data (authoritative for core game data)
  const session = {
    id: backendData.sessionId,
    difficulty: backendData.difficulty,
    startTime: new Date(backendData.startTime).getTime(),
    grid: backendData.currentGrid.map(row => [...row]),
    originalGrid: backendData.puzzle.map(row => [...row]),
    timeElapsed: backendData.timeElapsed || 0,
  };

  // Merge UI state from localStorage if available and valid
  if (localStorageData) {
    // Preserve UI state
    session.isPaused = localStorageData.isPaused || false;
    session.isNotesMode = localStorageData.isNotesMode || false;
    session.selectedCell = localStorageData.selectedCell || null;

    // Restore notes if they exist
    session.notes = localStorageData.notes || {};

    // Restore incorrect cells validation state
    session.incorrectCells = localStorageData.incorrectCells || {};
  } else {
    // Default UI state for new sessions
    session.isPaused = false;
    session.isNotesMode = false;
    session.selectedCell = null;
    session.notes = {};
    session.incorrectCells = {};
  }

  return session;
}

/**
 * Loads a game session from storage
 * @param {string} sessionId - The session ID to load
 * @returns {Promise<Object|null>} Game session data or null if not found
 */
export async function loadGameSession(sessionId) {
  let localStorageData = null;

  // First, try to get localStorage data (for UI state)
  try {
    const stored = localStorage.getItem(`sudoku_session_${sessionId}`);
    if (stored) {
      localStorageData = JSON.parse(stored);
    }
  } catch (localError) {
    logger.warn('Failed to parse localStorage data, will use defaults', { error: localError.message });
  }

  try {
    // Try to load core data from backend first
    const gameData = await api.getGame(sessionId);

    // Validate localStorage originalGrid against backend puzzle if available
    if (localStorageData && localStorageData.originalGrid) {
      const isValidOriginalGrid = validateOriginalGrid(localStorageData.originalGrid, gameData.puzzle);
      if (!isValidOriginalGrid) {
        logger.warn('localStorage originalGrid corrupted, using backend data');
        // Keep localStorage for UI state but not for corrupted originalGrid
      }
    }

    // Merge backend core data with localStorage UI state
    const session = mergeSessionData(gameData, localStorageData);

    // Find the matching solution for backend games
    const matchingSolution = findMatchingSolution(gameData.puzzle);
    if (matchingSolution) {
      session.solutionGrid = matchingSolution;
    }

    // Restore notes from localStorage (convert arrays back to Sets)
    const sessionWithNotes = restoreNotesFromStorage(session);

    // Update localStorage with clean merged data
    const sessionToStore = prepareSessionForStorage(sessionWithNotes);
    localStorage.setItem(`sudoku_session_${sessionId}`, JSON.stringify(sessionToStore));

    return sessionWithNotes;
  } catch (error) {
    console.log('Failed to load from API, trying localStorage:', error.message);

    // Fallback to localStorage only
    if (localStorageData) {
      // Validate localStorage data integrity
      if (!localStorageData.originalGrid || !localStorageData.grid) {
        logger.error('localStorage data missing critical properties');
        return null;
      }

      // Restore notes and return localStorage data
      return restoreNotesFromStorage(localStorageData);
    }

    return null;
  }
}