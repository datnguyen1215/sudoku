<script lang="ts">
	import type { SudokuCell } from '../utils/sudoku-engine';

	interface Props {
		cell: SudokuCell;
		row: number;
		col: number;
		selected: boolean;
		noteMode?: boolean;
		onCellClick: (row: number, col: number) => void;
		onCellInput: (row: number, col: number, value: number) => void;
	}

	let { cell, row, col, selected, noteMode = false, onCellClick, onCellInput }: Props = $props();

	function handleClick() {
		onCellClick(row, col);
	}

	function handleKeydown(event: KeyboardEvent) {
		// Only accept input if not original cell
		if (cell.isOriginal) return;

		const key = event.key;

		// Handle number input (1-9)
		if (key >= '1' && key <= '9') {
			const value = parseInt(key);
			onCellInput(row, col, value);
			event.preventDefault();
		}

		// Handle delete/backspace to clear cell
		if (key === 'Delete' || key === 'Backspace') {
			onCellInput(row, col, 0);
			event.preventDefault();
		}
	}

	function handleTouchEnd(event: TouchEvent) {
		// Prevent click event from firing after touch
		event.preventDefault();
		handleClick();
	}

	// Generate aria-label for accessibility
	const ariaLabel = $derived(() => {
		const rowLabel = `Row ${row + 1}`;
		const colLabel = `Column ${col + 1}`;
		const valueLabel = cell.value === 0 ? 'empty' : `value ${cell.value}`;
		const typeLabel = cell.isOriginal ? 'original' : 'editable';
		const stateLabel = cell.isError ? 'error' : selected ? 'selected' : '';

		return `${rowLabel}, ${colLabel}, ${valueLabel}, ${typeLabel} ${stateLabel}`.trim();
	});

	// CSS classes
	const cellClasses = $derived(
		[
			'sudoku-cell',
			cell.isOriginal && 'original',
			cell.isError && 'error',
			selected && 'selected',
			noteMode && cell.notes.length > 0 && 'has-notes'
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

<button
	class={cellClasses}
	tabindex={selected ? 0 : -1}
	aria-label={ariaLabel()}
	onclick={handleClick}
	onkeydown={handleKeydown}
	ontouchend={handleTouchEnd}
>
	{#if noteMode && cell.notes.length > 0 && cell.value === 0}
		<div class="notes">
			{#each Array(9) as _, i}
				<span class="note" class:visible={cell.notes.includes(i + 1)}>
					{cell.notes.includes(i + 1) ? i + 1 : ''}
				</span>
			{/each}
		</div>
	{:else if cell.value !== 0}
		<span class="value">{cell.value}</span>
	{/if}
</button>

<style>
	.sudoku-cell {
		width: 100%;
		height: 100%;
		min-height: 40px;
		border: 1px solid #ddd;
		background: white;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.2rem;
		font-weight: 500;
		position: relative;
		outline: none;
		user-select: none;
		-webkit-tap-highlight-color: transparent;
		touch-action: manipulation;
	}

	.sudoku-cell:hover {
		background: #f0f0f0;
	}

	.sudoku-cell:focus-visible {
		outline: 2px solid #007bff;
		outline-offset: -2px;
	}

	.sudoku-cell.selected {
		background: #e3f2fd;
		border-color: #1976d2;
	}

	.sudoku-cell.original {
		background: #f5f5f5;
		color: #333;
		font-weight: 600;
	}

	.sudoku-cell.original:hover {
		background: #f5f5f5;
		cursor: default;
	}

	.sudoku-cell.error {
		background: #ffebee;
		color: #c62828;
		border-color: #c62828;
	}

	.value {
		font-size: inherit;
		line-height: 1;
	}

	.notes {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(3, 1fr);
		width: 100%;
		height: 100%;
		gap: 1px;
		font-size: 0.6rem;
		font-weight: 400;
	}

	.note {
		display: flex;
		align-items: center;
		justify-content: center;
		color: #666;
		line-height: 1;
	}

	.note:not(.visible) {
		visibility: hidden;
	}

	/* Mobile optimizations */
	@media (max-width: 768px) {
		.sudoku-cell {
			min-height: 35px;
			font-size: 1rem;
		}

		.notes {
			font-size: 0.5rem;
		}
	}

	/* Touch device optimizations */
	@media (hover: none) and (pointer: coarse) {
		.sudoku-cell {
			min-height: 44px; /* iOS minimum touch target */
		}

		.sudoku-cell:hover {
			background: white;
		}

		.sudoku-cell:active {
			background: #e3f2fd;
		}
	}

	/* High contrast mode support */
	@media (prefers-contrast: high) {
		.sudoku-cell {
			border-color: #000;
		}

		.sudoku-cell.selected {
			border-width: 2px;
		}

		.sudoku-cell.error {
			border-width: 2px;
		}
	}

	/* Reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		.sudoku-cell {
			transition: none;
		}
	}
</style>
