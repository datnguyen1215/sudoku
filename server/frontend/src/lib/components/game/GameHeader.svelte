<script>
  /** @type {string} */
  export let time;

  /** @type {boolean} */
  export let isPaused;

  /** @type {string} */
  export let difficulty;

  /** @type {() => void} */
  export let onBack;

  /** @type {() => void} */
  export let onPause;

  /** @type {() => void} */
  export let onHint;
</script>

<header class="game-header">
  <div class="header-left">
    <button class="btn btn-secondary btn-small" onclick={onBack}> ← Back </button>
  </div>

  <div class="header-center">
    <div class="timer-display">
      <span class="timer-label">Timer:</span>
      <span class="timer-value">{time}</span>
    </div>
    <div class="difficulty-badge">
      {difficulty.toUpperCase()}
    </div>
  </div>

  <div class="header-right">
    <button
      class="btn btn-secondary btn-small"
      onclick={onPause}
      title={isPaused ? 'Resume' : 'Pause'}
    >
      {isPaused ? '▶️' : '⏸️'}
    </button>
    <button class="btn btn-secondary btn-small" onclick={onHint} title="Hint"> 💡 </button>
  </div>
</header>

<style>
  .game-header {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-2) 0;
    border-bottom: 1px solid var(--color-neutral-200);
  }

  .header-left {
    display: flex;
    justify-content: flex-start;
  }

  .header-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-1);
  }

  .header-right {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-2);
  }

  .timer-display {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-weight: var(--font-weight-medium);
  }

  .timer-label {
    color: var(--color-neutral-600);
    font-size: var(--font-size-sm);
  }

  .timer-value {
    color: var(--color-neutral-900);
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    font-family: 'Monaco', 'Menlo', monospace;
  }

  .difficulty-badge {
    background-color: var(--color-primary-100);
    color: var(--color-primary-700);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-base);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
  }

  @media (max-width: 640px) {
    .game-header {
      grid-template-columns: auto 1fr auto;
      gap: var(--space-2);
    }

    .header-center {
      gap: var(--space-0-5);
    }

    .timer-display {
      gap: var(--space-1);
    }

    .timer-value {
      font-size: var(--font-size-base);
    }
  }
</style>
