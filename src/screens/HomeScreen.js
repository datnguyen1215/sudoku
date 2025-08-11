import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { hasSavedGame } from '../services/storage';
import DifficultySelector from '../components/DifficultySelector';
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

  useEffect(() => {
    const checkForSavedGame = async () => {
      const exists = await hasSavedGame();
      setSavedGameExists(exists);
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
  const handleDifficultySelect = (difficulty) => {
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
    <SafeAreaView className={themeClasses.safeArea}>
      {showDifficultySelector ? (
        <View className={themeClasses.difficultyContainer}>
          <View className={themeClasses.backButtonContainer}>
            <TouchableOpacity
              className={themeClasses.backButton}
              onPress={handleBackFromDifficulty}>
              <Text className={themeClasses.backButtonText}>← Back</Text>
            </TouchableOpacity>
          </View>
          <DifficultySelector onSelectDifficulty={handleDifficultySelect} />
        </View>
      ) : (
        <View className={themeClasses.content}>
          {/* Logo with gradient */}
          <View className={themeClasses.logo}>
            <Text className={themeClasses.logoText}>数</Text>
          </View>
          
          <Text className={themeClasses.appTitle}>Sudoku</Text>
          <Text className={themeClasses.subtitle}>Classic Puzzle Game</Text>
          
          <View className={themeClasses.buttonContainer}>
            <TouchableOpacity
              className={`${themeClasses.buttonBase} ${themeClasses.primaryButton}`}
              onPress={handleStartNewGame}>
              <Text className="text-white">New Game</Text>
            </TouchableOpacity>
            
            {savedGameExists && (
              <TouchableOpacity
                className={`${themeClasses.buttonBase} ${themeClasses.continueButton}`}
                onPress={() => navigation.navigate('Game', { loadSaved: true })}>
                <Text className="text-white">Continue</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              className={`${themeClasses.buttonBase} ${themeClasses.secondaryButton}`}
              onPress={() => {/* TODO: Navigate to How to Play screen */}}>
              <Text className="text-white">How to Play</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className={`${themeClasses.buttonBase} ${themeClasses.secondaryButton}`}
              onPress={() => {/* TODO: Navigate to Statistics screen */}}>
              <Text className="text-white">Statistics</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className={`${themeClasses.buttonBase} ${themeClasses.secondaryButton}`}
              onPress={() => navigation.navigate('Settings')}>
              <Text className="text-white">Settings</Text>
            </TouchableOpacity>
          </View>
          
          <Text className={themeClasses.versionText}>v{packageInfo.version}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

// All styling is now handled by Tailwind CSS classes via NativeWind
// No StyleSheet needed - using className props exclusively

export default HomeScreen;