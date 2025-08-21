import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { hasSavedGame } from '../services/storage';
import DifficultySelector from '../components/DifficultySelector';
import Modal from '../components/Modal';
import packageInfo from '../../package.json';
import { themeClasses } from '../theme/colors';

/**
 * Home screen - main welcome screen with game options
 * @param {Object} props - Component props
 * @param {Object} props.navigation - Navigation prop
 * @returns {React.ReactElement} Home screen component
 */
const HomeScreen = ({ navigation }) => {
  const [savedGameExists, setSavedGameExists] = useState(false);
  const [showDifficultySelector, setShowDifficultySelector] = useState(false);
  const [storageError, setStorageError] = useState(null);

  useEffect(() => {
    const checkForSavedGame = async () => {
      const result = await hasSavedGame();
      if (result.success) {
        setSavedGameExists(result.exists);
        setStorageError(null);
      } else {
        setSavedGameExists(false);
        setStorageError('Unable to check saved games');
      }
    };
    checkForSavedGame();
  }, []);

  /**
   * Handles showing the difficulty selector when starting a new game
   */
  const handleStartNewGame = () => {
    setShowDifficultySelector(true);
  };

  /**
   * Handles difficulty selection and navigates to game screen
   * @param {Object} difficulty - Selected difficulty configuration
   */
  const handleDifficultySelect = difficulty => {
    setShowDifficultySelector(false);
    navigation.navigate('Game', { difficulty });
  };

  /**
   * Handles going back from difficulty selector to main menu
   */
  const handleBackFromDifficulty = () => {
    setShowDifficultySelector(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-sand">
      <View className={themeClasses.content}>
        {/* Logo */}
        <View className="w-20 h-20 rounded-2xl bg-cinnamon flex items-center justify-center mb-5 shadow-lg">
          <Text className={themeClasses.logoText}>数</Text>
        </View>

        <Text className={themeClasses.appTitle}>Sudoku</Text>
        <Text className={themeClasses.subtitle}>Classic Puzzle Game</Text>

        {storageError && (
          <Text className="text-red-600 text-sm mb-2 text-center">
            {storageError}
          </Text>
        )}

        <View className={themeClasses.buttonContainer}>
          <TouchableOpacity
            className={`${themeClasses.buttonBase} ${themeClasses.primaryButton}`}
            onPress={handleStartNewGame}
          >
            <Text className="text-white">New Game</Text>
          </TouchableOpacity>

          {savedGameExists && (
            <TouchableOpacity
              className={`${themeClasses.buttonBase} ${themeClasses.continueButton}`}
              onPress={() => navigation.navigate('Game', { loadSaved: true })}
            >
              <Text className="text-white">Continue</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            className={`${themeClasses.buttonBase} ${themeClasses.secondaryButton}`}
            onPress={() => navigation.navigate('HowToPlay')}
          >
            <Text className="text-white">How to Play</Text>
          </TouchableOpacity>
        </View>

        <Text className={themeClasses.versionText}>v{packageInfo.version}</Text>
      </View>

      {/* Difficulty Selection Modal */}
      <Modal
        visible={showDifficultySelector}
        onClose={handleBackFromDifficulty}
      >
        <DifficultySelector
          onSelectDifficulty={handleDifficultySelect}
          onClose={handleBackFromDifficulty}
        />
      </Modal>
    </SafeAreaView>
  );
};

// All styling is now handled by Tailwind CSS classes via NativeWind
// No StyleSheet needed - using className props exclusively

export default HomeScreen;
