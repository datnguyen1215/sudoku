<script>
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { loadGameSession, saveGameSession, saveGameSessionLocally, forceBackendSave, formatTime, getFilledNumbersInRow, getFilledNumbersInColumn, getFilledNumbersInBox } from '$utils/gameSession.js';
  import GameHeader from '$components/game/GameHeader.svelte';
  import SudokuGrid from '$components/game/SudokuGrid.svelte';
  import NumberPad from '$components/game/NumberPad.svelte';
  import ActionButtons from '$components/game/ActionButtons.svelte';

  /** @type {string} */
  const sessionId = page.params.sessionid;

  /** @type {Object|null} */
  let gameSession = $state(null);

  /** @type {number} */
  let currentTime = $state(0);

  /** @type {NodeJS.Timeout|null} */
  let timerInterval = null;

  /** @type {Object} */
  let flashingCells = $state({});

  /** @type {NodeJS.Timeout|null} */
  let flashTimeout = null;

  /**
   * Initialize the game session on component mount
   */
  onMount(async () => {
    try {
      gameSession = await loadGameSession(sessionId);

      if (!gameSession) {
        // Invalid session, redirect to difficulty selection
        console.warn('Invalid session ID:', sessionId);
        goto('/difficulty');
        return;
      }

      startTimer();
    } catch (error) {
      console.error('Failed to load game session:', error);
      goto('/difficulty');
    }

    // Cleanup timer on component unmount and force save
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      if (gameSession) {
        forceBackendSave(gameSession);
      }
    };
  });

  /**
   * Starts the game timer
   */
  function startTimer() {
    if (!gameSession || gameSession.isPaused) return;

    timerInterval = setInterval(() => {
      if (gameSession && !gameSession.isPaused) {
        currentTime = Date.now() - gameSession.startTime;
        gameSession.timeElapsed = currentTime;
        // Only save to localStorage for timer updates
        saveGameSessionLocally(gameSession);
      }
    }, 1000);
  }

  /**
   * Toggles pause state of the game
   */
  function togglePause() {
    if (!gameSession) return;

    gameSession.isPaused = !gameSession.isPaused;

    if (gameSession.isPaused) {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    } else {
      // Adjust start time to account for pause duration
      gameSession.startTime = Date.now() - gameSession.timeElapsed;
      startTimer();
    }

    // Use debounced save for pause/resume
    saveGameSession(gameSession);
  }

  /**
   * Handles navigation back to difficulty selection
   */
  function goBack() {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    // Force save before navigation
    if (gameSession) {
      forceBackendSave(gameSession);
    }
    goto('/difficulty');
  }

  /**
   * Handles cell selection in the sudoku grid
   * @param {Object} event - Cell selection event
   */
  function handleCellSelected(event) {
    if (!gameSession) return;

    gameSession.selectedCell = event.detail;
    // Cell selection doesn't need backend sync, just localStorage
    saveGameSessionLocally(gameSession);
  }

  /**
   * Handles number input from the number pad
   * @param {Object} event - Number input event
   */
  function handleNumberInput(event) {
    if (!gameSession || !gameSession.selectedCell) return;

    const { row, col } = gameSession.selectedCell;
    const number = event.detail;

    // Don't allow modifying original clue cells
    if (gameSession.originalGrid && gameSession.originalGrid[row][col] !== null) {
      return;
    }

    const cellKey = `${row},${col}`;

    // Check for conflicts and flash conflicting cells
    const conflictingCells = findConflictingCells(row, col, number);
    if (conflictingCells.length > 0) {
      flashConflictingCells(conflictingCells);
    }

    if (gameSession.isNotesMode) {
      // In notes mode, toggle the number in the notes set
      const currentNotes = gameSession.notes[cellKey] ? new Set(gameSession.notes[cellKey]) : new Set();

      if (currentNotes.has(number)) {
        // If note already exists, remove it (no conflict check needed for removal)
        currentNotes.delete(number);
      } else {
        // Adding a new note - check for conflicts first
        const conflictingCells = findConflictingCells(row, col, number);
        if (conflictingCells.length > 0) {
          // Flash conflicting cells to show why note can't be added
          flashConflictingCells(conflictingCells);
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

    // User made a move, debounce backend save
    saveGameSession(gameSession);
  }

  /**
   * Toggles notes mode on/off
   */
  function toggleNotes() {
    if (!gameSession) return;

    gameSession.isNotesMode = !gameSession.isNotesMode;
    // Notes mode toggle doesn't need backend sync
    saveGameSessionLocally(gameSession);
  }

  /**
   * Erases the selected cell
   */
  function eraseCell() {
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

    // User erased a cell, debounce backend save
    saveGameSession(gameSession);
  }

  /**
   * Shows hint for the current puzzle (placeholder)
   */
  function showHint() {
    alert('Hint feature coming soon!');
  }

  /**
   * Finds all cells that would conflict with placing a number in the selected cell
   * @param {number} row - Row index of the selected cell
   * @param {number} col - Column index of the selected cell
   * @param {number} number - The number to check conflicts for
   * @returns {Array<string>} Array of cell keys that contain conflicting numbers
   */
  function findConflictingCells(row, col, number) {
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
  }

  /**
   * Triggers flashing animation for conflicting cells
   * @param {Array<string>} cellKeys - Array of cell keys to flash
   */
  function flashConflictingCells(cellKeys) {
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
  }

</script>

{#if gameSession}
  <div class="game-container">
    <GameHeader
      time={formatTime(currentTime)}
      isPaused={gameSession.isPaused}
      difficulty={gameSession.difficulty}
      onBack={goBack}
      onPause={togglePause}
      onHint={showHint}
    />

    <div class="flex items-center justify-center h-full">
      <div class="game-board-wrapper">
        <SudokuGrid
          grid={gameSession.grid}
          originalGrid={gameSession.originalGrid}
          selectedCell={gameSession.selectedCell}
          incorrectCells={gameSession.incorrectCells}
          notes={gameSession.notes}
          flashingCells={flashingCells}
          onCellSelected={handleCellSelected}
        />

        <ActionButtons
          isNotesMode={gameSession.isNotesMode}
          onToggleNotes={toggleNotes}
          onErase={eraseCell}
          disabled={!gameSession.selectedCell}
        />

        <NumberPad
          onNumberSelected={handleNumberInput}
          disabled={!gameSession.selectedCell}
        />
      </div>
    </div>
  </div>
{:else}
  <div class="page-container">
    <main class="main-content">
      <div class="flex-center">
        <p>Loading game...</p>
      </div>
    </main>
  </div>
{/if}

<style>
  .game-container {
    height: 100vh;
    overflow: hidden;
    padding: 0.5rem;
    background-color: var(--color-neutral-50);
  }

  .game-board-wrapper {
    width: 100%;
    max-width: min(calc(100vh - 100px), calc(100vw - 20px));
    margin: 0 auto;
    padding-top: 1rem;
  }

  /* Components stack naturally as blocks */

  @media (max-width: 640px) {
    .game-container {
      padding: 0.25rem;
      gap: 0.25rem;
    }
  }

  @media (max-height: 700px) {
    .game-container {
      gap: 0.125rem;
    }
  }
</style>
