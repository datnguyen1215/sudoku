<script lang="ts">
	import type { SudokuGrid as GridType } from '../utils/sudoku-engine';
	import SudokuCell from './SudokuCell.svelte';

	interface Props {
		grid: GridType;
		selectedCell: { row: number; col: number } | null;
		onCellClick: (row: number, col: number) => void;
		onCellInput: (row: number, col: number, value: number) => void;
	}

	let { grid, selectedCell, onCellClick, onCellInput }: Props = $props();

	function getCellClasses(row: number, col: number): string {
		const classes = ['sudoku-cell'];

		// Add border classes for 3x3 box separation
		if (col === 2 || col === 5) classes.push('right-box');
		if (row === 2 || row === 5) classes.push('bottom-box');

		// Add selected class
		if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
			classes.push('selected');
		}

		return classes.join(' ');
	}
</script>

<div class="sudoku-grid">
	{#each grid as row, rowIndex}
		{#each row as cell, colIndex}
			<div class={getCellClasses(rowIndex, colIndex)}>
				<SudokuCell
					{cell}
					row={rowIndex}
					col={colIndex}
					selected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
					{onCellClick}
					{onCellInput}
				/>
			</div>
		{/each}
	{/each}
</div>

<style>
	.sudoku-grid {
		display: grid;
		grid-template-columns: repeat(9, 1fr);
		grid-template-rows: repeat(9, 1fr);
		gap: 1px;
		background-color: #333;
		border: 2px solid #333;
		aspect-ratio: 1;
		max-width: 500px;
		width: 100%;
		margin: 0 auto;
		border-radius: 4px;
		overflow: hidden;
	}

	.sudoku-cell {
		background: white;
		position: relative;
	}

	/* 3x3 box borders */
	.sudoku-cell.right-box {
		border-right: 2px solid #333;
	}

	.sudoku-cell.bottom-box {
		border-bottom: 2px solid #333;
	}

	/* Mobile responsive */
	@media (max-width: 768px) {
		.sudoku-grid {
			max-width: 350px;
			gap: 0.5px;
		}
	}

	@media (max-width: 480px) {
		.sudoku-grid {
			max-width: 320px;
		}
	}

	/* Touch device optimizations */
	@media (hover: none) and (pointer: coarse) {
		.sudoku-grid {
			max-width: 90vw;
		}
	}

	/* High contrast mode */
	@media (prefers-contrast: high) {
		.sudoku-grid {
			border-color: #000;
		}

		.sudoku-cell.right-box {
			border-right-color: #000;
		}

		.sudoku-cell.bottom-box {
			border-bottom-color: #000;
		}
	}
</style>
