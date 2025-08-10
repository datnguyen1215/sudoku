import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const GAME_STATE_KEY = 'sudoku_game_state';

/**
 * Load saved game from AsyncStorage
 * @returns {Promise<Object|null>} Saved game object or null if no game exists
 */
const loadGame = async () => {
  try {
    const gameState = await AsyncStorage.getItem(GAME_STATE_KEY);
    return gameState ? JSON.parse(gameState) : null;
  } catch (error) {
    console.error('Error loading game:', error);
    return null;
  }
};

/**
 * Save game state to AsyncStorage
 * @param {Object} gameState - The game state object to save
 * @returns {Promise<boolean>} Success status
 */
const saveGame = async (gameState) => {
  try {
    await AsyncStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
    return true;
  } catch (error) {
    console.error('Error saving game:', error);
    return false;
  }
};

/**
 * Check if a saved game exists
 * @returns {Promise<boolean>} True if saved game exists
 */
const hasSavedGame = async () => {
  try {
    const gameState = await AsyncStorage.getItem(GAME_STATE_KEY);
    return gameState !== null;
  } catch (error) {
    console.error('Error checking for saved game:', error);
    return false;
  }
};

/**
 * Clear saved game from storage
 * @returns {Promise<boolean>} Success status
 */
const clearSavedGame = async () => {
  try {
    await AsyncStorage.removeItem(GAME_STATE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing saved game:', error);
    return false;
  }
};

export {
  loadGame,
  saveGame,
  hasSavedGame,
  clearSavedGame,
};