import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import GameHeader from '../components/GameHeader';
import Board from '../components/Board';
import GameControls from '../components/GameControls';
import NumberPad from '../components/NumberPad';
import generatePuzzle from '../utils/sudokuGenerator';

/**
 * Main game screen with sudoku board and controls
 * @param {Object} props - Component props
 * @param {Object} props.navigation - Navigation prop
 * @param {Object} props.route - Route prop with params
 * @returns {React.ReactElement} Game screen component
 */
const GameScreen = ({ navigation, route }) => {
  // Get difficulty from route params
  const difficulty = route?.params?.difficulty || {
    name: 'Easy',
    minClues: 30,
    maxClues: 35,
  };

  // Puzzle states
  const [board, setBoard] = useState(Array(9).fill(Array(9).fill(null)));
  const [initialBoard, setInitialBoard] = useState(Array(9).fill(Array(9).fill(null)));
  const [solution, setSolution] = useState(Array(9).fill(Array(9).fill(null))); // eslint-disable-line no-unused-vars
  const [isGenerating, setIsGenerating] = useState(true);
  
  // Game states
  const [selectedCell, setSelectedCell] = useState(null);
  const [notesMode, setNotesMode] = useState(false);
  const [notes] = useState(Array(9).fill(Array(9).fill([])));
  const [mistakes] = useState(0);
  const maxMistakes = 3;

  /**
   * Generate a new puzzle with the current difficulty
   */
  const generateNewPuzzle = async () => {
    try {
      setIsGenerating(true);
      const puzzleData = await generatePuzzle(difficulty);
      
      setBoard(puzzleData.puzzle);
      setInitialBoard(puzzleData.puzzle);
      setSolution(puzzleData.solution);
      setSelectedCell(null); // Reset selection
    } catch (error) {
      console.error('Error generating puzzle:', error);
      // Fallback to empty board if generation fails
      const emptyBoard = Array(9).fill(Array(9).fill(null));
      setBoard(emptyBoard);
      setInitialBoard(emptyBoard);
      setSolution(emptyBoard);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate puzzle when component mounts or difficulty changes
  useEffect(() => {
    generateNewPuzzle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty.name, difficulty.minClues, difficulty.maxClues]);

  /**
   * Handle cell press
   * @param {number} row - Row index
   * @param {number} col - Column index
   */
  const handleCellPress = (row, col) => {
    setSelectedCell({ row, col });
  };

  /**
   * Handle number pad press
   * @param {number} number - Number pressed
   */
  const handleNumberPress = number => {
    // No functionality - just for layout
    console.log('Number pressed:', number);
  };

  /**
   * Handle back navigation
   */
  const handleBack = () => {
    navigation.goBack();
  };

  /**
   * Handle pause
   */
  const handlePause = () => {
    // No functionality - just for layout
    console.log('Pause pressed');
  };

  /**
   * Handle control actions
   */
  const handleUndo = () => console.log('Undo');
  const handleErase = () => console.log('Erase');
  const handleToggleNotes = () => setNotesMode(!notesMode);
  const handleHint = () => console.log('Hint');

  return (
    <SafeAreaView className="flex-1 bg-sand">
      <View className="flex-1">
        {/* Header with navigation and timer */}
        <GameHeader
          onBack={handleBack}
          onPause={handlePause}
          time="00:00"
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
                    mistakes >= maxMistakes
                      ? 'text-red-600'
                      : 'text-darkChocolate'
                  }`}
                >
                  {mistakes}/{maxMistakes}
                </Text>
              </View>
              
              {/* Loading indicator */}
              {isGenerating && (
                <View className="mt-2">
                  <Text className="text-center text-desertBrown text-sm">
                    Generating puzzle...
                  </Text>
                </View>
              )}
            </View>

            {/* Sudoku board */}
            <Board
              board={board}
              initialBoard={initialBoard}
              selectedCell={selectedCell}
              highlightValue={null}
              errors={[]}
              notes={notes}
              notesMode={notesMode}
              onCellPress={handleCellPress}
            />
          </View>
        </ScrollView>

        {/* Bottom controls */}
        <View className="bg-sand border-t border-desertBrown/20">
          {/* Game control buttons */}
          <GameControls
            onUndo={handleUndo}
            onErase={handleErase}
            onToggleNotes={handleToggleNotes}
            onHint={handleHint}
            notesMode={notesMode}
            canUndo={false}
            hintsRemaining={3}
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
