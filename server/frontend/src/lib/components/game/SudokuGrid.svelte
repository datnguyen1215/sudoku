<script>
  import { getGameContext } from '$lib/context/gameContext.svelte.js';

  const game = getGameContext();

  /**
   * Checks if a cell is currently selected
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @returns {boolean}
   */
  function isCellSelected(row, col) {
    return game.gameSession?.selectedCell && game.gameSession.selectedCell.row === row && game.gameSession.selectedCell.col === col;
  }

  /**
   * Checks if a cell is in the same row, column, or box as selected cell
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @returns {boolean}
   */
  function isRelatedCell(row, col) {
    const selectedCell = game.gameSession?.selectedCell;
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
    const selectedCell = game.gameSession?.selectedCell;
    const grid = game.gameSession?.grid;
    if (!selectedCell || !grid?.[selectedCell.row] || !grid?.[row]) return false;

    const selectedValue = grid[selectedCell.row][selectedCell.col];
    const cellValue = grid[row][col];

    return selectedValue !== null && cellValue !== null && selectedValue === cellValue;
  }

  /**
   * Checks if a cell is an original clue (read-only)
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @returns {boolean}
   */
  function isClueCell(row, col) {
    const originalGrid = game.gameSession?.originalGrid;
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
    return game.gameSession?.incorrectCells?.[cellKey] === true;
  }

  /**
   * Checks if a cell is currently flashing
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @returns {boolean}
   */
  function isFlashingCell(row, col) {
    const cellKey = `${row},${col}`;
    return game.flashingCells[cellKey] === true;
  }

  /**
   * Checks if a cell is user-entered and correct
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @returns {boolean}
   */
  function isUserEnteredCorrect(row, col) {
    const grid = game.gameSession?.grid;
    if (!grid || grid[row][col] === null) return false;

    // Has value, not a clue, and not incorrect
    return !isClueCell(row, col) && !isIncorrectCell(row, col);
  }

  /**
   * Gets the notes for a cell as an array
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @returns {Array<number>}
   */
  function getCellNotes(row, col) {
    const cellKey = `${row},${col}`;
    const cellNotes = game.gameSession?.notes?.[cellKey];
    return cellNotes ? Array.from(cellNotes).sort() : [];
  }

  /**
   * Handles cell click for all cells (including clue cells)
   * @param {number} row - Row index
   * @param {number} col - Column index
   */
  function handleCellClick(row, col) {
    const event = new CustomEvent('cellSelected', {
      detail: { row, col }
    });
    game.handleCellSelected(event);
  }
</script>

<div class="sudoku-grid">
  {#each game.gameSession?.grid || [] as row, rowIndex}
    {#each row as cell, colIndex}
      <button
        class="sudoku-cell"
        class:selected={isCellSelected(rowIndex, colIndex)}
        class:filled={cell !== null}
        class:clue={isClueCell(rowIndex, colIndex)}
        class:incorrect={isIncorrectCell(rowIndex, colIndex)}
        class:user-correct={isUserEnteredCorrect(rowIndex, colIndex)}
        class:related={isRelatedCell(rowIndex, colIndex)}
        class:same-value={hasSameValue(rowIndex, colIndex)}
        class:has-notes={cell === null && getCellNotes(rowIndex, colIndex).length > 0}
        class:flashing={isFlashingCell(rowIndex, colIndex)}
        class:right-border={colIndex === 2 || colIndex === 5}
        class:bottom-border={rowIndex === 2 || rowIndex === 5}
        onclick={() => handleCellClick(rowIndex, colIndex)}
        type="button"
      >
        {#if cell !== null}
          {cell}
        {:else}
          {#each getCellNotes(rowIndex, colIndex) as note}
            <span class="note note-{note}">{note}</span>
          {/each}
        {/if}
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
    cursor: pointer;
  }

  .sudoku-cell.clue:hover {
    background-color: var(--sudoku-cell-hover-bg);
    border-color: var(--color-primary-300);
  }

  .sudoku-cell.clue.selected {
    background-color: var(--sudoku-cell-selected-bg);
    border-color: var(--color-primary-700);
    box-shadow: 0 0 0 2px var(--color-primary-700);
  }

  /* User-entered correct cells */
  .sudoku-cell.user-correct {
    color: var(--color-user-entered);
  }

  /* User-entered incorrect cells */
  .sudoku-cell.incorrect {
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
  .sudoku-cell.related:not(.selected):is(.clue, .filled) {
    background-color: var(--sudoku-cell-related-bg);
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

  /* Notes display */
  .sudoku-cell.has-notes {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    padding: 2px;
    font-size: clamp(0.4rem, 1vw, 0.625rem);
    font-weight: normal;
  }

  .note {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: var(--color-neutral-600);
    line-height: 1;
  }

  /* Position each note in its grid position */
  .note-1 { grid-area: 1 / 1; }
  .note-2 { grid-area: 1 / 2; }
  .note-3 { grid-area: 1 / 3; }
  .note-4 { grid-area: 2 / 1; }
  .note-5 { grid-area: 2 / 2; }
  .note-6 { grid-area: 2 / 3; }
  .note-7 { grid-area: 3 / 1; }
  .note-8 { grid-area: 3 / 2; }
  .note-9 { grid-area: 3 / 3; }

  /* Flashing animation for conflicting cells */
  .sudoku-cell.flashing {
    animation: flash 0.5s ease-in-out;
  }

  @keyframes flash {
    0% { background-color: var(--sudoku-cell-bg); }
    50% { background-color: var(--color-error-100); }
    100% { background-color: var(--sudoku-cell-bg); }
  }

  /* Override other background colors when flashing */
  .sudoku-cell.flashing.filled,
  .sudoku-cell.flashing.clue,
  .sudoku-cell.flashing.related,
  .sudoku-cell.flashing.same-value {
    animation: flash 0.5s ease-in-out;
  }


</style>
