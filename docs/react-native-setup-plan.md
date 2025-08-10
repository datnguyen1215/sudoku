# React Native Sudoku Setup Plan

## Overview
This document outlines the complete setup plan for a minimal React Native Sudoku application using JavaScript with JSDoc type annotations (no TypeScript).

## 1. Project Initialization

### Commands
```bash
# Initialize React Native project
npx react-native@latest init SudokuApp --directory . --skip-install

# Remove TypeScript dependencies and files
# Update package.json to remove @types packages
# Rename any .ts/.tsx files to .js
```

## 2. Project Structure

```
sudoku/
├── android/                 # Android native code
├── ios/                    # iOS native code
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js       # Main menu screen
│   │   ├── GameScreen.js       # Game play screen
│   │   ├── DifficultyScreen.js # Difficulty selection
│   │   └── SettingsScreen.js   # User preferences
│   ├── components/
│   │   ├── SudokuGrid.js       # 9x9 grid container
│   │   ├── Cell.js             # Individual cell component
│   │   ├── NumberPad.js        # Number input pad
│   │   └── Timer.js            # Game timer display
│   ├── services/
│   │   ├── gameEngine.js       # Core game logic
│   │   └── storage.js          # AsyncStorage wrapper
│   ├── utils/
│   │   └── helpers.js          # Utility functions
│   ├── navigation/
│   │   └── AppNavigator.js     # Stack navigator setup
│   └── types.js                # JSDoc type definitions
├── App.js                      # Entry point
├── index.js                    # App registry
├── package.json
├── jsconfig.json              # Path aliases (no linting)
└── .gitignore
```

## 3. Dependencies

### Core Dependencies
```json
{
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.73.x",
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/stack": "^6.3.0",
    "react-native-screens": "^3.29.0",
    "react-native-safe-area-context": "^4.8.0",
    "react-native-gesture-handler": "^2.14.0",
    "@react-native-async-storage/async-storage": "^1.21.0",
    "react-native-vector-icons": "^10.0.0"
  }
}
```

### No Development Dependencies for Linting
- No ESLint
- No Prettier
- No TypeScript
- Keep only essential React Native dev dependencies

## 4. JavaScript + JSDoc Standards

### Function Style Priority
1. **Arrow functions** - Primary choice for all functions
2. **Function composition** - For complex logic over classes
3. **Regular functions** - Only when hoisting is required
4. **Async/await** - Always over Promise chains

### JSDoc Type Definitions (types.js)
```javascript
/**
 * @typedef {Object} Cell
 * @property {number|null} value - Cell value (1-9 or null)
 * @property {boolean} isFixed - Whether cell is part of initial puzzle
 * @property {boolean} isSelected - Currently selected state
 * @property {Array<number>} notes - User notes for cell
 */

/**
 * @typedef {Array<Array<Cell>>} Grid
 */

/**
 * @typedef {Object} GameState
 * @property {Grid} grid - Current game grid
 * @property {string} difficulty - Game difficulty level
 * @property {number} timeElapsed - Seconds elapsed
 * @property {boolean} isPaused - Pause state
 * @property {Array<Grid>} history - Move history for undo
 */

/**
 * @typedef {Object} Settings
 * @property {boolean} showTimer - Display timer
 * @property {boolean} soundEnabled - Sound effects
 * @property {string} theme - light or dark
 */
```

### Essential JSDoc Tags Only
- `@param` - Function parameters
- `@returns` - Return values
- `@typedef` - Type definitions
- `@throws` - Exceptions thrown
- `@async` - Async functions

## 5. Screen Components

### HomeScreen.js
- New Game button
- Continue button (if saved game exists)
- Settings button
- Simple vertical layout

### DifficultyScreen.js
- Easy (30-35 clues)
- Medium (25-30 clues)
- Hard (20-25 clues)
- Expert (17-20 clues)

### GameScreen.js
- SudokuGrid component
- NumberPad for input
- Timer display
- Pause/Resume button
- Undo button
- Notes toggle

### SettingsScreen.js
- Theme toggle (light/dark)
- Sound effects toggle
- Show timer toggle
- Clear saved games

## 6. Core Components

### SudokuGrid.js
- 9x9 grid rendering
- Cell selection handling
- Highlight selected row/column/box
- Victory detection

### Cell.js
- Display value or notes
- Handle selection
- Show validation errors
- Fixed vs user-entered styling

### NumberPad.js
- Numbers 1-9
- Clear button
- Notes mode toggle
- Disabled state for completed numbers

### Timer.js
- Format time display (MM:SS)
- Pause/resume functionality
- Auto-save on pause

## 7. Services

### gameEngine.js

Key Functions:
- `generatePuzzle(difficulty)` - Create new puzzle
- `validateMove(grid, row, col, value)` - Check if move is valid
- `checkWin(grid)` - Verify if puzzle is complete
- `getSolution(grid)` - Get puzzle solution
- `getHint(grid)` - Provide hint for next move

### storage.js

Key Functions:
- `saveGame(gameState)` - Persist to AsyncStorage
- `loadGame()` - Retrieve saved game
- `clearSave()` - Delete saved data
- `saveSettings(settings)` - Save user preferences
- `loadSettings()` - Load user preferences

## 8. Navigation Setup

### AppNavigator.js
- Stack Navigator configuration
- Screen transitions
- No tab navigation (keeping it minimal)
- Header customization per screen

## 9. Build Configuration

### Package.json Scripts
```json
{
  "scripts": {
    "start": "react-native start",
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "pod-install": "cd ios && pod install"
  }
}
```

### Android Configuration
- Minimum SDK: 23 (Android 6.0)
- Target SDK: Latest stable
- Package name: com.sudokuapp
- App name: Sudoku

### iOS Configuration
- Minimum iOS: 12.0
- Bundle identifier: com.sudokuapp
- Display name: Sudoku
- Requires pod install after dependency changes

## 10. Development Workflow

### Initial Setup
1. Clone repository
2. Run `npm install`
3. For iOS: `cd ios && pod install`
4. Return to root: `cd ..`

### Running the App
1. Start Metro bundler: `npm start`
2. In new terminal:
   - Android: `npm run android`
   - iOS: `npm run ios`

### Making Changes
1. Edit JavaScript files
2. Metro auto-reloads changes
3. Shake device for developer menu
4. Use Fast Refresh for instant updates

## 11. What's NOT Included

This minimal setup excludes:
- ESLint or any linting configuration
- TypeScript and type checking
- Testing framework setup (though Jest is included by default)
- CI/CD pipeline configuration
- Code formatting tools (Prettier)
- Pre-commit hooks
- Documentation generation tools

## 12. Next Steps After Setup

1. Implement basic navigation flow
2. Create sudoku generation algorithm
3. Add game state management
4. Implement save/load functionality
5. Add timer and scoring system
6. Create difficulty progression
7. Polish UI/UX
8. Test on both platforms
9. Prepare for release builds

## Notes

- All components use functional components with hooks
- State management via React hooks (useState, useContext)
- No Redux initially (can add later if needed)
- Focus on core gameplay before adding features
- Keep dependencies minimal for easier maintenance