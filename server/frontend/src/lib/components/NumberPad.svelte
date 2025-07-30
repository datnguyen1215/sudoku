<script lang="ts">
	interface Props {
		onNumberSelect: (number: number) => void;
		onClear: () => void;
		onToggleNoteMode: () => void;
		noteMode: boolean;
	}

	let { onNumberSelect, onClear, onToggleNoteMode, noteMode }: Props = $props();

	let activeButton = $state<number | string | null>(null);

	function handleNumberClick(number: number) {
		onNumberSelect(number);
	}

	function handleClearClick() {
		onClear();
	}

	function handleNotesClick() {
		onToggleNoteMode();
	}

	function handleKeyDown(event: KeyboardEvent, action: () => void) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			action();
		}
	}

	function handleMouseDown(id: number | string) {
		activeButton = id;
	}

	function handleMouseUp() {
		activeButton = null;
	}

	function handleTouchStart(id: number | string) {
		activeButton = id;
	}

	function handleTouchEnd(event: TouchEvent, action: () => void) {
		event.preventDefault();
		activeButton = null;
		action();
	}

	// Generate numbers array for iteration
	const numbers = Array.from({ length: 9 }, (_, i) => i + 1);
</script>

<div class="number-pad">
	<div class="numbers-grid">
		{#each numbers as number}
			<button
				class="number-btn"
				class:active={activeButton === number}
				aria-label="Enter number {number}"
				onmousedown={() => handleMouseDown(number)}
				onmouseup={handleMouseUp}
				ontouchstart={() => handleTouchStart(number)}
				ontouchend={(e) => handleTouchEnd(e, () => handleNumberClick(number))}
				onclick={() => handleNumberClick(number)}
				onkeydown={(e) => handleKeyDown(e, () => handleNumberClick(number))}
			>
				{number}
			</button>
		{/each}
	</div>

	<div class="action-buttons">
		<button
			class="action-btn clear-btn"
			class:active={activeButton === 'clear'}
			aria-label="Clear selected cell"
			onmousedown={() => handleMouseDown('clear')}
			onmouseup={handleMouseUp}
			ontouchstart={() => handleTouchStart('clear')}
			ontouchend={(e) => handleTouchEnd(e, handleClearClick)}
			onclick={handleClearClick}
			onkeydown={(e) => handleKeyDown(e, handleClearClick)}
		>
			Clear
		</button>

		<button
			class="action-btn notes-btn"
			class:active={activeButton === 'notes' || noteMode}
			aria-label="Toggle note mode {noteMode ? 'off' : 'on'}"
			onmousedown={() => handleMouseDown('notes')}
			onmouseup={handleMouseUp}
			ontouchstart={() => handleTouchStart('notes')}
			ontouchend={(e) => handleTouchEnd(e, handleNotesClick)}
			onclick={handleNotesClick}
			onkeydown={(e) => handleKeyDown(e, handleNotesClick)}
		>
			Notes
		</button>
	</div>
</div>

<style>
	.number-pad {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
		background: #f8f9fa;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		user-select: none;
	}

	.numbers-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.5rem;
	}

	.number-btn,
	.action-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 48px;
		padding: 0.75rem;
		font-size: 1.1rem;
		font-weight: 600;
		border: 2px solid #e0e0e0;
		border-radius: 6px;
		background: white;
		color: #333;
		cursor: pointer;
		transition: all 0.15s ease;
		outline: none;
		touch-action: manipulation;
		-webkit-tap-highlight-color: transparent;
	}

	.number-btn:hover,
	.action-btn:hover {
		background: #f0f0f0;
		border-color: #d0d0d0;
	}

	.number-btn:focus-visible,
	.action-btn:focus-visible {
		outline: 2px solid #007bff;
		outline-offset: 2px;
	}

	.number-btn.active,
	.action-btn.active {
		background: #007bff;
		color: white;
		border-color: #0056b3;
		transform: scale(0.95);
	}

	.action-buttons {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
	}

	.clear-btn {
		background: #dc3545;
		color: white;
		border-color: #c82333;
	}

	.clear-btn:hover {
		background: #c82333;
		border-color: #bd2130;
	}

	.notes-btn.active {
		background: #28a745;
		border-color: #1e7e34;
	}

	.notes-btn:hover {
		background: #e9ecef;
	}

	.notes-btn.active:hover {
		background: #218838;
	}

	/* Mobile optimizations */
	@media (max-width: 768px) {
		.number-pad {
			padding: 0.75rem;
			gap: 0.75rem;
		}

		.number-btn,
		.action-btn {
			min-height: 44px;
			font-size: 1rem;
		}

		.numbers-grid {
			gap: 0.375rem;
		}

		.action-buttons {
			gap: 0.375rem;
		}
	}

	/* Touch device optimizations */
	@media (hover: none) and (pointer: coarse) {
		.number-btn,
		.action-btn {
			min-height: 48px;
		}

		.number-btn:hover,
		.action-btn:hover {
			background: white;
			border-color: #e0e0e0;
		}

		.clear-btn:hover {
			background: #dc3545;
			border-color: #c82333;
		}

		.notes-btn:hover {
			background: white;
		}

		.notes-btn.active:hover {
			background: #28a745;
		}
	}

	/* High contrast mode */
	@media (prefers-contrast: high) {
		.number-btn,
		.action-btn {
			border-width: 3px;
			border-color: #000;
		}

		.number-btn.active,
		.action-btn.active {
			border-color: #000;
		}
	}

	/* Reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.number-btn,
		.action-btn {
			transition: none;
		}

		.number-btn.active,
		.action-btn.active {
			transform: none;
		}
	}

	/* Large screens */
	@media (min-width: 1024px) {
		.number-pad {
			max-width: 300px;
		}
	}
</style>
