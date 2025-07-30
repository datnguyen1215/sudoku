import { test, expect } from '@playwright/test';

test.describe('Sudoku Game - Mobile First TDD', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
	});

	test('should load the game with all essential elements', async ({ page }) => {
		// Test that all main components are present
		await expect(page.getByRole('heading', { name: 'Sudoku' })).toBeVisible();
		await expect(page.getByText('New Game')).toBeVisible();
		await expect(page.getByText('Hint')).toBeVisible();
		await expect(page.getByText('Undo')).toBeVisible();

		// Check number pad
		for (let i = 1; i <= 9; i++) {
			await expect(page.getByRole('button', { name: i.toString() })).toBeVisible();
		}
		await expect(page.getByText('Clear')).toBeVisible();
		await expect(page.getByText('Notes')).toBeVisible();

		// Check difficulty buttons
		await expect(page.getByText('Easy')).toBeVisible();
		await expect(page.getByText('Medium')).toBeVisible();
		await expect(page.getByText('Hard')).toBeVisible();
	});

	test('should start a new game when New Game button is clicked', async ({ page }) => {
		await page.getByText('New Game').click();

		// Wait for loading to complete
		await page.waitForTimeout(500);

		// Check that grid is populated with some numbers
		const cells = page.locator('.sudoku-cell button');
		await expect(cells).toHaveCount(81);

		// Some cells should have numbers (original clues)
		const filledCells = await cells.filter({ hasText: /[1-9]/ }).count();
		expect(filledCells).toBeGreaterThan(15); // At least 15 clues
	});

	test('should allow cell selection and number input', async ({ page }) => {
		await page.getByText('New Game').click();
		await page.waitForTimeout(500);

		// Find an empty cell and click it
		const emptyCells = page.locator('.sudoku-cell button').filter({ hasText: '' });
		const firstEmptyCell = emptyCells.first();
		await firstEmptyCell.click();

		// Cell should be selected
		await expect(firstEmptyCell).toHaveClass(/selected/);

		// Click number 5 on number pad
		await page.getByRole('button', { name: '5' }).click();

		// Cell should now contain 5
		await expect(firstEmptyCell).toHaveText('5');
	});

	test('should support keyboard input', async ({ page }) => {
		await page.getByText('New Game').click();
		await page.waitForTimeout(500);

		// Select an empty cell
		const emptyCells = page.locator('.sudoku-cell button').filter({ hasText: '' });
		const firstEmptyCell = emptyCells.first();
		await firstEmptyCell.click();

		// Type number 3
		await page.keyboard.press('3');

		// Cell should contain 3
		await expect(firstEmptyCell).toHaveText('3');

		// Test backspace to clear
		await page.keyboard.press('Backspace');
		await expect(firstEmptyCell).toHaveText('');
	});

	test('should support arrow key navigation', async ({ page }) => {
		await page.getByText('New Game').click();
		await page.waitForTimeout(500);

		// Click first cell (top-left)
		const firstCell = page.locator('.sudoku-cell button').first();
		await firstCell.click();
		await expect(firstCell).toHaveClass(/selected/);

		// Press arrow right
		await page.keyboard.press('ArrowRight');

		// Second cell should be selected
		const secondCell = page.locator('.sudoku-cell button').nth(1);
		await expect(secondCell).toHaveClass(/selected/);
	});

	test('should toggle note mode', async ({ page }) => {
		await page.getByText('New Game').click();
		await page.waitForTimeout(500);

		// Click Notes button
		const notesButton = page.getByText('Notes');
		await notesButton.click();

		// Notes button should be active
		await expect(notesButton).toHaveClass(/active/);

		// Select empty cell and add note
		const emptyCells = page.locator('.sudoku-cell button').filter({ hasText: '' });
		const firstEmptyCell = emptyCells.first();
		await firstEmptyCell.click();

		// Click number 7 (should add as note)
		await page.getByRole('button', { name: '7' }).click();

		// Cell should show note (visual check would be needed for full validation)
		// For now, just verify note mode is working
		await expect(notesButton).toHaveClass(/active/);
	});

	test('should handle clear function', async ({ page }) => {
		await page.getByText('New Game').click();
		await page.waitForTimeout(500);

		// Select empty cell and add number
		const emptyCells = page.locator('.sudoku-cell button').filter({ hasText: '' });
		const firstEmptyCell = emptyCells.first();
		await firstEmptyCell.click();
		await page.getByRole('button', { name: '4' }).click();

		// Verify number is added
		await expect(firstEmptyCell).toHaveText('4');

		// Click Clear button
		await page.getByText('Clear').click();

		// Cell should be empty
		await expect(firstEmptyCell).toHaveText('');
	});

	test('should support undo functionality', async ({ page }) => {
		await page.getByText('New Game').click();
		await page.waitForTimeout(500);

		// Make a move
		const emptyCells = page.locator('.sudoku-cell button').filter({ hasText: '' });
		const firstEmptyCell = emptyCells.first();
		await firstEmptyCell.click();
		await page.getByRole('button', { name: '6' }).click();

		// Verify move
		await expect(firstEmptyCell).toHaveText('6');

		// Undo should be enabled
		const undoButton = page.getByText('Undo');
		await expect(undoButton).toBeEnabled();

		// Click undo
		await undoButton.click();

		// Cell should be empty again
		await expect(firstEmptyCell).toHaveText('');
	});

	test('should change difficulty levels', async ({ page }) => {
		// Click Hard difficulty
		await page.getByText('Hard').click();
		await expect(page.getByText('Hard')).toHaveClass(/active/);

		// Start new game with hard difficulty
		await page.getByText('New Game').click();
		await page.waitForTimeout(500);

		// Hard puzzles should have fewer filled cells
		const filledCells = await page
			.locator('.sudoku-cell button')
			.filter({ hasText: /[1-9]/ })
			.count();
		expect(filledCells).toBeLessThan(35); // Hard puzzles typically have fewer clues

		// Switch to Easy
		await page.getByText('Easy').click();
		await expect(page.getByText('Easy')).toHaveClass(/active/);

		await page.getByText('New Game').click();
		await page.waitForTimeout(500);

		// Easy puzzles should have more filled cells
		const easyFilledCells = await page
			.locator('.sudoku-cell button')
			.filter({ hasText: /[1-9]/ })
			.count();
		expect(easyFilledCells).toBeGreaterThan(filledCells);
	});

	test('should show timer', async ({ page }) => {
		await page.getByText('New Game').click();

		// Timer should be visible and start at 00:00
		const timer = page.getByText(/Time: \d{2}:\d{2}/);
		await expect(timer).toBeVisible();

		// Wait and check timer increments
		await page.waitForTimeout(2000);
		await expect(timer).toHaveText(/Time: 00:0[1-9]/);
	});

	test('should be responsive on mobile viewport', async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 812 });

		await page.getByText('New Game').click();
		await page.waitForTimeout(500);

		// Game should still be playable
		await expect(page.getByRole('heading', { name: 'Sudoku' })).toBeVisible();
		await expect(page.locator('.sudoku-grid')).toBeVisible();

		// Number pad should be accessible
		await expect(page.getByRole('button', { name: '1' })).toBeVisible();

		// Test touch interaction
		const emptyCells = page.locator('.sudoku-cell button').filter({ hasText: '' });
		const firstEmptyCell = emptyCells.first();
		await firstEmptyCell.tap();
		await expect(firstEmptyCell).toHaveClass(/selected/);
	});

	test('should handle touch events on mobile', async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 812 });

		await page.getByText('New Game').click();
		await page.waitForTimeout(500);

		// Test tap interaction on number pad
		const numberButton = page.getByRole('button', { name: '8' });
		await numberButton.tap();

		// Select cell first
		const emptyCells = page.locator('.sudoku-cell button').filter({ hasText: '' });
		const firstEmptyCell = emptyCells.first();
		await firstEmptyCell.tap();

		// Tap number
		await numberButton.tap();

		// Should input number
		await expect(firstEmptyCell).toHaveText('8');
	});

	test('should persist game state on reload', async ({ page }) => {
		await page.getByText('New Game').click();
		await page.waitForTimeout(500);

		// Make a move
		const emptyCells = page.locator('.sudoku-cell button').filter({ hasText: '' });
		const firstEmptyCell = emptyCells.first();
		await firstEmptyCell.click();
		await page.getByRole('button', { name: '9' }).click();

		// Verify move
		await expect(firstEmptyCell).toHaveText('9');

		// Reload page
		await page.reload();
		await page.waitForLoadState('networkidle');

		// Game state should be restored
		const restoredCell = page.locator('.sudoku-cell button').filter({ hasText: '9' });
		await expect(restoredCell).toHaveCount(1);
	});

	test('should provide accessibility support', async ({ page }) => {
		await page.getByText('New Game').click();
		await page.waitForTimeout(500);

		// Check aria-labels on cells
		const cells = page.locator('.sudoku-cell button');
		const firstCell = cells.first();

		const ariaLabel = await firstCell.getAttribute('aria-label');
		expect(ariaLabel).toContain('Row 1');
		expect(ariaLabel).toContain('Column 1');

		// Check keyboard focus
		await firstCell.focus();
		await expect(firstCell).toBeFocused();

		// Check tab navigation
		await page.keyboard.press('Tab');
		// Next focusable element should be focused (implementation dependent)
	});

	test('should show win condition', async ({ page }) => {
		// This test would require a pre-solved puzzle or completing the game
		// For now, just verify the structure exists
		await page.getByText('New Game').click();
		await page.waitForTimeout(500);

		// Win dialog should not be visible initially
		await expect(page.getByText('Congratulations!')).not.toBeVisible();

		// TODO: Complete puzzle programmatically to test win condition
	});

	test('should validate input and show errors', async ({ page }) => {
		await page.getByText('New Game').click();
		await page.waitForTimeout(500);

		// Find two empty cells in the same row
		const cells = page.locator('.sudoku-cell button');

		// This is a simplified test - in reality, we'd need to ensure
		// we're testing actual conflict scenarios based on the generated puzzle

		// For now, just verify that the game doesn't crash with various inputs
		const firstEmptyCell = cells.filter({ hasText: '' }).first();
		await firstEmptyCell.click();
		await page.getByRole('button', { name: '1' }).click();

		// Game should still be functional
		await expect(page.getByRole('heading', { name: 'Sudoku' })).toBeVisible();
	});
});

test.describe('Performance Tests', () => {
	test('should load quickly', async ({ page }) => {
		const startTime = Date.now();
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		const loadTime = Date.now() - startTime;

		// Should load within 3 seconds
		expect(loadTime).toBeLessThan(3000);
	});

	test('should handle rapid interactions', async ({ page }) => {
		await page.goto('/');
		await page.getByText('New Game').click();
		await page.waitForTimeout(500);

		// Rapidly click different numbers
		for (let i = 1; i <= 9; i++) {
			await page.getByRole('button', { name: i.toString() }).click();
		}

		// Game should remain responsive
		await expect(page.getByRole('heading', { name: 'Sudoku' })).toBeVisible();
	});
});
