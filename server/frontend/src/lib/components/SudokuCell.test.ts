import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import SudokuCell from './SudokuCell.svelte';
import type { SudokuCell as CellType } from '../utils/sudoku-engine';

describe('SudokuCell Component', () => {
	const mockCell: CellType = {
		value: 0,
		isOriginal: false,
		isError: false,
		notes: []
	};

	beforeEach(() => {
		// Reset cell state
		mockCell.value = 0;
		mockCell.isOriginal = false;
		mockCell.isError = false;
		mockCell.notes = [];
	});

	it('should render empty cell', () => {
		render(SudokuCell, {
			props: {
				cell: mockCell,
				row: 0,
				col: 0,
				selected: false,
				onCellClick: () => {},
				onCellInput: () => {}
			}
		});

		const cellElement = screen.getByRole('button');
		expect(cellElement).toBeInTheDocument();
		expect(cellElement).toHaveClass('sudoku-cell');
	});

	it('should display cell value when not empty', () => {
		mockCell.value = 5;

		render(SudokuCell, {
			props: {
				cell: mockCell,
				row: 0,
				col: 0,
				selected: false,
				onCellClick: () => {},
				onCellInput: () => {}
			}
		});

		expect(screen.getByText('5')).toBeInTheDocument();
	});

	it('should apply original cell styling', () => {
		mockCell.value = 5;
		mockCell.isOriginal = true;

		render(SudokuCell, {
			props: {
				cell: mockCell,
				row: 0,
				col: 0,
				selected: false,
				onCellClick: () => {},
				onCellInput: () => {}
			}
		});

		const cellElement = screen.getByRole('button');
		expect(cellElement).toHaveClass('original');
	});

	it('should apply error styling', () => {
		mockCell.value = 5;
		mockCell.isError = true;

		render(SudokuCell, {
			props: {
				cell: mockCell,
				row: 0,
				col: 0,
				selected: false,
				onCellClick: () => {},
				onCellInput: () => {}
			}
		});

		const cellElement = screen.getByRole('button');
		expect(cellElement).toHaveClass('error');
	});

	it('should apply selected styling', () => {
		render(SudokuCell, {
			props: {
				cell: mockCell,
				row: 0,
				col: 0,
				selected: true,
				onCellClick: () => {},
				onCellInput: () => {}
			}
		});

		const cellElement = screen.getByRole('button');
		expect(cellElement).toHaveClass('selected');
	});

	it('should call onCellClick when clicked', async () => {
		let clickedRow = -1;
		let clickedCol = -1;

		const handleClick = (row: number, col: number) => {
			clickedRow = row;
			clickedCol = col;
		};

		render(SudokuCell, {
			props: {
				cell: mockCell,
				row: 2,
				col: 3,
				selected: false,
				onCellClick: handleClick,
				onCellInput: () => {}
			}
		});

		const cellElement = screen.getByRole('button');
		await fireEvent.click(cellElement);

		expect(clickedRow).toBe(2);
		expect(clickedCol).toBe(3);
	});

	it('should handle keyboard input for numbers', async () => {
		let inputRow = -1;
		let inputCol = -1;
		let inputValue = -1;

		const handleInput = (row: number, col: number, value: number) => {
			inputRow = row;
			inputCol = col;
			inputValue = value;
		};

		render(SudokuCell, {
			props: {
				cell: mockCell,
				row: 1,
				col: 2,
				selected: true,
				onCellClick: () => {},
				onCellInput: handleInput
			}
		});

		const cellElement = screen.getByRole('button');
		await userEvent.type(cellElement, '7');

		expect(inputRow).toBe(1);
		expect(inputCol).toBe(2);
		expect(inputValue).toBe(7);
	});

	it('should ignore invalid keyboard input', async () => {
		let inputCalled = false;

		const handleInput = () => {
			inputCalled = true;
		};

		render(SudokuCell, {
			props: {
				cell: mockCell,
				row: 0,
				col: 0,
				selected: true,
				onCellClick: () => {},
				onCellInput: handleInput
			}
		});

		const cellElement = screen.getByRole('button');
		await userEvent.type(cellElement, 'a');

		expect(inputCalled).toBe(false);
	});

	it('should not accept input for original cells', async () => {
		mockCell.isOriginal = true;
		let inputCalled = false;

		const handleInput = () => {
			inputCalled = true;
		};

		render(SudokuCell, {
			props: {
				cell: mockCell,
				row: 0,
				col: 0,
				selected: true,
				onCellClick: () => {},
				onCellInput: handleInput
			}
		});

		const cellElement = screen.getByRole('button');
		await userEvent.type(cellElement, '5');

		expect(inputCalled).toBe(false);
	});

	it('should display notes when in note mode', () => {
		mockCell.notes = [1, 2, 3];

		render(SudokuCell, {
			props: {
				cell: mockCell,
				row: 0,
				col: 0,
				selected: false,
				onCellClick: () => {},
				onCellInput: () => {},
				noteMode: true
			}
		});

		expect(screen.getByText('1')).toBeInTheDocument();
		expect(screen.getByText('2')).toBeInTheDocument();
		expect(screen.getByText('3')).toBeInTheDocument();
	});

	it('should be accessible for screen readers', () => {
		mockCell.value = 7;

		render(SudokuCell, {
			props: {
				cell: mockCell,
				row: 2,
				col: 4,
				selected: false,
				onCellClick: () => {},
				onCellInput: () => {}
			}
		});

		const cellElement = screen.getByRole('button');
		expect(cellElement).toHaveAttribute('aria-label');
		expect(cellElement.getAttribute('aria-label')).toContain('Row 3, Column 5'); // 1-indexed for users
		expect(cellElement.getAttribute('aria-label')).toContain('7');
	});

	it('should support touch events on mobile', async () => {
		let touchRow = -1;
		let touchCol = -1;

		const handleClick = (row: number, col: number) => {
			touchRow = row;
			touchCol = col;
		};

		render(SudokuCell, {
			props: {
				cell: mockCell,
				row: 1,
				col: 1,
				selected: false,
				onCellClick: handleClick,
				onCellInput: () => {}
			}
		});

		const cellElement = screen.getByRole('button');

		// Simulate touch event
		await fireEvent.touchStart(cellElement);
		await fireEvent.touchEnd(cellElement);

		expect(touchRow).toBe(1);
		expect(touchCol).toBe(1);
	});
});
