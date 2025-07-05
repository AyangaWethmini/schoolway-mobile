import React, { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { ThemeProvider } from './theme/ThemeContext';
import { SplashScreenSchoolway } from './components/SplashScreen';
import { Stack } from 'expo-router';

// Prevent native splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts or other resources here
        await Font.loadAsync({
          // Example: Add custom fonts if needed
          // 'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
        });
        // Simulate other async tasks (e.g., API calls)
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay for demo
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  return (
    <ThemeProvider>
      {isReady ? (
        <Stack>
          <Stack.Screen name="index" />
          {/* Add more screens here as needed */}
        </Stack>
      ) : (
        <SplashScreenSchoolway />
      )}
    </ThemeProvider>
  );
}