import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { hasSavedGame } from '../services/storage';
import DifficultySelector from '../components/DifficultySelector';
import packageInfo from '../../package.json';

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
    <SafeAreaView style={styles.container}>
      {showDifficultySelector ? (
        <View style={styles.difficultyContainer}>
          <View style={styles.backButtonContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackFromDifficulty}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          </View>
          <DifficultySelector onSelectDifficulty={handleDifficultySelect} />
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={styles.appTitle}>Sudoku</Text>
          <Text style={styles.subtitle}>Classic Puzzle Game</Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleStartNewGame}>
              <Text style={[styles.buttonText, styles.primaryButtonText]}>New Game</Text>
            </TouchableOpacity>
            
            {savedGameExists && (
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={() => navigation.navigate('Game', { loadSaved: true })}>
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>Continue</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => {/* TODO: Navigate to How to Play screen */}}>
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>How to Play</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => {/* TODO: Navigate to Statistics screen */}}>
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>Statistics</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => navigation.navigate('Settings')}>
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>Settings</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.versionText}>v{packageInfo.version}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  appTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(21, 101, 192, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 50,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 280,
    alignItems: 'center',
  },
  button: {
    width: '100%',
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  primaryButton: {
    backgroundColor: '#1976D2',
  },
  secondaryButton: {
    backgroundColor: '#42A5F5',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
  },
  secondaryButtonText: {
    color: '#ffffff',
  },
  versionText: {
    position: 'absolute',
    bottom: 20,
    color: '#999999',
    fontSize: 14,
  },
  difficultyContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  backButtonContainer: {
    padding: 20,
    paddingBottom: 0,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1976D2',
  },
  backButtonText: {
    color: '#1976D2',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;