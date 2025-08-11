import React from 'react';
import { View, Text, Pressable } from 'react-native';

/**
 * Game header with navigation, timer, and pause controls
 * @param {Object} props - Component props
 * @param {Function} props.onBack - Callback for back navigation
 * @param {Function} props.onPause - Callback for pause button
 * @param {string} props.time - Time display string
 * @param {string} props.difficulty - Current difficulty level
 * @returns {React.ReactElement} GameHeader component
 */
const GameHeader = ({
  onBack,
  onPause,
  time = '00:00',
  difficulty = 'Easy',
}) => {
  return (
    <View className="flex-row justify-between items-center px-4 py-3 bg-sand border-b border-desertBrown">
      {/* Back button */}
      <Pressable
        onPress={onBack}
        className="p-2 rounded-lg bg-cream border border-cinnamon"
      >
        <Text className="text-cinnamon text-base font-semibold">← Back</Text>
      </Pressable>

      {/* Timer and difficulty */}
      <View className="items-center">
        <Text className="text-2xl font-bold text-darkChocolate">{time}</Text>
        <Text className="text-xs text-desertBrown">{difficulty}</Text>
      </View>

      {/* Pause button */}
      <Pressable
        onPress={onPause}
        className="p-2 rounded-lg bg-cinnamon"
      >
        <Text className="text-white text-base font-semibold">❚❚</Text>
      </Pressable>
    </View>
  );
};

export default GameHeader;
