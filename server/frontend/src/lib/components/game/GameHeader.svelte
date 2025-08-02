<script>
  /** @type {{ time: string, isPaused: boolean, difficulty: string, onBack: () => void, onPause: () => void, onHint: () => void }} */
  let { time, isPaused, difficulty, onBack, onPause, onHint } = $props();
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
    gap: clamp(0.25rem, 1vw, 0.75rem);
    padding: clamp(0.25rem, 1vh, 0.5rem) 0;
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
    gap: 0;
  }

  .header-right {
    display: flex;
    justify-content: flex-end;
    gap: clamp(0.25rem, 1vw, 0.5rem);
  }

  .timer-display {
    display: flex;
    align-items: center;
    gap: clamp(0.125rem, 0.5vw, 0.25rem);
    font-weight: var(--font-weight-medium);
  }

  .timer-label {
    color: var(--color-neutral-600);
    font-size: var(--font-size-sm);
  }

  .timer-value {
    color: var(--color-neutral-900);
    font-size: clamp(0.875rem, 2vw, 1.125rem);
    font-weight: var(--font-weight-semibold);
    font-family: 'Monaco', 'Menlo', monospace;
  }

  .difficulty-badge {
    background-color: var(--color-primary-100);
    color: var(--color-primary-700);
    padding: 0.125rem 0.375rem;
    border-radius: var(--radius-base);
    font-size: clamp(0.5rem, 1.2vw, 0.625rem);
    font-weight: var(--font-weight-medium);
  }

  @media (max-width: 640px) {
    .game-header {
      grid-template-columns: auto 1fr auto;
      gap: var(--space-2);
    }

    .header-center {
      gap: 0;
    }

    .timer-display {
      gap: 0.125rem;
    }

    .timer-value {
      font-size: clamp(0.75rem, 1.8vw, 0.875rem);
    }
  }
</style>
