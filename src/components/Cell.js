import React from 'react';
import { View, Text, Pressable } from 'react-native';
import {
  getCellBackground,
  getBorderStyles,
  getTextColor,
} from '../utils/cellStyles';

/**
 * Individual sudoku cell component
 * @param {Object} props - Component props
 * @param {number} props.value - Cell value (1-9) or null for empty
 * @param {boolean} props.isGiven - Whether cell is a given/fixed value
 * @param {boolean} props.isSelected - Whether cell is currently selected
 * @param {boolean} props.isHighlighted - Whether cell has same number as selected
 * @param {boolean} props.hasError - Whether cell has an error
 * @param {boolean} props.isInSameRow - Whether cell is in same row as selected
 * @param {boolean} props.isInSameCol - Whether cell is in same column as selected
 * @param {boolean} props.isInSameBox - Whether cell is in same 3x3 box as selected
 * @param {boolean} props.hasSameValue - Whether cell has same value as selected
 * @param {boolean} props.showNotes - Whether to show notes mode
 * @param {Array} props.notes - Array of note numbers (1-9)
 * @param {Function} props.onPress - Callback when cell is pressed
 * @param {number} props.row - Row index (0-8)
 * @param {number} props.col - Column index (0-8)
 * @returns {React.ReactElement} Cell component
 */
const Cell = ({
  value = null,
  isGiven = false,
  isSelected = false,
  isHighlighted = false,
  hasError = false,
  isInSameRow = false,
  isInSameCol = false,
  isInSameBox = false,
  hasSameValue = false,
  showNotes = false,
  notes = [],
  onPress,
  row,
  col,
}) => {
  // Get styling from utility functions
  const backgroundClass = getCellBackground({
    hasError,
    isSelected,
    hasSameValue,
    isInSameRow,
    isInSameCol,
    isGiven,
    value,
  });
  const borderClass = getBorderStyles(row, col, isSelected, isInSameBox);
  const textColorClass = getTextColor(hasError, isGiven);

  return (
    <Pressable
      onPress={onPress}
      className={`aspect-square justify-center items-center ${backgroundClass} ${borderClass}`}
    >
      {showNotes && notes.length > 0 ? (
        // Notes mode - show small numbers in grid
        <View className="flex-1 flex-row flex-wrap p-0.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <View key={num} className="w-1/3 h-1/3 justify-center items-center">
              {notes.includes(num) && (
                <Text className="text-xs text-desertBrown/60">{num}</Text>
              )}
            </View>
          ))}
        </View>
      ) : (
        // Normal mode - show single value
        value !== null && (
          <Text className={`text-xl ${textColorClass}`}>{value}</Text>
        )
      )}
    </Pressable>
  );
};

export default Cell;
