import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider } from './src/context/AppContext';
import { AppNavigation } from './src/navigation/AppNavigation';
import { Colors } from './src/constants/theme';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <StatusBar style="dark" backgroundColor={Colors.background} />
          <AppNavigation />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
