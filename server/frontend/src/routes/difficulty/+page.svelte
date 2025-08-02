<script>
  import { goto } from '$app/navigation';
  import { createGameSession } from '$utils/gameSession.js';
  import { createLogger } from '$utils/logger.js';

  const logger = createLogger('difficulty/+page.svelte');

  /**
   * @typedef {Object} DifficultyLevel
   * @property {string} id - Unique identifier for the difficulty level
   * @property {string} title - Display name for the difficulty level
   * @property {string} description - User-friendly description of difficulty level
   * @property {number} clues - Number of pre-filled clues for this difficulty
   */

  /** @type {DifficultyLevel[]} */
  const difficulties = [
    {
      id: 'easy',
      title: 'EASY',
      description: 'For beginners',
      clues: 30
    },
    {
      id: 'medium',
      title: 'MEDIUM',
      description: 'Balanced',
      clues: 38
    },
    {
      id: 'hard',
      title: 'HARD',
      description: 'Challenging',
      clues: 47
    },
    {
      id: 'expert',
      title: 'EXPERT',
      description: 'Advanced',
      clues: 57
    }
  ];

  /**
   * Starts a new game with the specified difficulty level
   * @param {DifficultyLevel} difficulty - The selected difficulty configuration
   */
  const startGameWithDifficulty = async difficulty => {
    logger.info('Starting new game', { difficulty: difficulty.id });

    try {
      // Create a new game session
      const session = await createGameSession(difficulty.id);

      // Navigate to the game page with the session ID
      goto(`/game/${session.id}`);
    } catch (error) {
      logger.error('Failed to start game', { error: error.message });
      alert(error.message || 'Failed to start game. Please try again.');
    }
  };

  /**
   * Navigates back to the welcome page
   */
  const goBack = () => {
    logger.debug('Navigating back to home');
    goto('/');
  };
</script>

<div class="page-container">
  <main class="main-content">
    <div class="welcome-header">
      <div class="flex-center" style="justify-content: flex-start; margin-bottom: var(--space-6);">
        <button class="btn btn-secondary" onclick={goBack} style="margin-right: auto;">
          ← Back
        </button>
      </div>
      <h1 class="app-title" style="font-size: var(--font-size-2xl); margin-bottom: var(--space-2);">
        Choose Difficulty
      </h1>
      <p
        class="text-center"
        style="color: var(--color-neutral-600); font-size: var(--font-size-base);"
      >
        Select your challenge level
      </p>
    </div>

    <div style="display: grid; gap: var(--space-4); max-width: 20rem; margin: 0 auto; width: 100%;">
      {#each difficulties as difficulty}
        <button
          class="difficulty-card"
          onclick={() => startGameWithDifficulty(difficulty)}
          type="button"
        >
          <div class="difficulty-title">{difficulty.title}</div>
          <div class="difficulty-description">{difficulty.description}</div>
        </button>
      {/each}
    </div>
  </main>
</div>
