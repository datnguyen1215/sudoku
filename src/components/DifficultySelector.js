import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

/**
 * Difficulty configuration with clue counts
 * @typedef {Object} DifficultyConfig
 * @property {string} name - Display name of the difficulty
 * @property {string} description - Short description of the difficulty level
 * @property {number} minClues - Minimum number of clues
 * @property {number} maxClues - Maximum number of clues
 * @property {string} color - Primary color for the difficulty button
 * @property {string} gradientColor - Secondary color for gradient effect
 */

/**
 * Available difficulty levels with their configurations
 * @type {DifficultyConfig[]}
 */
const DIFFICULTIES = [
  {
    name: 'Easy',
    description: 'Perfect for beginners',
    minClues: 30,
    maxClues: 35,
  },
  {
    name: 'Medium',
    description: 'A moderate challenge',
    minClues: 25,
    maxClues: 30,
  },
  {
    name: 'Hard',
    description: 'For experienced players',
    minClues: 20,
    maxClues: 25,
  },
  {
    name: 'Expert',
    description: 'The ultimate challenge',
    minClues: 17,
    maxClues: 20,
  },
];

/**
 * Reusable difficulty selector component for Sudoku game
 * @param {Object} props - Component props
 * @param {Function} props.onSelectDifficulty - Callback function called when a difficulty is selected
 * @param {Function} [props.onClose] - Optional callback function called when modal should close
 * @param {Object} [props.style] - Optional style override for the container
 * @returns {React.ReactElement} DifficultySelector component
 */
const DifficultySelector = ({ onSelectDifficulty, onClose, style }) => {
  /**
   * Handles difficulty selection and calls the onSelectDifficulty callback
   * @param {DifficultyConfig} difficulty - Selected difficulty configuration
   */
  const handleDifficultyPress = difficulty => {
    if (onSelectDifficulty) {
      onSelectDifficulty(difficulty);
    }
  };

  return (
    <View style={style}>
      {DIFFICULTIES.map(difficulty => (
        <TouchableOpacity
          key={difficulty.name}
          className="w-full bg-cream border-2 border-desertBrown rounded-xl px-4 py-3 mb-3"
          onPress={() => handleDifficultyPress(difficulty)}
          activeOpacity={0.7}
        >
          <Text className="text-base font-bold text-darkChocolate mb-1">
            {difficulty.name}
          </Text>
          <Text className="text-xs text-desertBrown">
            {difficulty.description}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// All styling is now handled by Tailwind CSS classes via NativeWind
// No StyleSheet needed - using className props exclusively

export default DifficultySelector;
