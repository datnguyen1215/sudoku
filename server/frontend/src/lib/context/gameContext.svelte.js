/**
 * Game context for managing state across components using Svelte 5 runes
 */
import { setContext, getContext } from 'svelte';
import { loadGameSession, saveGameSession, saveGameSessionLocally } from '$utils/gameSession.js';
import { getValidCandidates } from '$utils/gameSession/gridHelpers.js';

const GAME_CONTEXT_KEY = Symbol('game');
const MAX_HISTORY_SIZE = 100;

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
  let cellHistory = $state({ past: [] });
  let autoNoteActive = $state(false);

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
    get cellHistory() { return cellHistory; },
    get autoNoteActive() { return autoNoteActive; },

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
        } else {
          // Clear history when loading a new session
          cellHistory.past = [];
          // Reset auto-note state when loading new session
          autoNoteActive = false;
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

    async saveSession() {
      if (!gameSession) return;
      await saveGameSession(gameSession);
    },

    saveSessionLocally() {
      if (!gameSession) return;
      saveGameSessionLocally(gameSession);
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

    /**
     * Clears notes containing the placed number from related cells
     */
    clearRelatedNotes(row, col, number) {
      if (!gameSession || !gameSession.notes || number === null) return;

      const updatedNotes = { ...gameSession.notes };
      const cellsToUpdate = new Set();

      // Collect all related cells (row, column, and 3x3 box)
      // Row cells
      for (let c = 0; c < 9; c++) {
        if (c !== col && gameSession.grid[row][c] === null) {
          cellsToUpdate.add(`${row},${c}`);
        }
      }

      // Column cells
      for (let r = 0; r < 9; r++) {
        if (r !== row && gameSession.grid[r][col] === null) {
          cellsToUpdate.add(`${r},${col}`);
        }
      }

      // 3x3 box cells
      const boxRow = Math.floor(row / 3) * 3;
      const boxCol = Math.floor(col / 3) * 3;
      for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
          if ((r !== row || c !== col) && gameSession.grid[r][c] === null) {
            cellsToUpdate.add(`${r},${c}`);
          }
        }
      }

      // Remove the number from notes in all related cells
      let notesChanged = false;
      for (const cellKey of cellsToUpdate) {
        if (updatedNotes[cellKey]) {
          const cellNotes = updatedNotes[cellKey];
          if (cellNotes.has(number)) {
            // Create new Set without the number
            const newCellNotes = new Set(cellNotes);
            newCellNotes.delete(number);

            if (newCellNotes.size > 0) {
              updatedNotes[cellKey] = newCellNotes;
            } else {
              // Remove empty notes
              delete updatedNotes[cellKey];
            }
            notesChanged = true;
          }
        }
      }

      // Only update if notes actually changed
      if (notesChanged) {
        gameSession.notes = updatedNotes;
      }
    },

    handleNumberInput(event) {
      if (!gameSession || !gameSession.selectedCell) return;

      const { row, col } = gameSession.selectedCell;
      const number = event.detail;

      // Don't allow modifying original clue cells
      if (gameSession.originalGrid && gameSession.originalGrid[row][col] !== null) {
        return;
      }

      // Save cell state before modification
      context.saveCell(row, col);

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

        // Clear related notes when placing a number
        if (number !== null) {
          context.clearRelatedNotes(row, col, number);
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

      // Save cell state before erasing
      context.saveCell(row, col);

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

    toggleAutoNote() {
      if (!gameSession || !gameSession.grid) return;

      if (!autoNoteActive) {
        // Generate auto-notes
        const newNotes = {};

        // Go through all cells in the grid
        for (let row = 0; row < 9; row++) {
          for (let col = 0; col < 9; col++) {
            // Skip cells that already have values
            if (gameSession.grid[row][col] !== null) continue;

            // Skip original clue cells (though they should have values)
            if (gameSession.originalGrid && gameSession.originalGrid[row][col] !== null) continue;

            // Get valid candidates for this cell
            const candidates = getValidCandidates(gameSession.grid, row, col);

            // Only add to notes if there are candidates
            if (candidates.size > 0) {
              const cellKey = `${row},${col}`;
              newNotes[cellKey] = candidates;
            }
          }
        }

        // Update notes with the new auto-generated notes
        gameSession.notes = newNotes;
        autoNoteActive = true;
      } else {
        // Clear all notes
        gameSession.notes = {};
        autoNoteActive = false;
      }

      // Save the session with updated notes
      context.saveSession();
    },

    /**
     * Saves the current state of a cell before modification
     * @param {number} row - Row index
     * @param {number} col - Column index
     */
    saveCell(row, col) {
      if (!gameSession) return;

      const cellKey = `${row},${col}`;
      const entry = {
        row,
        col,
        previousValue: gameSession.grid[row][col],
        previousNotes: gameSession.notes[cellKey]
          ? new Set(gameSession.notes[cellKey])
          : null
      };

      cellHistory.past.push(entry);

      // Silently remove oldest when exceeding limit
      if (cellHistory.past.length > MAX_HISTORY_SIZE) {
        cellHistory.past.shift();
      }
    },

    /**
     * Undoes the last cell action
     */
    undoLastAction() {
      if (!gameSession || cellHistory.past.length === 0) return;

      const lastAction = cellHistory.past.pop();
      const { row, col, previousValue, previousNotes } = lastAction;
      const cellKey = `${row},${col}`;

      // Restore value
      gameSession.grid[row][col] = previousValue;

      // Restore notes or clear them
      if (previousNotes && previousNotes.size > 0) {
        gameSession.notes = {
          ...gameSession.notes,
          [cellKey]: previousNotes
        };
      } else {
        const newNotes = { ...gameSession.notes };
        delete newNotes[cellKey];
        gameSession.notes = newNotes;
      }

      // Clear incorrect status if reverting to empty
      if (previousValue === null) {
        delete gameSession.incorrectCells[cellKey];
      } else if (gameSession.solutionGrid) {
        // Re-validate if we restored a number
        if (previousValue !== gameSession.solutionGrid[row][col]) {
          gameSession.incorrectCells[cellKey] = true;
        } else {
          delete gameSession.incorrectCells[cellKey];
        }
      }

      // Save session after undo
      context.saveSession();
    },

    // Cleanup function
    cleanup() {
      context.stopTimer();
      if (flashTimeout) {
        clearTimeout(flashTimeout);
      }
      if (gameSession) {
        context.saveSession();
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