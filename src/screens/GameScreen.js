import React, { useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import GameHeader from '../components/GameHeader';
import Board from '../components/Board';
import GameControls from '../components/GameControls';
import NumberPad from '../components/NumberPad';
import { MAX_MISTAKES, DEFAULT_DIFFICULTY } from '../constants/gameConstants';
import { useGameLogic } from '../hooks/useGameLogic';
import { useTimer } from '../hooks/useTimer';

/**
 * Main game screen with sudoku board and controls
 * @param {Object} props - Component props
 * @param {Object} props.navigation - Navigation prop
 * @param {Object} props.route - Route prop with params
 * @returns {React.ReactElement} Game screen component
 */
const GameScreen = ({ navigation, route }) => {
  // Get difficulty from route params
  const difficulty = route?.params?.difficulty || DEFAULT_DIFFICULTY;
  const loadSaved = route?.params?.loadSaved || false;

  // Use custom hook for game logic
  const {
    boardState,
    gameState,
    uiState,
    generateNewPuzzle,
    loadSavedGame,
    handleCellPress,
    handleNumberPress,
    handleErase,
    handleToggleNotes,
  } = useGameLogic(difficulty);

  // Use timer hook
  const timer = useTimer();

  // Generate puzzle or load saved game when component mounts
  useEffect(() => {
    const initGame = async () => {
      if (loadSaved) {
        await loadSavedGame();
      } else {
        await generateNewPuzzle();
      }
      timer.reset();
      timer.start();
    };
    initGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty.name, difficulty.minClues, difficulty.maxClues, loadSaved]);

  // Stop timer if game is won or too many mistakes
  useEffect(() => {
    if (gameState.mistakes >= MAX_MISTAKES) {
      timer.stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.mistakes]);

  /**
   * Handle back navigation
   */
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-sand">
      <View className="flex-1">
        {/* Header with navigation and timer */}
        <GameHeader
          onBack={handleBack}
          time={timer.formattedTime}
          difficulty={difficulty.name}
        />

        {/* Main game area */}
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 justify-center py-4">
            {/* Game info */}
            <View className="px-4 mb-4">
              {/* Mistakes counter */}
              <View className="flex-row justify-center items-center">
                <Text className="text-desertBrown mr-2">Mistakes:</Text>
                <Text
                  className={`font-bold ${
                    gameState.mistakes >= MAX_MISTAKES
                      ? 'text-red-600'
                      : 'text-darkChocolate'
                  }`}
                >
                  {gameState.mistakes}/{MAX_MISTAKES}
                </Text>
              </View>

              {/* Loading indicator */}
              {uiState.isGenerating && (
                <View className="mt-2">
                  <Text className="text-center text-desertBrown text-sm">
                    Generating puzzle...
                  </Text>
                </View>
              )}

              {/* Error indicator */}
              {uiState.generationError && (
                <View className="mt-2">
                  <Text className="text-center text-red-600 text-sm">
                    {uiState.generationError}
                  </Text>
                </View>
              )}
            </View>

            {/* Sudoku board */}
            <Board
              board={boardState.board}
              initialBoard={boardState.initialBoard}
              selectedCell={gameState.selectedCell}
              highlightValue={
                gameState.selectedCell
                  ? boardState.board[gameState.selectedCell.row][
                      gameState.selectedCell.col
                    ]
                  : null
              }
              errors={gameState.errors}
              notes={boardState.notes}
              notesMode={uiState.notesMode}
              onCellPress={handleCellPress}
            />
          </View>
        </ScrollView>

        {/* Bottom controls */}
        <View className="bg-sand border-t border-desertBrown/20">
          {/* Game control buttons */}
          <GameControls
            onErase={handleErase}
            onToggleNotes={handleToggleNotes}
            notesMode={uiState.notesMode}
          />

          {/* Number pad */}
          <NumberPad
            onNumberPress={handleNumberPress}
            disabledNumbers={[]}
            selectedNumber={null}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default GameScreen;
