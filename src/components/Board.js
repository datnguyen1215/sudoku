import React from 'react';
import { View } from 'react-native';
import Cell from './Cell';
import { BOX_SIZE } from '../utils/sudokuGenerator';
import { createEmptyBoard, createNotesBoard } from '../utils/boardUtils';

/**
 * Sudoku board component with 9x9 grid
 * @param {Object} props - Component props
 * @param {Array} props.board - 9x9 2D array of cell values
 * @param {Array} props.initialBoard - 9x9 2D array of given/fixed values
 * @param {Object} props.selectedCell - Currently selected cell {row, col}
 * @param {number} props.highlightValue - Value to highlight across board
 * @param {Array} props.errors - Array of error cells [{row, col}]
 * @param {Array} props.notes - 9x9 2D array of cell notes
 * @param {boolean} props.notesMode - Whether notes mode is active
 * @param {Array} props.conflictingCells - Array of conflicting cells [{row, col}]
 * @param {Function} props.onCellPress - Callback when cell is pressed
 * @returns {React.ReactElement} Board component
 */
const Board = ({
  board = null,
  initialBoard = null,
  selectedCell = null,
  highlightValue = null,
  errors = [],
  notes = null,
  notesMode = false,
  conflictingCells = [],
  onCellPress = () => {},
}) => {
  // Use utility functions for default boards if not provided
  const actualBoard = board || createEmptyBoard();
  const actualInitialBoard = initialBoard || createEmptyBoard();
  const actualNotes = notes || createNotesBoard();
  /**
   * Check if cell has error
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @returns {boolean} Whether cell has error
   */
  const hasError = (row, col) => {
    return errors.some(error => error.row === row && error.col === col);
  };

  /**
   * Check if cell is conflicting
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @returns {boolean} Whether cell is conflicting
   */
  const isConflicting = (row, col) => {
    return conflictingCells.some(cell => cell.row === row && cell.col === col);
  };

  /**
   * Check if cell should be highlighted
   * @param {number} value - Cell value
   * @returns {boolean} Whether cell should be highlighted
   */
  const shouldHighlight = value => {
    return (
      highlightValue !== null && value === highlightValue && value !== null
    );
  };

  /**
   * Get 3x3 box index (0-8) for a cell
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @returns {number} Box index
   */
  const getBoxIndex = (row, col) => {
    return Math.floor(row / BOX_SIZE) * BOX_SIZE + Math.floor(col / BOX_SIZE);
  };

  /**
   * Check if two cells are in the same 3x3 box
   * @param {number} row1 - First cell row
   * @param {number} col1 - First cell column
   * @param {number} row2 - Second cell row
   * @param {number} col2 - Second cell column
   * @returns {boolean} Whether cells are in same box
   */
  const isInSameBox = (row1, col1, row2, col2) => {
    return getBoxIndex(row1, col1) === getBoxIndex(row2, col2);
  };

  return (
    <View className="bg-sienna p-0.5 rounded-lg mx-4 aspect-square">
      <View className="flex-row flex-wrap">
        {actualBoard.map((row, rowIndex) =>
          row.map((value, colIndex) => (
            <View
              key={`${rowIndex}-${colIndex}`}
              className="w-[11.11%] aspect-square"
            >
              <Cell
                value={value}
                isGiven={actualInitialBoard[rowIndex][colIndex] !== null}
                isSelected={
                  selectedCell &&
                  selectedCell.row === rowIndex &&
                  selectedCell.col === colIndex
                }
                isHighlighted={shouldHighlight(value)}
                hasError={hasError(rowIndex, colIndex)}
                isConflicting={isConflicting(rowIndex, colIndex)}
                isInSameRow={selectedCell && selectedCell.row === rowIndex}
                isInSameCol={selectedCell && selectedCell.col === colIndex}
                isInSameBox={
                  selectedCell &&
                  isInSameBox(
                    selectedCell.row,
                    selectedCell.col,
                    rowIndex,
                    colIndex,
                  )
                }
                hasSameValue={
                  selectedCell &&
                  actualBoard[selectedCell.row][selectedCell.col] !== null &&
                  actualBoard[selectedCell.row][selectedCell.col] === value
                }
                showNotes={value === null}
                notes={actualNotes[rowIndex][colIndex]}
                highlightValue={highlightValue}
                onPress={() => onCellPress(rowIndex, colIndex)}
                row={rowIndex}
                col={colIndex}
              />
            </View>
          )),
        )}
      </View>
    </View>
  );
};

export default Board;
