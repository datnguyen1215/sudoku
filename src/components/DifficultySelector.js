import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

/**
 * Difficulty configuration with clue counts
 * @typedef {Object} DifficultyConfig
 * @property {string} name - Display name of the difficulty
 * @property {string} clueRange - String representation of clue count range
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
    clueRange: '30-35 clues',
    minClues: 30,
    maxClues: 35,
    color: '#4CAF50',
    gradientColor: '#66BB6A',
  },
  {
    name: 'Medium',
    clueRange: '25-30 clues',
    minClues: 25,
    maxClues: 30,
    color: '#2196F3',
    gradientColor: '#64B5F6',
  },
  {
    name: 'Hard',
    clueRange: '20-25 clues',
    minClues: 20,
    maxClues: 25,
    color: '#FF9800',
    gradientColor: '#FFB74D',
  },
  {
    name: 'Expert',
    clueRange: '17-20 clues',
    minClues: 17,
    maxClues: 20,
    color: '#F44336',
    gradientColor: '#EF5350',
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
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Choose Difficulty</Text>
      <Text style={styles.subtitle}>Select your preferred challenge level</Text>
      
      <View style={styles.buttonContainer}>
        {DIFFICULTIES.map((difficulty) => (
          <TouchableOpacity
            key={difficulty.name}
            style={[
              styles.difficultyButton,
              { backgroundColor: difficulty.color }
            ]}
            onPress={() => handleDifficultyPress(difficulty)}
            activeOpacity={0.8}>
            
            <View style={styles.buttonContent}>
              <Text style={styles.difficultyName}>{difficulty.name}</Text>
              <Text style={styles.clueRange}>{difficulty.clueRange}</Text>
            </View>
            
            {/* Gradient overlay effect using a lighter color */}
            <View 
              style={[
                styles.gradientOverlay, 
                { backgroundColor: difficulty.gradientColor }
              ]} 
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1565C0',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: 400,
  },
  difficultyButton: {
    width: '100%',
    maxWidth: 300,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    position: 'relative',
    overflow: 'hidden',
  },
  buttonContent: {
    alignItems: 'center',
    zIndex: 2,
  },
  difficultyName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  clueRange: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: '50%',
    bottom: 0,
    opacity: 0.3,
    zIndex: 1,
  },
});

export default DifficultySelector;