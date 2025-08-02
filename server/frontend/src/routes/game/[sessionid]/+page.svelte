<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { loadGameSession, saveGameSession, formatTime } from '$utils/gameSession.js';
  import GameHeader from '$components/game/GameHeader.svelte';
  import SudokuGrid from '$components/game/SudokuGrid.svelte';
  import NumberPad from '$components/game/NumberPad.svelte';
  import ActionButtons from '$components/game/ActionButtons.svelte';

  /** @type {string} */
  const sessionId = $page.params.sessionid;

  /** @type {Object|null} */
  let gameSession = $state(null);

  /** @type {number} */
  let currentTime = $state(0);

  /** @type {NodeJS.Timeout|null} */
  let timerInterval = null;

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

    // Cleanup timer on component unmount
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
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
        // Don't await to avoid blocking the timer
        saveGameSession(gameSession);
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

    // Don't await to keep UI responsive
    saveGameSession(gameSession);
  }

  /**
   * Handles navigation back to difficulty selection
   */
  function goBack() {
    if (timerInterval) {
      clearInterval(timerInterval);
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
    saveGameSession(gameSession);
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

    gameSession.grid[row][col] = number;

    // Validate the entry if we have a solution
    const cellKey = `${row},${col}`;
    if (gameSession.solutionGrid) {
      // Local game - we have the solution
      if (number !== null && number !== gameSession.solutionGrid[row][col]) {
        gameSession.incorrectCells[cellKey] = true;
      } else {
        delete gameSession.incorrectCells[cellKey];
      }
    }

    // Don't await to keep UI responsive
    saveGameSession(gameSession);
  }

  /**
   * Toggles notes mode on/off
   */
  function toggleNotes() {
    if (!gameSession) return;

    gameSession.isNotesMode = !gameSession.isNotesMode;
    // Don't await to keep UI responsive
    saveGameSession(gameSession);
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

    gameSession.grid[row][col] = null;

    // Remove from incorrect cells when erasing
    const cellKey = `${row},${col}`;
    delete gameSession.incorrectCells[cellKey];

    // Don't await to keep UI responsive
    saveGameSession(gameSession);
  }

  /**
   * Shows hint for the current puzzle (placeholder)
   */
  function showHint() {
    alert('Hint feature coming soon!');
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
          onCellSelected={handleCellSelected}
        />

        <ActionButtons
          isNotesMode={gameSession.isNotesMode}
          onToggleNotes={toggleNotes}
          onErase={eraseCell}
          disabled={!gameSession.selectedCell}
        />

        <NumberPad onNumberSelected={handleNumberInput} disabled={!gameSession.selectedCell} />
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
