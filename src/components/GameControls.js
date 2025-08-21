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
      disabled
        ? 'bg-paleWheat'
        : active
        ? 'bg-cinnamon'
        : 'bg-paleCream border border-desertBrown'
    }`}
  >
    <Text
      className={`text-2xl mb-1 ${
        disabled
          ? 'text-desertBrown/50'
          : active
          ? 'text-white'
          : 'text-darkChocolate'
      }`}
    >
      {children}
    </Text>
    <Text
      className={`text-xs ${
        disabled
          ? 'text-desertBrown/50'
          : active
          ? 'text-white'
          : 'text-darkChocolate'
      }`}
    >
      {label}
    </Text>
  </Pressable>
);

/**
 * Game control buttons component
 * @param {Object} props - Component props
 * @param {Function} props.onErase - Callback for erase action
 * @param {Function} props.onUndo - Callback for undo action
 * @param {Function} props.onToggleNotes - Callback for toggling notes mode
 * @param {boolean} props.notesMode - Whether notes mode is active
 * @param {boolean} props.hasHistory - Whether there are moves to undo
 * @returns {React.ReactElement} GameControls component
 */
const GameControls = ({
  onErase,
  onUndo,
  onToggleNotes,
  notesMode = false,
  hasHistory = false,
}) => {
  return (
    <View className="flex-row px-4 py-2 bg-sand">
      <ControlButton onPress={onErase} disabled={false} label="Erase">
        ⌫
      </ControlButton>

      <ControlButton onPress={onUndo} disabled={!hasHistory} label="Undo">
        ↶
      </ControlButton>

      <ControlButton onPress={onToggleNotes} active={notesMode} label="Notes">
        ✏
      </ControlButton>
    </View>
  );
};

export default GameControls;
