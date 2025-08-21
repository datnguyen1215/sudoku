/**
 * Custom hook for Sudoku game logic
 */

import { useState, useEffect, useRef } from 'react';
import {
  copyBoard,
  isValidPlacement,
  getRelatedCells,
} from '../utils/sudokuGenerator';
import { createEmptyBoard, createNotesBoard } from '../utils/boardUtils';
import generatePuzzle from '../utils/sudokuGenerator';
import { saveGame, loadGame, clearSavedGame } from '../services/storage';

// Constants
const CONFLICT_FLASH_DURATION = 300; // ms
const MAX_HISTORY = 10;

/**
 * Custom hook to manage Sudoku game logic
 * @param {Object} difficulty - Difficulty configuration
 * @returns {Object} Game logic and state
 */
export const useGameLogic = difficulty => {
  // Board state - puzzle data
  const [boardState, setBoardState] = useState({
    board: createEmptyBoard(),
    initialBoard: createEmptyBoard(),
    solution: createEmptyBoard(),
    notes: createNotesBoard(),
  });

  // Game state - game progress and errors
  const [gameState, setGameState] = useState({
    mistakes: 0,
    errors: [],
    selectedCell: null,
  });

  // UI state - interface controls
  const [uiState, setUiState] = useState({
    notesMode: false,
    isGenerating: true,
    generationError: null,
    conflictingCells: [],
  });

  // Move history for undo functionality
  const [moveHistory, setMoveHistory] = useState([]);

  // Auto-save timer ref
  const saveTimerRef = useRef(null);
  // Conflict animation timer ref
  const conflictTimerRef = useRef(null);

  /**
   * Generate a new puzzle with the current difficulty
   */
  const generateNewPuzzle = async () => {
    try {
      setUiState(prev => ({
        ...prev,
        isGenerating: true,
        generationError: null,
      }));
      const puzzleData = await generatePuzzle(difficulty);

      setBoardState({
        board: puzzleData.puzzle,
        initialBoard: puzzleData.puzzle,
        solution: puzzleData.solution,
        notes: createNotesBoard(),
      });
      setGameState(prev => ({ ...prev, selectedCell: null }));

      // Clear any existing saved game when starting new
      clearSavedGame();
      setMoveHistory([]);
    } catch (error) {
      console.error('Error generating puzzle:', error);
      setUiState(prev => ({
        ...prev,
        generationError: 'Failed to generate puzzle. Please try again.',
      }));
      // Fallback to empty board if generation fails
      const emptyBoard = createEmptyBoard();
      setBoardState({
        board: emptyBoard,
        initialBoard: emptyBoard,
        solution: emptyBoard,
        notes: createNotesBoard(),
      });
    } finally {
      setUiState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  /**
   * Load a saved game from storage
   */
  const loadSavedGame = async () => {
    try {
      setUiState(prev => ({ ...prev, isGenerating: true }));
      const result = await loadGame();

      if (result.success && result.data) {
        setBoardState(result.data.boardState);
        setGameState(result.data.gameState);
        setUiState(prev => ({
          ...prev,
          isGenerating: false,
          generationError: null,
        }));
        setMoveHistory([]);
        return true;
      } else {
        // No saved game or error - generate new puzzle
        await generateNewPuzzle();
        return false;
      }
    } catch (error) {
      console.error('Error loading saved game:', error);
      await generateNewPuzzle();
      return false;
    }
  };

  /**
   * Find cells that conflict with a potential note placement
   * @param {Array} board - Current board state
   * @param {number} row - Row to check
   * @param {number} col - Column to check
   * @param {number} number - Number to check
   * @returns {Array} Array of conflicting cell positions
   */
  const findConflictingCells = (board, row, col, number) => {
    const relatedCells = getRelatedCells(row, col);
    return relatedCells.filter(
      cell => board[cell.row] && board[cell.row][cell.col] === number,
    );
  };

  /**
   * Remove a specific number from notes in related cells
   * @param {Array} notes - Current notes board
   * @param {number} row - Row of placed number
   * @param {number} col - Column of placed number
   * @param {number} number - Number to remove from notes
   * @returns {Array} Updated notes board
   */
  const removeNotesFromRelatedCells = (notes, row, col, number) => {
    const newNotes = notes.map(noteRow =>
      noteRow.map(cellNotes => [...cellNotes]),
    );

    const relatedCells = getRelatedCells(row, col);

    for (const cell of relatedCells) {
      const idx = newNotes[cell.row][cell.col].indexOf(number);
      if (idx > -1) {
        newNotes[cell.row][cell.col].splice(idx, 1);
      }
    }

    return newNotes;
  };

  /**
   * Push current game state to history for undo functionality
   */
  const pushToHistory = () => {
    const snapshot = {
      board: copyBoard(boardState.board),
      notes: boardState.notes.map(noteRow =>
        noteRow.map(cellNotes => [...cellNotes]),
      ),
      errors: [...gameState.errors],
      mistakes: gameState.mistakes,
    };

    setMoveHistory(prev => {
      const newHistory = [...prev, snapshot];
      return newHistory.length > MAX_HISTORY
        ? newHistory.slice(-MAX_HISTORY)
        : newHistory;
    });
  };

  /**
   * Handle cell press
   * @param {number} row - Row index
   * @param {number} col - Column index
   */
  const handleCellPress = (row, col) => {
    setGameState(prev => ({ ...prev, selectedCell: { row, col } }));
  };

  /**
   * Handle number pad press
   * @param {number} number - Number pressed
   */
  const handleNumberPress = number => {
    // Validate number input
    if (!number || number < 1 || number > 9) return;

    // Check if a cell is selected
    if (!gameState.selectedCell) return;

    const { row, col } = gameState.selectedCell;

    // Check if this is a given/fixed cell
    if (boardState.initialBoard[row][col] !== null) return;

    // Push current state to history before making changes
    pushToHistory();

    // Handle notes mode
    if (uiState.notesMode && boardState.board[row][col] === null) {
      // Create a deep copy of the notes board
      const newNotes = boardState.notes.map(noteRow =>
        noteRow.map(cellNotes => [...cellNotes]),
      );

      // Toggle the note for this number
      const cellNotes = newNotes[row][col];
      const noteIndex = cellNotes.indexOf(number);

      if (noteIndex > -1) {
        // Remove the note if it exists
        cellNotes.splice(noteIndex, 1);
      } else {
        // Only add the note if it's a valid placement
        if (isValidPlacement(boardState.board, row, col, number)) {
          cellNotes.push(number);
          cellNotes.sort((a, b) => a - b); // Keep notes sorted
        } else {
          // Find and flash conflicting cells
          const conflicts = findConflictingCells(
            boardState.board,
            row,
            col,
            number,
          );

          // Clear any existing conflict timer
          if (conflictTimerRef.current) {
            clearTimeout(conflictTimerRef.current);
          }

          setUiState(prev => ({ ...prev, conflictingCells: conflicts }));

          // Set new timer with ref for cleanup
          conflictTimerRef.current = setTimeout(() => {
            setUiState(prev => ({ ...prev, conflictingCells: [] }));
            conflictTimerRef.current = null;
          }, CONFLICT_FLASH_DURATION);
        }
      }

      // Update the notes in board state
      setBoardState(prev => ({ ...prev, notes: newNotes }));
      return; // Exit early for notes mode
    }

    // Create a deep copy of the board
    const newBoard = copyBoard(boardState.board);

    // Check if the move is valid against the solution
    const isValid =
      boardState.solution &&
      boardState.solution[row] &&
      number === boardState.solution[row][col];

    if (isValid) {
      // Update the board
      newBoard[row][col] = number;

      // Clear notes for this cell and remove this number from related cells
      let newNotes = boardState.notes.map((noteRow, rIdx) =>
        noteRow.map((cellNotes, cIdx) =>
          rIdx === row && cIdx === col ? [] : cellNotes,
        ),
      );

      // Remove this number from notes in related cells (row, column, box)
      newNotes = removeNotesFromRelatedCells(newNotes, row, col, number);

      setBoardState(prev => ({
        ...prev,
        board: newBoard,
        notes: newNotes,
      }));

      // Clear any existing error for this cell
      setGameState(prev => ({
        ...prev,
        errors: prev.errors.filter(
          err => !(err.row === row && err.col === col),
        ),
      }));
    } else {
      // Add to errors and increment mistakes
      setGameState(prev => ({
        ...prev,
        errors: [
          ...prev.errors.filter(err => !(err.row === row && err.col === col)),
          { row, col },
        ],
        mistakes: prev.mistakes + 1,
      }));

      // Still update the board with the invalid number so user can see it
      newBoard[row][col] = number;

      // Clear notes for this cell even when placing invalid number
      // (but don't remove from related cells since it's invalid)
      const newNotes = boardState.notes.map((noteRow, rIdx) =>
        noteRow.map((cellNotes, cIdx) =>
          rIdx === row && cIdx === col ? [] : cellNotes,
        ),
      );

      setBoardState(prev => ({
        ...prev,
        board: newBoard,
        notes: newNotes,
      }));
    }
  };

  /**
   * Handle erase action
   */
  const handleErase = () => {
    // Check if a cell is selected
    if (!gameState.selectedCell) return;

    const { row, col } = gameState.selectedCell;

    // Check if this is a given/fixed cell
    if (boardState.initialBoard[row][col] !== null) return;

    // Push current state to history before making changes
    pushToHistory();

    // Create a deep copy of the board
    const newBoard = copyBoard(boardState.board);

    // Clear the cell
    newBoard[row][col] = null;
    setBoardState(prev => ({ ...prev, board: newBoard }));

    // Clear any error for this cell
    setGameState(prev => ({
      ...prev,
      errors: prev.errors.filter(err => !(err.row === row && err.col === col)),
    }));
  };

  /**
   * Toggle notes mode
   */
  const handleToggleNotes = () => {
    setUiState(prev => ({ ...prev, notesMode: !prev.notesMode }));
  };

  /**
   * Handle undo action
   */
  const handleUndo = () => {
    if (moveHistory.length === 0) return;

    const lastState = moveHistory[moveHistory.length - 1];

    setBoardState(prev => ({
      ...prev,
      board: lastState.board,
      notes: lastState.notes,
    }));

    setGameState(prev => ({
      ...prev,
      errors: lastState.errors,
      mistakes: lastState.mistakes,
    }));

    setUiState(prev => ({ ...prev, conflictingCells: [] }));

    setMoveHistory(prev => prev.slice(0, -1));
  };

  // Auto-save game state when it changes (debounced)
  useEffect(() => {
    // Clear existing timer
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    // Don't save if board is empty or generating
    if (
      uiState.isGenerating ||
      !boardState.initialBoard ||
      !boardState.initialBoard[0] ||
      !boardState.initialBoard[0][0]
    ) {
      return;
    }

    // Set new timer for auto-save (debounced by 1 second)
    saveTimerRef.current = setTimeout(() => {
      const gameData = {
        boardState,
        gameState,
        difficulty,
        timestamp: Date.now(),
      };
      saveGame(gameData);
    }, 1000);

    // Cleanup timers on unmount
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
      if (conflictTimerRef.current) {
        clearTimeout(conflictTimerRef.current);
        conflictTimerRef.current = null;
      }
    };
  }, [boardState, gameState, difficulty, uiState.isGenerating]);

  return {
    // State
    boardState,
    gameState,
    uiState,
    moveHistory,

    // Actions
    generateNewPuzzle,
    loadSavedGame,
    handleCellPress,
    handleNumberPress,
    handleErase,
    handleToggleNotes,
    handleUndo,
  };
};
