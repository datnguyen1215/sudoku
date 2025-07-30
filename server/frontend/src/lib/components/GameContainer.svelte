<script lang="ts">
	import { onMount } from 'svelte';
	import SudokuGrid from './SudokuGrid.svelte';
	import NumberPad from './NumberPad.svelte';
	import {
		type SudokuGrid as GridType,
		type SudokuCell,
		type DifficultyLevel,
		type Hint,
		createEmptyGrid,
		generateSudoku,
		isValidPlacement,
		getHint,
		checkWin
	} from '../utils/sudoku-engine';

	interface GameState {
		grid: GridType;
		solution: GridType;
		selectedCell: { row: number; col: number } | null;
		difficulty: DifficultyLevel;
		noteMode: boolean;
		gameWon: boolean;
		moveHistory: Array<{
			row: number;
			col: number;
			oldValue: number;
			newValue: number;
			timestamp: number;
		}>;
		startTime: number;
		elapsedTime: number;
	}

	// Game state using Svelte 5 runes
	let gameState = $state<GameState>({
		grid: createEmptyGrid(),
		solution: createEmptyGrid(),
		selectedCell: null,
		difficulty: 'medium',
		noteMode: false,
		gameWon: false,
		moveHistory: [],
		startTime: Date.now(),
		elapsedTime: 0
	});

	let gameTimer = $state<number>(0);
	let showWinDialog = $state(false);
	let isGenerating = $state(false);

	// Derived state
	const canUndo = $derived(gameState.moveHistory.length > 0);
	const hintsUsed = $derived(
		gameState.moveHistory.filter((move) => move.newValue > 0 && move.oldValue === 0).length
	);

	// Timer effect
	$effect(() => {
		const interval = setInterval(() => {
			if (!gameState.gameWon) {
				gameState.elapsedTime = Date.now() - gameState.startTime;
				gameTimer = Math.floor(gameState.elapsedTime / 1000);
			}
		}, 1000);

		return () => clearInterval(interval);
	});

	// Auto-save game state
	$effect(() => {
		if (typeof window !== 'undefined') {
			localStorage.setItem(
				'sudoku-game-state',
				JSON.stringify({
					grid: gameState.grid,
					solution: gameState.solution,
					difficulty: gameState.difficulty,
					moveHistory: gameState.moveHistory,
					startTime: gameState.startTime,
					elapsedTime: gameState.elapsedTime
				})
			);
		}
	});

	// Load saved game state on mount
	onMount(() => {
		const saved = localStorage.getItem('sudoku-game-state');
		if (saved) {
			try {
				const savedState = JSON.parse(saved);
				gameState.grid = savedState.grid || createEmptyGrid();
				gameState.solution = savedState.solution || createEmptyGrid();
				gameState.difficulty = savedState.difficulty || 'medium';
				gameState.moveHistory = savedState.moveHistory || [];
				gameState.startTime = savedState.startTime || Date.now();
				gameState.elapsedTime = savedState.elapsedTime || 0;
			} catch (e) {
				console.warn('Failed to load saved game state:', e);
				startNewGame();
			}
		} else {
			startNewGame();
		}
	});

	function startNewGame() {
		isGenerating = true;

		// Use setTimeout to allow UI to update with loading state
		setTimeout(() => {
			const { puzzle, solution } = generateSudoku(gameState.difficulty);

			gameState.grid = puzzle;
			gameState.solution = solution;
			gameState.selectedCell = null;
			gameState.noteMode = false;
			gameState.gameWon = false;
			gameState.moveHistory = [];
			gameState.startTime = Date.now();
			gameState.elapsedTime = 0;

			showWinDialog = false;
			isGenerating = false;
		}, 100);
	}

	function handleCellClick(row: number, col: number) {
		gameState.selectedCell = { row, col };
	}

	function handleCellInput(row: number, col: number, value: number) {
		const cell = gameState.grid[row][col];

		// Don't allow input on original cells
		if (cell.isOriginal) return;

		// Clear error state
		cell.isError = false;

		// Record move for undo
		const move = {
			row,
			col,
			oldValue: cell.value,
			newValue: value,
			timestamp: Date.now()
		};
		gameState.moveHistory.push(move);

		if (gameState.noteMode) {
			// Handle note mode
			if (value === 0) {
				cell.notes = [];
			} else {
				const noteIndex = cell.notes.indexOf(value);
				if (noteIndex >= 0) {
					cell.notes.splice(noteIndex, 1);
				} else {
					cell.notes.push(value);
					cell.notes.sort();
				}
			}
		} else {
			// Handle normal input
			cell.value = value;
			cell.notes = []; // Clear notes when placing number

			// Validate placement
			if (value > 0 && !isValidPlacement(gameState.grid, row, col, value)) {
				cell.isError = true;
			}

			// Check for win condition
			if (checkWin(gameState.grid)) {
				gameState.gameWon = true;
				showWinDialog = true;
			}
		}
	}

	function handleNumberSelect(number: number) {
		if (gameState.selectedCell) {
			handleCellInput(gameState.selectedCell.row, gameState.selectedCell.col, number);
		}
	}

	function handleClear() {
		if (gameState.selectedCell) {
			handleCellInput(gameState.selectedCell.row, gameState.selectedCell.col, 0);
		}
	}

	function handleToggleNoteMode() {
		gameState.noteMode = !gameState.noteMode;
	}

	function handleUndo() {
		if (gameState.moveHistory.length > 0) {
			const lastMove = gameState.moveHistory.pop()!;
			const cell = gameState.grid[lastMove.row][lastMove.col];

			cell.value = lastMove.oldValue;
			cell.isError = false;

			// If it was a note move, restore previous notes state
			// This is simplified - a full implementation would store note history
			if (gameState.noteMode && lastMove.oldValue === 0) {
				cell.notes = [];
			}
		}
	}

	function handleHint() {
		const hint = getHint(gameState.grid);
		if (hint) {
			// Highlight the hint cell and fill it
			gameState.selectedCell = { row: hint.row, col: hint.col };
			handleCellInput(hint.row, hint.col, hint.value);
		}
	}

	function handleDifficultyChange(difficulty: DifficultyLevel) {
		gameState.difficulty = difficulty;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!gameState.selectedCell) return;

		const { row, col } = gameState.selectedCell;

		switch (event.key) {
			case 'ArrowUp':
				event.preventDefault();
				if (row > 0) gameState.selectedCell = { row: row - 1, col };
				break;
			case 'ArrowDown':
				event.preventDefault();
				if (row < 8) gameState.selectedCell = { row: row + 1, col };
				break;
			case 'ArrowLeft':
				event.preventDefault();
				if (col > 0) gameState.selectedCell = { row, col: col - 1 };
				break;
			case 'ArrowRight':
				event.preventDefault();
				if (col < 8) gameState.selectedCell = { row, col: col + 1 };
				break;
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
				event.preventDefault();
				handleNumberSelect(parseInt(event.key));
				break;
			case 'Delete':
			case 'Backspace':
				event.preventDefault();
				handleClear();
				break;
		}
	}

	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<main class="game-container">
	<header class="game-header">
		<h1>Sudoku</h1>
		<div class="game-info">
			<span class="timer">Time: {formatTime(gameTimer)}</span>
			<span class="difficulty">Difficulty: {gameState.difficulty}</span>
		</div>
	</header>

	<div class="game-content">
		<div class="game-board">
			{#if isGenerating}
				<div class="loading">
					<div class="spinner"></div>
					<p>Generating new puzzle...</p>
				</div>
			{:else}
				<SudokuGrid
					grid={gameState.grid}
					selectedCell={gameState.selectedCell}
					onCellClick={handleCellClick}
					onCellInput={handleCellInput}
				/>
			{/if}
		</div>

		<div class="game-controls">
			<div class="difficulty-selector">
				<h3>Difficulty</h3>
				<div class="difficulty-buttons">
					{#each ['easy', 'medium', 'hard'] as diff}
						<button
							class="difficulty-btn"
							class:active={gameState.difficulty === diff}
							onclick={() => handleDifficultyChange(diff as DifficultyLevel)}
						>
							{diff.charAt(0).toUpperCase() + diff.slice(1)}
						</button>
					{/each}
				</div>
			</div>

			<div class="action-controls">
				<button class="control-btn primary" onclick={startNewGame}> New Game </button>

				<button class="control-btn" onclick={handleHint}> Hint </button>

				<button class="control-btn" onclick={handleUndo} disabled={!canUndo}> Undo </button>
			</div>

			<NumberPad
				onNumberSelect={handleNumberSelect}
				onClear={handleClear}
				onToggleNoteMode={handleToggleNoteMode}
				noteMode={gameState.noteMode}
			/>
		</div>
	</div>

	{#if showWinDialog}
		<div class="win-dialog-overlay">
			<div class="win-dialog">
				<h2>🎉 Congratulations!</h2>
				<p>You solved the puzzle in {formatTime(gameTimer)}!</p>
				<p>Moves: {gameState.moveHistory.length}</p>
				<div class="win-actions">
					<button class="control-btn primary" onclick={startNewGame}> New Game </button>
					<button class="control-btn" onclick={() => (showWinDialog = false)}> Close </button>
				</div>
			</div>
		</div>
	{/if}
</main>

<style>
	.game-container {
		min-height: 100vh;
		padding: 1rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: #333;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	.game-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.game-header h1 {
		color: white;
		font-size: 2.5rem;
		font-weight: 700;
		margin: 0 0 0.5rem 0;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
	}

	.game-info {
		display: flex;
		justify-content: center;
		gap: 2rem;
		color: white;
		font-size: 1rem;
		font-weight: 500;
	}

	.game-content {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 2rem;
		max-width: 1200px;
		margin: 0 auto;
		align-items: start;
	}

	.game-board {
		display: flex;
		justify-content: center;
		min-height: 400px;
	}

	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: white;
		border-radius: 8px;
		padding: 3rem;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 4px solid #f3f3f3;
		border-top: 4px solid #667eea;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 1rem;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.game-controls {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		min-width: 300px;
	}

	.difficulty-selector h3 {
		margin: 0 0 0.5rem 0;
		color: white;
		font-size: 1.1rem;
	}

	.difficulty-buttons {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.5rem;
	}

	.difficulty-btn {
		padding: 0.5rem 1rem;
		border: 2px solid rgba(255, 255, 255, 0.3);
		background: rgba(255, 255, 255, 0.1);
		color: white;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s ease;
		font-weight: 500;
	}

	.difficulty-btn:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	.difficulty-btn.active {
		background: white;
		color: #667eea;
		border-color: white;
	}

	.action-controls {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.control-btn {
		padding: 0.75rem 1.5rem;
		border: 2px solid rgba(255, 255, 255, 0.3);
		background: rgba(255, 255, 255, 0.1);
		color: white;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s ease;
		font-weight: 500;
		font-size: 1rem;
	}

	.control-btn:hover:not(:disabled) {
		background: rgba(255, 255, 255, 0.2);
	}

	.control-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.control-btn.primary {
		background: #28a745;
		border-color: #28a745;
	}

	.control-btn.primary:hover {
		background: #218838;
		border-color: #218838;
	}

	.win-dialog-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.8);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.win-dialog {
		background: white;
		padding: 2rem;
		border-radius: 12px;
		text-align: center;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
		max-width: 400px;
		width: 90%;
	}

	.win-dialog h2 {
		margin: 0 0 1rem 0;
		color: #28a745;
		font-size: 1.8rem;
	}

	.win-dialog p {
		margin: 0.5rem 0;
		font-size: 1.1rem;
	}

	.win-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		margin-top: 1.5rem;
	}

	/* Mobile responsive */
	@media (max-width: 768px) {
		.game-content {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		.game-controls {
			min-width: auto;
			order: -1;
		}

		.game-header h1 {
			font-size: 2rem;
		}

		.game-info {
			flex-direction: column;
			gap: 0.5rem;
		}

		.difficulty-buttons {
			grid-template-columns: 1fr;
		}

		.action-controls {
			flex-direction: row;
			justify-content: space-between;
		}

		.control-btn {
			flex: 1;
			padding: 0.5rem;
			font-size: 0.9rem;
		}
	}

	/* Touch device optimizations */
	@media (hover: none) and (pointer: coarse) {
		.control-btn,
		.difficulty-btn {
			min-height: 44px;
		}
	}

	/* High contrast mode */
	@media (prefers-contrast: high) {
		.difficulty-btn,
		.control-btn {
			border-width: 3px;
		}
	}

	/* Reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.spinner {
			animation: none;
		}

		.control-btn,
		.difficulty-btn {
			transition: none;
		}
	}
</style>
