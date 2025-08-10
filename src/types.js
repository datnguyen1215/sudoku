/**
 * @fileoverview Basic app-level type definitions using JSDoc
 */

/**
 * Navigation screen names
 * @typedef {('Home' | 'Game' | 'Settings')} ScreenName
 */

/**
 * Navigation route parameter types
 * @typedef {Object} RouteParams
 * @property {Object} Home - Home screen parameters
 * @property {Object} Game - Game screen parameters  
 * @property {Object} Settings - Settings screen parameters
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

export {};