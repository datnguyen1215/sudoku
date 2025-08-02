<script>
  /** @type {{ onNumberSelected: (event: CustomEvent) => void, disabled?: boolean }} */
  let { onNumberSelected, disabled = false } = $props();

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
    gap: 0.375rem;
    padding: 0.5rem;
    background-color: var(--color-neutral-100);
    border-radius: 0 0 var(--radius-lg) var(--radius-lg);
    border: 1px solid var(--color-neutral-200);
    border-top: none;
    width: 100%;
  }

  .number-button {
    background-color: var(--color-neutral-50);
    border: 1px solid var(--color-neutral-300);
    color: var(--color-neutral-900);
    border-radius: var(--radius-base);
    font-size: clamp(1rem, 2.5vw, 1.375rem);
    font-weight: var(--font-weight-semibold);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all var(--transition-fast);
    aspect-ratio: 1;
    min-height: 0;
    height: auto;
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
      gap: 0.25rem;
      padding: 0.375rem;
    }

    .number-button {
      font-size: clamp(0.875rem, 2vw, 1.125rem);
    }
  }

  @media (max-width: 480px) {
    .number-pad {
      gap: 0.125rem;
      padding: 0.25rem;
    }

    .number-button {
      font-size: clamp(0.75rem, 1.75vw, 1rem);
    }
  }

  @media (max-height: 600px) {
    .number-pad {
      padding: 0.25rem;
      gap: 0.125rem;
    }

    .number-button {
      font-size: 0.875rem;
    }
  }
</style>
