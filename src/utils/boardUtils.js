/**
 * Board utility functions for Sudoku game
 */

import { generateEmptyBoard } from './sudokuGenerator';

// Re-export for backward compatibility
export const createEmptyBoard = generateEmptyBoard;

/**
 * Creates a 9x9 board for storing notes (empty arrays)
 * @returns {Array<Array<Array>>} Notes board
 */
export const createNotesBoard = () => {
  return Array(9)
    .fill(null)
    .map(() =>
      Array(9)
        .fill(null)
        .map(() => []),
    );
};
