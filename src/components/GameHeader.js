import React from 'react';
import { View, Text, Pressable } from 'react-native';

/**
 * Game header with navigation and timer
 * @param {Object} props - Component props
 * @param {Function} props.onBack - Callback for back navigation
 * @param {string} props.time - Time display string
 * @param {string} props.difficulty - Current difficulty level
 * @returns {React.ReactElement} GameHeader component
 */
const GameHeader = ({ onBack, time = '00:00', difficulty = 'Easy' }) => {
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

      {/* Spacer for layout balance */}
      <View className="p-2 w-12" />
    </View>
  );
};

export default GameHeader;
