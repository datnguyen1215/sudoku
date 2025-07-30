import { describe, it, expect } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import NumberPad from './NumberPad.svelte';

describe('NumberPad Component', () => {
	it('should render numbers 1-9', () => {
		render(NumberPad, {
			props: {
				onNumberSelect: () => {},
				onClear: () => {},
				onToggleNoteMode: () => {},
				noteMode: false
			}
		});

		// Check that numbers 1-9 are rendered
		for (let i = 1; i <= 9; i++) {
			expect(screen.getByText(i.toString())).toBeInTheDocument();
		}
	});

	it('should render clear and note mode buttons', () => {
		render(NumberPad, {
			props: {
				onNumberSelect: () => {},
				onClear: () => {},
				onToggleNoteMode: () => {},
				noteMode: false
			}
		});

		expect(screen.getByText('Clear')).toBeInTheDocument();
		expect(screen.getByText('Notes')).toBeInTheDocument();
	});

	it('should call onNumberSelect when number is clicked', async () => {
		let selectedNumber = -1;

		const handleNumberSelect = (num: number) => {
			selectedNumber = num;
		};

		render(NumberPad, {
			props: {
				onNumberSelect: handleNumberSelect,
				onClear: () => {},
				onToggleNoteMode: () => {},
				noteMode: false
			}
		});

		const numberButton = screen.getByText('5');
		await fireEvent.click(numberButton);

		expect(selectedNumber).toBe(5);
	});

	it('should call onClear when clear button is clicked', async () => {
		let clearCalled = false;

		const handleClear = () => {
			clearCalled = true;
		};

		render(NumberPad, {
			props: {
				onNumberSelect: () => {},
				onClear: handleClear,
				onToggleNoteMode: () => {},
				noteMode: false
			}
		});

		const clearButton = screen.getByText('Clear');
		await fireEvent.click(clearButton);

		expect(clearCalled).toBe(true);
	});

	it('should call onToggleNoteMode when notes button is clicked', async () => {
		let noteToggleCalled = false;

		const handleToggleNoteMode = () => {
			noteToggleCalled = true;
		};

		render(NumberPad, {
			props: {
				onNumberSelect: () => {},
				onClear: () => {},
				onToggleNoteMode: handleToggleNoteMode,
				noteMode: false
			}
		});

		const notesButton = screen.getByText('Notes');
		await fireEvent.click(notesButton);

		expect(noteToggleCalled).toBe(true);
	});

	it('should show active state for note mode', () => {
		render(NumberPad, {
			props: {
				onNumberSelect: () => {},
				onClear: () => {},
				onToggleNoteMode: () => {},
				noteMode: true
			}
		});

		const notesButton = screen.getByText('Notes');
		expect(notesButton).toHaveClass('active');
	});

	it('should be touch-friendly on mobile', () => {
		render(NumberPad, {
			props: {
				onNumberSelect: () => {},
				onClear: () => {},
				onToggleNoteMode: () => {},
				noteMode: false
			}
		});

		const numberButtons = screen.getAllByRole('button');
		numberButtons.forEach((button) => {
			// Check minimum touch target size
			const computedStyle = window.getComputedStyle(button);
			expect(parseInt(computedStyle.minHeight) >= 44).toBe(true); // iOS minimum
		});
	});

	it('should support keyboard navigation', async () => {
		let selectedNumber = -1;

		const handleNumberSelect = (num: number) => {
			selectedNumber = num;
		};

		render(NumberPad, {
			props: {
				onNumberSelect: handleNumberSelect,
				onClear: () => {},
				onToggleNoteMode: () => {},
				noteMode: false
			}
		});

		const numberButton = screen.getByText('3');
		numberButton.focus();
		await fireEvent.keyDown(numberButton, { key: 'Enter' });

		expect(selectedNumber).toBe(3);
	});

	it('should have proper ARIA labels for accessibility', () => {
		render(NumberPad, {
			props: {
				onNumberSelect: () => {},
				onClear: () => {},
				onToggleNoteMode: () => {},
				noteMode: false
			}
		});

		// Check number buttons have aria-labels
		const numberButton = screen.getByText('7');
		expect(numberButton).toHaveAttribute('aria-label');
		expect(numberButton.getAttribute('aria-label')).toContain('Enter number 7');

		// Check action buttons have aria-labels
		const clearButton = screen.getByText('Clear');
		expect(clearButton).toHaveAttribute('aria-label');

		const notesButton = screen.getByText('Notes');
		expect(notesButton).toHaveAttribute('aria-label');
	});

	it('should handle touch events properly', async () => {
		let selectedNumber = -1;

		const handleNumberSelect = (num: number) => {
			selectedNumber = num;
		};

		render(NumberPad, {
			props: {
				onNumberSelect: handleNumberSelect,
				onClear: () => {},
				onToggleNoteMode: () => {},
				noteMode: false
			}
		});

		const numberButton = screen.getByText('8');

		// Simulate touch events
		await fireEvent.touchStart(numberButton);
		await fireEvent.touchEnd(numberButton);

		expect(selectedNumber).toBe(8);
	});

	it('should show visual feedback on button press', async () => {
		render(NumberPad, {
			props: {
				onNumberSelect: () => {},
				onClear: () => {},
				onToggleNoteMode: () => {},
				noteMode: false
			}
		});

		const numberButton = screen.getByText('2');

		// Simulate active state
		await fireEvent.mouseDown(numberButton);
		expect(numberButton).toHaveClass('active');

		await fireEvent.mouseUp(numberButton);
		expect(numberButton).not.toHaveClass('active');
	});
});
