<script>
  import { getGameContext } from '$lib/context/gameContext.svelte.js';

  const game = getGameContext();
</script>

<div class="action-buttons">
  <button
    class="action-button"
    class:active={game.gameSession?.isNotesMode}
    class:disabled={!game.gameSession?.selectedCell}
    onclick={game.toggleNotes}
    disabled={!game.gameSession?.selectedCell}
    type="button"
    title="Toggle notes mode"
  >
    <span class="action-icon">📝</span>
    <span class="action-label">NOTES</span>
  </button>

  <button
    class="action-button"
    class:disabled={!game.gameSession?.selectedCell}
    onclick={game.eraseCell}
    disabled={!game.gameSession?.selectedCell}
    type="button"
    title="Erase selected cell"
  >
    <span class="action-icon">🗑️</span>
    <span class="action-label">ERASE</span>
  </button>
</div>

<style>
  .action-buttons {
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem;
    width: 100%;
    background-color: var(--color-neutral-100);
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  }

  .action-button {
    background-color: var(--color-neutral-50);
    border: 1px solid var(--color-neutral-300);
    color: var(--color-neutral-900);
    border-radius: var(--radius-lg);
    padding: clamp(0.25rem, 1vw, 0.75rem);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    flex: 1;
    cursor: pointer;
    transition: all var(--transition-fast);
    height: 2.5rem;
  }

  .action-button:hover:not(.disabled) {
    background-color: var(--color-primary-50);
    border-color: var(--color-primary-300);
    transform: translateY(-1px);
  }

  .action-button:active:not(.disabled) {
    transform: translateY(0);
  }

  .action-button.active {
    background-color: var(--color-primary-100);
    border-color: var(--color-primary-500);
    color: var(--color-primary-700);
  }

  .action-button.active:hover {
    background-color: var(--color-primary-200);
  }

  .action-button.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: var(--color-neutral-200);
    color: var(--color-neutral-500);
  }

  .action-icon {
    font-size: 1rem;
    line-height: 1;
  }

  .action-label {
    font-size: 0.625rem;
    font-weight: var(--font-weight-medium);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  @media (max-width: 640px) {
    .action-buttons {
      gap: 0.25rem;
      padding: 0.375rem;
    }

    .action-button {
      padding: 0.375rem;
      height: 2rem;
    }

    .action-icon {
      font-size: 0.875rem;
    }

    .action-label {
      font-size: 0.5rem;
    }
  }

  @media (max-height: 600px) {
    .action-button {
      height: 1.75rem;
      padding: 0.25rem;
    }

    .action-icon {
      font-size: 0.75rem;
    }

    .action-label {
      display: none;
    }
  }
</style>
