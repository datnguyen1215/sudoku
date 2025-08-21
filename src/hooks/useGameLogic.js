/**
 * Custom hook for Sudoku game logic
 */

import { useState, useEffect, useRef } from 'react';
import { copyBoard } from '../utils/sudokuGenerator';
import { createEmptyBoard, createNotesBoard } from '../utils/boardUtils';
import generatePuzzle from '../utils/sudokuGenerator';
import { saveGame, loadGame, clearSavedGame } from '../services/storage';

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
  });

  // Auto-save timer ref
  const saveTimerRef = useRef(null);

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
    // Check if a cell is selected
    if (!gameState.selectedCell) return;

    const { row, col } = gameState.selectedCell;

    // Check if this is a given/fixed cell
    if (boardState.initialBoard[row][col] !== null) return;

    // Create a deep copy of the board
    const newBoard = copyBoard(boardState.board);

    // Check if the move is valid against the solution
    const isValid = number === boardState.solution[row][col];

    if (isValid) {
      // Update the board
      newBoard[row][col] = number;
      setBoardState(prev => ({ ...prev, board: newBoard }));

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
      setBoardState(prev => ({ ...prev, board: newBoard }));
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

  // Auto-save game state when it changes (debounced)
  useEffect(() => {
    // Clear existing timer
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    // Don't save if board is empty or generating
    if (uiState.isGenerating || !boardState.initialBoard[0][0]) {
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

    // Cleanup timer on unmount
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [boardState, gameState, difficulty, uiState.isGenerating]);

  return {
    // State
    boardState,
    gameState,
    uiState,

    // Actions
    generateNewPuzzle,
    loadSavedGame,
    handleCellPress,
    handleNumberPress,
    handleErase,
    handleToggleNotes,
  };
};
