/**
 * @fileoverview Basic app-level type definitions using JSDoc
 */

/**
 * Navigation screen names
 * @typedef {('Home' | 'Game' | 'HowToPlay')} ScreenName
 */

/**
 * Navigation route parameter types
 * @typedef {Object} RouteParams
 * @property {Object} Home - Home screen parameters
 * @property {Object} Game - Game screen parameters
 * @property {Object} HowToPlay - How to play screen parameters
 */

/**
 * Navigation prop type for screens
 * @typedef {Object} NavigationProp
 * @property {function(ScreenName, Object=): void} navigate - Navigate to screen
 * @property {function(): void} goBack - Go back to previous screen
 * @property {function(): boolean} canGoBack - Check if can go back
 */

/**
 * React Native screen component props
 * @typedef {Object} ScreenProps
 * @property {NavigationProp} navigation - Navigation prop
 * @property {Object} route - Route prop with params
 */

/**
 * Basic app configuration
 * @typedef {Object} AppConfig
 * @property {string} name - App name
 * @property {string} version - App version
 * @property {boolean} debugMode - Debug mode flag
 */

/**
 * Cell position on the board
 * @typedef {Object} CellPosition
 * @property {number} row - Row index (0-8)
 * @property {number} col - Column index (0-8)
 */

/**
 * Board state
 * @typedef {Object} BoardState
 * @property {Array<Array<number|null>>} board - Current board state
 * @property {Array<Array<number|null>>} initialBoard - Initial/given values
 * @property {Array<Array<Array<number>>>} notes - Notes for each cell
 */

/**
 * Game state
 * @typedef {Object} GameState
 * @property {number} mistakes - Number of mistakes made
 * @property {Array<CellPosition>} errors - Cells with errors
 * @property {CellPosition|null} selectedCell - Currently selected cell
 */

/**
 * UI state
 * @typedef {Object} UIState
 * @property {boolean} notesMode - Whether notes mode is active
 * @property {boolean} isGenerating - Whether puzzle is being generated
 * @property {string|null} generationError - Error message if generation failed
 */

/**
 * Puzzle data from generator
 * @typedef {Object} PuzzleData
 * @property {Array<Array<number|null>>} puzzle - Puzzle with empty cells
 * @property {Array<Array<number>>} solution - Complete solution
 * @property {string} difficulty - Difficulty name
 * @property {number} clues - Number of given clues
 * @property {number} targetClues - Target number of clues
 */

/**
 * Difficulty configuration
 * @typedef {Object} DifficultyConfig
 * @property {string} name - Difficulty name
 * @property {string} description - Difficulty description
 * @property {number} minClues - Minimum number of clues
 * @property {number} maxClues - Maximum number of clues
 */

export {};
