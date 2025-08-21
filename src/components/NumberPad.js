import React from 'react';
import { View, Text, Pressable } from 'react-native';

/**
 * Number button component
 * @param {Object} props - Button props
 * @returns {React.ReactElement} Number button
 */
const NumberButton = ({
  number,
  onNumberPress,
  disabledNumbers,
  selectedNumber,
}) => {
  const isDisabled = disabledNumbers.includes(number);
  const isSelected = selectedNumber === number;

  return (
    <Pressable
      onPress={() => onNumberPress(number)}
      disabled={isDisabled}
      className={`flex-1 py-2 mx-1 rounded-xl items-center justify-center ${
        isDisabled
          ? 'bg-paleWheat'
          : isSelected
          ? 'bg-cinnamon'
          : 'bg-cream border-2 border-desertBrown'
      }`}
    >
      <Text
        className={`text-2xl font-bold ${
          isDisabled
            ? 'text-desertBrown/50'
            : isSelected
            ? 'text-white'
            : 'text-desertBrown'
        }`}
      >
        {number}
      </Text>
    </Pressable>
  );
};

/**
 * Number pad component for inputting sudoku values
 * @param {Object} props - Component props
 * @param {Function} props.onNumberPress - Callback when number is pressed
 * @param {Array} props.disabledNumbers - Array of numbers that are completed/disabled
 * @param {number} props.selectedNumber - Currently selected number for highlighting
 * @returns {React.ReactElement} NumberPad component
 */
const NumberPad = ({
  onNumberPress,
  disabledNumbers = [],
  selectedNumber = null,
}) => {
  return (
    <View className="px-4 py-3 bg-sand">
      <View className="flex-row">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(number => (
          <NumberButton
            key={number}
            number={number}
            onNumberPress={onNumberPress}
            disabledNumbers={disabledNumbers}
            selectedNumber={selectedNumber}
          />
        ))}
      </View>
    </View>
  );
};

export default NumberPad;
