import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const GAME_STATE_KEY = 'sudoku_game_state';

/**
 * Load saved game from AsyncStorage
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>} Result object
 */
const loadGame = async () => {
  try {
    const gameState = await AsyncStorage.getItem(GAME_STATE_KEY);
    return {
      success: true,
      data: gameState ? JSON.parse(gameState) : null,
    };
  } catch (error) {
    console.error('Error loading game:', error);
    return {
      success: false,
      error: 'Failed to load saved game',
    };
  }
};

/**
 * Save game state to AsyncStorage
 * @param {Object} gameState - The game state object to save
 * @returns {Promise<{success: boolean, error?: string}>} Result object
 */
const saveGame = async gameState => {
  try {
    await AsyncStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
    return { success: true };
  } catch (error) {
    console.error('Error saving game:', error);
    return {
      success: false,
      error: 'Failed to save game',
    };
  }
};

/**
 * Check if a saved game exists
 * @returns {Promise<{success: boolean, exists?: boolean, error?: string}>} Result object
 */
const hasSavedGame = async () => {
  try {
    const gameState = await AsyncStorage.getItem(GAME_STATE_KEY);
    return {
      success: true,
      exists: gameState !== null,
    };
  } catch (error) {
    console.error('Error checking for saved game:', error);
    return {
      success: false,
      exists: false,
      error: 'Failed to check saved game',
    };
  }
};

/**
 * Clear saved game from storage
 * @returns {Promise<{success: boolean, error?: string}>} Result object
 */
const clearSavedGame = async () => {
  try {
    await AsyncStorage.removeItem(GAME_STATE_KEY);
    return { success: true };
  } catch (error) {
    console.error('Error clearing saved game:', error);
    return {
      success: false,
      error: 'Failed to clear saved game',
    };
  }
};

export { loadGame, saveGame, hasSavedGame, clearSavedGame };
