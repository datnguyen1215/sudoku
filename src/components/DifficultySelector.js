import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

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
    buttonClass: 'bg-green-500',
  },
  {
    name: 'Medium',
    description: 'Balanced challenge',
    minClues: 25,
    maxClues: 30,
    buttonClass: 'bg-sandy',
  },
  {
    name: 'Hard',
    description: 'For experienced players',
    minClues: 20,
    maxClues: 25,
    buttonClass: 'bg-desertBrown',
  },
  {
    name: 'Expert',
    description: 'Ultimate puzzle mastery',
    minClues: 17,
    maxClues: 20,
    buttonClass: 'bg-cinnamon',
  },
];

/**
 * Reusable difficulty selector component for Sudoku game
 * @param {Object} props - Component props
 * @param {Function} props.onSelectDifficulty - Callback function called when a difficulty is selected
 * @param {Object} [props.style] - Optional style override for the container
 * @returns {React.ReactElement} DifficultySelector component
 */
const DifficultySelector = ({ onSelectDifficulty, style }) => {
  /**
   * Handles difficulty selection and calls the onSelectDifficulty callback
   * @param {DifficultyConfig} difficulty - Selected difficulty configuration
   */
  const handleDifficultyPress = (difficulty) => {
    if (onSelectDifficulty) {
      onSelectDifficulty(difficulty);
    }
  };

  return (
    <View className="flex-1 px-5 py-5 bg-gradient-to-br from-sand to-wheat">
      <Text className="text-3xl font-bold text-mahogany text-center mb-2">Choose Difficulty</Text>
      <Text className="text-base text-brown text-center mb-10">Select your preferred challenge level</Text>
      
      <View className="flex-1 justify-center items-center max-h-96">
        {DIFFICULTIES.map((difficulty) => (
          <TouchableOpacity
            key={difficulty.name}
            className={`w-full max-w-80 py-5 px-6 rounded-2xl mb-4 ${difficulty.buttonClass} shadow-lg`}
            onPress={() => handleDifficultyPress(difficulty)}
            activeOpacity={0.8}>
            
            <View className="items-center">
              <Text className="text-xl font-bold text-white mb-1">{difficulty.name}</Text>
              <Text className="text-sm text-white opacity-90">{difficulty.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// All styling is now handled by Tailwind CSS classes via NativeWind
// No StyleSheet needed - using className props exclusively

export default DifficultySelector;