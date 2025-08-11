import React, { useEffect, useRef } from 'react';
import {
  View,
  Modal as RNModal,
  TouchableOpacity,
  Text,
  Animated,
  Dimensions,
} from 'react-native';

/**
 * Simple modal component for bottom-sheet style display
 * @param {Object} props - Component props
 * @param {boolean} props.visible - Controls modal visibility
 * @param {Function} props.onClose - Callback function called when modal should close
 * @param {React.ReactNode} props.children - Content to render inside the modal
 * @returns {React.ReactElement} Modal component
 */
const Modal = ({ visible, onClose, children }) => {
  const slideAnim = useRef(
    new Animated.Value(Dimensions.get('window').height),
  ).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: Dimensions.get('window').height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  return (
    <RNModal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Semi-transparent overlay - appears instantly */}
      <View className="flex-1 bg-black/50 justify-end">
        {/* Tap to close overlay */}
        <TouchableOpacity
          className="flex-1"
          onPress={onClose}
        />

        {/* Modal content container - slides in with animation */}
        <Animated.View
          style={{ transform: [{ translateY: slideAnim }] }}
          className="bg-cream rounded-t-2xl border-t-4 border-x-4 border-sienna"
        >
          {/* Header section with title and close button */}
          <View className="flex-row justify-between items-center px-5 py-4">
            <Text className="text-xl font-bold text-darkChocolate">
              Choose Difficulty
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-7 h-7 rounded-full bg-desertBrown items-center justify-center"
              activeOpacity={0.7}
            >
              <Text className="text-white text-lg font-bold">×</Text>
            </TouchableOpacity>
          </View>

          {/* Modal content */}
          <View className="p-5">{children}</View>
        </Animated.View>
      </View>
    </RNModal>
  );
};

export default Modal;
