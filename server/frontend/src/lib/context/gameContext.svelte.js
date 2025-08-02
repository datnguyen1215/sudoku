/**
 * Game context for managing state across components using Svelte 5 runes
 */
import { setContext, getContext } from 'svelte';
import { loadGameSession, saveGameSession, saveGameSessionLocally, forceBackendSave } from '$utils/gameSession.js';

const GAME_CONTEXT_KEY = Symbol('game');

/**
 * Creates and sets the game context with reactive state management
 * @param {string} sessionId - The session ID to manage
 * @returns {Object} Game context object with state and methods
 */
export function createGameContext(sessionId) {
  // Direct runes for reactive state
  let gameSession = $state(null);
  let loading = $state(false);
  let error = $state(null);
  let currentTime = $state(0);
  let flashingCells = $state({});

  // Timer state
  let intervalId = null;
  let flashTimeout = null;

  // Context object with state and methods
  const context = {
    // Reactive state getters
    get gameSession() { return gameSession; },
    get loading() { return loading; },
    get error() { return error; },
    get currentTime() { return currentTime; },
    get flashingCells() { return flashingCells; },

    // Session methods
    async loadSession() {
      if (!sessionId) {
        error = 'No session ID provided';
        return null;
      }

      loading = true;
      error = null;

      try {
        gameSession = await loadGameSession(sessionId);
        if (!gameSession) {
          error = 'Session not found';
        }
        return gameSession;
      } catch (err) {
        error = err.message;
        console.error('Failed to load game session:', err);
        return null;
      } finally {
        loading = false;
      }
    },

    async saveSession(immediate = false) {
      if (!gameSession) return;
      await saveGameSession(gameSession, immediate);
    },

    saveSessionLocally() {
      if (!gameSession) return;
      saveGameSessionLocally(gameSession);
    },

    async forceSave() {
      if (!gameSession) return;
      await forceBackendSave(gameSession);
    },

    // Timer methods
    startTimer() {
      if (!gameSession || intervalId) return;

      intervalId = setInterval(() => {
        currentTime = Date.now() - gameSession.startTime;
        context.saveSessionLocally();
      }, 1000);
    },

    stopTimer() {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    },

    togglePause() {
      if (!gameSession) return;

      gameSession.isPaused = !gameSession.isPaused;

      if (gameSession.isPaused) {
        context.stopTimer();
      } else {
        context.startTimer();
      }

      context.saveSession();
    },

    // Input handlers
    handleCellSelected(event) {
      if (!gameSession) return;

      gameSession.selectedCell = event.detail;
      context.saveSessionLocally();
    },

    /**
     * Finds all cells that would conflict with placing a number in the selected cell
     */
    findConflictingCells(row, col, number) {
      if (!gameSession || !gameSession.grid) return [];

      const conflictingCells = [];
      const grid = gameSession.grid;

      // Check row for conflicts
      for (let c = 0; c < 9; c++) {
        if (c !== col && grid[row][c] === number) {
          conflictingCells.push(`${row},${c}`);
        }
      }

      // Check column for conflicts
      for (let r = 0; r < 9; r++) {
        if (r !== row && grid[r][col] === number) {
          conflictingCells.push(`${r},${col}`);
        }
      }

      // Check 3x3 box for conflicts
      const boxRow = Math.floor(row / 3) * 3;
      const boxCol = Math.floor(col / 3) * 3;
      for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
          if ((r !== row || c !== col) && grid[r][c] === number) {
            conflictingCells.push(`${r},${c}`);
          }
        }
      }

      return conflictingCells;
    },

    /**
     * Triggers flashing animation for conflicting cells
     */
    flashConflictingCells(cellKeys) {
      if (cellKeys.length === 0) return;

      // Clear any existing flash timeout
      if (flashTimeout) {
        clearTimeout(flashTimeout);
      }

      // Set flashing cells
      const newFlashingCells = {};
      cellKeys.forEach(key => {
        newFlashingCells[key] = true;
      });
      flashingCells = newFlashingCells;

      // Clear flashing after animation duration
      flashTimeout = setTimeout(() => {
        flashingCells = {};
      }, 500);
    },

    handleNumberInput(event) {
      if (!gameSession || !gameSession.selectedCell) return;

      const { row, col } = gameSession.selectedCell;
      const number = event.detail;

      // Don't allow modifying original clue cells
      if (gameSession.originalGrid && gameSession.originalGrid[row][col] !== null) {
        return;
      }

      const cellKey = `${row},${col}`;

      // Check for conflicts and flash conflicting cells
      const conflictingCells = context.findConflictingCells(row, col, number);
      if (conflictingCells.length > 0) {
        context.flashConflictingCells(conflictingCells);
      }

      if (gameSession.isNotesMode) {
        // In notes mode, toggle the number in the notes set
        const currentNotes = gameSession.notes[cellKey] ? new Set(gameSession.notes[cellKey]) : new Set();

        if (currentNotes.has(number)) {
          // If note already exists, remove it
          currentNotes.delete(number);
        } else {
          // Adding a new note - check for conflicts first
          const conflictingCells = context.findConflictingCells(row, col, number);
          if (conflictingCells.length > 0) {
            // Flash conflicting cells to show why note can't be added
            context.flashConflictingCells(conflictingCells);
            // Don't add the conflicting note - return early
            return;
          }
          // No conflicts, safe to add the note
          currentNotes.add(number);
        }

        // Create new notes object to trigger reactivity
        if (currentNotes.size === 0) {
          const newNotes = { ...gameSession.notes };
          delete newNotes[cellKey];
          gameSession.notes = newNotes;
        } else {
          gameSession.notes = {
            ...gameSession.notes,
            [cellKey]: currentNotes
          };
        }
      } else {
        // Regular mode - set the number
        gameSession.grid[row][col] = number;

        // Clear notes for this cell when entering a real number
        if (number !== null && gameSession.notes[cellKey]) {
          const newNotes = { ...gameSession.notes };
          delete newNotes[cellKey];
          gameSession.notes = newNotes;
        }

        // Validate the entry if we have a solution
        if (gameSession.solutionGrid) {
          // Local game - we have the solution
          if (number !== null && number !== gameSession.solutionGrid[row][col]) {
            gameSession.incorrectCells[cellKey] = true;
          } else {
            delete gameSession.incorrectCells[cellKey];
          }
        }
      }

      // User made a move, trigger save callback
      context.saveSession();
    },

    toggleNotes() {
      if (!gameSession) return;

      gameSession.isNotesMode = !gameSession.isNotesMode;
      context.saveSessionLocally();
    },

    eraseCell() {
      if (!gameSession || !gameSession.selectedCell) return;

      const { row, col } = gameSession.selectedCell;

      // Don't allow erasing original clue cells
      if (gameSession.originalGrid && gameSession.originalGrid[row][col] !== null) {
        return;
      }

      const cellKey = `${row},${col}`;

      // Erase the value
      gameSession.grid[row][col] = null;

      // Remove from incorrect cells when erasing
      delete gameSession.incorrectCells[cellKey];

      // Also clear notes for this cell
      if (gameSession.notes[cellKey]) {
        const newNotes = { ...gameSession.notes };
        delete newNotes[cellKey];
        gameSession.notes = newNotes;
      }

      // User erased a cell, trigger save callback
      context.saveSession();
    },

    // Cleanup function
    cleanup() {
      context.stopTimer();
      if (flashTimeout) {
        clearTimeout(flashTimeout);
      }
      if (gameSession) {
        context.forceSave();
      }
    }
  };

  // Set the context
  setContext(GAME_CONTEXT_KEY, context);
  return context;
}

/**
 * Gets the game context
 * @returns {Object} Game context object
 * @throws {Error} If context is not found
 */
export function getGameContext() {
  const context = getContext(GAME_CONTEXT_KEY);
  if (!context) {
    throw new Error('Game context not found. Make sure to call createGameContext in a parent component.');
  }
  return context;
}