import React from 'react';
import { View, Text, Pressable } from 'react-native';

/**
 * Control button component
 * @param {Object} props - Button props
 * @returns {React.ReactElement} Control button
 */
const ControlButton = ({ onPress, disabled, active, children, label }) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    className={`flex-1 py-1 px-2 mx-1 rounded-lg items-center ${
      disabled ? 'bg-gray-300' : active ? 'bg-cinnamon' : 'bg-desertBrown'
    }`}
  >
    <Text
      className={`text-2xl mb-1 ${disabled ? 'text-gray-500' : 'text-white'}`}
    >
      {children}
    </Text>
    <Text className={`text-xs ${disabled ? 'text-gray-500' : 'text-white'}`}>
      {label}
    </Text>
  </Pressable>
);

/**
 * Game control buttons component
 * @param {Object} props - Component props
 * @param {Function} props.onUndo - Callback for undo action
 * @param {Function} props.onErase - Callback for erase action
 * @param {Function} props.onToggleNotes - Callback for toggling notes mode
 * @param {Function} props.onHint - Callback for hint action
 * @param {boolean} props.notesMode - Whether notes mode is active
 * @param {boolean} props.canUndo - Whether undo is available
 * @param {number} props.hintsRemaining - Number of hints remaining
 * @returns {React.ReactElement} GameControls component
 */
const GameControls = ({
  onUndo,
  onErase,
  onToggleNotes,
  onHint,
  notesMode = false,
  canUndo = false,
  hintsRemaining = 3,
}) => {
  return (
    <View className="flex-row px-4 py-2 bg-sand">
      <ControlButton onPress={onUndo} disabled={!canUndo} label="Undo">
        ↶
      </ControlButton>

      <ControlButton onPress={onErase} disabled={false} label="Erase">
        ⌫
      </ControlButton>

      <ControlButton onPress={onToggleNotes} active={notesMode} label="Notes">
        ✏
      </ControlButton>

      <ControlButton
        onPress={onHint}
        disabled={hintsRemaining === 0}
        label={`Hint (${hintsRemaining})`}
      >
        💡
      </ControlButton>
    </View>
  );
};

export default GameControls;
