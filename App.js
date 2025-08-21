import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';

// Import global CSS for NativeWind
import './global.css';

/**
 * Main App component - entry point for the Sudoku application
 * @returns {React.ReactElement} App component
 */
const App = () => {
  return (
    <SafeAreaView className="flex-1 bg-sand">
      <StatusBar barStyle="dark-content" backgroundColor="#FAF3E0" />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default App;
