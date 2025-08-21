import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * How to Play screen - Tutorial and game rules
 * @param {Object} props - Component props
 * @param {Object} props.navigation - Navigation prop
 * @returns {React.ReactElement} How to Play screen component
 */
const HowToPlayScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="flex-1 bg-cream"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row justify-between items-center px-5 py-4 border-b border-desertBrown">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-8 h-8 items-center justify-center"
          >
            <Text className="text-darkChocolate text-xl">←</Text>
          </TouchableOpacity>
          <Text className="text-xl font-bold text-darkChocolate">
            How to Play
          </Text>
          <View className="w-8" />
        </View>

        {/* Content */}
        <ScrollView className="flex-1 px-5 py-4">
          {/* Objective Section */}
          <View className="mb-4">
            <Text className="text-base font-bold text-mahogany mb-2">
              Objective
            </Text>
            <Text className="text-sm text-brown leading-5">
              Fill the 9x9 grid with numbers 1-9 so that each row, column, and
              3x3 box contains all digits from 1 to 9.
            </Text>
          </View>

          {/* The Grid Section */}
          <View className="mb-4">
            <Text className="text-base font-bold text-mahogany mb-2">
              The Grid
            </Text>
            {/* Demo Grid - 3x3 visualization */}
            <View className="w-24 h-24 border-2 border-sienna rounded bg-cream mx-auto my-2">
              <View className="flex-1 flex-row">
                <View className="flex-1 border-r border-desertBrown border-b items-center justify-center">
                  <Text className="text-xs text-desertBrown">Box 1</Text>
                </View>
                <View className="flex-1 border-r border-desertBrown border-b items-center justify-center">
                  <Text className="text-xs text-desertBrown">Box 2</Text>
                </View>
                <View className="flex-1 border-b border-desertBrown items-center justify-center">
                  <Text className="text-xs text-desertBrown">Box 3</Text>
                </View>
              </View>
              <View className="flex-1 flex-row">
                <View className="flex-1 border-r border-desertBrown border-b items-center justify-center">
                  <Text className="text-xs text-desertBrown">Box 4</Text>
                </View>
                <View className="flex-1 border-r border-desertBrown border-b items-center justify-center">
                  <Text className="text-xs text-desertBrown">Box 5</Text>
                </View>
                <View className="flex-1 border-b border-desertBrown items-center justify-center">
                  <Text className="text-xs text-desertBrown">Box 6</Text>
                </View>
              </View>
              <View className="flex-1 flex-row">
                <View className="flex-1 border-r border-desertBrown items-center justify-center">
                  <Text className="text-xs text-desertBrown">Box 7</Text>
                </View>
                <View className="flex-1 border-r border-desertBrown items-center justify-center">
                  <Text className="text-xs text-desertBrown">Box 8</Text>
                </View>
                <View className="flex-1 items-center justify-center">
                  <Text className="text-xs text-desertBrown">Box 9</Text>
                </View>
              </View>
            </View>
            <Text className="text-sm text-brown leading-5">
              The grid is divided into 9 boxes, each containing 9 cells.
            </Text>
          </View>

          {/* Rules Section */}
          <View className="mb-4">
            <Text className="text-base font-bold text-mahogany mb-2">
              Rules
            </Text>
            <Text className="text-sm text-brown leading-5">
              • Each row must contain 1-9{'\n'}• Each column must contain 1-9
              {'\n'}• Each 3x3 box must contain 1-9{'\n'}• No duplicates
              allowed!
            </Text>
          </View>

          {/* Tips Section */}
          <View className="mb-4">
            <Text className="text-base font-bold text-mahogany mb-2">Tips</Text>
            <Text className="text-sm text-brown leading-5">
              • Start with rows, columns, or boxes that have many given numbers
              {'\n'}• Use the Notes feature to track possibilities{'\n'}• Look
              for singles and pairs
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default HowToPlayScreen;
