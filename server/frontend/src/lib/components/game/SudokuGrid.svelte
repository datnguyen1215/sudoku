<script>
  /** @type {{ grid: Array<Array<number|null>>, originalGrid: Array<Array<number|null>>, selectedCell: Object|null, incorrectCells: Object, onCellSelected: (event: CustomEvent) => void }} */
  let { grid, originalGrid, selectedCell, incorrectCells = {}, onCellSelected } = $props();

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
   * Checks if a cell is in the same row, column, or box as selected cell
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @returns {boolean}
   */
  function isRelatedCell(row, col) {
    if (!selectedCell) return false;

    // Same row or column
    if (row === selectedCell.row || col === selectedCell.col) return true;

    // Same 3x3 box
    const selectedBoxRow = Math.floor(selectedCell.row / 3);
    const selectedBoxCol = Math.floor(selectedCell.col / 3);
    const cellBoxRow = Math.floor(row / 3);
    const cellBoxCol = Math.floor(col / 3);

    return selectedBoxRow === cellBoxRow && selectedBoxCol === cellBoxCol;
  }

  /**
   * Checks if a cell has the same value as selected cell
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @returns {boolean}
   */
  function hasSameValue(row, col) {
    if (!selectedCell || !grid[selectedCell.row] || !grid[row]) return false;

    const selectedValue = grid[selectedCell.row][selectedCell.col];
    const cellValue = grid[row][col];

    return selectedValue !== null && cellValue !== null && selectedValue === cellValue;
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
   * Checks if a cell has an incorrect value
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @returns {boolean}
   */
  function isIncorrectCell(row, col) {
    const cellKey = `${row},${col}`;
    return incorrectCells[cellKey] === true;
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

<div class="sudoku-grid">
  {#each grid as row, rowIndex}
    {#each row as cell, colIndex}
      <button
        class="sudoku-cell"
        class:selected={isCellSelected(rowIndex, colIndex)}
        class:filled={cell !== null}
        class:clue={isClueCell(rowIndex, colIndex)}
        class:incorrect={isIncorrectCell(rowIndex, colIndex)}
        class:related={isRelatedCell(rowIndex, colIndex)}
        class:same-value={hasSameValue(rowIndex, colIndex)}
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

<style>
  .sudoku-grid {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    grid-template-rows: repeat(9, 1fr);
    gap: 1px;
    background-color: var(--sudoku-grid-border-color);
    border: 2px solid var(--sudoku-grid-border-color);
    border-radius: var(--radius-lg);
    padding: 2px;
    aspect-ratio: 1;
    width: 100%;
    height: auto;
    margin: 0 auto;
  }

  .sudoku-cell {
    background-color: var(--sudoku-cell-bg);
    border: var(--sudoku-border-thin) solid var(--color-neutral-300);
    color: var(--color-neutral-900);
    font-size: clamp(1rem, 3vw, 1.5rem);
    font-weight: var(--font-weight-semibold);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all var(--transition-fast);
    aspect-ratio: 1;
    min-height: 0;
  }

  .sudoku-cell:hover {
    background-color: var(--sudoku-cell-hover-bg);
    border-color: var(--color-primary-300);
  }

  .sudoku-cell.selected {
    background-color: var(--sudoku-cell-selected-bg);
    border-color: var(--color-primary-700);
    box-shadow: 0 0 0 2px var(--color-primary-700);
    z-index: 1;
  }

  .sudoku-cell.filled {
    background-color: var(--sudoku-cell-filled-bg);
    color: var(--color-neutral-900);
  }

  .sudoku-cell.filled.selected {
    background-color: var(--sudoku-cell-selected-bg);
  }

  .sudoku-cell.clue {
    background-color: var(--sudoku-cell-clue-bg);
    color: var(--color-neutral-700);
    font-weight: var(--font-weight-bold);
    cursor: default;
  }

  .sudoku-cell.clue:hover {
    background-color: var(--sudoku-cell-clue-bg);
    border-color: var(--color-neutral-300);
  }

  /* Incorrect cells */
  .sudoku-cell.incorrect {
    color: var(--color-error);
  }

  .sudoku-cell.incorrect.selected {
    color: var(--color-error);
  }

  /* Related cells (same row/column/box) */
  .sudoku-cell.related:not(.selected) {
    background-color: var(--sudoku-cell-related-bg);
  }

  /* Cells with same value */
  .sudoku-cell.same-value:not(.selected) {
    background-color: var(--sudoku-cell-same-value-bg);
    font-weight: var(--font-weight-bold);
  }

  /* Priority order for background colors */
  .sudoku-cell.clue.related {
    background-color: var(--sudoku-cell-clue-bg);
  }

  .sudoku-cell.same-value.related:not(.selected) {
    background-color: var(--sudoku-cell-same-value-bg);
  }

  /* Section borders */
  .sudoku-cell.right-border {
    border-right: var(--sudoku-border-section) solid var(--sudoku-grid-border-color);
  }

  .sudoku-cell.bottom-border {
    border-bottom: var(--sudoku-border-section) solid var(--sudoku-grid-border-color);
  }

  @media (max-width: 640px) {
    .sudoku-cell {
      font-size: clamp(0.875rem, 2.5vw, 1.25rem);
    }
  }

  @media (max-width: 480px) {
    .sudoku-cell {
      font-size: clamp(0.75rem, 2vw, 1rem);
    }
  }

  @media (max-height: 600px) {
    .sudoku-cell {
      font-size: clamp(0.75rem, 2vw, 1rem);
    }
  }

  /* Completion animation */
  @keyframes pulse-success {
    0% {
      background-color: var(--sudoku-cell-bg);
      transform: scale(1);
    }
    50% {
      background-color: var(--color-primary-300);
      transform: scale(1.05);
    }
    100% {
      background-color: var(--sudoku-cell-bg);
      transform: scale(1);
    }
  }

  .sudoku-cell.completed {
    animation: pulse-success 0.5s ease;
  }
</style>
