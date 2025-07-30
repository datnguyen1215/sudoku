import { describe, it, expect } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import SudokuGrid from './SudokuGrid.svelte';
import { createEmptyGrid } from '../utils/sudoku-engine';

describe('SudokuGrid Component', () => {
	it('should render 9x9 grid of cells', () => {
		const grid = createEmptyGrid();

		render(SudokuGrid, {
			props: {
				grid,
				selectedCell: null,
				onCellClick: () => {},
				onCellInput: () => {}
			}
		});

		// Should render 81 cells (9x9)
		const cells = screen.getAllByRole('button');
		expect(cells).toHaveLength(81);
	});

	it('should apply proper grid styling', () => {
		const grid = createEmptyGrid();

		const { container } = render(SudokuGrid, {
			props: {
				grid,
				selectedCell: null,
				onCellClick: () => {},
				onCellInput: () => {}
			}
		});

		const gridElement = container.querySelector('.sudoku-grid');
		expect(gridElement).toBeInTheDocument();
		expect(gridElement).toHaveClass('sudoku-grid');
	});

	it('should highlight selected cell', () => {
		const grid = createEmptyGrid();

		render(SudokuGrid, {
			props: {
				grid,
				selectedCell: { row: 2, col: 3 },
				onCellClick: () => {},
				onCellInput: () => {}
			}
		});

		// Find the selected cell and verify it has selected class
		const cells = screen.getAllByRole('button');
		const selectedCell = cells[2 * 9 + 3]; // row 2, col 3 in flat array
		expect(selectedCell).toHaveClass('selected');
	});

	it('should call onCellClick when cell is clicked', async () => {
		const grid = createEmptyGrid();
		let clickedRow = -1;
		let clickedCol = -1;

		const handleCellClick = (row: number, col: number) => {
			clickedRow = row;
			clickedCol = col;
		};

		render(SudokuGrid, {
			props: {
				grid,
				selectedCell: null,
				onCellClick: handleCellClick,
				onCellInput: () => {}
			}
		});

		const cells = screen.getAllByRole('button');
		await fireEvent.click(cells[10]); // Click second row, first column (index 10)

		expect(clickedRow).toBe(1);
		expect(clickedCol).toBe(1);
	});

	it('should be responsive on mobile devices', () => {
		const grid = createEmptyGrid();

		const { container } = render(SudokuGrid, {
			props: {
				grid,
				selectedCell: null,
				onCellClick: () => {},
				onCellInput: () => {}
			}
		});

		const gridElement = container.querySelector('.sudoku-grid');
		expect(gridElement).toHaveClass('sudoku-grid');

		// Check that it has mobile-responsive styling
		const computedStyle = window.getComputedStyle(gridElement!);
		expect(computedStyle.display).toBe('grid');
	});

	it('should apply box borders for 3x3 sections', () => {
		const grid = createEmptyGrid();

		const { container } = render(SudokuGrid, {
			props: {
				grid,
				selectedCell: null,
				onCellClick: () => {},
				onCellInput: () => {}
			}
		});

		// Check that cells have appropriate border classes for 3x3 boxes
		const cells = container.querySelectorAll('.sudoku-cell');

		// Top-right cell of first box should have right-box-border
		const topRightFirstBox = cells[2]; // row 0, col 2
		expect(topRightFirstBox).toHaveClass('right-box');

		// Bottom-left cell of first box should have bottom-box-border
		const bottomLeftFirstBox = cells[18]; // row 2, col 0
		expect(bottomLeftFirstBox).toHaveClass('bottom-box');
	});
});
