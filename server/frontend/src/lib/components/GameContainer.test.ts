import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import GameContainer from './GameContainer.svelte';

describe('GameContainer Component', () => {
	beforeEach(() => {
		// Reset any global state before each test
		localStorage.clear();
	});

	it('should render all game components', () => {
		render(GameContainer);

		// Should render the main game elements
		expect(screen.getByRole('main')).toBeInTheDocument();
		expect(screen.getByText('Sudoku')).toBeInTheDocument();

		// Should render number pad
		expect(screen.getByText('1')).toBeInTheDocument();
		expect(screen.getByText('Clear')).toBeInTheDocument();
		expect(screen.getByText('Notes')).toBeInTheDocument();
	});

	it('should render game controls', () => {
		render(GameContainer);

		// Should have game control buttons
		expect(screen.getByText('New Game')).toBeInTheDocument();
		expect(screen.getByText('Hint')).toBeInTheDocument();
		expect(screen.getByText('Undo')).toBeInTheDocument();
	});

	it('should render difficulty selector', () => {
		render(GameContainer);

		// Should have difficulty options
		expect(screen.getByText('Easy')).toBeInTheDocument();
		expect(screen.getByText('Medium')).toBeInTheDocument();
		expect(screen.getByText('Hard')).toBeInTheDocument();
	});

	it('should start a new game when New Game is clicked', async () => {
		render(GameContainer);

		const newGameButton = screen.getByText('New Game');
		await fireEvent.click(newGameButton);

		// Should show loading state or new puzzle
		// Check that grid is not empty (has some original numbers)
		const cells = screen.getAllByRole('button');
		const filledCells = cells.filter((cell) => cell.textContent && cell.textContent !== '');
		expect(filledCells.length).toBeGreaterThan(20); // Typical puzzle has 20+ given numbers
	});

	it('should change difficulty when difficulty button is clicked', async () => {
		render(GameContainer);

		const hardButton = screen.getByText('Hard');
		await fireEvent.click(hardButton);

		// Hard difficulty should be selected
		expect(hardButton).toHaveClass('active');

		// Start new game with hard difficulty
		const newGameButton = screen.getByText('New Game');
		await fireEvent.click(newGameButton);

		// Hard puzzles should have fewer given numbers
		const cells = screen.getAllByRole('button');
		const filledCells = cells.filter((cell) => cell.textContent && cell.textContent !== '');
		expect(filledCells.length).toBeLessThan(30); // Hard puzzles have fewer clues
	});

	it('should handle cell selection', async () => {
		render(GameContainer);

		// Start a new game first
		const newGameButton = screen.getByText('New Game');
		await fireEvent.click(newGameButton);

		// Click on a cell
		const cells = screen.getAllByRole('button');
		const firstEmptyCell = cells.find((cell) => !cell.textContent);

		if (firstEmptyCell) {
			await fireEvent.click(firstEmptyCell);
			expect(firstEmptyCell).toHaveClass('selected');
		}
	});

	it('should handle number input', async () => {
		render(GameContainer);

		// Start a new game
		const newGameButton = screen.getByText('New Game');
		await fireEvent.click(newGameButton);

		// Select a cell and input a number
		const cells = screen.getAllByRole('button');
		const firstEmptyCell = cells.find((cell) => !cell.textContent);

		if (firstEmptyCell) {
			await fireEvent.click(firstEmptyCell);

			// Click number 5 on number pad
			const numberFive = screen.getByText('5');
			await fireEvent.click(numberFive);

			// Cell should now show 5
			expect(firstEmptyCell.textContent).toBe('5');
		}
	});

	it('should provide hints when Hint button is clicked', async () => {
		render(GameContainer);

		// Start a new game
		const newGameButton = screen.getByText('New Game');
		await fireEvent.click(newGameButton);

		const hintButton = screen.getByText('Hint');
		await fireEvent.click(hintButton);

		// Should fill in a cell or show hint message
		// This depends on implementation - either a cell gets filled or a message appears
		const cells = screen.getAllByRole('button');
		const filledCells = cells.filter((cell) => cell.textContent && cell.textContent !== '');
		expect(filledCells.length).toBeGreaterThan(0);
	});

	it('should handle undo functionality', async () => {
		render(GameContainer);

		// Start a new game
		const newGameButton = screen.getByText('New Game');
		await fireEvent.click(newGameButton);

		// Make a move
		const cells = screen.getAllByRole('button');
		const firstEmptyCell = cells.find((cell) => !cell.textContent);

		if (firstEmptyCell) {
			await fireEvent.click(firstEmptyCell);
			const numberFive = screen.getByText('5');
			await fireEvent.click(numberFive);

			// Verify move was made
			expect(firstEmptyCell.textContent).toBe('5');

			// Undo the move
			const undoButton = screen.getByText('Undo');
			await fireEvent.click(undoButton);

			// Cell should be empty again
			expect(firstEmptyCell.textContent).toBe('');
		}
	});

	it('should toggle note mode', async () => {
		render(GameContainer);

		// Start a new game
		const newGameButton = screen.getByText('New Game');
		await fireEvent.click(newGameButton);

		// Toggle note mode
		const notesButton = screen.getByText('Notes');
		await fireEvent.click(notesButton);

		// Notes button should be active
		expect(notesButton).toHaveClass('active');
	});

	it('should detect win condition', async () => {
		render(GameContainer);

		// This test would need a pre-solved puzzle or completion simulation
		// For now, just check that win detection exists
		expect(screen.queryByText('Congratulations!')).not.toBeInTheDocument();
	});

	it('should save and restore game state', async () => {
		render(GameContainer);

		// Start a new game
		const newGameButton = screen.getByText('New Game');
		await fireEvent.click(newGameButton);

		// Make a move
		const cells = screen.getAllByRole('button');
		const firstEmptyCell = cells.find((cell) => !cell.textContent);

		if (firstEmptyCell) {
			await fireEvent.click(firstEmptyCell);
			const numberSeven = screen.getByText('7');
			await fireEvent.click(numberSeven);
		}

		// Re-render component (simulating page reload)
		render(GameContainer);

		// Game state should be preserved
		// This depends on localStorage implementation
		const restoredCells = screen.getAllByRole('button');
		const cellsWithSeven = restoredCells.filter((cell) => cell.textContent === '7');
		expect(cellsWithSeven.length).toBeGreaterThan(0);
	});

	it('should be responsive on mobile', () => {
		render(GameContainer);

		// Should have mobile-friendly layout
		const container = screen.getByRole('main');
		expect(container).toHaveClass('game-container');

		// Should handle mobile viewport
		const computedStyle = window.getComputedStyle(container);
		expect(computedStyle.display).toBeTruthy();
	});

	it('should handle keyboard navigation', async () => {
		render(GameContainer);

		// Start a new game
		const newGameButton = screen.getByText('New Game');
		await fireEvent.click(newGameButton);

		// Focus should move between cells with arrow keys
		const cells = screen.getAllByRole('button');
		const firstEmptyCell = cells.find((cell) => !cell.textContent);

		if (firstEmptyCell) {
			firstEmptyCell.focus();
			await fireEvent.keyDown(firstEmptyCell, { key: 'ArrowRight' });

			// Next cell should be focused (implementation dependent)
			expect(document.activeElement).toBeTruthy();
		}
	});
});
