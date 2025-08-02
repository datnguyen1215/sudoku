<script>
  /** @type {{ grid: Array<Array<number|null>>, originalGrid: Array<Array<number|null>>, selectedCell: Object|null, onCellSelected: (event: CustomEvent) => void }} */
  let { grid, originalGrid, selectedCell, onCellSelected } = $props();

  /**
   * Checks if a cell is currently selected
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @returns {boolean}
   */
  function isCellSelected(row, col) {
    return selectedCell && selectedCell.row === row && selectedCell.col === col;
  }

  /**
   * Gets the section index for a cell (0-8)
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @returns {number}
   */
  function getSectionIndex(row, col) {
    return Math.floor(row / 3) * 3 + Math.floor(col / 3);
  }

  /**
   * Checks if a cell is an original clue (read-only)
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @returns {boolean}
   */
  function isClueCell(row, col) {
    return originalGrid && originalGrid[row] && originalGrid[row][col] !== null;
  }

  /**
   * Handles cell click, preventing selection of clue cells
   * @param {number} row - Row index
   * @param {number} col - Column index
   */
  function handleCellClick(row, col) {
    // Don't allow selection of original clue cells
    if (isClueCell(row, col)) {
      return;
    }

    const event = new CustomEvent('cellSelected', {
      detail: { row, col }
    });
    onCellSelected(event);
  }
</script>

<div class="sudoku-container">
  <div class="sudoku-grid">
    {#each grid as row, rowIndex}
      {#each row as cell, colIndex}
        <button
          class="sudoku-cell"
          class:selected={isCellSelected(rowIndex, colIndex)}
          class:filled={cell !== null}
          class:clue={isClueCell(rowIndex, colIndex)}
          class:right-border={colIndex === 2 || colIndex === 5}
          class:bottom-border={rowIndex === 2 || rowIndex === 5}
          onclick={() => handleCellClick(rowIndex, colIndex)}
          type="button"
        >
          {cell || ''}
        </button>
      {/each}
    {/each}
  </div>
</div>

<style>
  .sudoku-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    padding: var(--space-2);
  }

  .sudoku-grid {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    grid-template-rows: repeat(9, 1fr);
    gap: var(--sudoku-grid-gap);
    background-color: var(--color-neutral-900);
    border: var(--sudoku-border-section) solid var(--color-neutral-900);
    border-radius: var(--radius-lg);
    padding: var(--sudoku-section-gap);
    aspect-ratio: 1;
    width: min(100%, 90vh);
    max-width: min(90vw, 90vh);
  }

  .sudoku-cell {
    background-color: var(--color-neutral-50);
    border: var(--sudoku-border-thin) solid var(--color-neutral-300);
    color: var(--color-neutral-900);
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all var(--transition-fast);
    aspect-ratio: 1;
    min-height: 2rem;
  }

  .sudoku-cell:hover {
    background-color: var(--color-primary-50);
    border-color: var(--color-primary-300);
  }

  .sudoku-cell.selected {
    background-color: var(--color-primary-100);
    border-color: var(--color-primary-500);
    box-shadow: 0 0 0 2px var(--color-primary-500);
  }

  .sudoku-cell.filled {
    background-color: var(--color-neutral-100);
    color: var(--color-neutral-900);
  }

  .sudoku-cell.filled.selected {
    background-color: var(--color-primary-200);
  }

  .sudoku-cell.clue {
    background-color: var(--color-neutral-200);
    color: var(--color-neutral-800);
    font-weight: var(--font-weight-bold);
    cursor: default;
  }

  .sudoku-cell.clue:hover {
    background-color: var(--color-neutral-200);
    border-color: var(--color-neutral-300);
  }

  /* Section borders */
  .sudoku-cell.right-border {
    border-right: var(--sudoku-border-section) solid var(--color-neutral-900);
  }

  .sudoku-cell.bottom-border {
    border-bottom: var(--sudoku-border-section) solid var(--color-neutral-900);
  }

  @media (max-width: 640px) {
    .sudoku-container {
      padding: var(--space-1);
    }

    .sudoku-grid {
      width: min(95vw, 80vh);
      max-width: min(95vw, 80vh);
    }

    .sudoku-cell {
      font-size: var(--font-size-base);
      min-height: 1.75rem;
    }
  }

  @media (max-width: 480px) {
    .sudoku-grid {
      width: min(98vw, 75vh);
      max-width: min(98vw, 75vh);
    }

    .sudoku-cell {
      font-size: var(--font-size-sm);
      min-height: 1.5rem;
    }
  }
</style>
