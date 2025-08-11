import React from 'react';
import { View } from 'react-native';
import Cell from './Cell';

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
 * @param {Function} props.onCellPress - Callback when cell is pressed
 * @returns {React.ReactElement} Board component
 */
const Board = ({
  board = Array(9).fill(Array(9).fill(null)),
  initialBoard = Array(9).fill(Array(9).fill(null)),
  selectedCell = null,
  highlightValue = null,
  errors = [],
  notes = Array(9).fill(Array(9).fill([])),
  notesMode = false,
  onCellPress = () => {},
}) => {
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
   * Check if cell should be highlighted
   * @param {number} value - Cell value
   * @returns {boolean} Whether cell should be highlighted
   */
  const shouldHighlight = value => {
    return (
      highlightValue !== null && value === highlightValue && value !== null
    );
  };

  return (
    <View className="bg-sienna p-0.5 rounded-lg mx-4 aspect-square">
      <View className="flex-row flex-wrap">
        {board.map((row, rowIndex) =>
          row.map((value, colIndex) => (
            <View
              key={`${rowIndex}-${colIndex}`}
              className="w-[11.11%] aspect-square"
            >
              <Cell
                value={value}
                isGiven={initialBoard[rowIndex][colIndex] !== null}
                isSelected={
                  selectedCell &&
                  selectedCell.row === rowIndex &&
                  selectedCell.col === colIndex
                }
                isHighlighted={shouldHighlight(value)}
                hasError={hasError(rowIndex, colIndex)}
                showNotes={notesMode && value === null}
                notes={notes[rowIndex][colIndex]}
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
