<script>
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { formatTime } from '$utils/formatters.js';
  import { createGameContext } from '$lib/context/gameContext.svelte.js';
  import GameHeader from '$components/game/GameHeader.svelte';
  import SudokuGrid from '$components/game/SudokuGrid.svelte';
  import NumberPad from '$components/game/NumberPad.svelte';
  import ActionButtons from '$components/game/ActionButtons.svelte';

  /** @type {string} */
  const sessionId = page.params.sessionid;

  // Create and set game context
  const game = createGameContext(sessionId);

  /**
   * Initialize the game session on component mount
   */
  onMount(async () => {
    const session = await game.loadSession();

    if (!session) {
      // Invalid session, redirect to difficulty selection
      console.warn('Invalid session ID:', sessionId);
      goto('/difficulty');
      return;
    }

    game.startTimer();

    // Cleanup on component unmount
    return () => {
      game.cleanup();
    };
  });

  /**
   * Toggles pause state of the game
   */
  function togglePause() {
    game.togglePause();
  }

  /**
   * Handles navigation back to difficulty selection
   */
  function goBack() {
    game.stopTimer();
    if (game.gameSession) {
      game.forceSave();
    }
    goto('/difficulty');
  }

  /**
   * Shows hint for the current puzzle (placeholder)
   */
  function showHint() {
    alert('Hint feature coming soon!');
  }
</script>

{#if game.loading}
  <div class="page-container">
    <main class="main-content">
      <div class="flex-center">
        <p>Loading game...</p>
      </div>
    </main>
  </div>
{:else if game.error}
  <div class="page-container">
    <main class="main-content">
      <div class="flex-center">
        <p>Error: {game.error}</p>
        <button class="btn btn-primary" onclick={() => goto('/difficulty')}>
          Back to Difficulty Selection
        </button>
      </div>
    </main>
  </div>
{:else if game.gameSession}
  <div class="game-container">
    <GameHeader
      time={formatTime(game.currentTime)}
      isPaused={game.gameSession.isPaused}
      difficulty={game.gameSession.difficulty}
      onBack={goBack}
      onPause={togglePause}
      onHint={showHint}
    />

    <div class="flex items-center justify-center h-full">
      <div class="game-board-wrapper">
        <SudokuGrid />

        <ActionButtons />

        <NumberPad />
      </div>
    </div>
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