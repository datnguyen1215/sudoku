<script>
  /** @type {{ isNotesMode: boolean, onToggleNotes: () => void, onErase: () => void, onCheck: () => void, disabled?: boolean }} */
  let { isNotesMode, onToggleNotes, onErase, onCheck, disabled = false } = $props();
</script>

<div class="action-buttons">
  <button
    class="action-button"
    class:active={isNotesMode}
    class:disabled
    onclick={onToggleNotes}
    {disabled}
    type="button"
    title="Toggle notes mode"
  >
    <span class="action-icon">📝</span>
    <span class="action-label">NOTES</span>
  </button>

  <button
    class="action-button"
    class:disabled
    onclick={onErase}
    {disabled}
    type="button"
    title="Erase selected cell"
  >
    <span class="action-icon">🗑️</span>
    <span class="action-label">ERASE</span>
  </button>

  <button class="action-button" onclick={onCheck} type="button" title="Check solution">
    <span class="action-icon">✅</span>
    <span class="action-label">CHECK</span>
  </button>
</div>

<style>
  .action-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-3);
    padding: var(--space-3);
  }

  .action-button {
    background-color: var(--color-neutral-50);
    border: 1px solid var(--color-neutral-300);
    color: var(--color-neutral-900);
    border-radius: var(--radius-lg);
    padding: var(--space-3);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-1);
    cursor: pointer;
    transition: all var(--transition-fast);
    min-height: 4rem;
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
    font-size: var(--font-size-xl);
    line-height: 1;
  }

  .action-label {
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  @media (max-width: 640px) {
    .action-buttons {
      gap: var(--space-2);
      padding: var(--space-2);
    }

    .action-button {
      padding: var(--space-2);
      min-height: 3.5rem;
    }

    .action-icon {
      font-size: var(--font-size-lg);
    }

    .action-label {
      font-size: var(--font-size-2xs);
    }
  }
</style>
