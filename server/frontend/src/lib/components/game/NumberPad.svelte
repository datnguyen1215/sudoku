<script>
  /** @type {(event: CustomEvent) => void} */
  export let onNumberSelected;

  /** @type {boolean} */
  export let disabled = false;

  /**
   * Handles number button click
   * @param {number} number - The selected number (1-9)
   */
  function handleNumberClick(number) {
    if (disabled) return;

    const event = new CustomEvent('numberSelected', {
      detail: number
    });
    onNumberSelected(event);
  }

  /** @type {number[]} */
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
</script>

<div class="number-pad">
  {#each numbers as number}
    <button
      class="number-button"
      class:disabled
      onclick={() => handleNumberClick(number)}
      {disabled}
      type="button"
    >
      {number}
    </button>
  {/each}
</div>

<style>
  .number-pad {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    gap: var(--space-2);
    padding: var(--space-3);
    background-color: var(--color-neutral-100);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-neutral-200);
  }

  .number-button {
    background-color: var(--color-neutral-50);
    border: 1px solid var(--color-neutral-300);
    color: var(--color-neutral-900);
    border-radius: var(--radius-base);
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all var(--transition-fast);
    aspect-ratio: 1;
    min-height: 2.5rem;
  }

  .number-button:hover:not(.disabled) {
    background-color: var(--color-primary-50);
    border-color: var(--color-primary-300);
    transform: translateY(-1px);
  }

  .number-button:active:not(.disabled) {
    transform: translateY(0);
    background-color: var(--color-primary-100);
  }

  .number-button.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: var(--color-neutral-200);
    color: var(--color-neutral-500);
  }

  @media (max-width: 640px) {
    .number-pad {
      gap: var(--space-1);
      padding: var(--space-2);
    }

    .number-button {
      font-size: var(--font-size-base);
      min-height: 2rem;
    }
  }

  @media (max-width: 480px) {
    .number-button {
      font-size: var(--font-size-sm);
      min-height: 1.75rem;
    }
  }
</style>
